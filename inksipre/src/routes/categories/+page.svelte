<script>
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages/_index.js';
	import { theme } from '$lib/stores/theme';
	import { productImages } from './productImages.js';

	export let data;
	export let form;

	let selectedColor = {};
	let showDesignToast = false;

	const { hoodies, tshirts, sweatshirts, mugs } = data;
	const short = (text, len = 90) =>
		text ? `${text.slice(0, len)}${text.length > len ? '...' : ''}` : '';

	const featureBadges = (product) => {
		const cat = (product?.category || '').toLowerCase();
		const name = (product?.name || '').toLowerCase();

		if (cat.includes('hood') || name.includes('hoodie')) {
			return ['Heavyweight fleece', 'Brushed interior', 'Rib cuffs'];
		}
		if (cat.includes('tshirt') || name.includes('tee')) {
			return ['100% cotton', 'Side-seamed', 'Ribbed neck'];
		}
		if (cat.includes('sweat')) {
			return ['Loopback terry', 'Clean fit', 'Reinforced cuffs'];
		}
		if (cat.includes('mug')) {
			return ['Dishwasher-safe', 'Glossy finish', 'Premium ceramic'];
		}

		return ['Quality build', 'Comfort fit', 'Made to last'];
	};

	function viewProduct(id) {
		window.location.href = `/product/${id}`;
	}

	$: isLight = $theme === 'light';
	$: categoryGroups = [
		{ title: 'Hoodies', items: hoodies },
		{ title: 'T-Shirts', items: tshirts },
		{ title: 'Sweatshirts', items: sweatshirts },
		{ title: 'Mugs', items: mugs }
	];

	onMount(() => {
		try {
			const url =
				typeof localStorage !== 'undefined' ? localStorage.getItem('selectedDesignUrl') : null;
			if (url) {
				showDesignToast = true;
				setTimeout(() => (showDesignToast = false), 2500);
			}
		} catch {}
	});
</script>

<div
	class={`relative isolate min-h-screen overflow-hidden px-6 pt-24 pb-16 transition-colors duration-300 sm:pb-24 lg:px-12 ${
		isLight ? 'bg-[#f4efe7] text-slate-800' : 'bg-gray-900 text-gray-200'
	}`}
>
	{#if showDesignToast}
		<div
			role="status"
			aria-live="polite"
			class={`pointer-events-none fixed top-20 left-1/2 z-[9999] -translate-x-1/2 rounded-lg px-4 py-2 text-white shadow-lg ${
				isLight ? 'bg-amber-500' : 'bg-indigo-600'
			}`}
		>
			{m.categories_toast_design_selected()}
		</div>
	{/if}

	<div class={`absolute inset-0 -z-10 ${isLight ? 'opacity-40' : 'opacity-20'}`}>
		<svg
			aria-hidden="true"
			class={`absolute top-0 left-1/2 h-[64rem] w-[128rem] -translate-x-1/2 ${isLight ? 'stroke-stone-300' : 'stroke-gray-800'}`}
		>
			<defs>
				<pattern id="grid" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
					<path d="M100 200V.5M.5 .5H200" fill="none" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#grid)" />
		</svg>
	</div>

	<div
		class={`absolute inset-x-0 top-0 -z-10 h-[34rem] blur-3xl ${isLight ? 'bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.22),_transparent_60%)]' : 'bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),_transparent_60%)]'}`}
	></div>

	<section
		class={`relative -mx-6 mb-12 min-h-[88vh] overflow-hidden lg:-mx-12 ${isLight ? 'bg-[#efe3d1]' : 'bg-gray-800/80'}`}
	>
		<img
			src="/images/header.png"
			alt="Collection hero"
			class={`absolute inset-0 h-full w-full object-cover ${isLight ? 'opacity-45' : 'opacity-60'}`}
			loading="lazy"
		/>
		<div
			class={`absolute inset-0 ${isLight ? 'bg-gradient-to-t from-[#f4efe7] via-[#f4efe740] to-transparent' : 'bg-gradient-to-t from-gray-900/100 via-gray-900/5 to-transparent'}`}
		></div>
		<div class="absolute inset-0 flex items-end justify-center pb-12">
			<div class="space-y-3 text-center">
				<p
					class={`text-2xl font-light tracking-wide sm:text-3xl ${isLight ? 'text-slate-900' : 'text-white/90'}`}
				>
					Inkspire Winter Collection
				</p>
				<a
					href="/categories"
					class={`inline-block text-sm font-medium tracking-[0.12em] uppercase transition ${isLight ? 'text-slate-700 hover:text-amber-700' : 'text-white hover:text-indigo-200'}`}
				>
					Shop now
				</a>
			</div>
		</div>
	</section>

	{#if form?.products?.length > 0}
		<section class="mb-16">
			<h2
				class={`mb-6 text-center text-2xl font-semibold ${isLight ? 'text-amber-700' : 'text-indigo-400'}`}
			>
				{m.categories_results_title()}
			</h2>
			<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
				{#each form.products as product}
					<article
						class={`flex flex-col rounded-2xl border p-4 shadow-lg backdrop-blur-sm transition duration-300 hover:-translate-y-1 ${
							isLight
								? 'border-stone-200 bg-white/80 hover:shadow-[0_20px_45px_rgba(217,119,6,0.18)]'
								: 'border-gray-700 bg-gray-800/60 hover:shadow-indigo-500/30'
						}`}
					>
						<div
							class={`flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border ${
								isLight
									? 'border-stone-200 bg-gradient-to-br from-amber-50 via-white to-stone-100'
									: 'border-gray-700 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800'
							}`}
						>
							{#if productImages[product.id] && selectedColor[product.id]}
								<img
									src={productImages[product.id].colors[selectedColor[product.id]]}
									alt={product.name}
									class="h-full w-full object-cover"
								/>
							{:else if product.image_url}
								<img
									src={product.image_url}
									alt={product.name}
									class="h-full w-full object-cover"
								/>
							{:else}
								<span class={`text-sm ${isLight ? 'text-slate-400' : 'text-gray-400'}`}
									>Image coming soon</span
								>
							{/if}
						</div>
						<div class="mt-3 flex flex-1 flex-col gap-2">
							<div class="flex items-center justify-between gap-2">
								<h3
									class={`line-clamp-1 text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}
								>
									{product.name}
								</h3>
								<span
									class={`text-sm font-medium ${isLight ? 'text-amber-700' : 'text-indigo-300'}`}
									>${product.base_price}</span
								>
							</div>
							{#if product.description}
								<p class={`line-clamp-2 text-sm ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
									{short(product.description, 110)}
								</p>
							{/if}
							<div
								class={`flex flex-wrap gap-2 text-xs ${isLight ? 'text-slate-600' : 'text-gray-300'}`}
							>
								{#each featureBadges(product) as feat}
									<span
										class={`rounded-full border px-2 py-1 ${isLight ? 'border-stone-200 bg-stone-100' : 'border-white/10 bg-white/5'}`}
										>{feat}</span
									>
								{/each}
							</div>
						</div>
						<button
							onclick={() => viewProduct(product.id)}
							class={`mt-3 rounded-lg px-4 py-2 text-white transition ${isLight ? 'bg-amber-500 hover:bg-amber-400' : 'bg-[#4F46E5] hover:bg-[#6366F1]'}`}
						>
							{m.categories_view_product()}
						</button>
					</article>
				{/each}
			</div>
		</section>
	{/if}

	<div class="space-y-20">
		{#each categoryGroups as category}
			<section class="text-center">
				<h2
					class={`mb-2 text-3xl font-bold tracking-tight sm:text-4xl ${
						isLight
							? 'text-slate-900 drop-shadow-[0_5px_18px_rgba(245,158,11,0.16)]'
							: 'text-white drop-shadow-[0_5px_18px_rgba(79,70,229,0.25)]'
					}`}
				>
					{category.title}
				</h2>
				<div
					class={`mx-auto mb-8 h-0.5 w-24 rounded ${isLight ? 'bg-amber-500/50' : 'bg-indigo-400/50'}`}
				></div>
				<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{#each category.items as product}
						<article
							class={`flex flex-col rounded-2xl border p-4 shadow-lg backdrop-blur-sm transition duration-300 hover:-translate-y-1 ${
								isLight
									? 'border-stone-200 bg-white/82 hover:shadow-[0_20px_45px_rgba(217,119,6,0.18)]'
									: 'border-gray-700 bg-gray-800/60 hover:shadow-indigo-500/30'
							}`}
						>
							<div
								class={`flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border ${
									isLight
										? 'border-stone-200 bg-gradient-to-br from-amber-50 via-white to-stone-100'
										: 'border-gray-700 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800'
								}`}
							>
								{#if product.image_url}
									<img
										src={product.image_url}
										alt={product.name}
										class="h-full w-full object-cover"
									/>
								{:else}
									<span class={`text-sm ${isLight ? 'text-slate-400' : 'text-gray-400'}`}
										>Image coming soon</span
									>
								{/if}
							</div>
							<div class="mt-3 flex flex-1 flex-col gap-2">
								<div class="flex items-center justify-between gap-2">
									<h3
										class={`line-clamp-1 text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}
									>
										{product.name}
									</h3>
									<span
										class={`text-sm font-medium ${isLight ? 'text-amber-700' : 'text-indigo-300'}`}
										>${product.base_price}</span
									>
								</div>
								{#if product.description}
									<p class={`line-clamp-2 text-sm ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
										{short(product.description, 110)}
									</p>
								{/if}
								<div
									class={`flex flex-wrap gap-2 text-xs ${isLight ? 'text-slate-600' : 'text-gray-300'}`}
								>
									{#each featureBadges(product) as feat}
										<span
											class={`rounded-full border px-2 py-1 ${isLight ? 'border-stone-200 bg-stone-100' : 'border-white/10 bg-white/5'}`}
											>{feat}</span
										>
									{/each}
								</div>
							</div>
							<button
								onclick={() => viewProduct(product.id)}
								class={`mt-3 rounded-lg px-4 py-2 text-white transition ${isLight ? 'bg-amber-500 hover:bg-amber-400' : 'bg-[#4F46E5] hover:bg-[#6366F1]'}`}
							>
								View Product
							</button>
						</article>
					{/each}
				</div>
			</section>
		{/each}
	</div>
</div>
