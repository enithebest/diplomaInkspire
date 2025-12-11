<script>
  import * as m from '$lib/paraglide/messages/_index.js';

  let { data } = $props();
  let activeTab = $state('profile');
  let filterStatus = $state('all');
  let filteredOrders = $state(data.orders || []);
  let uploads = $state(data.uploads || []);

  const itemsByOrder = data.itemsByOrder ?? {};

  const formatDateTime = (value) => {
    if (!value) return '';
    const d = new Date(value);
    return d.toLocaleString();
  };

  const statusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'paid') return 'bg-green-600/20 text-green-300 border border-green-500/40';
    if (s === 'processing' || s === 'pending') return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40';
    if (s === 'failed' || s === 'requires_payment_method')
      return 'bg-red-500/20 text-red-300 border border-red-500/40';
    return 'bg-gray-600/20 text-gray-200 border border-gray-500/40';
  };


  $effect(() => {
    filteredOrders =
      filterStatus === 'all'
        ? data.orders || []
        : (data.orders || []).filter(
            (o) => (o.status || '').toLowerCase() === filterStatus.toLowerCase()
          );
  });

  function reorderToCart(orderId) {
    try {
      const items = itemsByOrder[orderId] || [];
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('cart') : null;
      const cart = raw ? JSON.parse(raw) : [];
      for (const it of items) {
        cart.push({
          product_id: it.product_id,
          variant_id: it.variant_id,
          name: it.name,
          color: undefined,
          size: undefined,
          price: it.unit_price,
          qty: it.quantity,
          image_url: undefined
        });
      }
      if (typeof localStorage !== 'undefined') localStorage.setItem('cart', JSON.stringify(cart));
      alert(m.profile_reorder_alert());
    } catch (e) {
      console.error(e);
    }
  }
</script>

<section class="relative min-h-screen bg-gradient-to-b from-[#141b33] via-[#10182c] to-[#0c1124] text-white px-6 py-16 overflow-hidden">
  <div class="absolute -top-40 left-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-700/20 blur-3xl -translate-x-1/2"></div>

  <div class="relative z-10 max-w-5xl mx-auto">
    <h1
      class="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent"
    >
      {m.profile_title()}
    </h1>

    <!-- Tabs -->
    <div class="flex justify-center gap-3 mb-8">
      <button
        class={`px-4 py-2 rounded-lg border ${activeTab === 'profile' ? 'bg-white/15 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
        onclick={() => (activeTab = 'profile')}
      >
        {m.profile_tab_profile()}
      </button>
      <button
        class={`px-4 py-2 rounded-lg border ${activeTab === 'orders' ? 'bg-white/15 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
        onclick={() => (activeTab = 'orders')}
      >
        {m.profile_tab_orders()}
      </button>
      <button
        class={`px-4 py-2 rounded-lg border ${activeTab === 'uploads' ? 'bg-white/15 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
        onclick={() => (activeTab = 'uploads')}
      >
        {m.profile_tab_uploads()}
      </button>
    </div>



    {#if activeTab === 'profile'}
      <form
        method="POST"
        action="?/update"
        class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 space-y-5"
      >
        <div>
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="block text-sm font-semibold text-gray-300 mb-1">{m.profile_email_label()}</label>
          <input
            type="email"
            name="email"
            value={data.user.email}
            readonly
            class="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
          />
        </div>

        <div>
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="block text-sm font-semibold text-gray-300 mb-1">{m.profile_name_label()}</label>
          <input
            type="text"
            name="full_name"
            value={data.user.full_name}
            class="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
          />
        </div>

        <div>
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="block text-sm font-semibold text-gray-300 mb-1">{m.profile_password_label()}</label>
          <input
            type="password"
            name="password"
            placeholder={m.profile_password_placeholder()}
            class="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-[#4F46E5] hover:bg-[#6366F1] text-white font-semibold py-3 rounded-lg shadow-lg shadow-[#4F46E5]/20 transition-all duration-200"
        >
          {m.profile_update_button()}
        </button>
      </form>
    {/if}

    {#if activeTab === 'orders'}
      <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4">
        <div class="flex flex-wrap items-center gap-3">
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="text-sm text-gray-200">{m.profile_orders_filter_label()}</label>
          <div class="relative">
            <select
              class="appearance-none bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white shadow-inner shadow-black/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 pr-10"
              style="appearance:none;-webkit-appearance:none;-moz-appearance:none;"
              bind:value={filterStatus}
            >
              <option class="bg-gray-900 text-white" value="all">{m.profile_orders_filter_all()}</option>
              <option class="bg-gray-900 text-white" value="paid">{m.profile_orders_filter_paid()}</option>
              <option class="bg-gray-900 text-white" value="processing">{m.profile_orders_filter_processing()}</option>
              <option class="bg-gray-900 text-white" value="pending">{m.profile_orders_filter_pending()}</option>
              <option class="bg-gray-900 text-white" value="failed">{m.profile_orders_filter_failed()}</option>
            </select>
            <span class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">▼</span>
          </div>
        </div>
        {#if (data.orders || []).length === 0}
          <p class="text-center text-gray-300">{m.profile_orders_empty()}</p>
        {:else}
          <div class="grid gap-4 sm:grid-cols-2">
            {#each filteredOrders as o}
              <div class="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 shadow-lg h-full">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div class="flex items-center gap-3">
                    <span class="text-sm text-gray-300 font-semibold">#{o.id}</span>
                    <span class={`text-xs px-2 py-1 rounded-full ${statusBadge(o.status)}`}>{o.status ?? 'unknown'}</span>
                    <span class="text-sm text-gray-400">{formatDateTime(o.created_at)}</span>
                  </div>
                  <div class="text-indigo-300 font-semibold">{m.profile_orders_total()} ${o.total_price}</div>
                </div>
                {#if (itemsByOrder[o.id] || []).length > 0}
                  <ul class="text-gray-300 text-sm space-y-2">
                    {#each itemsByOrder[o.id] as it}
                      <li class="flex items-center gap-3">
                        {#if it.image_url}
                          <img
                            src={it.image_url}
                            alt={it.name}
                            class="w-12 h-12 rounded-md object-cover border border-white/10 bg-gray-800/50"
                            loading="lazy"
                            decoding="async"
                          />
                        {/if}
                        <div class="flex-1">
                          <div class="font-semibold text-white">{it.name}</div>
                          <div class="flex items-center gap-3 text-xs text-gray-400">
                            <span>{m.profile_orders_line({ qty: it.quantity, price: `$${it.unit_price}` })}</span>
                            {#if it.color}
                              <span class="inline-flex items-center gap-1 text-white">
                                <span
                                  class="inline-block h-3 w-3 rounded-full border border-white/40"
                                  style={`background:${it.color};`}
                                  aria-hidden="true"
                                ></span>
                                <span class="capitalize text-gray-200">{it.color}</span>
                              </span>
                            {/if}
                            {#if it.size}
                              <span class="uppercase text-gray-300">{it.size}</span>
                            {/if}
                          </div>
                        </div>
                        <div class="text-sm text-gray-200 font-semibold">
                          ${it.line_total ?? (Number(it.quantity || 0) * Number(it.unit_price || 0)).toFixed(2)}
                        </div>
                      </li>
                    {/each}
                  </ul>
                {/if}
                {#if o.ship_line1 || o.ship_city || o.ship_country}
                  <div class="mt-3 text-sm text-gray-300 space-y-0.5">
                    <div class="font-semibold text-white">{m.profile_orders_shipping()}</div>
                    {#if o.ship_name}<div>{o.ship_name}</div>{/if}
                    {#if o.ship_line1}<div>{o.ship_line1}</div>{/if}
                    {#if o.ship_line2}<div>{o.ship_line2}</div>{/if}
                    <div>
                      {#if o.ship_city}{o.ship_city}{/if}
                      {#if o.ship_region}, {o.ship_region}{/if}
                      {#if o.ship_postal} {o.ship_postal}{/if}
                    </div>
                    {#if o.ship_country}<div>{o.ship_country}</div>{/if}
                  </div>
                {/if}
                <div class="mt-3 flex justify-between items-center text-sm text-gray-300">
                  <span>{m.profile_orders_receipt()}</span>
                  <button class="px-3 py-1 rounded bg-[#4F46E5] hover:bg-[#6366F1] text-white text-xs" disabled>{m.profile_orders_download()}</button>
                </div>
                <div class="mt-3 text-right">
                  <button class="px-3 py-2 rounded bg-[#4F46E5] hover:bg-[#6366F1] text-white text-sm" onclick={() => reorderToCart(o.id)}>{m.profile_orders_reorder()}</button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}

    {#if activeTab === 'uploads'}
      <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6">
        {#if (uploads || []).length === 0}
          <p class="text-center text-gray-300">{m.profile_uploads_empty()}</p>
        {:else}
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {#each uploads as u}
              <div class="border border-white/10 rounded-md overflow-hidden">
                <img
                  src={u.image_url}
                  alt={u.image_url?.split('/').pop() ?? m.profile_uploads_alt()}
                  class="w-full aspect-video object-cover"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                />
                <div class="p-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    class="text-xs px-2 py-1 rounded bg-[#4F46E5] hover:bg-[#6366F1] text-white"
                    onclick={() => {
                      try {
                        localStorage.setItem('selectedDesignUrl', u.image_url);
                        location.href = '/categories';
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                  >
                    {m.profile_uploads_use()}
                  </button>
                  <button
                    type="button"
                    class="text-xs px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white"
                    onclick={async () => {
                      try {
                        const res = await fetch('?/delete_upload', {
                          method: 'POST',
                          headers: { 'content-type': 'application/x-www-form-urlencoded' },
                          credentials: 'same-origin',
                          body: new URLSearchParams({ upload_id: String(u.id) })
                        });
                        if (res.ok) {
                          uploads = (uploads || []).filter((x) => x.id !== u.id);
                        } else {
                          console.error('Delete failed', res.status);
                        }
                      } catch (err) {
                        console.error('Failed to delete upload', err);
                      }
                    }}
                  >
                    {m.profile_uploads_delete()}
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</section>
