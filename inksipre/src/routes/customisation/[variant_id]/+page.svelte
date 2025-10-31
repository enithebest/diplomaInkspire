<script>
  import { enhance } from '$app/forms';
  export let data;
  export let form;
  let file;
  let previewUrl = '';
  let message = '';
  let uploadedUrl = '';

  function handleFileChange(e) {
    file = e.target.files[0];
    if (file) {
      previewUrl = URL.createObjectURL(file);
    }
  }
</script>

<h1 class="text-3xl font-bold mb-6 text-center">
  Customize {data?.product?.name ?? 'Product'}
</h1>

<form
  method="POST"
  enctype="multipart/form-data"
  action="?/upload"
  use:enhance
  class="max-w-lg mx-auto space-y-6"
>
  <div>
    <label for="design" class="block mb-2 text-lg font-medium"
      >Upload your design</label
    >
    <input
      id="design"
      type="file"
      name="design"
      accept="image/*"
      required
      on:change={handleFileChange}
      class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
    />
  </div>

  {#if previewUrl}
    <div class="mt-4">
      <p class="text-gray-600 mb-2">Preview:</p>
      <img
        src={previewUrl}
        alt="Preview"
        class="max-h-64 rounded-lg shadow mx-auto"
      />
    </div>
  {/if}

  <button
    type="submit"
    formaction="?/upload"
    class="mt-6 w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
  >
    Upload & Save
  </button>
</form>

{#if form?.success}
  <p class="mt-4 text-center text-green-600">Uploaded successfully!</p>
{/if}

{#if uploadedUrl}
  <div class="mt-6 text-center">
    <p class="text-gray-700">Uploaded successfully!</p>
    <img
      src={uploadedUrl}
      alt="Uploaded design"
      class="max-h-64 mx-auto rounded-lg mt-4 shadow"
    />
  </div>
{/if}

{#if form?.imageUrl}
  <div class="mt-6 text-center">
    <p class="text-gray-700">Uploaded successfully!</p>
    <img
      src={form.imageUrl}
      alt="Uploaded design"
      class="max-h-64 mx-auto rounded-lg mt-4 shadow"
    />
  </div>
{/if}
