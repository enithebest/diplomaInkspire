<script>
  import { onMount } from 'svelte';
  import { loadStripe } from '@stripe/stripe-js';
  import { calculateShippingFee } from '$lib/shipping';

  const { data } = $props();

  let cart = $state([]);
  let message = $state('');
  let loading = $state(false);
  let total = $state(0);
  let totalFormatted = $state('0.00');
  let shipping = $state({ amount: 0, label: 'Enter country to calculate shipping', tier: 'missing_country' });
  let grandTotal = $state(0);
  let grandTotalFormatted = $state('0.00');
  let country = $state('');
  let stripe = $state(null);
  let elements = $state(null);
  let paymentElement;
  let clientSecret = $state('');
  let mountedSecret = '';
  let hasPaymentElement = false;
  let buttonLabel = $state('Continue to payment');
  let removedInvalidItems = $state(0);

  onMount(() => {
    const raw = localStorage.getItem('cart');
    cart = raw ? JSON.parse(raw) : [];
    sanitizeCart();
    updateTotals();

    if (!cart.length) {
      window.location.href = '/cart';
    }
  });

  onMount(() => {
    if (data?.publishableKey) {
      loadStripe(data.publishableKey).then((s) => {
        stripe = s;
      });
    }
  });

  function sanitizeCart() {
    const valid = [];
    let removed = 0;
    for (const item of cart) {
      const productId = Number(item.product_id ?? item.productId);
      const price = Number(item.price);
      const qty = Number(item.qty) || 1;
      if (Number.isFinite(productId) && productId > 0 && Number.isFinite(price) && price > 0 && qty > 0) {
        valid.push({ ...item, product_id: productId, qty });
      } else {
        removed += 1;
      }
    }
    if (removed > 0) {
      cart = valid;
      removedInvalidItems = removed;
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (err) {
        console.warn('Unable to persist sanitized cart', err);
      }
    }
  }

  function updateTotals() {
    total = cart.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1),
      0
    );
    totalFormatted = total.toFixed(2);
    refreshShipping();
  }

  const lineTotal = (item) =>
    ((Number(item.price) || 0) * (Number(item.qty) || 1)).toFixed(2);

  function refreshShipping() {
    const fee = calculateShippingFee({ subtotal: total, country });
    shipping = fee;
    grandTotal = total + fee.amount;
    grandTotalFormatted = grandTotal.toFixed(2);
  }

  const handleCountryInput = (event) => {
    const raw = event?.target?.value ?? '';
    country = raw.toString().toUpperCase();
    refreshShipping();
  };

  async function mountElements(secret) {
    if (!stripe || !secret) return;
    if (elements && mountedSecret === secret) return;
    elements = stripe.elements({
      clientSecret: secret,
      appearance: {
        theme: 'night',
        variables: {
          colorPrimary: '#6366F1',
          colorBackground: 'rgba(255,255,255,0.04)',
          colorText: '#e5e7eb',
          colorTextSecondary: '#9ca3af',
          colorDanger: '#f87171',
          borderRadius: '10px'
        }
      }
    });
    const paymentEl = elements.create('payment', { layout: 'tabs' });
    const target = document.getElementById('payment-element');
    if (target) {
      target.innerHTML = '';
      paymentEl.mount(target);
      paymentElement = paymentEl;
      mountedSecret = secret;
      hasPaymentElement = true;
      buttonLabel = 'Pay now';
    }
  }

  async function confirmPayment(secret) {
    if (!stripe) return 'Payments are not available right now.';
    await mountElements(secret);
    if (!elements) return 'Unable to start payment. Please refresh.';

    const submitResult = await elements.submit();
    if (submitResult.error) {
      return submitResult.error.message || 'Payment details are incomplete.';
    }

    const intentId = secret.split('_secret')[0] || '';

    const returnUrlBase = `${window.location.origin}/checkout/success?payment_intent=${intentId}&payment_intent_client_secret=${encodeURIComponent(secret)}`;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret: secret,
      redirect: 'if_required',
      confirmParams: {
        return_url: returnUrlBase
      }
    });

    console.log('confirm result', { error, status: paymentIntent?.status, id: paymentIntent?.id });

    if (error) {
      return error.message || 'Payment failed. Please check your details.';
    }
    if (paymentIntent?.status === 'succeeded') {
      window.location.href = `${returnUrlBase}&status=succeeded`;
      return null;
    }
    if (paymentIntent?.status === 'processing' || paymentIntent?.status === 'requires_action') {
      const statusParam = paymentIntent?.status || 'processing';
      window.location.href = `${returnUrlBase}&status=${statusParam}`;
      return null;
    }
    if (paymentIntent?.status === 'requires_payment_method') {
      return 'Payment was not completed. Please update the card and try again.';
    }
    if (paymentIntent?.status) {
      return `Payment status: ${paymentIntent.status}. If this does not complete, please try again.`;
    }
    return null;
  }

  async function submitCheckout(event) {
    event?.preventDefault?.();
    if (loading) return;
    loading = true;
    message = '';
    try {
      // If the payment element is already mounted with this clientSecret, confirm the payment
      if (hasPaymentElement && clientSecret && mountedSecret === clientSecret) {
        const confirmError = await confirmPayment(clientSecret);
        if (confirmError) message = confirmError;
        return;
      }



      // Otherwise create a new intent and mount the payment element
      const formData = new FormData(event.currentTarget);
      formData.append('cart', JSON.stringify(cart));
      formData.append('shipping_amount', shipping.amount.toString());
      formData.append('shipping_label', shipping.label);
      const res = await fetch('/api/checkout-intent', {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: formData
      });
      const raw = await res.json().catch(() => null);
      console.log('intent response', res.status, raw);
      const payload = raw?.type ? raw.data : raw;
      if (!res.ok || raw?.type === 'failure') {
        message = payload?.message || 'Checkout failed. Please try again.';
        return;
      }
      clientSecret = payload?.clientSecret || '';
      if (!clientSecret) {
        message = 'No payment client secret returned.';
        return;
      }
      await mountElements(clientSecret);
      // No error here; user now enters card details and clicks again
    } catch (err) {
      console.error('Checkout error', err);
      message = err?.message || 'Unable to start checkout. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen bg-[#0b1120]">
<section class="max-w-7xl mx-auto px-4 lg:px-6 py-12 text-gray-100">
  <div class="bg-gradient-to-br from-[#0f172a] via-[#0b1223] to-[#0d1326] rounded-3xl border border-white/5 shadow-2xl shadow-black/30 p-6 lg:p-10">
    <div class="flex items-center justify-between flex-wrap gap-3 mb-8">
      <div>
        <p class="text-sm text-indigo-300 uppercase tracking-wide">Checkout</p>
        <h1 class="text-3xl font-bold text-white">Complete your order</h1>
      </div>
      <div class="text-sm text-gray-400">
        Secure payments powered by Stripe
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <form
          method="POST"
          onsubmit={submitCheckout}
          class="space-y-5 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg shadow-black/20 backdrop-blur-sm"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-white">Shipping details</h2>
            <span class="text-xs text-gray-400">All fields required</span>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <label class="block text-sm font-medium text-gray-200">
              Full name
              <input
                name="full_name"
                autocomplete="name"
                required
                value={data.user?.full_name}
                class="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>
            <label class="block text-sm font-medium text-gray-200">
              Email
              <input
                name="email"
                type="email"
                autocomplete="email"
                disabled
                value={data.user?.email}
                class="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-gray-400"
              />
            </label>
          </div>

          <label class="block text-sm font-medium text-gray-200">
            Address line
            <input
              name="line1"
              autocomplete="address-line1"
              required
              class="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </label>

          <div class="grid md:grid-cols-3 gap-4">
            <label class="block text-sm font-medium text-gray-200">
              City
              <input
                name="city"
                autocomplete="address-level2"
                required
                class="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>
            <label class="block text-sm font-medium text-gray-200">
              Postal code
              <input
                name="postal_code"
                autocomplete="postal-code"
                required
                class="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>
            <label class="block text-sm font-medium text-gray-200">
              Country (2-letter)
              <input
                name="country"
                maxlength="2"
                autocomplete="country"
                required
                bind:value={country}
                oninput={handleCountryInput}
                class="mt-1 w-full uppercase rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>
          </div>

          {#if message}
            <div class="text-sm text-red-300 bg-red-900/30 border border-red-500/40 px-3 py-2 rounded">
              {message}
            </div>
          {/if}
          {#if removedInvalidItems > 0}
            <div class="text-sm text-amber-200 bg-amber-900/30 border border-amber-500/40 px-3 py-2 rounded">
              Removed {removedInvalidItems} invalid cart item(s). Please review your cart before paying.
            </div>
          {/if}

          {#if !data.stripeReady}
            <p class="text-sm text-red-300">
              Payment is not configured (server missing STRIPE_SECRET_KEY).
            </p>
        {:else}
            <div id="payment-element" class="border border-white/10 rounded-lg p-4 bg-white/5"></div>
        {/if}

          <button
            type="submit"
            class="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#4F46E5] text-white font-semibold shadow-lg shadow-[#4F46E5]/30 transition hover:bg-[#6366F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1] disabled:opacity-60"
            disabled={loading}
          >
            {#if loading}
              <span class="animate-pulse">Processing...</span>
            {:else}
              {buttonLabel}
            {/if}
          </button>
        </form>
      </div>

      <aside class="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg shadow-black/20 backdrop-blur-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-white">Order summary</h2>
          <span class="text-xs text-gray-400">Review your items</span>
        </div>

        {#if cart.length === 0}
          <p class="text-gray-400 text-sm">Your cart is empty.</p>
        {:else}
          <div class="space-y-3">
            {#each cart as item}
              <div class="flex justify-between text-sm text-gray-200 border-b border-white/5 pb-2">
                <div>
                  <p class="font-medium text-white">{item.name}</p>
                  <p class="text-gray-400">Qty: {item.qty} - {item.color} {item.size}</p>
                </div>
                <p class="font-semibold text-white">{lineTotal(item)} $</p>
              </div>
            {/each}
          </div>

          <div class="border-t border-white/10 mt-4 pt-4 space-y-2 text-sm text-gray-200">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span class="font-semibold text-white">{totalFormatted} $</span>
            </div>
            <div class="flex justify-between">
              <div>
                <span>Shipping</span>
                <p class="text-xs text-gray-400">{shipping.label}</p>
              </div>
              <span class="font-semibold text-white">{shipping.amount.toFixed(2)} $</span>
            </div>
            <div class="flex justify-between border-t border-dashed border-white/10 pt-2 text-white font-semibold">
              <span>Order total</span>
              <span>{grandTotalFormatted} $</span>
            </div>
            <p class="text-xs text-gray-400">
              Shipping fees follow the About page tiers (DE free over EUR 120, EUR 5 domestic, EUR 12 EU, EUR 18-25 international).
            </p>
          </div>
        {/if}
      </aside>
    </div>
  </div>
</section>
</div>


