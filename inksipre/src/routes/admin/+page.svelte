<script>
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages/_index.js';
	import { theme } from '$lib/stores/theme';
	export let data;
	export let form;

	const toOv = (ov) => {
		try {
			return typeof ov === 'string' ? JSON.parse(ov) : ov;
		} catch (e) {
			return {};
		}
	};

	let displayCount = 3;
	const productsPerPage = 3;

	$: visibleProducts = data.products.slice(0, displayCount);
	$: hasMore = displayCount < data.products.length;

	const loadMore = () => {
		displayCount += productsPerPage;
	};
	$: isLight = $theme === 'light';
</script>

<div
	class="pointer-events-auto fixed top-4 right-6 z-50 hidden h-9 w-20 rounded-full bg-gray-900/90 md:block"
></div>

<section
	class={`relative min-h-screen overflow-hidden px-6 py-16 ${isLight ? 'bg-gradient-to-b from-[#fbf7f1] via-[#f4efe7] to-[#efe7db] text-slate-900' : 'bg-gradient-to-b from-[#141b33] via-[#10182c] to-[#0c1124] text-white'}`}
>
	<div
		class="absolute -top-40 left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-700/20 blur-3xl"
	></div>

	<div class="relative z-10 mx-auto max-w-5xl space-y-10">
		<h1
			class="mb-6 bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-5xl"
		>
			Adminbereich Produktverwaltung
		</h1>

		<form
			method="POST"
			action="?/create"
			enctype="multipart/form-data"
			use:enhance
			class="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md"
		>
			<h2 class="mb-6 text-2xl font-semibold text-blue-300">{m.admin_create_heading()}</h2>

			<div class="grid grid-cols-2 gap-4">
				<input
					name="name"
					placeholder={m.admin_name_placeholder()}
					class="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
					required
				/>
				<input
					name="base_price"
					placeholder={m.admin_base_price_placeholder()}
					type="number"
					step="0.01"
					class="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
					required
				/>
				<textarea
					name="description"
					placeholder={m.admin_description_placeholder()}
					class="col-span-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
				></textarea>

				<select
					name="category"
					class="col-span-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
					required
				>
					<option value="" class="bg-[#10182c] text-gray-300"
						>{m.admin_category_select_default()}</option
					>
					<option value="hoodies" class="bg-[#10182c] text-gray-100"
						>{m.admin_category_hoodies()}</option
					>
					<option value="tshirts" class="bg-[#10182c] text-gray-100"
						>{m.admin_category_tshirts()}</option
					>
					<option value="sweatshirts" class="bg-[#10182c] text-gray-100"
						>{m.admin_category_sweatshirts()}</option
					>
					<option value="mugs" class="bg-[#10182c] text-gray-100">{m.admin_category_mugs()}</option>
				</select>

				<input
					name="image"
					type="file"
					accept="image/*"
					class="col-span-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
					required
				/>
				<p class="col-span-2 text-sm text-gray-400">{m.admin_allowed_formats()}</p>
			</div>

			<button
				type="submit"
				class={`mt-5 w-full rounded-lg py-3 font-semibold text-white shadow-lg transition-all duration-200 ${isLight ? 'bg-amber-500 shadow-amber-500/25 hover:bg-amber-400' : 'bg-[#4F46E5] shadow-[#4F46E5]/20 hover:bg-[#6366F1]'}`}
			>
				{m.admin_create_button()}
			</button>
		</form>

		{#each visibleProducts as product}
			<div
				class="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md"
			>
				<div class="flex flex-wrap items-start justify-between gap-6">
					<div class="flex min-w-[250px] flex-1 items-center gap-4">
						<img
							src={product.image_url ?? '/placeholder.png'}
							alt={product.name}
							class="h-20 w-20 rounded-lg border border-white/10 object-cover"
						/>
						<div>
							<h3 class="text-xl font-semibold text-blue-300">{product.name}</h3>
							<p class="text-gray-300">{product.description}</p>
							<p class="text-sm text-gray-400">{product.category}</p>
							<p class="mt-1 font-medium text-white">{product.base_price} €</p>
						</div>
					</div>

					<form method="POST" action="?/delete" use:enhance>
						<input type="hidden" name="id" value={product.id} />
						<button
							class={`rounded-lg px-4 py-2 font-medium text-white transition ${isLight ? 'bg-rose-500 hover:bg-rose-400' : 'bg-red-500 hover:bg-red-600'}`}
						>
							{m.admin_delete_button()}
						</button>
					</form>
				</div>

				<div class="mt-6">
					<h4 class="mb-3 font-semibold text-blue-200">{m.admin_variants_heading()}</h4>

					{#if product.variants?.length > 0}
						<ul class="mb-4 space-y-2">
							{#each product.variants as v (v.id)}
								{@const ov = toOv(v.option_values)}
								<li
									class="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-gray-200 transition hover:bg-white/20"
								>
									<span class="font-mono">
										{ov?.size || '–'} / {ov?.color || '–'}
									</span>
									<div class="flex items-center gap-4">
										<span class="text-sm font-medium">{v.price} €</span>
										<form method="POST" action="?/deleteVariant" use:enhance>
											<input type="hidden" name="id" value={v.id} />
											<button class="text-sm font-medium text-red-400 hover:text-red-500">
												Löschen
											</button>
										</form>
									</div>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="mb-3 text-gray-400">{m.admin_no_variants()}</p>
					{/if}

					<form method="POST" action="?/addVariant" use:enhance class="flex flex-wrap gap-2">
						<input type="hidden" name="product_id" value={product.id} />
						<input
							name="size"
							placeholder={m.admin_variant_size_placeholder()}
							class="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
						/>
						<input
							name="color"
							placeholder={m.admin_variant_color_placeholder()}
							class="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
						/>
						<input
							name="price"
							type="number"
							step="0.01"
							placeholder={m.admin_variant_price_placeholder()}
							class="w-28 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
						/>
						<button
							class={`rounded-lg px-5 py-2 font-semibold text-white shadow-lg transition ${isLight ? 'bg-amber-500 shadow-amber-500/25 hover:bg-amber-400' : 'bg-[#4F46E5] shadow-[#4F46E5]/20 hover:bg-[#6366F1]'}`}
						>
							{m.admin_add_variant_button()}
						</button>
					</form>
				</div>
			</div>
		{/each}

		{#if hasMore}
			<div class="mt-10 flex justify-center">
				<button
					on:click={loadMore}
					class={`rounded-lg px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 ${isLight ? 'bg-amber-500 shadow-amber-500/25 hover:bg-amber-400' : 'bg-[#4F46E5] shadow-[#4F46E5]/20 hover:bg-[#6366F1]'}`}
				>
					Load More Products
				</button>
			</div>
		{/if}

		{#if form?.message}
			<p class="text-center font-medium text-red-400">{form.message}</p>
		{/if}
	</div>
</section>
