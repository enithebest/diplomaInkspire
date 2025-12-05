<script>
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';
  import * as m from '$lib/paraglide/messages/_index.js';
  export let data;
  export let form;

  import { productImages } from "./productImages.js";
  let selectedColor = {};

  const { hoodies, tshirts, sweatshirts, mugs } = data;
   const short = (text, len = 90) => (text ? `${text.slice(0, len)}${text.length > len ? '…' : ''}` : '');
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

  // Redirect to product detail page instead of customisation
  function viewProduct(id) {
    window.location.href = `/product/${id}`;
  }
  let showDesignToast = false;
  const categorySections = [
    { title: m.categories_section_hoodies(), items: hoodies },
    { title: m.categories_section_tshirts(), items: tshirts },
    { title: m.categories_section_sweatshirts(), items: sweatshirts },
    { title: m.categories_section_mugs(), items: mugs }
  ];

  const clearSearch = () => goto('/categories');
  onMount(() => {
    try {
      const url = typeof localStorage !== 'undefined' ? localStorage.getItem('selectedDesignUrl') : null;
      if (url) {
        showDesignToast = true;
        setTimeout(() => (showDesignToast = false), 2500);
      }
    } catch (e) {}
  });
</script>

<div class="relative isolate overflow-hidden bg-gray-900 text-gray-200 min-h-screen px-6 py-16 sm:py-24 lg:px-12">
  {#if showDesignToast}
    <div role="status" aria-live="polite" class="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-indigo-600 text-white pointer-events-none px-4 py-2 rounded-lg shadow-lg">{m.categories_toast_design_selected()}</div>
  {/if}
  <!-- Decorative SVG grid pattern -->
  <div class="absolute inset-0 -z-10 opacity-20">
    <svg aria-hidden="true" class="absolute top-0 left-1/2 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-800">
      <defs>
        <pattern id="grid" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
          <path d="M100 200V.5M.5 .5H200" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>

  <!-- Page Header -->
  <h1 class="text-4xl font-semibold text-center text-white mb-10">{m.categories_title()}</h1>

  <!-- Search Bar -->
  <form method="POST" action="?/search" use:enhance class="flex flex-col sm:flex-row gap-3 justify-center mb-12">
    <div class="relative w-full sm:w-1/2">
      <input
        type="text"
        name="name"
        placeholder={form?.searchTerm || m.categories_search_placeholder()}
        class="border border-gray-700 bg-gray-800 text-gray-200 placeholder:text-gray-500 rounded-lg px-4 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        required
        aria-label="Produkt suchen"
      />
      {#if form?.searchTerm}
        <button
          type="button"
          class="absolute inset-y-0 right-2 my-auto h-8 w-8 rounded-full bg-gray-700 text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          onclick={clearSearch}
          aria-label="Suche zurücksetzen und zum Shop"
        >
          ✕
        </button>
      {/if}
    </div>
    <button
      type="submit"
      class="bg-[#4F46E5] hover:bg-[#6366F1] text-white px-6 py-2 rounded-lg font-medium transition"
    >
      {m.categories_search_button()}
    </button>
  </form>

  {#if form?.message}
    <p class="text-center text-red-500 mb-4">{form.message}</p>
  {/if}

  <!--Search Results -->
  {#if form?.products?.length > 0}
    <section class="mb-16">
      <h2 class="text-2xl font-semibold mb-6 text-center text-indigo-400">{m.categories_results_title()}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {#each form.products as product}
          <div
            class="bg-gray-800/60 backdrop-blur-sm border border-gray-700 shadow-lg rounded-2xl p-4 flex flex-col transition hover:-translate-y-1 hover:shadow-indigo-500/30 duration-300"
          >
            <div class="w-full h-48 rounded-xl bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center">
            {#if productImages[product.id] && selectedColor[product.id]}
  <!-- Variante gewählt -->
  <img
    src={productImages[product.id].colors[selectedColor[product.id]]}
    alt={product.name}
    class="w-full h-full object-cover"
  />
{:else if product.image_url}
  <!-- Standard DB Bild -->
  <img
    src={product.image_url}
    alt={product.name}
    class="w-full h-full object-cover"
  />
{:else}
  <span class="text-gray-400 text-sm">Image coming soon</span>
{/if}

            </div>
            <div class="mt-3 flex-1 flex flex-col gap-2">
              <div class="flex items-center justify-between gap-2">
                <h3 class="text-lg font-semibold text-white line-clamp-1">{product.name}</h3>
                <span class="text-sm text-indigo-300 font-medium">${product.base_price}</span>
              </div>
              {#if product.description}
                <p class="text-gray-400 text-sm line-clamp-2">{short(product.description, 110)}</p>
              {/if}
              <div class="flex flex-wrap gap-2 text-xs text-gray-300">
                {#each featureBadges(product) as feat}
                  <span class="px-2 py-1 rounded-full bg-white/5 border border-white/10">{feat}</span>
                {/each}
              </div>
            </div>
            <button
              onclick={() => viewProduct(product.id)}
              class="mt-3 bg-[#4F46E5] hover:bg-[#6366F1] text-white px-4 py-2 rounded-lg transition"
            >
              {m.categories_view_product()}
            </button>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Product Categories -->
  <div class="space-y-20">
    {#each [
      { title: 'Hoodies', items: hoodies },
      { title: 'T-Shirts', items: tshirts },
      { title: 'Sweatshirts', items: sweatshirts },
      { title: 'Mugs', items: mugs }
    ] as category}
    <section class="text-center">
      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-white drop-shadow-[0_5px_18px_rgba(79,70,229,0.25)]">
        {category.title}
      </h2>
      <div class="h-0.5 w-24 mx-auto bg-indigo-400/50 rounded mb-8"></div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {#each category.items as product}
          <div
            class="bg-gray-800/60 backdrop-blur-sm border border-gray-700 shadow-lg rounded-2xl p-4 flex flex-col transition hover:-translate-y-1 hover:shadow-indigo-500/30 duration-300"
          >
            <div class="w-full h-48 rounded-xl bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center">
              {#if product.image_url}
                <img src={product.image_url} alt={product.name} class="w-full h-full object-cover" />
              {:else}
                <span class="text-gray-400 text-sm">Image coming soon</span>
              {/if}
            </div>
            <div class="mt-3 flex-1 flex flex-col gap-2">
              <div class="flex items-center justify-between gap-2">
                <h3 class="text-lg font-semibold text-white line-clamp-1">{product.name}</h3>
                <span class="text-sm text-indigo-300 font-medium">${product.base_price}</span>
              </div>
              {#if product.description}
                <p class="text-gray-400 text-sm line-clamp-2">{short(product.description, 110)}</p>
              {/if}
              <div class="flex flex-wrap gap-2 text-xs text-gray-300">
                {#each featureBadges(product) as feat}
                  <span class="px-2 py-1 rounded-full bg-white/5 border border-white/10">{feat}</span>
                {/each}
              </div>
            </div>
            <button
              onclick={() => viewProduct(product.id)}
              class="mt-3 bg-[#4F46E5] hover:bg-[#6366F1] text-white px-4 py-2 rounded-lg transition"
            >
              View Product
            </button>
          </div>
        {/each}
      </div>
    </section>
    {/each}
  </div>
</div>
