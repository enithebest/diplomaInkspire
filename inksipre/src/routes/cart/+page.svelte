<<<<<<< HEAD
<script>
  export let data;

  const items = data?.items || [];
  const total = Number(data?.total || 0).toFixed(2);
  const requireLogin = data?.requireLogin;
</script>

<section class="max-w-5xl mx-auto px-6 py-12 text-gray-100">
  <h1 class="text-3xl font-bold text-center mb-10">Your Cart</h1>

  {#if requireLogin}
    <div class="bg-gray-800/70 border border-gray-700 rounded-xl p-6 text-center">
      <p class="text-lg mb-4">Please log in to view your cart.</p>
      <a
        class="inline-block px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold"
        href="/login?next=/cart"
      >
        Go to login
      </a>
    </div>
  {:else if !items.length}
    <p class="text-center text-gray-400 text-lg mt-10">Your cart is empty.</p>
=======
﻿<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import * as m from "$lib/paraglide/messages/_index.js";

  let cart = [];
  let showRemoveToast = false;

  function loadCart() {
    try {
      const raw = localStorage.getItem("cart");
      cart = raw ? JSON.parse(raw) : [];
    } catch {
      cart = [];
    }
  }

  function removeItem(index) {
    cart = cart.filter((_, i) => i !== index);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    showRemoveToast = true;
    setTimeout(() => (showRemoveToast = false), 2000);
  }

  function clearCart() {
    localStorage.removeItem("cart");
    cart = [];
    window.dispatchEvent(new Event("storage"));
  }

  $: total = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0).toFixed(2);

  onMount(loadCart);

  function goToCheckout() {
    const isAuthenticated = Boolean($page.data?.user);
    if (!isAuthenticated) {
      const url = `/login?reason=order_required&next=${encodeURIComponent("/cart")}`;
      window.location.href = url;
      return;
    }
    window.location.href = "/checkout";
  }
</script>

{#if showRemoveToast}
  <div
    class="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in"
  >
    {m.cart_toast_removed()}
  </div>
{/if}

<section class="max-w-6xl mx-auto px-6 py-12">
  <h1 class="text-3xl font-bold text-center text-gray-800 mb-10">{m.cart_title()}</h1>

  {#if cart.length === 0}
    <p class="text-center text-gray-500 text-lg mt-10">{m.cart_empty()}</p>
>>>>>>> c5e71bd5eac1b664537fb8f437ab98d7e688fe0c
  {:else}
    <div class="space-y-4">
      {#each items as item}
        <div class="flex items-center justify-between bg-gray-800/70 border border-gray-700 rounded-xl p-4">
          <div class="flex items-center gap-4">
            <div class="w-20 h-20 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
              <img
                src={item.image_url}
                alt={item.name}
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
<<<<<<< HEAD
              <h2 class="font-semibold text-lg">{item.name}</h2>
              <p class="text-sm text-gray-400">
                {#if item.sku}SKU: {item.sku} · {/if}
                {#if item.color}Color: {item.color}{/if}
                {#if item.size} · Size: {item.size}{/if}
=======
              <h2 class="font-semibold text-lg text-gray-800">{item.name}</h2>
              <p class="text-gray-600 text-sm">
                {m.cart_color_label()} <span class="capitalize">{item.color}</span> • {m.cart_size_label()} {item.size}
>>>>>>> c5e71bd5eac1b664537fb8f437ab98d7e688fe0c
              </p>
              <form
                method="POST"
                action="?/updateQuantity"
                class="mt-2 flex items-center gap-3"
              >
                <input type="hidden" name="item_id" value={item.id} />
                <label class="text-sm text-gray-300" for={`qty-${item.id}`}>Qty</label>
                <input
                  id={`qty-${item.id}`}
                  name="quantity"
                  type="number"
                  min="1"
                  max="99"
                  value={item.quantity}
                  class="w-16 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold"
                >
                  Update
                </button>
              </form>
              <p class="text-sm text-gray-300">EUR {item.price.toFixed(2)} each</p>
            </div>
          </div>
<<<<<<< HEAD
          <div class="text-right">
            <p class="text-lg font-semibold">EUR {(item.price * item.quantity).toFixed(2)}</p>
            <p class="text-xs text-gray-400">Pending payment</p>
            <form method="POST" action="?/deleteItem" class="mt-2">
              <input type="hidden" name="item_id" value={item.id} />
              <button
                type="submit"
                class="text-sm text-red-400 hover:text-red-300 font-medium"
              >
                Remove
              </button>
            </form>
          </div>
        </div>
      {/each}

      <div class="flex flex-col sm:flex-row justify-between items-center mt-8 border-t border-gray-700 pt-6 gap-4">
        <p class="text-xl font-semibold">Total: <span class="text-blue-400">EUR {total}</span></p>
=======

          <button
            on:click={() => removeItem(i)}
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
          {m.cart_total_label()} <span class="text-blue-600">{total} €</span>
        </p>

>>>>>>> c5e71bd5eac1b664537fb8f437ab98d7e688fe0c
        <div class="flex gap-3">
          <a
            class="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold"
            href="/checkout"
          >
<<<<<<< HEAD
            Proceed to checkout
          </a>
=======
            {m.cart_clear_button()}
          </button>

          <button
            type="button"
            on:click={goToCheckout}
            class="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm"
          >
            {m.cart_checkout_button()}
          </button>
>>>>>>> c5e71bd5eac1b664537fb8f437ab98d7e688fe0c
        </div>
      </div>
    </div>
  {/if}
</section>

<style>
  :global(body) {
    background: #0f172a;
  }
</style>
