<script>
  export let showEditor = false;
  export let primaryButton = '';
  export let onApply;
  export let editorContainerRef;

  let containerEl;
  $: editorContainerRef = containerEl;
</script>

<div class={`fixed inset-0 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center z-40 p-6 ${showEditor ? '' : 'hidden'}`}>
  <h2 class="text-2xl font-bold text-white mb-4">Adjust your images</h2>
  <div bind:this={containerEl} class="bg-gray-100 rounded-lg shadow-2xl overflow-hidden"></div>
  <button
    class={`${primaryButton} mt-6 px-8 py-3`}
    onclick={onApply}
  >
    Ready
  </button>
</div>
