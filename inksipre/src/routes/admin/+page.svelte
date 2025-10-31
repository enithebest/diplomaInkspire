<script>
	import { enhance } from '$app/forms';
	export let data;
	export let form;
</script>

<h1 class="text-3xl font-bold mb-6 text-center">🛠️ Adminbereich – Produktverwaltung</h1>

<!-- Neues Produkt -->
<form
	method="POST"
	action="?/create"
	enctype="multipart/form-data"
	use:enhance
	class="bg-gray-100 p-4 rounded-lg mb-6"
>
	<h2 class="text-xl mb-3 font-semibold">Neues Produkt erstellen</h2>

	<div class="grid grid-cols-2 gap-2">
		<input name="name" placeholder="Produktname" class="border p-2 rounded" required />
		<input
			name="base_price"
			placeholder="Basispreis (€)"
			type="number"
			step="0.01"
			class="border p-2 rounded"
			required
		/>
		<textarea
			name="description"
			placeholder="Beschreibung"
			class="border p-2 rounded col-span-2"
		></textarea>

		<!-- Kategorie -->
		<select name="category" class="border p-2 rounded col-span-2" required>
			<option value="">-- Kategorie wählen --</option>
			<option value="hoodies">Hoodies</option>
			<option value="tshirts">T-Shirts</option>
			<option value="sweatshirts">Sweatshirts</option>
			<option value="mugs">Mugs</option>
		</select>

		<!-- Bild -->
		<input
			name="image"
			type="file"
			accept="image/*"
			class="border p-2 rounded col-span-2"
			required
		/>
	</div>

	<button type="submit" class="mt-3 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
		Erstellen
	</button>
</form>

<!-- Bestehende Produkte -->
{#each data.products as product}
	<div class="border rounded-lg p-4 mb-6 bg-white shadow-sm">
		<div class="flex justify-between items-center">
			<div class="flex gap-4 items-center">
				<img
					src={product.image_url ?? '/placeholder.png'}
					alt={product.name}
					class="w-20 h-20 object-cover rounded-lg border"
				/>
				<div>
					<h3 class="text-lg font-semibold">{product.name}</h3>
					<p class="text-gray-600">{product.description}</p>
					<p class="text-sm text-gray-500">{product.category}</p>
					<p class="mt-1 font-medium">{product.base_price} €</p>
				</div>
			</div>

			<form method="POST" action="?/delete" use:enhance>
				<input type="hidden" name="id" value={product.id} />
				<button class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Löschen</button>
			</form>
		</div>

		<!-- Varianten -->
		<div class="mt-4">
			<h4 class="font-semibold mb-2">Varianten</h4>
			{#if product.variants?.length > 0}
				<ul class="list-disc list-inside mb-3">
					{#each product.variants as v}
						<li>
							<code>{JSON.stringify(v.option_values)}</code> – {v.price} €
							<form method="POST" action="?/deleteVariant" use:enhance class="inline">
								<input type="hidden" name="id" value={v.id} />
								<button class="text-green-600 ml-2 hover:underline">✕</button>
							</form>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-gray-500 mb-3">Keine Varianten vorhanden.</p>
			{/if}

			<form method="POST" action="?/addVariant" use:enhance class="flex flex-wrap gap-2">
				<input type="hidden" name="product_id" value={product.id} />
				<input name="size" placeholder="Größe (z. B. M)" class="border p-1 rounded" />
				<input name="color" placeholder="Farbe (z. B. Schwarz)" class="border p-1 rounded" />
				<input
					name="price"
					type="number"
					step="0.01"
					placeholder="Preis (€)"
					class="border p-1 rounded w-28"
				/>
				<button class="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-800">
					Variante hinzufügen
				</button>
			</form>
		</div>
	</div>
{/each}

{#if form?.message}
	<p class="text-center text-red-600">{form.message}</p>
{/if}
