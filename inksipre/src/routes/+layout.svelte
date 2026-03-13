<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme';
	export let data;

	onMount(() => {
		theme.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Navigation bar visible on every page -->

<Nav user={data.user} locale={data.locale} locales={data.locales} />

<!-- Page content -->
<main class="min-h-screen bg-transparent text-inherit transition-colors duration-200">
	<slot />
</main>

<Footer />
