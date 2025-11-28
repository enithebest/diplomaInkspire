<script>
  let { data } = $props();

  let message = $state('');

  let lang = $state('de');
  let activeTab = $state('profile');

  const itemsByOrder = data.itemsByOrder ?? {};

  const translations = {
    de: {
      title: 'Mein Profil',
      email: 'E-Mail',
      name: 'Vollständiger Name',
      password: 'Neues Passwort (optional)',
      update: 'Profil aktualisieren',
      success: 'Profil wurde erfolgreich aktualisiert!'
    },
    en: {
      title: 'My Profile',
      email: 'Email',
      name: 'Full Name',
      password: 'New Password (optional)',
      update: 'Update Profile',
      success: 'Profile updated successfully!'
    }
  };

  const t = (key) => translations[lang][key];

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
      alert('Items added to cart');
    } catch (e) {
      console.error(e);
    }
  }
</script>


<section class="relative min-h-screen bg-gradient-to-b from-[#141b33] via-[#10182c] to-[#0c1124] text-white px-6 py-16 overflow-hidden">
  <div class="absolute -top-40 left-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-700/20 blur-3xl -translate-x-1/2"></div>

  <!-- Sprachumschalter -->
  <div class="absolute top-6 right-6 z-20 flex gap-2">
    <button
      onclick={() => (lang = 'de')}
      class="px-3 py-1 rounded-lg text-sm font-semibold border border-white/10 bg-white/10 hover:bg-white/20 transition"
      class:bg-blue-600={lang === 'de'}
    >
      DE
    </button>
    <button
      onclick={() => (lang = 'en')}
      class="px-3 py-1 rounded-lg text-sm font-semibold border border-white/10 bg-white/10 hover:bg-white/20 transition"
      class:bg-blue-600={lang === 'en'}
    >
      EN
    </button>
  </div>

  <div class="relative z-10 max-w-5xl mx-auto">
    <h1 class="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">
      {t('title')}
    </h1>

    <!-- Tabs -->
    <div class="flex justify-center gap-3 mb-8">
      <button class={`px-4 py-2 rounded-lg border ${activeTab==='profile' ? 'bg-white/15 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`} onclick={() => (activeTab = 'profile')}>Profile</button>
      <button class={`px-4 py-2 rounded-lg border ${activeTab==='orders' ? 'bg-white/15 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`} onclick={() => (activeTab = 'orders')}>Orders</button>
      <button class={`px-4 py-2 rounded-lg border ${activeTab==='uploads' ? 'bg-white/15 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`} onclick={() => (activeTab = 'uploads')}>Uploads</button>
    </div>

    {#if activeTab === 'profile'}
    <form
      method="POST"
      action="?/update"
      class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 space-y-5"
    >
      <!-- E-Mail -->
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-sm font-semibold text-gray-300 mb-1">{t('email')}</label>
        <input
          type="email"
          name="email"
          value={data.user.email}
          readonly
          class="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
        />
      </div>

      <!-- Name -->
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-sm font-semibold text-gray-300 mb-1">{t('name')}</label>
        <input
          type="text"
          name="full_name"
          value={data.user.full_name}
          class="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
        />
      </div>

      <!-- Passwort -->
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-sm font-semibold text-gray-300 mb-1">{t('password')}</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          class="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
        />
      </div>

      <!-- Button -->
      <button
        type="submit"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200"
      >
        {t('update')}
      </button>

      {#if message}
        <p class="text-center text-green-400 font-medium mt-3">{t('success')}</p>
      {/if}
    </form>
    {/if}

    {#if activeTab === 'orders'}
      <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6">
        {#if (data.orders || []).length === 0}
          <p class="text-center text-gray-300">No orders yet.</p>
        {:else}
          <div class="space-y-6">
            {#each data.orders as o}
              <div class="border border-white/10 rounded-lg p-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div class="text-sm text-gray-300">#{o.id} • {new Date(o.created_at).toLocaleString()}</div>
                  <div class="text-indigo-300 font-semibold">Total: ${o.total_price}</div>
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
                          <div class="text-xs text-gray-400">Qty {it.quantity} • ${it.unit_price}</div>
                        </div>
                      </li>
                    {/each}
                  </ul>
                {/if}
                <div class="mt-3 text-right">
                  <button class="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-sm" onclick={() => reorderToCart(o.id)}>Reorder to cart</button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}

    {#if activeTab === 'uploads'}
      <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6">
        {#if (data.uploads || []).length === 0}
          <p class="text-center text-gray-300">No uploads yet.</p>
        {:else}
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {#each data.uploads as u}
              <div class="border border-white/10 rounded-md overflow-hidden">
                <img
                  src={u.image_url}
                  alt={u.image_url?.split('/').pop() ?? 'upload image'}
                  class="w-full aspect-video object-cover"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                />
                <div class="p-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    class="text-xs px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white"
                    onclick={() => { try { localStorage.setItem('selectedDesignUrl', u.image_url); location.href = '/categories'; } catch (e) { console.error(e); } }}
                  >Use</button>
                  <form method="POST" action="?/delete_upload">
                    <input type="hidden" name="upload_id" value={u.id} />
                    <button class="text-xs px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white">Delete</button>
                  </form>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</section>

