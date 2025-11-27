<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import * as m from "$lib/paraglide/messages/_index.js";

  let cart = [];
  let showRemoveToast = false;
  let total = 0;
  let totalFormatted = "0.00";

  function loadCart() {
    try {
      const raw = localStorage.getItem("cart");
      cart = raw ? JSON.parse(raw) : [];
    } catch {
      cart = [];
    }
    updateTotals();
  }

  function removeItem(index) {
    cart = cart.filter((_, i) => i !== index);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    updateTotals();
    showRemoveToast = true;
    setTimeout(() => (showRemoveToast = false), 2000);
  }

  function clearCart() {
    localStorage.removeItem("cart");
    cart = [];
    window.dispatchEvent(new Event("storage"));
    updateTotals();
  }

  function updateTotals() {
    total = cart.reduce(
      (sum, { price, qty }) => sum + (Number(price) || 0) * (Number(qty) || 1),
      0
    );
    totalFormatted = total.toFixed(2);
  }

  onMount(loadCart);

  function goToCheckout() {
    const isAuthenticated = Boolean($page.data?.user);
    if (!isAuthenticated) {
      const url = `/login?reason=order_required&next=${encodeURIComponent("/checkout")}`;
      window.location.href = url;
      return;
    }
    window.location.href = "/checkout";
  }
</script>

{#if showRemoveToast}
  <div
    class="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse"
  >
    {m.cart_toast_removed()}
  </div>
{/if}

<section class="max-w-6xl mx-auto px-6 py-12 bg-gray-50 min-h-screen">
  <h1 class="text-3xl font-bold text-center text-gray-800 mb-10">{m.cart_title()}</h1>

  {#if cart.length === 0}
    <p class="text-center text-gray-500 text-lg mt-10">{m.cart_empty()}</p>
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
                {m.cart_color_label()} <span class="capitalize">{item.color}</span> • {m.cart_size_label()} {item.size}
              </p>
              <p class="text-gray-500 text-sm">{item.price} ?</p>
            </div>
          </div>

          <button
            onclick={() => removeItem(i)}
            class="text-red-500 hover:text-red-600 font-medium text-sm transition"
          >
            {m.cart_remove_button()}
          </button>
        </div>
      {/each}

      <div
        class="flex flex-col sm:flex-row justify-between items-center mt-10 border-t border-gray-200 pt-6 gap-4"
      >
        <p class="text-xl font-semibold text-gray-800">
          {m.cart_total_label()} <span class="text-blue-600">{totalFormatted} ?</span>
        </p>

        <div class="flex gap-3">
          <button
            onclick={clearCart}
            class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm"
          >
            {m.cart_clear_button()}
          </button>

          <button
            type="button"
            onclick={goToCheckout}
            class="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm"
          >
            {m.cart_checkout_button()}
          </button>
        </div>
      </div>
    </div>
  {/if}
</section>
