<script>
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages/_index.js';
	import { theme } from '$lib/stores/theme';
	import { productImages } from './productImages.js';

	export let data;
	export let form;

	let selectedColor = {};
	let showDesignToast = false;
	let showFilterPopup = false;
	let selectedCategories = [];
	let selectedColors = [];
	let maxPrice = 0;
	let sortBy = 'featured';
	let searchQuery = '';
	let categoryGroups = [];
	let filteredProducts = [];
	let visibleCount = 0;
	let activeFilterCount = 0;

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

	const categoryOptions = [
		{ value: 'hoodies', title: 'Hoodies' },
		{ value: 'tshirts', title: 'T-Shirts' },
		{ value: 'sweatshirts', title: 'Sweatshirts' },
		{ value: 'mugs', title: 'Mugs' }
	];

	const colorMeta = {
		black: '#111111',
		white: '#f8fafc',
		red: '#ef4444'
	};

	const allProducts = [...hoodies, ...tshirts, ...sweatshirts, ...mugs];
	const priceOf = (product) => Number(product?.base_price || 0);
	const colorsOf = (product) => Object.keys(productImages[product?.id]?.colors || {});
	const availableColors = Array.from(new Set(allProducts.flatMap(colorsOf)));
	const highestPrice = allProducts.length ? Math.max(...allProducts.map(priceOf)) : 0;

	$: isLight = $theme === 'light';
	$: if (!maxPrice && highestPrice) maxPrice = Math.ceil(highestPrice);

	function viewProduct(id) {
		window.location.href = `/product/${id}`;
	}

	function toggleInList(list, value) {
		return list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value];
	}

	function toggleCategory(value) {
		selectedCategories = toggleInList(selectedCategories, value);
	}

	function toggleColor(value) {
		selectedColors = toggleInList(selectedColors, value);
	}

	function resetFilters() {
		selectedCategories = [];
		selectedColors = [];
		searchQuery = '';
		sortBy = 'featured';
		maxPrice = Math.ceil(highestPrice || 0);
	}

	function applyFilters(items) {
		return items
			.filter((product) =>
				selectedCategories.length ? selectedCategories.includes(product.category) : true
			)
			.filter((product) =>
				selectedColors.length
					? selectedColors.some((color) => colorsOf(product).includes(color))
					: true
			)
			.filter((product) => priceOf(product) <= Number(maxPrice || highestPrice))
			.filter((product) => {
				if (!searchQuery.trim()) return true;
				const query = searchQuery.trim().toLowerCase();
				return (
					(product.name || '').toLowerCase().includes(query) ||
					(product.description || '').toLowerCase().includes(query) ||
					(product.category || '').toLowerCase().includes(query)
				);
			})
			.sort((a, b) => {
				if (sortBy === 'price-asc') return priceOf(a) - priceOf(b);
				if (sortBy === 'price-desc') return priceOf(b) - priceOf(a);
				return 0;
			});
	}

	$: {
		filteredProducts = applyFilters(allProducts);
		categoryGroups = [
			{ title: 'Hoodies', value: 'hoodies', items: applyFilters(hoodies) },
			{ title: 'T-Shirts', value: 'tshirts', items: applyFilters(tshirts) },
			{ title: 'Sweatshirts', value: 'sweatshirts', items: applyFilters(sweatshirts) },
			{ title: 'Mugs', value: 'mugs', items: applyFilters(mugs) }
		];
		visibleCount = filteredProducts.length;
		activeFilterCount =
			selectedCategories.length +
			selectedColors.length +
			(Number(maxPrice || highestPrice) < highestPrice ? 1 : 0) +
			(searchQuery.trim() ? 1 : 0) +
			(sortBy !== 'featured' ? 1 : 0);
	}

	onMount(() => {
		for (const product of allProducts) {
			const initialColor = colorsOf(product)[0];
			if (initialColor) selectedColor[product.id] = initialColor;
		}

		try {
			const url =
				typeof localStorage !== 'undefined' ? localStorage.getItem('selectedDesignUrl') : null;
			if (url) {
				showDesignToast = true;
				setTimeout(() => (showDesignToast = false), 2500);
			}
		} catch {
			showDesignToast = false;
		}
	});
</script>

<div
	class={`relative isolate min-h-screen overflow-hidden px-6 pb-16 transition-colors duration-300 sm:pb-24 lg:px-12 ${
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

	{#if showFilterPopup}
		<button
			type="button"
			class="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
			onclick={() => (showFilterPopup = false)}
			aria-label="Close filter popup"
		></button>

		<div
			class={`fixed top-24 right-6 z-50 w-full max-w-md rounded-[2rem] border p-6 shadow-2xl backdrop-blur-xl lg:right-12 ${
				isLight
					? 'border-stone-200 bg-white/92 text-slate-800'
					: 'border-white/10 bg-gray-900/95 text-gray-100'
			}`}
		>
			<div class="mb-5 flex items-start justify-between gap-4">
				<div>
					<h2 class={`text-2xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
						{m.categories_filter_title()}
					</h2>
					<p class={`mt-1 text-sm ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
						{m.categories_filter_helper()}
					</p>
				</div>
				<button
					type="button"
					onclick={() => (showFilterPopup = false)}
					class={`rounded-full px-3 py-1 text-sm ${
						isLight ? 'bg-stone-100 text-slate-700' : 'bg-white/10 text-gray-200'
					}`}
				>
					×
				</button>
			</div>

			<div class="space-y-5">
				<div>
					<label
						class={`mb-2 block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-gray-200'}`}
						for="popup-search"
					>
						{m.categories_search_placeholder()}
					</label>
					<input
						id="popup-search"
						type="search"
						bind:value={searchQuery}
						placeholder={m.categories_search_placeholder()}
						class={`w-full rounded-2xl border px-4 py-3 transition outline-none ${
							isLight
								? 'border-stone-200 bg-stone-50 text-slate-900 placeholder:text-slate-400'
								: 'border-white/10 bg-slate-900 text-white placeholder:text-gray-500'
						}`}
					/>
				</div>

				<div>
					<p class={`mb-3 text-sm font-medium ${isLight ? 'text-slate-700' : 'text-gray-200'}`}>
						{m.categories_filter_category()}
					</p>
					<div class="flex flex-wrap gap-2">
						{#each categoryOptions as option (option.value)}
							<button
								type="button"
								onclick={() => toggleCategory(option.value)}
								class={`rounded-full border px-4 py-2 text-sm transition ${
									selectedCategories.includes(option.value)
										? isLight
											? 'border-amber-400 bg-amber-100 text-amber-800'
											: 'border-indigo-400 bg-indigo-500/15 text-indigo-200'
										: isLight
											? 'border-stone-200 bg-white text-slate-700'
											: 'border-white/10 bg-white/5 text-gray-300'
								}`}
							>
								{option.title}
							</button>
						{/each}
					</div>
				</div>

				<div>
					<p class={`mb-3 text-sm font-medium ${isLight ? 'text-slate-700' : 'text-gray-200'}`}>
						{m.categories_filter_color()}
					</p>
					<div class="flex flex-wrap gap-2">
						{#each availableColors as color (color)}
							<button
								type="button"
								onclick={() => toggleColor(color)}
								class={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm capitalize transition ${
									selectedColors.includes(color)
										? isLight
											? 'border-slate-900 bg-slate-900 text-white'
											: 'border-white bg-white text-slate-900'
										: isLight
											? 'border-stone-200 bg-white text-slate-700'
											: 'border-white/10 bg-white/5 text-gray-300'
								}`}
							>
								<span
									class="h-4 w-4 rounded-full border border-black/10"
									style={`background:${colorMeta[color] || color};`}
								></span>
								{color}
							</button>
						{/each}
					</div>
				</div>

				<div>
					<div
						class={`mb-2 flex items-center justify-between text-sm ${isLight ? 'text-slate-700' : 'text-gray-200'}`}
					>
						<span>{m.categories_filter_price_cap()}</span>
						<span class={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
							${Number(maxPrice || 0).toFixed(0)}
						</span>
					</div>
					<input
						type="range"
						min="0"
						max={Math.ceil(highestPrice || 0)}
						step="1"
						bind:value={maxPrice}
						class="w-full accent-indigo-500"
					/>
				</div>

				<div>
					<label
						class={`mb-2 block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-gray-200'}`}
						for="popup-sort"
					>
						{m.categories_filter_sort()}
					</label>
					<select
						id="popup-sort"
						bind:value={sortBy}
						class={`w-full rounded-2xl border px-4 py-3 transition outline-none ${
							isLight
								? 'border-stone-200 bg-stone-50 text-slate-900'
								: 'border-white/10 bg-slate-900 text-white'
						}`}
					>
						<option value="featured">{m.categories_filter_sort_featured()}</option>
						<option value="price-asc">{m.categories_filter_sort_price_low()}</option>
						<option value="price-desc">{m.categories_filter_sort_price_high()}</option>
					</select>
				</div>
			</div>

			<div class="mt-6 flex items-center justify-between gap-3">
				<div class={`text-sm ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
					{visibleCount}
					{m.categories_filter_results()}
				</div>
				<div class="flex gap-2">
					<button
						type="button"
						onclick={resetFilters}
						class={`rounded-full px-4 py-2 text-sm font-medium ${
							isLight ? 'bg-stone-100 text-slate-700' : 'bg-white/10 text-gray-200'
						}`}
					>
						{m.categories_filter_reset()}
					</button>
					<button
						type="button"
						onclick={() => (showFilterPopup = false)}
						class={`rounded-full px-4 py-2 text-sm font-medium text-white ${
							isLight ? 'bg-amber-500' : 'bg-indigo-600'
						}`}
					>
						OK
					</button>
				</div>
			</div>
		</div>
	{/if}

	<div class={`absolute inset-0 -z-10 ${isLight ? 'opacity-40' : 'opacity-20'}`}>
		<svg
			aria-hidden="true"
			class={`absolute top-0 left-1/2 h-[64rem] w-[128rem] -translate-x-1/2 ${
				isLight ? 'stroke-stone-300' : 'stroke-gray-800'
			}`}
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
		class={`absolute inset-x-0 top-0 -z-10 h-[34rem] blur-3xl ${
			isLight
				? 'bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.22),_transparent_60%)]'
				: 'bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),_transparent_60%)]'
		}`}
	></div>

	<section
		class={`relative -mx-6 mb-12 min-h-screen overflow-hidden lg:-mx-12 ${
			isLight ? 'bg-[#efe3d1]' : 'bg-gray-800/80'
		}`}
	>
		<img
			src={isLight ? '/images/header2.png' : '/images/header.png'}
			alt="Collection hero"
			class={`absolute inset-0 h-full w-full object-cover`}
			loading="lazy"
		/>
		<div
			class={`absolute inset-0 ${
				isLight
					? 'bg-gradient-to-t from-[#f4efe7]/100 via-[#f4efe7]/5 to-transparent'
					: 'bg-gradient-to-t from-gray-900/100 via-gray-900/5 to-transparent'
			}`}
		></div>
		<div class="absolute inset-0 flex items-end justify-center px-6 pb-12 pt-24 sm:px-8 lg:px-12">
			<div class="space-y-4 text-center">
				<p
					class={`text-2xl font-light tracking-wide sm:text-3xl ${
						isLight ? 'text-slate-900' : 'text-white/90'
					}`}
				>
					Inkspire Winter Collection
				</p>
				<div class="flex flex-wrap items-center justify-center gap-3">
					<button
						type="button"
						onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
						class={`inline-block text-sm font-medium tracking-[0.12em] uppercase transition ${
							isLight ? 'text-slate-700 hover:text-amber-700' : 'text-white hover:text-indigo-200'
						}`}
					>
						Shop now
					</button>
					<button
						type="button"
						onclick={() => (showFilterPopup = true)}
						class={`rounded-full border px-4 py-2 text-sm font-medium transition ${
							isLight
								? 'border-stone-200 bg-white/80 text-slate-800 hover:bg-white'
								: 'border-white/15 bg-gray-900/60 text-white hover:bg-gray-900/80'
						}`}
					>
						{m.categories_filter_title()}
						{#if activeFilterCount > 0}({activeFilterCount}){/if}
					</button>
				</div>
			</div>
		</div>
	</section>

	{#if activeFilterCount > 0}
		<section class="mb-10 flex flex-wrap items-center gap-2">
			{#each selectedCategories as category (category)}
				<span
					class={`rounded-full px-3 py-1 text-xs ${isLight ? 'bg-amber-100 text-amber-800' : 'bg-indigo-500/15 text-indigo-200'}`}
				>
					{category}
				</span>
			{/each}
			{#each selectedColors as color (color)}
				<span
					class={`rounded-full px-3 py-1 text-xs capitalize ${isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
				>
					{color}
				</span>
			{/each}
			{#if searchQuery.trim()}
				<span
					class={`rounded-full px-3 py-1 text-xs ${isLight ? 'bg-stone-200 text-slate-700' : 'bg-white/10 text-gray-200'}`}
				>
					{searchQuery}
				</span>
			{/if}
			{#if Number(maxPrice || highestPrice) < highestPrice}
				<span
					class={`rounded-full px-3 py-1 text-xs ${isLight ? 'bg-stone-200 text-slate-700' : 'bg-white/10 text-gray-200'}`}
				>
					{m.categories_filter_price_cap()}: ${Number(maxPrice).toFixed(0)}
				</span>
			{/if}
		</section>
	{/if}

	{#if form?.products?.length > 0}
		<section class="mb-16">
			<h2
				class={`mb-6 text-center text-2xl font-semibold ${isLight ? 'text-amber-700' : 'text-indigo-400'}`}
			>
				{m.categories_results_title()}
			</h2>
			<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
				{#each form.products as product (product.id)}
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
								>
									${product.base_price}
								</span>
							</div>
							{#if product.description}
								<p class={`line-clamp-2 text-sm ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
									{short(product.description, 110)}
								</p>
							{/if}
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
		{#if visibleCount === 0}
			<section class="text-center">
				<p class={`text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
					{m.categories_filter_empty_title()}
				</p>
				<p class={`mt-2 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
					{m.categories_filter_empty_copy()}
				</p>
			</section>
		{/if}

		{#each categoryGroups as category (category.value)}
			{#if category.items.length > 0}
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
						{#each category.items as product (product.id)}
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
										>
											${product.base_price}
										</span>
									</div>
									{#if product.description}
										<p
											class={`line-clamp-2 text-sm ${isLight ? 'text-slate-500' : 'text-gray-400'}`}
										>
											{short(product.description, 110)}
										</p>
									{/if}
									<div class="flex flex-wrap gap-2">
										{#each colorsOf(product) as color (color)}
											<button
												type="button"
												onclick={() => (selectedColor[product.id] = color)}
												class={`h-7 w-7 rounded-full border-2 transition ${
													selectedColor[product.id] === color
														? isLight
															? 'border-slate-900'
															: 'border-white'
														: isLight
															? 'border-stone-200'
															: 'border-white/20'
												}`}
												style={`background:${colorMeta[color] || color};`}
												aria-label={`${product.name} ${color}`}
											></button>
										{/each}
									</div>
									<div
										class={`flex flex-wrap gap-2 text-xs ${isLight ? 'text-slate-600' : 'text-gray-300'}`}
									>
										{#each featureBadges(product) as feat (feat)}
											<span
												class={`rounded-full border px-2 py-1 ${isLight ? 'border-stone-200 bg-stone-100' : 'border-white/10 bg-white/5'}`}
											>
												{feat}
											</span>
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
		{/each}
	</div>
</div>
