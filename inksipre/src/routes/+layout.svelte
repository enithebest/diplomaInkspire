<script>
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import Nav from '$lib/components/Nav.svelte';
  export let data;
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<!-- Navigation bar visible on every page -->


<Nav user={data.user} />

<!-- Page content -->
<main class="min-h-screen bg-white text-gray-900">
  <slot />
</main>
