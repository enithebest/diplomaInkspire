<script>
  export let products = [];
  import * as m from '$lib/paraglide/messages/_index.js';

  const fallbackImg = (id) =>
    `https://picsum.photos/seed/inkspire-${id}/600/400`;
</script>

<section class="bg-gray-900 py-16">
  <div class="max-w-6xl mx-auto px-6">
    <div class="flex items-end justify-between mb-8">
      <div>
        <h2 class="text-2xl sm:text-3xl font-semibold text-white">{m.bestsellers_title()}</h2>
        <p class="text-gray-400 mt-1">{m.bestsellers_subtitle()}</p>
      </div>
      <a href="/categories" class="text-sm font-medium text-indigo-300 hover:text-white">{m.bestsellers_shop_all()}</a>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each products as p}
        <a
          href={`/product/${p.id}`}
          class="group bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-indigo-400/60 hover:shadow-[0_20px_60px_-30px_rgba(99,102,241,0.8)] transition"
        >
          <div class="aspect-[4/3] bg-gray-800 overflow-hidden">
            <img
              src={fallbackImg(p.id)}
              alt={p.name}
              class="w-full h-full object-cover group-hover:scale-105 transition"
              loading="lazy"
            />
          </div>
          <div class="p-4 space-y-2">
            <h3 class="text-white font-semibold truncate">{p.name}</h3>
            {#if p.description}
              <p class="text-gray-300/80 text-sm line-clamp-2">{p.description}</p>
            {/if}
            <div class="flex items-center justify-between pt-1">
              <span class="text-indigo-300 font-semibold">EUR {Number(p.base_price).toFixed(2)}</span>
              {#if p.total_sold != null}
                <span class="text-xs text-gray-400">{m.bestsellers_sold({ count: p.total_sold })}</span>
              {/if}
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
  
</section>
