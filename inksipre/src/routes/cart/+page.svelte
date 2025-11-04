<script>
  import { onMount } from 'svelte';
  let cart = [];
  let showToast = false;

  // Warenkorb laden
  function loadCart() {
    try {
      const raw = localStorage.getItem('cart');
      cart = raw ? JSON.parse(raw) : [];
    } catch {
      cart = [];
    }
  }

  // Toast anzeigen, wenn Produkt hinzugefügt wurde
  function handleStorageChange() {
    loadCart();
    showToast = true;
    setTimeout(() => (showToast = false), 2000);
  }

  // Einzelnes Produkt entfernen
  function removeItem(index) {
    cart = cart.filter((_, i) => i !== index);
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
  }

  // Warenkorb leeren
  function clearCart() {
    localStorage.removeItem('cart');
    cart = [];
    window.dispatchEvent(new Event('storage'));
  }

  // Gesamtsumme berechnen
  $: total = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0).toFixed(2);

  onMount(() => {
    loadCart();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  });
</script>

{#if showToast}
  <div
    class="fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in"
  >
    Produkt wurde zum Warenkorb hinzugefügt
  </div>
{/if}

<section class="max-w-6xl mx-auto px-6 py-12">
  <h1 class="text-3xl font-bold text-center text-gray-800 mb-10">Dein Warenkorb</h1>

  {#if cart.length === 0}
    <p class="text-center text-gray-500 text-lg mt-10">Dein Warenkorb ist leer.</p>
  {:else}
    <div class="space-y-6">
      {#each cart as item, i}
        <div
          class="flex items-center justify-between bg-white border border-gray-200 rounded-lg shadow-sm p-4"
        >
          <div class="flex items-center gap-4">
            <img
              src={item.image_url}
              alt={item.name}
              class="w-20 h-20 object-cover rounded-lg border border-gray-300"
            />
            <div>
              <h2 class="font-semibold text-lg text-gray-800">{item.name}</h2>
              <p class="text-gray-600 text-sm">
                Farbe: <span class="capitalize">{item.color}</span> • Größe: {item.size}
              </p>
              <p class="text-gray-500 text-sm">{item.price} €</p>
            </div>
          </div>

          <button
            on:click={() => removeItem(i)}
            class="text-red-500 hover:text-red-600 font-medium text-sm transition"
          >
            Entfernen
          </button>
        </div>
      {/each}

      <div
        class="flex flex-col sm:flex-row justify-between items-center mt-10 border-t border-gray-200 pt-6 gap-4"
      >
        <p class="text-xl font-semibold text-gray-800">
          Gesamtsumme: <span class="text-blue-600">{total} €</span>
        </p>

        <div class="flex gap-3">
          <button
            on:click={clearCart}
            class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm"
          >
            Warenkorb leeren
          </button>

          <a
            href="/checkout"
            class="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm"
          >
            Zur Kasse
          </a>
        </div>
      </div>
    </div>
  {/if}
</section>

<style>
  :global(body) {
    background-color: #f9fafb;
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translate(-50%, -10px);
    }
    10% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    90% {
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
