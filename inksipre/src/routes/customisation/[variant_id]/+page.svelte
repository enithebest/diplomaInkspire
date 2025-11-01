<script>
  import { enhance } from '$app/forms';
  export let data;
  export let form;
  let file;
  let previewUrl = '';

  function handleFileChange(e) {
    file = e.target.files[0];
    if (file) {
      previewUrl = URL.createObjectURL(file);
    }
  }
</script>

<h1 class="text-3xl font-bold mb-6 text-center">Customize {data?.product?.name ?? 'Product'}</h1>

<div class="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
  <!-- Sidebar: Upload form -->
  <aside class="md:col-span-4">
    <div class="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 md:sticky md:top-6">
      <h2 class="text-lg font-semibold mb-4">Upload Design</h2>
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
    </div>
  </aside>

  <!-- Main: Customisation canvas / preview -->
  <main class="md:col-span-8">
    <div class="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 min-h-[360px] flex items-center justify-center">
      {#if previewUrl}
        <img src={previewUrl} alt="Preview" class="max-h-[520px] w-auto rounded-lg shadow" />
      {:else if form?.imageUrl}
        <img src={form.imageUrl} alt="Uploaded design" class="max-h-[520px] w-auto rounded-lg shadow" />
      {:else}
        <p class="text-gray-400">Upload an image on the left to start customising.</p>
      {/if}
    </div>

    {#if data?.product?.description}
      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-1 text-indigo-400">Description</h3>
        <p class="text-gray-300 leading-relaxed">{data.product.description}</p>
      </div>
    {/if}
  </main>
</div>

