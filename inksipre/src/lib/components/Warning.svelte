<script>
	export let message;
</script>

{#if message}
	<div
		class="mb-4 rounded border border-red-500 bg-red-100 px-4 py-2 text-center text-sm text-red-700 shadow"
	>
		{message}
	</div>
{/if}
