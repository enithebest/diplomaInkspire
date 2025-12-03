<script>
  import { browser } from '$app/environment';
  import { enhance } from '$app/forms';
  import { onDestroy, onMount } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
  ]; // adjust names to match the back mesh in the GLB
  const modelPath = (() => {
    const name = (data?.product?.name ?? '').toLowerCase();
    if (name.includes('ceramic mug')) return '/model1.glb'; // only the first mug
    if (name.includes('classic pullover hoodie')) return '/workerjacket111.glb'; // only the first hoodie model
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

  let libraryItems = $derived((data?.uploads ?? []).map((upload) => ({
    id: upload.id,
    url: upload.image_url,
    created_at: upload.created_at
  })));
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
      // Filenames are stored as user-variant-timestamp-<name>.ext; strip the generated prefixes
      if (parts.length > 3 && /^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])) {
        const trimmed = parts.slice(3).join('-');
        return trimmed || last;
      }
      return last;
    } catch (error) {
      return url;
    }
  };

  const addImageToEditor = (url) => {
    if (!url) return;
    uploadedImages = [url];
    showEditor = true;
    if (konvaReady) {
      setTimeout(initEditor, 50);
    } else {
      pendingEditorInit = true;
    }
  };

  const openEditor = () => {
    if (!uploadedImages.length) {
      const fallback = previewUrl || form?.imageUrl || libraryItems[0]?.url;
      if (fallback) {
        addImageToEditor(fallback);
        return;
      }
    }
    showEditor = true;
    setTimeout(initEditor, 50);
  };

  const useFromLibrary = (url) => {
    previewUrl = url;
    showLibrary = false;
    addImageToEditor(url);
  };

  const convertImageToTexture = (imageUrl) => {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageUrl);
    texture.encoding = THREE.sRGBEncoding;
    texture.flipY = false;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  };

  const setTextureOnModel = (texture) => {
    const targets = textureTargets.length ? textureTargets : material ? [material] : [];
    targets.forEach((mesh) => {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((mat) => {
        if (!mat) return;
        mat.map = texture;
        if (mat.color) mat.color.set('#ffffff'); // ensure texture is visible
        mat.needsUpdate = true;
      });
    });
  };

  const initEditor = () => {
    if (!konvaReady || !Konva) return;
    if (!editorContainerRef) return;
    if (stage) stage.destroy();

    const width = 400;
    const height = 300;

    stage = new Konva.Stage({
      container: editorContainerRef,
      width,
      height
    });

    layer = new Konva.Layer();
    stage.add(layer);

    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width,
      height,
      fill: '#f0f0f0',
      stroke: '#aaa',
      strokeWidth: 2
    });
    layer.add(background);

    uploadedImages.forEach((imgUrl, index) => {
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
          draggable: true
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
    });
  };

  const applyToModel = () => {
    if (!stage || textureTargets.length === 0) return;

    stage.find('Transformer').forEach((tr) => tr.hide());
    stage.draw();

    let dataURL = '';
    try {
      dataURL = stage.toDataURL({ pixelRatio: 2 });
    } catch (err) {
      console.error('Unable to export canvas (likely CORS on an image).', err);
      return;
    }

    stage.find('Transformer').forEach((tr) => tr.show());
    stage.draw();

    const texture = convertImageToTexture(dataURL);
    setTextureOnModel(texture);

    showEditor = false;
  };

  // Capture a snapshot of the current model or fallback design URL for cart/order preview
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
    orderDesignUrl = previewUrl || form?.imageUrl || uploadedImages[0] || '';
    if (!stage) {
      orderDesignData = '';
      if (event?.target) {
        const designUrlField = event.target.querySelector('input[name="design_url"]');
        const designDataField = event.target.querySelector('input[name="design_data"]');
        if (designUrlField) designUrlField.value = orderDesignUrl;
        if (designDataField) designDataField.value = orderDesignData;
      }
      return;
    }

    try {
      stage.find('Transformer').forEach((tr) => tr.hide());
      stage.draw();
      orderDesignData = stage.toDataURL({ pixelRatio: 2 });
      stage.find('Transformer').forEach((tr) => tr.show());
      stage.draw();
    } catch (err) {
      console.error('Unable to export design for order', err);
      orderDesignData = '';
    }

    if (event?.target) {
      const designUrlField = event.target.querySelector('input[name="design_url"]');
      const designDataField = event.target.querySelector('input[name="design_data"]');
      if (designUrlField) designUrlField.value = orderDesignUrl;
      if (designDataField) designDataField.value = orderDesignData;
    }

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
    return previewUrl || form?.imageUrl || data?.variant?.image_url || data?.product?.image_url || '';
  };

  const initScene = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(20, 1, 1e-5, 1e10);
    scene.add(camera);

    const light = new THREE.HemisphereLight(0xffffff, 0x222222, 1);
    scene.add(light);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x131316, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(800, 800); // initial; will be resized to container below
    renderer.outputEncoding = THREE.sRGBEncoding;
    containerRef.appendChild(renderer.domElement);

    orbitControls = new OrbitControls(camera, renderer.domElement);

    const resizeRendererToDisplaySize = () => {
      if (!renderer || !camera || !containerRef) return;
      const width = containerRef.clientWidth || 800;
      const height = containerRef.clientHeight || 800;
      const size = Math.max(200, Math.min(width, height)); // keep square to avoid stretch
      const canvas = renderer.domElement;
      const needResize = canvas.width !== size || canvas.height !== size;
      if (needResize) {
        renderer.setSize(size, size, false);
        camera.aspect = 1;
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
              mat.map = null; // show flat color before any user texture
              if (mat.color) mat.color.copy(parsed);
              mat.needsUpdate = true;
              if (!material && !Array.isArray(child.material)) material = mat; // fallback material
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
          }
        });

        if (textureTargets.length === 0 && object?.children?.length) {
          // fallback: use the largest mesh by vertex count if named targets are missing
          let fallbackMesh = null;
          object.traverse((obj) => {
            if (obj.isMesh) {
              if (!fallbackMesh || (obj.geometry?.attributes?.position?.count || 0) > (fallbackMesh.geometry?.attributes?.position?.count || 0)) {
                fallbackMesh = obj;
              }
            }
          });
          if (fallbackMesh) textureTargets = [fallbackMesh];
        }

        if (textureTargets.length === 0) {
          console.warn('No texture targets matched; available meshes:', meshNames);
        } else {
          console.info('Texture targets:', textureTargets.map((m) => m.name));
        }

        applyBaseColor(gltf, jacketColor);
        scene.add(gltf.scene);
      },
      undefined,
      (error) => console.error(error)
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
      link.download = 'custom-mug.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  onMount(() => {
    if (browser) {
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

      const loadKonva = async () => {
        const mod = await import('konva');
        Konva = mod.default ?? mod;
        konvaReady = true;
        if (pendingEditorInit || uploadedImages.length) {
          pendingEditorInit = false;
          setTimeout(initEditor, 50);
        }
      };

      loadKonva();
      initScene();
      loadModel();
      if (modelPath) animate();
    }
  });

  $effect(() => {
    if (browser && form?.imageUrl && form.imageUrl !== lastSyncedImage) {
      lastSyncedImage = form.imageUrl;
      previewUrl = form.imageUrl;
      addImageToEditor(form.imageUrl);
    }
  });

  // When an order succeeds, mirror it into the local cart so it appears immediately
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
        sku: data?.variant?.sku || data?.variant?.id || '',
        size,
        color,
        price,
        qty: 1,
        image
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
    if (renderer) {
      renderer.dispose();
      if (containerRef && renderer.domElement.parentNode === containerRef) {
        containerRef.removeChild(renderer.domElement);
      }
    }
  });
</script>

<div class="relative isolate overflow-hidden bg-gray-900 text-gray-200 min-h-screen px-6 py-10 lg:px-12">
  <h1 class="text-3xl font-bold mb-6 text-center text-white">
    Customize {data?.product?.name ?? 'Product'}
  </h1>

  <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <aside class="lg:col-span-3 space-y-6">
      <div class="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Upload design</h2>
          <button
            type="button"
            class="text-sm text-indigo-300 hover:text-white underline"
            onclick={() => (showLibrary = true)}
          >
            My library
          </button>
        </div>

        <form method="POST" enctype="multipart/form-data" action="?/upload" use:enhance class="space-y-5">
          <div>
            <label for="design" class="block mb-2 text-sm font-medium text-gray-200">Choose image</label>
            <input
              id="design"
              type="file"
              name="design"
              accept="image/*"
              required
              onchange={handleFileChange}
              class="block w-full text-sm text-gray-200 border border-white/10 rounded-lg cursor-pointer bg-white/5 focus:outline-none"
            />
            <p class="mt-2 text-xs text-gray-400">Allowed: PNG, JPG, WEBP. Max size: 5MB.</p>
          </div>

          {#if form?.error}
            <p class="text-sm text-red-500" role="alert" aria-live="polite">{form.error}</p>
          {/if}
          {#if form?.success}
            <p class="text-sm text-green-400" role="status">Uploaded successfully!</p>
          {/if}

          <button
            type="submit"
            formaction="?/upload"
            class="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Upload &amp; Save
          </button>
        </form>

        {#if previewUrl || form?.imageUrl}
          <div class="mt-4 space-y-2">
            <h3 class="text-sm font-medium">Preview</h3>
            <img
              src={previewUrl || form?.imageUrl}
              alt="Uploaded design preview"
              class="max-h-48 w-auto rounded-md shadow border border-white/10"
            />
          </div>
        {/if}
      </div>

      <div class="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-lg">
        <p class="text-lg font-medium mb-3">Edit your artwork</p>
        <button
          class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onclick={openEditor}
        >
          {uploadedImages.length ? 'Reopen Customizer' : 'Open Customizer'}
        </button>

        <div class="mt-4 space-y-4 text-sm text-gray-400">
          {#if uploadedImages.length === 0}
            <p>Upload an image using the form or pick one from your library to start editing.</p>
          {:else}
            <p>Current design loaded in the editor:</p>
            <div class="flex flex-wrap gap-3">
              {#each uploadedImages as imgUrl}
                <img
                  src={imgUrl}
                  alt="Preview"
                  class="w-16 h-16 object-cover rounded-lg border-2 border-gray-600 shadow-md hover:scale-110 transition transform duration-200"
                />
              {/each}
            </div>
          {/if}
        </div>
      </div>

    </aside>

    <main class="lg:col-span-6 flex flex-col h-full space-y-6">
      <div class="flex-1 relative">
        <div class="bg-gray-900/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-gray-700 h-[60vh] max-h-[650px] min-h-[360px] relative">
          <div bind:this={containerRef} class="w-full h-full flex items-center justify-center cursor-grab"></div>
          {#if modelPath}
            <div class="pointer-events-none absolute inset-0 flex items-end justify-center pb-4">            </div>
          {:else}
            <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div class="bg-black/50 text-white px-4 py-2 rounded-lg border border-white/10 text-sm">3D preview coming soon</div>
            </div>
          {/if}
        </div>
        <div class="flex justify-end mt-3">
          <button
            class="bg-gray-800/70 border border-white/15 text-white font-semibold px-3 py-2 rounded-lg shadow-md backdrop-blur transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            onclick={download}
            disabled={!modelPath}
          >
            Download render
          </button>
        </div>
      </div>
      <p class="text-center text-sm text-gray-400">Drag to rotate / Scroll to zoom</p>
    </main>

    <aside class="lg:col-span-3 space-y-4">
      <div class="sticky top-4 space-y-4">
        {#if data?.product?.description}
          <div class="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 max-h-[55vh] overflow-y-auto shadow-lg">
            <h3 class="text-lg font-semibold mb-2 text-indigo-300">Product details</h3>
            <p class="text-gray-200 leading-relaxed whitespace-pre-line">{data.product.description}</p>
          </div>
        {/if}

        <div class="bg-white/5 backdrop-blur border border-blue-900/40 rounded-xl p-5 shadow-lg">
          <div class="flex flex-col gap-1 mb-3">
            <h3 class="text-lg font-semibold text-white">Ready to order?</h3>
            <p class="text-sm text-gray-300">We attach your current edit to a new order.</p>
            <p class="text-xs text-gray-400">Variant: {data?.variant?.sku || data?.variant?.id || 'Selected'}</p>
          </div>
          <form
            method="POST"
            action="?/order"
            class="space-y-3"
            onsubmit={prepareOrderSubmission}
          >
            <input type="hidden" name="design_data" value={orderDesignData} />
            <input type="hidden" name="design_url" value={orderDesignUrl} />

            <button
              type="submit"
              class="w-full bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-xl transition transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Order this custom piece
            </button>
            {#if form?.orderSuccess}
              <p class="text-sm text-green-400" role="status">Order saved! We’ll get it ready.</p>
            {/if}
            {#if form?.orderError}
              <p class="text-sm text-red-400" role="alert">{form.orderError}</p>
            {/if}
          </form>
        </div>
      </div>
    </aside>
  </div>

  {#if showLibrary}
    <div class="fixed inset-0 z-50">
      <div
        class="absolute inset-0 bg-black/60"
        role="button"
        tabindex="0"
        onclick={() => (showLibrary = false)}
        onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (showLibrary = false)}
        aria-label="Close library"
      ></div>
      <aside class="absolute right-0 top-0 h-full w-full sm:w-[28rem] bg-gray-900 border-l border-white/10 p-4 overflow-y-auto">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold">My library</h2>
          <button class="text-sm text-gray-300 hover:text-white" onclick={() => (showLibrary = false)}>Close</button>
        </div>

        <input
          type="text"
          placeholder="Search library"
          bind:value={search}
          class="w-full mb-4 px-3 py-2 rounded-md bg-white/5 border border-white/10 focus:outline-none"
        />

        {#if libraryItems.length === 0}
          <p class="text-gray-400">No uploads yet.</p>
        {:else}
          <div class="grid grid-cols-2 gap-3">
            {#each libraryItems.filter((item) => displayName(item.url).toLowerCase().includes(search.toLowerCase())) as item}
              <div class="bg-white/5 border border-white/10 rounded-md overflow-hidden group">
                <img src={item.url} alt={displayName(item.url)} class="w-full h-28 object-cover" />
                <div class="p-2 flex items-center justify-between">
                  <span class="text-xs truncate max-w-[70%]" title={displayName(item.url)}>{displayName(item.url)}</span>
                  <button
                    class="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
                    onclick={() => useFromLibrary(item.url)}
                  >
                    Use
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </aside>
    </div>
  {/if}

    {#if showEditor}
    <div class="fixed inset-0 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center z-40 p-6">
      <h2 class="text-2xl font-bold text-white mb-4">Adjust your images</h2>
      <div bind:this={editorContainerRef} class="bg-gray-100 rounded-lg shadow-2xl overflow-hidden"></div>
      <button
        class="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-full transition transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onclick={applyToModel}
      >
        Ready
      </button>
    </div>
  {/if}
</div>


