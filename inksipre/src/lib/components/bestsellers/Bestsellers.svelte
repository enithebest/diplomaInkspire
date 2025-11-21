<script>
  export let products = [];
  import * as m from '$lib/paraglide/messages/_index.js';

  const fallbackImg = (id) =>
    `https://picsum.photos/seed/inkspire-${id}/600/400`;
</script>

<section class="bg-gray-50 py-16">
  <div class="max-w-6xl mx-auto px-6">
    <div class="flex items-end justify-between mb-8">
      <div>
        <h2 class="text-2xl sm:text-3xl font-semibold text-gray-900">{m.bestsellers_title()}</h2>
        <p class="text-gray-500 mt-1">{m.bestsellers_subtitle()}</p>
      </div>
      <a href="/categories" class="text-sm font-medium text-blue-600 hover:text-blue-700">{m.bestsellers_shop_all()}</a>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each products as p}
        <a href={`/product/${p.id}`} class="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
          <div class="aspect-[4/3] bg-gray-100 overflow-hidden">
            <img
              src={fallbackImg(p.id)}
              alt={p.name}
              class="w-full h-full object-cover group-hover:scale-105 transition"
              loading="lazy"
            />
          </div>
          <div class="p-4">
            <h3 class="text-gray-900 font-semibold truncate">{p.name}</h3>
            {#if p.description}
              <p class="text-gray-500 text-sm line-clamp-2 mt-1">{p.description}</p>
            {/if}
            <div class="flex items-center justify-between mt-3">
              <span class="text-gray-900 font-semibold">€{Number(p.base_price).toFixed(2)}</span>
              {#if p.total_sold != null}
                <span class="text-xs text-gray-500">{m.bestsellers_sold({ count: p.total_sold })}</span>
              {/if}
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
  
</section>

