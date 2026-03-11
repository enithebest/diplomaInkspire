<script>
  export let description = '';
</script>

{#if description}
  <div class="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 max-h-[55vh] overflow-y-auto shadow-lg">
    <h3 class="text-lg font-semibold mb-2 text-indigo-300">Product details</h3>
    <p class="text-gray-200 leading-relaxed whitespace-pre-line">{description}</p>
  </div>
{/if}
