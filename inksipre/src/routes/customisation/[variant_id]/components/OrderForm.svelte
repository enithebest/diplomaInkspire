<script>
  export let primaryButton = '';
  export let onSubmit;
  export let form;
  export let orderDesignData = '';
  export let orderDesignUrl = '';
  export let variantSku = '';
</script>

<div class="bg-white/5 backdrop-blur border border-blue-900/40 rounded-xl p-5 shadow-lg">
  <div class="flex flex-col gap-1 mb-3">
    <h3 class="text-lg font-semibold text-white">Ready to order?</h3>
    <p class="text-sm text-gray-300">We attach your current edit to a new order.</p>
    <p class="text-xs text-gray-400">Variant: {variantSku || 'Selected'}</p>
  </div>
  <form
    method="POST"
    action="?/order"
    class="space-y-3"
    on:submit={onSubmit}
  >
    <input type="hidden" name="design_data" value={orderDesignData} />
    <input type="hidden" name="design_url" value={orderDesignUrl} />
    <input type="hidden" name="rotation" value="0" />
    <input type="hidden" name="scale" value="1" />
    <input type="hidden" name="position_x" value="0" />
    <input type="hidden" name="position_y" value="0" />

    <button
      type="submit"
      class={`${primaryButton} w-full px-6 py-3`}
    >
      Order this custom piece
    </button>
    {#if form?.orderSuccess}
      <p class="text-sm text-green-400" role="status">Order saved! We'll get it ready.</p>
    {/if}
    {#if form?.orderError}
      <p class="text-sm text-red-400" role="alert">{form.orderError}</p>
    {/if}
  </form>
</div>
