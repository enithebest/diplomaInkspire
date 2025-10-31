<script>
  import { enhance } from '$app/forms';
  export let data;
  export let form;

  const { hoodies, tshirts, sweatshirts, mugs } = data;

  // Redirect to product detail page instead of customisation
  function viewProduct(id) {
    window.location.href = `/product/${id}`;
  }
</script>

<!-- ðŸŒŒ Background Section -->
<div class="relative isolate overflow-hidden bg-gray-900 text-gray-200 min-h-screen px-6 py-16 sm:py-24 lg:px-12">
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
  <h1 class="text-4xl font-semibold text-center text-white mb-10">Our Categories</h1>

  <!-- ðŸ” Search Bar -->
  <form method="POST" action="?/search" use:enhance class="flex flex-col sm:flex-row gap-3 justify-center mb-12">
    <input
      type="text"
      name="name"
      placeholder="Search for a product..."
      class="border border-gray-700 bg-gray-800 text-gray-200 placeholder-gray-400 rounded-lg px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      required
    />
    <button
      type="submit"
      class="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition"
    >
      Search
    </button>
  </form>

  {#if form?.message}
    <p class="text-center text-red-500 mb-4">{form.message}</p>
  {/if}

  <!-- ðŸ§¾ Search Results -->
  {#if form?.products?.length > 0}
    <section class="mb-16">
      <h2 class="text-2xl font-semibold mb-6 text-center text-indigo-400">Search Results</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {#each form.products as product}
          <div
            class="bg-gray-800/60 backdrop-blur-sm border border-gray-700 shadow-lg rounded-2xl p-4 flex flex-col items-center transition hover:-translate-y-1 hover:shadow-indigo-500/30 duration-300"
          >
            <img
              src={product.image_url ?? '/placeholder.png'}
              alt={product.name}
              class="w-full h-48 object-cover rounded-lg"
            />
            <h3 class="mt-3 text-lg font-semibold text-white">{product.name}</h3>
            <p class="text-gray-400">${product.base_price}</p>
            <button
              on:click={() => viewProduct(product.id)}
              class="mt-3 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition"
            >
              View Product
            </button>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- ðŸ·ï¸ Product Categories -->
  <div class="space-y-20">
    {#each [
      { title: 'Hoodies', items: hoodies },
      { title: 'T-Shirts', items: tshirts },
      { title: 'Sweatshirts', items: sweatshirts },
      { title: 'Mugs', items: mugs }
    ] as category}
      <section>
        <h2 class="text-2xl font-semibold mb-6 text-indigo-400">{category.title}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {#each category.items as product}
            <div
              class="bg-gray-800/60 backdrop-blur-sm border border-gray-700 shadow-lg rounded-2xl p-4 flex flex-col items-center transition hover:-translate-y-1 hover:shadow-indigo-500/30 duration-300"
            >
              <img
                src={product.image_url ?? '/placeholder.png'}
                alt={product.name}
                class="w-full h-48 object-cover rounded-lg"
              />
              <h3 class="mt-3 text-lg font-semibold text-white">{product.name}</h3>
              <p class="text-gray-400">${product.base_price}</p>
              <button
                on:click={() => viewProduct(product.id)}
                class="mt-3 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition"
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


