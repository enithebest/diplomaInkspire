<script>
  import Content from '$lib/components/content/content.svelte';
  import Hero from '$lib/components/herosection/hero.svelte';
  import Product from '$lib/components/products/product.svelte';
  import Bestsellers from '$lib/components/bestsellers/Bestsellers.svelte';
  export let data;
</script>

<Hero />
<Bestsellers products={data.bestsellers} />
<Product />
<Content />
