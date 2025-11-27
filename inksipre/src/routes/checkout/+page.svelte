<script>
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';

  const { data } = $props();

  let cart = $state([]);
  let message = $state('');
  let loading = $state(false);
  let total = $state(0);
  let totalFormatted = $state('0.00');

  onMount(() => {
    const raw = localStorage.getItem('cart');
    cart = raw ? JSON.parse(raw) : [];
    updateTotals();

    if (!cart.length) {
      window.location.href = '/cart';
    }
  });

  const enhanceSubmit = enhance(
    async ({ formData }) => {
      formData.append('cart', JSON.stringify(cart));
      return async ({ result }) => {
        loading = false;

        if (result.type === 'success') {
          const url = result.data?.checkoutUrl;
          if (url) {
            window.location.href = url;
          } else {
            message = 'No checkout URL returned.';
          }
        } else if (result.type === 'failure') {
          message = result.data?.message ?? 'Checkout failed. Please try again.';
        } else {
          message = 'Unexpected response. Please try again.';
        }
      };
    },
    {
      pending: () => {
        loading = true;
        message = '';
      }
    }
  );

  function updateTotals() {
    total = cart.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1),
      0
    );
    totalFormatted = total.toFixed(2);
  }

  const lineTotal = (item) =>
    ((Number(item.price) || 0) * (Number(item.qty) || 1)).toFixed(2);
</script>

<section class="max-w-6xl mx-auto px-6 py-12">
  <h1 class="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

  <div class="grid lg:grid-cols-3 gap-8">
    <div class="lg:col-span-2 space-y-6">
      <form
        method="POST"
        action="?/intent"
        use:enhanceSubmit
        class="space-y-4 bg-white shadow-sm border border-gray-200 rounded-lg p-6"
      >
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Shipping details</h2>

        <div class="grid md:grid-cols-2 gap-4">
          <label class="block text-sm font-medium text-gray-700">
            Full name
            <input
              name="full_name"
              required
              value={data.user?.full_name}
              class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label class="block text-sm font-medium text-gray-700">
            Email
            <input
              name="email"
              type="email"
              disabled
              value={data.user?.email}
              class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600"
            />
          </label>
        </div>

        <label class="block text-sm font-medium text-gray-700">
          Address line
          <input
            name="line1"
            required
            class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <div class="grid md:grid-cols-3 gap-4">
          <label class="block text-sm font-medium text-gray-700">
            City
            <input
              name="city"
              required
              class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label class="block text-sm font-medium text-gray-700">
            Postal code
            <input
              name="postal_code"
              required
              class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label class="block text-sm font-medium text-gray-700">
            Country (2-letter)
            <input
              name="country"
              maxlength="2"
              required
              class="mt-1 w-full uppercase rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        {#if message}
          <div class="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {message}
          </div>
        {/if}

        <button
          type="submit"
          class="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          disabled={loading || !cart.length}
        >
          {#if loading}
            <span class="animate-pulse">Processing...</span>
          {:else}
            Continue to payment
          {/if}
        </button>
      </form>
    </div>

    <aside class="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Order summary</h2>

      {#if cart.length === 0}
        <p class="text-gray-500 text-sm">Your cart is empty.</p>
      {:else}
        <div class="space-y-3">
          {#each cart as item}
            <div class="flex justify-between text-sm text-gray-700">
              <div>
                <p class="font-medium">{item.name}</p>
                <p class="text-gray-500">Qty: {item.qty} - {item.color} {item.size}</p>
              </div>
              <p class="font-semibold">{lineTotal(item)} $</p>
            </div>
          {/each}
        </div>

        <div class="border-t border-gray-200 mt-4 pt-4 flex justify-between text-gray-900 font-semibold">
          <span>Total</span>
          <span>{totalFormatted} $</span>
        </div>
      {/if}
    </aside>
  </div>
</section>
