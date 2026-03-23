<script>
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

	import VariationHeader from './VariationHeader.svelte';
	import UploadPanel from './UploadPanel.svelte';
	import EditorActions from './EditorActions.svelte';
	import PreviewPanel from './PreviewPanel.svelte';
	import ProductDetails from './ProductDetails.svelte';
	import OrderForm from './OrderForm.svelte';
	import LibraryDrawer from './LibraryDrawer.svelte';
	import EditorOverlay from './EditorOverlay.svelte';

	let { data, form } = $props();

	let file = $state(null);
	let previewUrl = $state('');
	let showLibrary = $state(false);
	let search = $state('');

	let containerRef = $state(null);
	let editorContainerRef = $state(null);

	let scene;
	let camera;
	let renderer;
	let orbitControls;
	let material;
	let animationId;
	let textureTargets = [];
	const textureTargetNames = [
		'Back',
		'back',
		'BackPlate',
		'Jacket_Back',
		'Body',
		'Mug_Porcelain_PBR001_0'
	];
	const modelPath = (() => {
		const name = (data?.product?.name ?? '').toLowerCase();
		if (name.includes('ceramic mug')) return '/3dobjects/mugs/model1.glb';
		if (name.includes('classic pullover hoodie')) return '/workerjacket111.glb';
		if (name.includes('classic cotton tee')) return '/poloshirt.glb';
		if (name.includes('cropped sweatshirt')) return '/3dobjects/hoodie/sweatshirt1.glb';
		return null;
	})();

	let showEditor = $state(false);
	let uploadedImages = $state([]);
	let stage;
	let layer;
	let lastSyncedImage = $state(null);
	let Konva;
	let konvaReady = false;
	let pendingEditorInit = $state(false);
	let orderDesignData = $state('');
	let orderDesignUrl = $state('');
	let lastOrderHandled = $state(null);
	let previewExpanded = $state(false);
	let previewActivated = $state(false);
	let modelReady = $state(false);
	let sceneBootstrapped = false;
	let konvaLoading = false;
	const primaryButton =
		'inline-flex items-center justify-center gap-2 rounded-lg bg-[#4F46E5] text-white font-semibold shadow-lg shadow-[#4F46E5]/30 transition hover:bg-[#6366F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1] disabled:opacity-60 disabled:cursor-not-allowed';

	const designFallback = () =>
		previewUrl ||
		form?.imageUrl ||
		uploadedImages[0] ||
		data?.variant?.image_url ||
		data?.product?.image_url ||
		'';

	const setInputValue = (formEl, name, value) => {
		if (!formEl) return;
		const field = formEl.querySelector(`input[name="${name}"]`);
		if (field) field.value = value;
	};

	const syncOrderInputs = (formEl, values = {}) => {
		Object.entries(values).forEach(([key, value]) => setInputValue(formEl, key, value));
	};

	const withHiddenTransformers = (cb) => {
		if (!stage) return null;
		const transformers = stage.find('Transformer');
		transformers.forEach((tr) => tr.hide());
		stage.draw();
		const result = cb?.();
		transformers.forEach((tr) => tr.show());
		stage.draw();
		return result;
	};

	const exportStageImage = (pixelRatio = 2) =>
		withHiddenTransformers(() => stage?.toDataURL({ pixelRatio })) || '';

	const handleFileChange = (event) => {
		file = event.target?.files?.[0];
		if (file) {
			previewUrl = URL.createObjectURL(file);
		}
	};

	const displayName = (url) => {
		try {
			const path = new URL(url).pathname;
			const last = decodeURIComponent(path.split('/').pop() || '');
			const parts = last.split('-');
			if (parts.length > 3 && /^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])) {
				const trimmed = parts.slice(3).join('-');
				return trimmed || last;
			}
			return last;
		} catch {
			return url;
		}
	};

	const libraryItems = $derived(
		(data?.uploads ?? []).map((upload) => ({
			id: upload.id,
			url: upload.image_url,
			created_at: upload.created_at
		}))
	);

	const variantOptions = (() => {
		try {
			if (typeof data?.variant?.option_values === 'string') {
				return JSON.parse(data.variant.option_values);
			}
			return data?.variant?.option_values || {};
		} catch (err) {
			console.error('Unable to parse variant options', err);
			return {};
		}
	})();
	let jacketColor = (data?.variant?.color ?? '').toString().trim();

	const addImageToEditor = (url) => {
		if (!url) return;
		if (!uploadedImages.includes(url)) {
			uploadedImages = [...uploadedImages, url];
		}
		showEditor = true;
		if (konvaReady && stage && layer) {
			addImageNode(url, uploadedImages.length - 1);
			layer.draw();
		} else if (konvaReady) {
			setTimeout(initEditor, 50);
		} else {
			pendingEditorInit = true;
		}
	};

	const openEditor = () => {
		if (!uploadedImages.length) {
			const fallback = designFallback();
			if (fallback) {
				addImageToEditor(fallback);
				return;
			}
		}
		showEditor = true;
		if (!stage) setTimeout(initEditor, 50);
	};

	const useFromLibrary = (url) => {
		previewUrl = url;
		showLibrary = false;
		addImageToEditor(url);
	};

	const getMaxAnisotropy = () => renderer?.capabilities?.getMaxAnisotropy?.() ?? 1;
	const activatePreview = () => {
		previewActivated = true;
	};

	const applyTextureQuality = (tex, useSRGB = false) => {
		if (!tex) return;
		if (useSRGB) tex.colorSpace = THREE.SRGBColorSpace;
		tex.anisotropy = getMaxAnisotropy();
		tex.needsUpdate = true;
	};

	const convertImageToTexture = (imageUrl) => {
		const textureLoader = new THREE.TextureLoader();
		const texture = textureLoader.load(imageUrl);
		applyTextureQuality(texture, true);
		texture.flipY = false;
		texture.wrapS = THREE.ClampToEdgeWrapping;
		texture.wrapT = THREE.ClampToEdgeWrapping;
		texture.needsUpdate = true;
		return texture;
	};

	const setTextureOnModel = (texture) => {
		const targets = textureTargets.length ? textureTargets : material ? [material] : [];
		targets.forEach((mesh) => {
			const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
			materials.forEach((mat) => {
				if (!mat) return;
				mat.map = texture;
				applyTextureQuality(mat.map, true);
				if (mat.color) mat.color.set('#ffffff');
				mat.needsUpdate = true;
			});
		});
	};

	const editorWidth = 400;
	const editorHeight = 300;

	const addImageNode = (imgUrl, index = 0) => {
		if (!layer || !Konva || !stage) return;
		const alreadyExists = layer.find(
			(node) => node.name() === 'design-image' && node.getAttr('data-url') === imgUrl
		)?.[0];
		if (alreadyExists) return;

		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.src = imgUrl;
		img.onload = () => {
			const konvaImage = new Konva.Image({
				image: img,
				x: 50 + index * 20,
				y: 50 + index * 20,
				width: 150,
				height: 150,
				draggable: true,
				name: 'design-image',
				'data-url': imgUrl
			});
			layer.add(konvaImage);

			const transformer = new Konva.Transformer({
				nodes: [konvaImage],
				enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
			});
			layer.add(transformer);
			layer.draw();

			konvaImage.on('click', () => {
				stage.find('Transformer').forEach((instance) => instance.nodes([]));
				transformer.nodes([konvaImage]);
				layer.draw();
			});
		};
	};

	const initEditor = () => {
		if (!konvaReady || !Konva) return;
		if (!editorContainerRef) return;
		if (stage && layer) {
			uploadedImages.forEach((imgUrl, index) => addImageNode(imgUrl, index));
			layer.draw();
			return;
		}

		stage = new Konva.Stage({
			container: editorContainerRef,
			width: editorWidth,
			height: editorHeight
		});

		layer = new Konva.Layer();
		stage.add(layer);

		const background = new Konva.Rect({
			x: 0,
			y: 0,
			width: editorWidth,
			height: editorHeight,
			fill: '#f0f0f0',
			stroke: '#aaa',
			strokeWidth: 2
		});
		layer.add(background);

		uploadedImages.forEach((imgUrl, index) => addImageNode(imgUrl, index));
	};

	const resetDesign = () => {
		previewUrl = '';
		uploadedImages = [];
		orderDesignData = '';
		orderDesignUrl = '';
		lastSyncedImage = null;
		if (stage && layer) {
			layer.destroyChildren();
			layer.draw();
		}
		setTextureOnModel(null);
		try {
			localStorage.removeItem('selectedDesignUrl');
		} catch (err) {
			console.error('Unable to clear stored design', err);
		}
	};

	const applyToModel = () => {
		if (!stage || textureTargets.length === 0) return;
		const dataURL = exportStageImage();
		if (!dataURL) return;
		const texture = convertImageToTexture(dataURL);
		setTextureOnModel(texture);
		showEditor = false;
	};

	const snapshotCartPreview = () => {
		try {
			const img = captureModelImage();
			if (img) {
				orderDesignUrl = img;
			}
		} catch (err) {
			console.error('Preview snapshot failed', err);
		}
	};

	const prepareOrderSubmission = (event) => {
		orderDesignUrl = designFallback();
		if (!stage) {
			orderDesignData = '';
			syncOrderInputs(event?.target, {
				design_url: orderDesignUrl,
				design_data: orderDesignData,
				rotation: '0',
				scale: '1',
				position_x: '0',
				position_y: '0'
			});
			return;
		}

		orderDesignData = exportStageImage();
		if (!orderDesignData) orderDesignData = '';

		const designImage = stage.find('.design-image')?.[0];
		const rotation = designImage?.rotation?.() ?? 0;
		const scaleX = designImage?.scaleX?.() ?? 1;
		const scaleY = designImage?.scaleY?.() ?? 1;
		const scale = (scaleX + scaleY) / 2;
		const posX = (designImage?.x?.() ?? 0) / editorWidth;
		const posY = (designImage?.y?.() ?? 0) / editorHeight;

		syncOrderInputs(event?.target, {
			design_url: orderDesignUrl,
			design_data: orderDesignData,
			rotation: rotation.toFixed(2),
			scale: scale.toFixed(2),
			position_x: posX.toFixed(2),
			position_y: posY.toFixed(2)
		});

		snapshotCartPreview();
	};

	const captureModelImage = () => {
		if (!browser) return '';
		if (renderer && scene && camera) {
			orbitControls.update();
			renderer.render(scene, camera);

			const captureCanvas = document.createElement('canvas');
			captureCanvas.width = renderer.domElement.width;
			captureCanvas.height = renderer.domElement.height;
			const context = captureCanvas.getContext('2d');
			if (context) {
				context.drawImage(renderer.domElement, 0, 0);
				return captureCanvas.toDataURL('image/png', 0.95);
			}
		}
		return designFallback();
	};

	const initScene = () => {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(20, 1, 1e-5, 1e10);
		scene.add(camera);

		const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.1);
		scene.add(hemiLight);
		const dirLight = new THREE.DirectionalLight(0xffffff, 2.4);
		dirLight.position.set(4, 8, 6);
		dirLight.castShadow = false;
		scene.add(dirLight);

		renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: 'high-performance'
		});
		renderer.physicallyCorrectLights = true;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.1;
		renderer.setClearColor(0x131316, 0);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		const initialWidth = containerRef?.clientWidth || 800;
		const initialHeight = containerRef?.clientHeight || 800;
		renderer.setSize(initialWidth, initialHeight, false);
		camera.aspect = initialWidth / initialHeight;
		camera.updateProjectionMatrix();
		containerRef.appendChild(renderer.domElement);

		orbitControls = new OrbitControls(camera, renderer.domElement);

		const resizeRendererToDisplaySize = () => {
			if (!renderer || !camera || !containerRef) return;
			const width = Math.max(200, containerRef.clientWidth || 800);
			const height = Math.max(200, containerRef.clientHeight || 800);
			const canvas = renderer.domElement;
			const needResize = canvas.width !== width || canvas.height !== height;
			if (needResize) {
				renderer.setSize(width, height, false);
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
			}
		};

		const handleResize = () => resizeRendererToDisplaySize();
		resizeRendererToDisplaySize();
		window.addEventListener('resize', handleResize);
		onDestroy(() => window.removeEventListener('resize', handleResize));
	};

	const loadModel = () => {
		if (!scene || !camera || !orbitControls) return;
		if (!modelPath) return;
		modelReady = false;

		const loader = new GLTFLoader();
		const applyBaseColor = (gltf, color) => {
			const safe = (color || '').toString().trim().replace(/;$/, '');
			if (!safe) return;
			try {
				const parsed = new THREE.Color(safe);
				gltf.scene.traverse((child) => {
					if (child.isMesh && child.material) {
						const materials = Array.isArray(child.material) ? child.material : [child.material];
						materials.forEach((mat) => {
							if (!mat) return;
							mat.map = null;
							if (mat.color) mat.color.copy(parsed);
							mat.needsUpdate = true;
							if (!material && !Array.isArray(child.material)) material = mat;
						});
					}
				});
			} catch (err) {
				console.warn('Invalid color string:', color, err);
			}
		};
		loader.load(
			modelPath,
			(gltf) => {
				const object = gltf.scene;
				textureTargets = [];
				const meshNames = [];

				const boundingBox = new THREE.Box3().setFromObject(object);
				const modelCenter = new THREE.Vector3();
				const modelSizeVec3 = new THREE.Vector3();
				boundingBox.getCenter(modelCenter);
				boundingBox.getSize(modelSizeVec3);
				const modelSize = modelSizeVec3.length();

				orbitControls.reset();
				orbitControls.maxDistance = modelSize * 50;
				orbitControls.enableDamping = true;
				orbitControls.dampingFactor = 0.07;
				orbitControls.rotateSpeed = 1.25;
				orbitControls.autoRotate = true;

				object.position.sub(modelCenter);
				camera.position.set(
					modelCenter.x - modelSize * 0.2,
					modelCenter.y + modelSize * 0.4,
					modelCenter.z + modelSize * 1.4
				);
				camera.near = modelSize / 100;
				camera.far = modelSize * 100;
				camera.updateProjectionMatrix();

				object.traverse((obj) => {
					if (obj.isMesh) {
						const name = obj.name || '';
						meshNames.push(name);
						if (textureTargetNames.includes(name)) {
							textureTargets.push(obj);
						}
						if (!material && !Array.isArray(obj.material)) material = obj.material;
						const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
						materials.forEach((mat) => {
							if (!mat) return;
							applyTextureQuality(mat.map, true);
							applyTextureQuality(mat.emissiveMap, true);
							applyTextureQuality(mat.lightMap);
							applyTextureQuality(mat.bumpMap);
							applyTextureQuality(mat.displacementMap);
							applyTextureQuality(mat.roughnessMap);
							applyTextureQuality(mat.metalnessMap);
							applyTextureQuality(mat.normalMap);
							applyTextureQuality(mat.aoMap);
							applyTextureQuality(mat.specularMap);
						});
					}
				});

				if (textureTargets.length === 0 && object?.children?.length) {
					let fallbackMesh = null;
					object.traverse((obj) => {
						if (obj.isMesh) {
							if (
								!fallbackMesh ||
								(obj.geometry?.attributes?.position?.count || 0) >
									(fallbackMesh.geometry?.attributes?.position?.count || 0)
							) {
								fallbackMesh = obj;
							}
						}
					});
					if (fallbackMesh) textureTargets = [fallbackMesh];
				}

				if (textureTargets.length === 0) {
					console.warn('No texture targets matched; available meshes:', meshNames);
				} else {
					console.info(
						'Texture targets:',
						textureTargets.map((m) => m.name)
					);
				}

				applyBaseColor(gltf, jacketColor);
				scene.add(gltf.scene);
				modelReady = true;
			},
			undefined,
			(error) => {
				modelReady = false;
				console.error(error);
			}
		);
	};

	const animate = () => {
		animationId = requestAnimationFrame(animate);
		orbitControls.update();
		renderer.render(scene, camera);
	};

	const download = () => {
		if (!renderer || !scene || !camera) return;
		orbitControls.update();
		renderer.render(scene, camera);

		const captureCanvas = document.createElement('canvas');
		captureCanvas.width = renderer.domElement.width;
		captureCanvas.height = renderer.domElement.height;
		const context = captureCanvas.getContext('2d');
		if (context) {
			context.drawImage(renderer.domElement, 0, 0);
			const dataURL = captureCanvas.toDataURL('image/png', 1.0);
			const link = document.createElement('a');
			link.href = dataURL;
			link.download = 'preview.png';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	const togglePreviewExpanded = (state = !previewExpanded) => {
		activatePreview();
		previewExpanded = state;
		if (browser) {
			setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
		}
	};

	const loadKonva = async () => {
		if (konvaReady || konvaLoading || !browser) return;
		konvaLoading = true;
		try {
			const mod = await import('konva');
			Konva = mod.default ?? mod;
			konvaReady = true;
			if (pendingEditorInit || uploadedImages.length) {
				pendingEditorInit = false;
				setTimeout(initEditor, 50);
			}
		} finally {
			konvaLoading = false;
		}
	};

	onMount(() => {
		if (!browser) return;
		try {
			if (!jacketColor) {
				const storedColor = localStorage.getItem('selectedBaseColor');
				if (storedColor) {
					jacketColor = storedColor;
				}
			}
			const stored = localStorage.getItem('selectedDesignUrl');
			if (stored) {
				previewUrl = stored;
				addImageToEditor(stored);
				localStorage.removeItem('selectedDesignUrl');
			}
		} catch (error) {
			console.error(error);
		}

		loadKonva();
	});

	$effect(() => {
		if (!browser || !previewActivated || sceneBootstrapped || !containerRef) return;
		sceneBootstrapped = true;
		initScene();
		loadModel();
		if (modelPath) animate();
	});

	$effect(() => {
		if (!browser || !showEditor || !editorContainerRef || !konvaReady || stage) return;
		setTimeout(initEditor, 50);
	});

	$effect(() => {
		if (browser && form?.imageUrl && form.imageUrl !== lastSyncedImage) {
			lastSyncedImage = form.imageUrl;
			previewUrl = form.imageUrl;
			addImageToEditor(form.imageUrl);
		}
	});

	$effect(() => {
		if (!browser) return;
		if (!form?.orderSuccess) return;
		const handledKey = form?.orderId || 'order';
		if (lastOrderHandled === handledKey) return;
		lastOrderHandled = handledKey;

		const color = (variantOptions?.color || data?.variant?.color || '').toString();
		const size = (variantOptions?.size || data?.variant?.size || '').toString();
		const price = Number(data?.variant?.price ?? data?.product?.base_price ?? 0) || 0;
		const image =
			orderDesignUrl ||
			previewUrl ||
			form?.imageUrl ||
			data?.variant?.image_url ||
			data?.product?.image_url ||
			'';

		try {
			const cartRaw = localStorage.getItem('cart');
			const cart = cartRaw ? JSON.parse(cartRaw) : [];
			cart.unshift({
				name: data?.product?.name || 'Custom product',
				product_id: data?.product?.id || null,
				variant_id: data?.variant?.id || null,
				upload_id: form?.uploadId ?? null,
				customisation_id: form?.customisationId ?? null,
				source_order_id: form?.orderId ?? null,
				source_order_item_id: form?.orderItemId ?? null,
				sku: data?.variant?.sku || data?.variant?.id || '',
				size,
				color,
				price,
				qty: 1,
				image,
				design_url: form?.designUrl || image
			});
			localStorage.setItem('cart', JSON.stringify(cart));
			window.dispatchEvent(new Event('cart-updated'));
		} catch (err) {
			console.error('Failed to sync cart', err);
		}
	});

	onDestroy(() => {
		if (!browser) return;
		cancelAnimationFrame(animationId);
		if (stage) {
			stage.destroy();
			stage = null;
		}
		if (renderer) {
			renderer.dispose();
			if (containerRef && renderer.domElement.parentNode === containerRef) {
				containerRef.removeChild(renderer.domElement);
			}
		}
	});
</script>

<div
	class="relative isolate min-h-screen overflow-hidden bg-gray-900 px-6 py-10 text-gray-200 lg:px-12"
>
	<VariationHeader name={data?.product?.name ?? 'Product'} />

	<div class="mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 lg:grid-cols-12">
		<aside class="space-y-6 lg:col-span-3">
			<UploadPanel
				{primaryButton}
				{form}
				{previewUrl}
				{showLibrary}
				{handleFileChange}
				onOpenLibrary={() => (showLibrary = true)}
			/>

			<EditorActions
				{primaryButton}
				{openEditor}
				{resetDesign}
				{uploadedImages}
				canReset={!!uploadedImages.length || !!previewUrl || !!form?.imageUrl}
			/>
		</aside>

		<main class="flex h-full flex-col space-y-6 lg:col-span-6">
			<PreviewPanel
				{primaryButton}
				{modelPath}
				{modelReady}
				{previewExpanded}
				onActivatePreview={activatePreview}
				onContainerReady={(node) => (containerRef = node)}
				onTogglePreview={togglePreviewExpanded}
				onDownload={download}
			/>
		</main>

		<aside class="space-y-4 lg:col-span-3">
			<div class="sticky top-4 space-y-4">
				<ProductDetails description={data?.product?.description} />
				<OrderForm
					{primaryButton}
					{form}
					{orderDesignData}
					{orderDesignUrl}
					variantSku={data?.variant?.sku || data?.variant?.id}
					onSubmit={prepareOrderSubmission}
				/>
			</div>
		</aside>
	</div>

	<LibraryDrawer
		{primaryButton}
		{showLibrary}
		{libraryItems}
		{search}
		{displayName}
		onClose={() => (showLibrary = false)}
		onUse={useFromLibrary}
		onSearchChange={(value) => (search = value)}
	/>

	<EditorOverlay
		{primaryButton}
		{showEditor}
		onContainerReady={(node) => (editorContainerRef = node)}
		onApply={applyToModel}
	/>
</div>
