<script>
  let data = $props();
</script>

<section class="max-w-2xl mx-auto px-6 py-16 text-center">
  <h1 class="text-3xl font-bold text-gray-900 mb-4">Thank you!</h1>
  {#if data.status === 'paid'}
    <p class="text-lg text-gray-700 mb-6">
      Your payment was received.
      {#if data.amount}
        Total: {data.amount} {data.currency}
      {/if}
    </p>
  {:else if data.status === 'processing'}
    <p class="text-lg text-gray-700 mb-6">
      Your payment is processing. We will confirm shortly.
    </p>
  {:else if data.status === 'requires_payment_method'}
    <p class="text-lg text-gray-700 mb-6">
      Payment failed. Please try again.
    </p>
  {:else if data.status === 'unknown'}
    <p class="text-lg text-gray-700 mb-6">
      Missing session information, but your order may be processing.
    </p>
  {:else}
    <p class="text-lg text-gray-700 mb-6">
      We could not verify the payment status. If you were charged, please contact support.
    </p>
  {/if}

  <div class="flex justify-center gap-3">
    <a href="/orders" class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">View orders</a>
    <a href="/categories" class="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300">Continue shopping</a>
  </div>
</section>
