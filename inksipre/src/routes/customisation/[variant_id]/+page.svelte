<script>
  import { enhance } from '$app/forms';
  export let data;
  export let form;
  let file;
  let previewUrl = '';
  let showLibrary = false;
  let search = '';

  function handleFileChange(e) {
    file = e.target.files[0];
    if (file) {
      previewUrl = URL.createObjectURL(file);
    }
  }

  const libraryItems = (data?.uploads ?? []).map((u) => ({
    id: u.id,
    url: u.image_url,
    created_at: u.created_at
  }));

  function displayName(url) {
    try {
      const path = new URL(url).pathname;
      const last = path.split('/').pop() || '';
      return decodeURIComponent(last);
    } catch (e) {
      return url;
    }
  }

  function useFromLibrary(url) {
    previewUrl = url;
    showLibrary = false;
  }
</script>

<h1 class="text-3xl font-bold mb-6 text-center">Customize {data?.product?.name ?? 'Product'}</h1>

<div class="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
  <!-- Sidebar: Upload form -->
  <aside class="md:col-span-4">
    <div class="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 md:sticky md:top-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Upload Design</h2>
        <button
          type="button"
          class="text-sm text-indigo-300 hover:text-white underline"
          on:click={() => (showLibrary = true)}
        >
          My library
        </button>
      </div>
      <form method="POST" enctype="multipart/form-data" action="?/upload" use:enhance class="space-y-5">
        <div>
          <label for="design" class="block mb-2 text-sm font-medium">Choose image</label>
          <input
            id="design"
            type="file"
            name="design"
            accept="image/*"
            required
            on:change={handleFileChange}
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
          <p class="mt-2 text-xs text-gray-500">Allowed: PNG, JPG, WEBP. Max size: 5MB.</p>
        </div>

        {#if form?.error}
          <p class="text-sm text-red-600" role="alert" aria-live="polite">{form.error}</p>
        {/if}
        {#if form?.success}
          <p class="text-sm text-green-600" role="status">Uploaded successfully!</p>
        {/if}

        <button type="submit" formaction="?/upload" class="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Upload & Save
        </button>
      </form>

      {#if previewUrl || form?.imageUrl}
        <div class="mt-4">
          <h3 class="text-sm font-medium mb-2">Preview</h3>
          <img
            src={previewUrl || form?.imageUrl}
            alt="Uploaded design preview"
            class="max-h-48 w-auto rounded-md shadow border border-white/10"
          />
        </div>
      {/if}
    </div>
  </aside>

  <!-- Main: Info / instructions (no centered image preview) -->
  <main class="md:col-span-8">
    <div class="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 min-h-[240px]">
      <p class="text-gray-300">
        Upload an image using the form on the left. Your uploaded image will appear directly below the form.
      </p>
    </div>

    {#if data?.product?.description}
      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-1 text-indigo-400">Description</h3>
        <p class="text-gray-300 leading-relaxed">{data.product.description}</p>
      </div>
    {/if}
  </main>
</div>

{#if showLibrary}
  <div class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/60" on:click={() => (showLibrary = false)}></div>
    <aside class="absolute right-0 top-0 h-full w-full sm:w-[28rem] bg-gray-900 border-l border-white/10 p-4 overflow-y-auto">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold">My library</h2>
        <button class="text-sm text-gray-300 hover:text-white" on:click={() => (showLibrary = false)}>Close</button>
      </div>

      <input
        type="text"
        placeholder="Search library"
        bind:value={search}
        class="w-full mb-4 px-3 py-2 rounded-md bg-white/5 border border-white/10 focus:outline-none"
      />

      {#if libraryItems.length === 0}
        <p class="text-gray-400">No uploads yet.</p>
      {:else}
        <div class="grid grid-cols-2 gap-3">
          {#each libraryItems.filter((i) => displayName(i.url).toLowerCase().includes(search.toLowerCase())) as item}
            <div class="bg-white/5 border border-white/10 rounded-md overflow-hidden group">
              <img src={item.url} alt={displayName(item.url)} class="w-full h-28 object-cover" />
              <div class="p-2 flex items-center justify-between">
                <span class="text-xs truncate max-w-[70%]" title={displayName(item.url)}>{displayName(item.url)}</span>
                <button
                  class="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
                  on:click={() => useFromLibrary(item.url)}
                >Use</button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </aside>
  </div>
{/if}
