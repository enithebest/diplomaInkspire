<script>
  export let data;
  const { hoodies, tshirts, sweatshirts, mugs } = data;

  function editProduct(id) {
    // Redirect to customization page for selected product
    window.location.href = `/customisation/${id}`;
  }
</script>

<h1 class="text-3xl font-bold mb-6 text-center">Our Categories</h1>

<div class="space-y-16">

  <!-- HOODIES -->
  <section>
    <h2 class="text-2xl font-semibold mb-4">Hoodies</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {#each hoodies as product}
    <div class="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center">
      <img src={product.image_url ?? '/placeholder.png'} alt={product.name} class="w-full h-48 object-cover rounded-lg" />
      <h3 class="mt-2 text-lg font-medium">{product.name}</h3>
      <p class="text-gray-500">${product.base_price}</p>
      <button
        on:click={() => editProduct(product.id)}
        class="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        Edit
      </button>
    </div>
  {/each}
</div>
  </section>

  <!-- T-SHIRTS -->
  <section>
    <h2 class="text-2xl font-semibold mb-4">T-Shirts</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each tshirts as product}
        <div class="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center">
          <img src={product.image_url ?? '/placeholder.png'} alt={product.name} class="w-full h-48 object-cover rounded-lg" />
          <h3 class="mt-2 text-lg font-medium">{product.name}</h3>
          <p class="text-gray-500">${product.base_price}</p>
          <button
            on:click={() => editProduct(product.id)}
            class="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Edit
          </button>
        </div>
      {/each}
    </div>
  </section>

  <!-- SWEATSHIRTS -->
  <section>
    <h2 class="text-2xl font-semibold mb-4">Sweatshirts</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each sweatshirts as product}
        <div class="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center">
          <img src={product.image_url ?? '/placeholder.png'} alt={product.name} class="w-full h-48 object-cover rounded-lg" />
          <h3 class="mt-2 text-lg font-medium">{product.name}</h3>
          <p class="text-gray-500">${product.base_price}</p>
          <button
            on:click={() => editProduct(product.id)}
            class="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Edit
          </button>
        </div>
      {/each}
    </div>
  </section>

  <!-- MUGS -->
  <section>
    <h2 class="text-2xl font-semibold mb-4">Mugs</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each mugs as product}
        <div class="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center">
          <img src={product.image_url ?? '/placeholder.png'} alt={product.name} class="w-full h-48 object-cover rounded-lg" />
          <h3 class="mt-2 text-lg font-medium">{product.name}</h3>
          <p class="text-gray-500">${product.base_price}</p>
          <button
            on:click={() => editProduct(product.id)}
            class="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Edit
          </button>
        </div>
      {/each}
    </div>
  </section>

</div>
