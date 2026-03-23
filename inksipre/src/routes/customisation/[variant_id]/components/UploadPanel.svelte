<script>
  import { enhance } from '$app/forms';

  export let handleFileChange;
  export let showLibrary = false;
  export let onOpenLibrary;
  export let previewUrl = '';
  export let form;
  export let primaryButton = '';
</script>

<div class="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg">
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-lg font-semibold">Upload design</h2>
    <button
      type="button"
      class={`${primaryButton} px-3 py-2 text-sm`}
      onclick={onOpenLibrary}
      aria-pressed={showLibrary}
    >
      My library
    </button>
  </div>

  <form method="POST" enctype="multipart/form-data" action="?/upload" use:enhance class="space-y-5">
    <div>
      <label for="design" class="block mb-2 text-sm font-medium text-gray-200">Choose image</label>
      <input
        id="design"
        type="file"
        name="design"
        accept="image/*"
        required
        onchange={handleFileChange}
        class="block w-full text-sm text-gray-200 border border-white/10 rounded-lg cursor-pointer bg-white/5 focus:outline-none"
      />
      <p class="mt-2 text-xs text-gray-400">Allowed: PNG, JPG, WEBP. Max size: 5MB.</p>
    </div>

    {#if form?.error}
      <p class="text-sm text-red-500" role="alert" aria-live="polite">{form.error}</p>
    {/if}
    {#if form?.success}
      <p class="text-sm text-green-400" role="status">Uploaded successfully!</p>
    {/if}

    <button
      type="submit"
      formaction="?/upload"
      class={`${primaryButton} w-full px-6 py-3`}
    >
      Upload &amp; Save
    </button>
  </form>

  {#if previewUrl || form?.imageUrl}
    <div class="mt-4 space-y-2">
      <h3 class="text-sm font-medium">Preview</h3>
      <img
        src={previewUrl || form?.imageUrl}
        alt="Uploaded design preview"
        class="max-h-48 w-auto rounded-md shadow border border-white/10"
      />
    </div>
  {/if}
</div>
