<script>
  export let data;
  const { product, variants } = data;

  function handleUpload() {
    alert('Upload feature coming soon!');
  }
</script>

<h1 class="text-3xl font-bold mb-6">Customize {product.name}</h1>

<div class="flex flex-col md:flex-row gap-8">
  <!-- Product Preview -->
  <div class="flex-1">
    <img
      src={product.image_url ?? '/placeholder.png'}
      alt={product.name}
      class="w-full h-96 object-cover rounded-2xl shadow-md"
    />
  </div>

  <!-- Customization Panel -->
  <div class="flex-1 bg-white shadow-lg rounded-2xl p-6 space-y-4">
    <h2 class="text-2xl font-semibold">Product Details</h2>
    <p>{product.description}</p>
    <p class="text-gray-600">Base Price: ${product.base_price}</p>

    {#if variants?.length}
      <div>
        <h3 class="font-semibold mt-4">Variants</h3>
        <ul class="list-disc list-inside text-gray-700">
          {#each variants as v}
            <li>{v.option_values}</li>
          {/each}
        </ul>
      </div>
    {/if}

    <button
      on:click={handleUpload}
      class="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Upload Design
    </button>
  </div>
</div>
