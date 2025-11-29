<script>
  import { onMount } from 'svelte';
  import { loadStripe } from '@stripe/stripe-js';

  const { data } = $props();

  let cart = $state([]);
  let message = $state('');
  let loading = $state(false);
  let total = $state(0);
  let totalFormatted = $state('0.00');
  let stripe = $state(null);
  let elements = $state(null);
  let paymentElement;
  let clientSecret = $state('');
  let mountedSecret = '';
  let hasPaymentElement = false;
  let buttonLabel = $state('Continue to payment');

  onMount(() => {
    const raw = localStorage.getItem('cart');
    cart = raw ? JSON.parse(raw) : [];
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

  function updateTotals() {
    total = cart.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1),
      0
    );
    totalFormatted = total.toFixed(2);
  }

  const lineTotal = (item) =>
    ((Number(item.price) || 0) * (Number(item.qty) || 1)).toFixed(2);

  async function mountElements(secret) {
    if (!stripe || !secret) return;
    if (elements && mountedSecret === secret) return;
    elements = stripe.elements({ clientSecret: secret });
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

<section class="max-w-6xl mx-auto px-6 py-12">
  <h1 class="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

  <div class="grid lg:grid-cols-3 gap-8">
    <div class="lg:col-span-2 space-y-6">
      <form
        method="POST"
        onsubmit={submitCheckout}
        class="space-y-4 bg-white shadow-sm border border-gray-200 rounded-lg p-6"
      >
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Shipping details</h2>

        <div class="grid md:grid-cols-2 gap-4">
          <label class="block text-sm font-medium text-gray-700">
            Full name
            <input
              name="full_name"
              autocomplete="name"
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
              autocomplete="email"
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
            autocomplete="address-line1"
            required
            class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <div class="grid md:grid-cols-3 gap-4">
          <label class="block text-sm font-medium text-gray-700">
            City
            <input
              name="city"
              autocomplete="address-level2"
              required
              class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label class="block text-sm font-medium text-gray-700">
            Postal code
            <input
              name="postal_code"
              autocomplete="postal-code"
              required
              class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label class="block text-sm font-medium text-gray-700">
            Country (2-letter)
            <input
              name="country"
              maxlength="2"
              autocomplete="country"
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

        {#if !data.stripeReady}
          <p class="text-sm text-red-600">
            Payment is not configured (server missing STRIPE_SECRET_KEY).
          </p>
        {:else}
          <div id="payment-element" class="border border-gray-200 rounded-lg p-4 bg-gray-50"></div>
        {/if}

        <button
          type="submit"
          class="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
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
