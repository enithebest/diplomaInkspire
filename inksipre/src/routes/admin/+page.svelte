<script>
	import { enhance } from '$app/forms';
	export let data;
	export let form;

	const toOv = (ov) => {
		try {
			return typeof ov === 'string' ? JSON.parse(ov) : ov;
		} catch (e) {
			return {};
		}
	};
</script>

<section class="relative min-h-screen bg-gradient-to-b from-[#141b33] via-[#10182c] to-[#0c1124] text-white px-6 py-16 overflow-hidden">
	<div class="absolute -top-40 left-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-700/20 blur-3xl -translate-x-1/2"></div>

	<div class="relative z-10 max-w-5xl mx-auto space-y-10">
		<h1 class="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">
			Adminbereich – Produktverwaltung
		</h1>

		<form
			method="POST"
			action="?/create"
			enctype="multipart/form-data"
			use:enhance
			class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8"
		>
			<h2 class="text-2xl font-semibold mb-6 text-blue-300">Neues Produkt erstellen</h2>

			<div class="grid grid-cols-2 gap-4">
				<input
					name="name"
					placeholder="Produktname"
					class="bg-white/10 border border-white/10 rounded-lg px-3 py-2 placeholder-gray-400 text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
					required
				/>
				<input
					name="base_price"
					placeholder="Basispreis (€)"
					type="number"
					step="0.01"
					class="bg-white/10 border border-white/10 rounded-lg px-3 py-2 placeholder-gray-400 text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
					required
				/>
				<textarea
					name="description"
					placeholder="Beschreibung"
					class="col-span-2 bg-white/10 border border-white/10 rounded-lg px-3 py-2 placeholder-gray-400 text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
				></textarea>

				<select
					name="category"
					class="col-span-2 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
					required
				>
					<option value="" class="bg-[#10182c] text-gray-300">-- Kategorie wählen --</option>
					<option value="hoodies" class="bg-[#10182c] text-gray-100">Hoodies</option>
					<option value="tshirts" class="bg-[#10182c] text-gray-100">T-Shirts</option>
					<option value="sweatshirts" class="bg-[#10182c] text-gray-100">Sweatshirts</option>
					<option value="mugs" class="bg-[#10182c] text-gray-100">Mugs</option>
				</select>

				<input
					name="image"
					type="file"
					accept="image/*"
					class="col-span-2 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
					required
				/>
				<p class="col-span-2 text-sm text-gray-400">Erlaubte Formate: PNG, JPG, WEBP. Max. 5MB.</p>
			</div>

			<button
				type="submit"
				class="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20"
			>
				Erstellen
			</button>
		</form>

		{#each data.products as product}
			<div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-6 mb-6">
				<div class="flex justify-between items-start gap-6 flex-wrap">
					<div class="flex gap-4 items-center flex-1 min-w-[250px]">
						<img
							src={product.image_url ?? '/placeholder.png'}
							alt={product.name}
							class="w-20 h-20 object-cover rounded-lg border border-white/10"
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
							class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
						>
							Löschen
						</button>
					</form>
				</div>

				<div class="mt-6">
					<h4 class="font-semibold mb-3 text-blue-200">Varianten</h4>

					{#if product.variants?.length > 0}
						<ul class="space-y-2 mb-4">
							{#each product.variants as v (v.id)}
								{@const ov = toOv(v.option_values)}
								<li
									class="flex justify-between items-center bg-white/10 rounded-lg px-3 py-2 text-gray-200 hover:bg-white/20 transition"
								>
									<span class="font-mono">
										{ov?.size || '–'} / {ov?.color || '–'}
									</span>
									<div class="flex items-center gap-4">
										<span class="text-sm font-medium">{v.price} €</span>
										<form method="POST" action="?/deleteVariant" use:enhance>
											<input type="hidden" name="id" value={v.id} />
											<button
												class="text-red-400 hover:text-red-500 text-sm font-medium"
											>
												Löschen
											</button>
										</form>
									</div>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="text-gray-400 mb-3">Keine Varianten vorhanden.</p>
					{/if}

					<form method="POST" action="?/addVariant" use:enhance class="flex flex-wrap gap-2">
						<input type="hidden" name="product_id" value={product.id} />
						<input
							name="size"
							placeholder="Größe (z. B. M)"
							class="border border-white/10 bg-white/10 text-white placeholder-gray-400 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
						/>
						<input
							name="color"
							placeholder="Farbe (z. B. Schwarz)"
							class="border border-white/10 bg-white/10 text-white placeholder-gray-400 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
						/>
						<input
							name="price"
							type="number"
							step="0.01"
							placeholder="Preis (€)"
							class="border border-white/10 bg-white/10 text-white placeholder-gray-400 px-3 py-2 rounded-lg w-28 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
						/>
						<button
							class="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold transition shadow-lg shadow-blue-500/20"
						>
							Variante hinzufügen
						</button>
					</form>
				</div>
			</div>
		{/each}

		{#if form?.message}
			<p class="text-center text-red-400 font-medium">{form.message}</p>
		{/if}
	</div>
</section>
