<script>
  export let data;

  const product = data.product;
  const variants = data.variants || [];

  let selectedVariant = null;
  let selectedColor = '';
  let selectedSize = '';
  let showMore = false;

  const colors = Array.from(
    new Set(variants.map((v) => v.color).filter((v) => !!v))
  );

  function sizesFor(color) {
    return Array.from(
      new Set(
        variants
          .filter((v) => v.color === color && v.size)
          .map((v) => v.size)
      )
    );
  }

  function chooseColor(c) {
    selectedColor = c;
    // reset size when color changes
    selectedSize = '';
    selectedVariant = null;
  }

  function chooseSize(s) {
    selectedSize = s;
    selectedVariant =
      variants.find((v) => v.color === selectedColor && v.size === s) || null;
  }

  function addToCart() {
    if (!selectedVariant) return;
    try {
      const item = {
        product_id: product.id,
        variant_id: selectedVariant.id,
        name: product.name,
        color: selectedVariant.color,
        size: selectedVariant.size,
        price: selectedVariant.price ?? product.base_price,
        qty: 1,
        image_url: selectedVariant.image_url ?? product.image_url
      };
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('cart') : null;
      const cart = raw ? JSON.parse(raw) : [];
      cart.push(item);
      if (typeof localStorage !== 'undefined') localStorage.setItem('cart', JSON.stringify(cart));
      alert('Added to cart');
    } catch (e) {
      console.error(e);
    }
  }

  const shortDesc = (product?.description || '').slice(0, 160);
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
              <button
                type="button"
                class="rounded-md border border-gray-700 hover:ring-2 hover:ring-indigo-500 transition p-0"
                on:click={() => (selectedVariant = variant)}
                aria-label="Choose variant image"
              >
                <img
                  src={variant.image_url}
                  alt="Variant thumbnail"
                  class="w-20 h-20 object-cover rounded-md"
                />
              </button>
            {/if}
          {/each}
        </div>
      {/if}
    </div>

    <!-- RIGHT: Details -->
    <div class="space-y-5">
      <h1 class="text-4xl font-bold text-white">{product.name}</h1>

      <!-- Short description above the fold -->
      {#if product.description}
        <p class="text-gray-300 leading-relaxed">
          {#if product.description.length > 160}
            {shortDesc}... <button class="text-indigo-400 underline text-sm" on:click={() => (showMore = !showMore)}>{showMore ? 'Show less' : 'Read more'}</button>
          {:else}
            {product.description}
          {/if}
        </p>
      {/if}

      <p class="text-2xl font-semibold text-indigo-400">
        ${selectedVariant?.price ?? product.base_price}
      </p>

      <!-- Variant Selection -->
      {#if variants && variants.length > 0}
        <div class="mt-6 space-y-4">
          <h3 class="text-lg font-semibold text-indigo-400">Select Variant</h3>

          <!-- Colors -->
          {#if colors.length > 0}
            <div class="flex items-center gap-3 flex-wrap">
              {#each colors as c}
                <button
                  class={`w-9 h-9 rounded-full border-2 ${selectedColor === c ? 'border-indigo-500' : 'border-gray-600'} flex items-center justify-center`}
                  style={`background-color: ${c?.toLowerCase?.() || 'transparent'}`}
                  title={c}
                  on:click={() => chooseColor(c)}
                >
                  {#if !c}
                    <span class="text-xs text-gray-400">?</span>
                  {/if}
                </button>
                <span class="sr-only">{c}</span>
              {/each}
            </div>
          {/if}

          <!-- Sizes (appear after color selected) -->
          {#if selectedColor}
            <div class="flex items-center gap-2 flex-wrap">
              {#each sizesFor(selectedColor) as s}
                <button
                  class={`px-3 py-1.5 rounded-md border text-sm ${selectedSize === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'}`}
                  on:click={() => chooseSize(s)}
                >{s}</button>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      <!-- Primary actions -->
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          class="bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          disabled={!selectedVariant}
          on:click={addToCart}
        >
          Add to cart
        </button>
        <a
          href={selectedVariant ? `/customisation/${selectedVariant.id}` : undefined}
          class={`text-center py-3 rounded-lg font-semibold ${selectedVariant ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-700 text-gray-300 cursor-not-allowed'}`}
          aria-disabled={!selectedVariant}
        >
          Start Designing
        </a>
      </div>

      <!-- Details below -->
      {#if showMore && product.description}
        <div class="mt-6">
          <h3 class="text-lg font-semibold text-indigo-400 mb-2">Description</h3>
          <p class="text-gray-300 leading-relaxed">{product.description}</p>
        </div>
      {/if}

      <div class="mt-6">
        <h3 class="text-lg font-semibold text-indigo-400 mb-2">Specifications</h3>
        <ul class="list-disc list-inside text-gray-300 space-y-1">
          <li>Fabric: Cotton blend</li>
          <li>Fit: Regular</li>
          <li>Weight: Mid‑weight</li>
        </ul>
      </div>
    </div>
  </section>
{/if}

<style>
  :global(body) {
    background-color: #0f172a; /* same bg as other pages */
    color: #f8fafc;
  }
</style>
