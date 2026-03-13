<script>
  export let primaryButton = '';
  export let modelPath = '';
  export let previewExpanded = false;
  export let onTogglePreview;
  export let onDownload;
  export let onContainerReady;

  let containerEl;
  $: onContainerReady?.(containerEl);
</script>

{#if previewExpanded}
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
    role="button"
    tabindex="0"
    aria-label="Close expanded preview"
    onclick={() => onTogglePreview?.(false)}
    onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && onTogglePreview?.(false)}
  ></div>
{/if}

<div class={`flex-1 relative ${previewExpanded ? 'z-50' : ''}`}>
  <div
    class={`bg-gray-900/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-gray-700 relative transition-all duration-200 ease-out
      ${previewExpanded ? 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-6xl h-[80vh] min-h-[480px]' : 'h-[60vh] max-h-[650px] min-h-[360px]'}
    `}
  >
    <div bind:this={containerEl} class="w-full h-full flex items-center justify-center cursor-grab"></div>
    {#if modelPath}
      <div class="pointer-events-none absolute inset-0 flex items-end justify-center pb-4"></div>
    {:else}
      <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div class="bg-black/50 text-white px-4 py-2 rounded-lg border border-white/10 text-sm">3D preview coming soon</div>
      </div>
    {/if}
    {#if previewExpanded}
      <div class="absolute top-4 right-4 flex gap-2 z-50">
        <button
          class={`${primaryButton} px-3 py-2 text-xs`}
          onclick={() => onTogglePreview?.(false)}
        >
          Close
        </button>
      </div>
    {/if}
  </div>
  <div class="flex justify-end gap-2 mt-3">
    <button
      class={`${primaryButton} px-3 py-2 text-sm flex items-center gap-2`}
      onclick={() => onTogglePreview?.(true)}
      aria-pressed={previewExpanded}
      disabled={!modelPath || previewExpanded}
      title="Expand preview"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 9V5a1 1 0 011-1h4M20 15v4a1 1 0 01-1 1h-4M15 4h4a1 1 0 011 1v4M9 20H5a1 1 0 01-1-1v-4" />
      </svg>
      Maximize
    </button>
    <button
      class={`${primaryButton} px-4 py-2 text-sm`}
      onclick={onDownload}
      disabled={!modelPath}
    >
      Download render
    </button>
  </div>
</div>

<p class="text-center text-sm text-gray-400">Drag to rotate / Scroll to zoom</p>
