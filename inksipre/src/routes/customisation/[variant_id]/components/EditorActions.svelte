<script>
  export let primaryButton = '';
  export let openEditor;
  export let resetDesign;
  export let uploadedImages = [];
  export let canReset = false;
</script>

<div class="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-lg">
  <p class="text-lg font-medium mb-3">Edit your artwork</p>
  <button
    class={`${primaryButton} w-full px-6 py-3`}
    onclick={openEditor}
  >
    {uploadedImages.length ? 'Reopen Customizer' : 'Open Customizer'}
  </button>
  <button
    class={`${primaryButton} w-full px-6 py-3 mt-3`}
    onclick={resetDesign}
    disabled={!canReset}
  >
    Reset design
  </button>

  <div class="mt-4 space-y-4 text-sm text-gray-400">
    {#if uploadedImages.length === 0}
      <p>Upload an image using the form or pick one from your library to start editing.</p>
    {:else}
      <p>Current design loaded in the editor:</p>
      <div class="flex flex-wrap gap-3">
        {#each uploadedImages as imgUrl}
          <img
            src={imgUrl}
            alt="Preview"
            class="w-16 h-16 object-cover rounded-lg border-2 border-gray-600 shadow-md hover:scale-110 transition transform duration-200"
          />
        {/each}
      </div>
    {/if}
  </div>
</div>
