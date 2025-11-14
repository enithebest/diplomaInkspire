<script>
  import { onMount } from 'svelte';
  let cart = [];
  let showRemoveToast = false;

  function loadCart() {
    try {
      const raw = localStorage.getItem('cart');
      cart = raw ? JSON.parse(raw) : [];
    } catch {
      cart = [];
    }
  }

  function removeItem(index) {
    cart = cart.filter((_, i) => i !== index);
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    showRemoveToast = true;
    setTimeout(() => (showRemoveToast = false), 2000);
  }

  function clearCart() {
    localStorage.removeItem('cart');
    cart = [];
    window.dispatchEvent(new Event('storage'));
  }

  $: total = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0).toFixed(2);

  onMount(loadCart);
</script>

{#if showRemoveToast}
  <div
    class="fixed top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-600 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in"
  >
   Item removed
  </div>
{/if}

<section class="max-w-6xl mx-auto px-6 py-16">
  <h1 class="text-4xl font-extrabold text-center text-gray-900 mb-12 tracking-tight">
    Your Cart
  </h1>

  {#if cart.length === 0}
    <div class="text-center py-20">
      <p class="text-gray-500 text-lg mb-6">Your cart is currently empty.</p>
      <a
        href="/categories"
        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition"
      >
        Browse Products
      </a>
    </div>
  {:else}
    <div class="space-y-5">
      {#each cart as item, i}
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5"
        >
          <div class="flex items-center gap-5 w-full sm:w-auto">
            <img
              src={item.image_url}
              alt={item.name}
              class="w-24 h-24 object-cover rounded-xl border border-gray-200 shadow-sm"
            />
            <div>
              <h2 class="font-semibold text-lg text-gray-900">{item.name}</h2>
              <p class="text-gray-600 text-sm mt-1">
                <span class="capitalize">{item.color}</span> • Size {item.size}
              </p>
              <p class="text-blue-600 font-medium mt-1">{item.price} €</p>
            </div>
          </div>

          <button
            on:click={() => removeItem(i)}
            class="text-rose-600 hover:text-rose-700 text-sm font-medium transition"
          >
            Remove
          </button>
        </div>
      {/each}

      <div
        class="flex flex-col sm:flex-row justify-between items-center mt-12 border-t border-gray-200 pt-8 gap-6"
      >
        <p class="text-2xl font-semibold text-gray-900">
          Total: <span class="text-blue-700">{total} €</span>
        </p>

        <div class="flex gap-4">
          <button
            on:click={clearCart}
            class="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
          >
            Clear Cart
          </button>

          <a
            href="/checkout"
            class="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg transition"
          >
            Proceed to Checkout
          </a>
        </div>
      </div>
    </div>
  {/if}
</section>

<style>
  :global(body) {
    background: linear-gradient(to bottom right, #f8fafc, #eef2ff);
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translate(-50%, -10px);
    }
    10%, 90% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -10px);
    }
  }

  .animate-fade-in {
    animation: fadeInOut 2s ease-in-out forwards;
  }
</style>
