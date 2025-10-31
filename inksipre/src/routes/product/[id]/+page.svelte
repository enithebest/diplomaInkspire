<script>
  export let data;
  let selectedVariant = null;

  const product = data.product;
  const variants = data.variants;
</script>

{#if !product}
  <p class="text-center mt-20 text-gray-500 text-lg">Product not found.</p>
{:else}
  <section class="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
    <!-- LEFT: Image -->
    <div>
      <img
        src={selectedVariant?.image_url ?? product.image_url}
        alt={product.name}
        class="rounded-lg shadow-lg w-full max-h-[500px] object-cover"
      />

      <!-- Thumbnail previews -->
      {#if variants && variants.length > 0}
        <div class="flex gap-3 mt-4 flex-wrap justify-center">
          {#each variants as variant}
            {#if variant.image_url}
              <img
                src={variant.image_url}
                alt="Variant"
                class="w-20 h-20 object-cover rounded-md border border-gray-700 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition"
                on:click={() => (selectedVariant = variant)}
              />
            {/if}
          {/each}
        </div>
      {/if}
    </div>

    <!-- RIGHT: Details -->
    <div class="space-y-5">
      <h1 class="text-4xl font-bold text-white">{product.name}</h1>
      <p class="text-gray-300 leading-relaxed">{product.description}</p>

      <p class="text-2xl font-semibold text-indigo-400">
        ${selectedVariant?.price ?? product.base_price}
      </p>

      <!-- Variant Selection -->
      {#if variants && variants.length > 0}
        <div class="mt-6">
          <h3 class="text-lg font-semibold mb-2 text-indigo-400">Select Variant</h3>
          <div class="flex flex-wrap gap-3">
            {#each variants as variant}
              <button
                class={`px-4 py-2 rounded-lg border transition text-sm ${
                  selectedVariant?.id === variant.id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
                }`}
                on:click={() => (selectedVariant = variant)}
              >
                {variant.color ?? 'Color'} / {variant.size ?? 'Size'}
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Start Designing Button -->
      {#if selectedVariant}
        <a
          href={`/customisation/${selectedVariant.id}`}
          class="block mt-8 text-center bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Start Designing
        </a>
      {:else}
        <p class="text-gray-500 text-sm mt-6">Please select a variant to continue.</p>
      {/if}
    </div>
  </section>
{/if}

<style>
  :global(body) {
    background-color: #0f172a; /* same bg as other pages */
    color: #f8fafc;
  }
</style>
