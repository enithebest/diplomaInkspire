<script>
  import Content from '$lib/components/content/content.svelte';
  import Hero from '$lib/components/herosection/hero.svelte';

  import Bestsellers from '$lib/components/bestsellers/Bestsellers.svelte';
  import Reviews from '$lib/components/reviews/Reviews.svelte';
  export let data;
</script>

<Hero />
<Bestsellers products={data.bestsellers} />

<Content />
<Reviews />
