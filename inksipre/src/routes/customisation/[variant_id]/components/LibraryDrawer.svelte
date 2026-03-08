<script>
  export let showLibrary = false;
  export let primaryButton = '';
  export let libraryItems = [];
  export let search = '';
  export let onSearchChange;
  export let onUse;
  export let onClose;
  export let displayName = (v) => v;
</script>

{#if showLibrary}
  <div class="fixed inset-0 z-50">
    <div
      class="absolute inset-0 bg-black/60"
      role="button"
      tabindex="0"
      onclick={onClose}
      onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && onClose?.()}
      aria-label="Close library"
    ></div>
    <aside class="absolute right-0 top-0 h-full w-full sm:w-[28rem] bg-gray-900 border-l border-white/10 p-4 overflow-y-auto">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold">My library</h2>
        <button class={`${primaryButton} px-3 py-2 text-sm`} onclick={onClose}>Close</button>
      </div>

      <input
        type="text"
        placeholder="Search library"
        value={search}
        oninput={(e) => onSearchChange?.(e.target.value)}
        class="w-full mb-4 px-3 py-2 rounded-md bg-white/5 border border-white/10 focus:outline-none"
      />

      {#if libraryItems.length === 0}
        <p class="text-gray-400">No uploads yet.</p>
      {:else}
        <div class="grid grid-cols-2 gap-3">
          {#each libraryItems.filter((item) => displayName(item.url).toLowerCase().includes(search.toLowerCase())) as item}
            <div class="bg-white/5 border border-white/10 rounded-md overflow-hidden group">
              <img src={item.url} alt={displayName(item.url)} class="w-full h-28 object-cover" />
              <div class="p-2 flex items-center justify-between">
                <span class="text-xs truncate max-w-[70%]" title={displayName(item.url)}>{displayName(item.url)}</span>
                <button
                  class={`${primaryButton} text-xs px-3 py-2 w-full justify-center`}
                  onclick={() => onUse?.(item.url)}
                >
                  Use
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </aside>
  </div>
{/if}
