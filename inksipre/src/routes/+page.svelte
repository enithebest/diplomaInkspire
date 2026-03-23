<script>
  import Content from '$lib/components/content/content.svelte';
  import Hero from '$lib/components/herosection/hero.svelte';

  import Bestsellers from '$lib/components/bestsellers/Bestsellers.svelte';
  import Reviews from '$lib/components/reviews/Reviews.svelte';
  export let data;
</script>

<Hero />
{#await data.bestsellers}
  <section class="bg-gray-900 py-16">
    <div class="mx-auto max-w-6xl px-6">
      <div class="mb-8 flex items-end justify-between">
        <div class="space-y-2">
          <div class="h-8 w-48 animate-pulse rounded bg-white/10"></div>
          <div class="h-4 w-64 animate-pulse rounded bg-white/5"></div>
        </div>
        <div class="h-4 w-20 animate-pulse rounded bg-white/10"></div>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {#each Array(4) as _, index}
          <div
            class="overflow-hidden rounded-xl border border-white/10 bg-white/5"
            aria-hidden="true"
          >
            <div
              class="aspect-[4/3] animate-pulse bg-gradient-to-br from-white/10 via-white/5 to-transparent"
              style={`animation-delay: ${index * 120}ms;`}
            ></div>
            <div class="space-y-3 p-4">
              <div
                class="h-5 animate-pulse rounded bg-white/10"
                style={`animation-delay: ${index * 120 + 40}ms;`}
              ></div>
              <div
                class="h-4 w-11/12 animate-pulse rounded bg-white/5"
                style={`animation-delay: ${index * 120 + 80}ms;`}
              ></div>
              <div
                class="h-4 w-3/4 animate-pulse rounded bg-white/5"
                style={`animation-delay: ${index * 120 + 120}ms;`}
              ></div>
              <div class="flex items-center justify-between pt-1">
                <div
                  class="h-4 w-20 animate-pulse rounded bg-white/10"
                  style={`animation-delay: ${index * 120 + 160}ms;`}
                ></div>
                <div
                  class="h-3 w-16 animate-pulse rounded bg-white/5"
                  style={`animation-delay: ${index * 120 + 200}ms;`}
                ></div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
{:then bestsellers}
  <Bestsellers products={bestsellers} />
{:catch}
{/await}

<Content />
<Reviews />
