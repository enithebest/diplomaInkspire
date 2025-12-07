<script>
  import { onMount } from 'svelte';
  let { data } = $props();

  onMount(() => {
    try {
      localStorage.removeItem('cart');
    } catch (e) {
      console.error(e);
    }
  });
</script>

<div class="min-h-screen bg-[#0b1120] text-gray-100">
  <section class="max-w-3xl mx-auto px-6 py-16">
    <div class="bg-gradient-to-br from-[#0f172a] via-[#0b1223] to-[#0d1326] rounded-3xl border border-white/5 shadow-2xl shadow-black/30 p-8 text-center">
      <div class="flex justify-center mb-6">
        {#if data.status === 'paid'}
          <div class="h-14 w-14 rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-2xl">✓</div>
        {:else if data.status === 'processing'}
          <div class="h-14 w-14 rounded-full bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 text-2xl">…</div>
        {:else}
          <div class="h-14 w-14 rounded-full bg-rose-500/15 border border-rose-400/40 flex items-center justify-center text-rose-300 text-2xl">!</div>
        {/if}
      </div>

      <h1 class="text-3xl font-bold text-white mb-2">
        {#if data.status === 'paid'}Thank you!{:else if data.status === 'processing'}Payment processing{:else if data.status === 'requires_payment_method'}Payment failed{:else}Payment status unclear{/if}
      </h1>

      {#if data.status === 'paid'}
        <p class="text-lg text-gray-300 mb-2">Your payment was received.</p>
        {#if data.amount}
          <p class="text-md text-gray-400 mb-4">Total: {data.amount} {data.currency}</p>
        {/if}
      {:else if data.status === 'processing'}
        <p class="text-lg text-gray-300 mb-4">Your payment is processing. We will confirm shortly.</p>
      {:else if data.status === 'requires_payment_method'}
        <p class="text-lg text-gray-300 mb-4">Payment failed. Please try again with a different method.</p>
      {:else if data.status === 'unknown'}
        <p class="text-lg text-gray-300 mb-4">Missing session information, but your order may be processing.</p>
      {:else}
        <p class="text-lg text-gray-300 mb-4">We could not verify the payment status. If you were charged, please contact support.</p>
      {/if}

      <div class="flex justify-center gap-3 mt-6">
        <a href="/orders" class="px-5 py-3 rounded-lg bg-[#4F46E5] text-white font-semibold shadow-lg shadow-[#4F46E5]/30 transition hover:bg-[#6366F1]">View orders</a>
        <a href="/categories" class="px-5 py-3 rounded-lg bg-white/10 text-white border border-white/15 transition hover:bg-white/15">Continue shopping</a>
      </div>
    </div>
  </section>
</div>
