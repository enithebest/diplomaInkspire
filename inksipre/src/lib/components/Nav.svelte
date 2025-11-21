<script>
  export let user;
  export let locale = 'en';
  export let locales = ['en'];

  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { localizeHref, setLocale } from '$lib/paraglide/runtime';
  import * as m from '$lib/paraglide/messages/_index.js';
  let cartCount = 0;

  // Read cart from localStorage
  function updateCartCount() {
    try {
      const raw = localStorage.getItem('cart');
      const items = raw ? JSON.parse(raw) : [];
      cartCount = items.length;
    } catch {
      cartCount = 0;
    }
  }

  // Run once on mount and when localStorage changes
  onMount(() => {
    updateCartCount();

    // Listen for changes triggered in other tabs
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  });

  $: availableLocales = locales?.length ? locales : ['en'];
  $: currentHref = `${$page.url.pathname}${$page.url.search}${$page.url.hash}`;

  function handleLocaleClick(e, code) {
    // allow modified clicks (open in new tab / window) and non-left clicks
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    // setLocale will navigate when the URL strategy is enabled
    try {
      const res = setLocale(code);
      // handle async setLocale (custom strategies) without awaiting here
      if (res instanceof Promise) res.catch(() => {});
    } catch (err) {
      // fallback: navigate to localized href
      window.location.href = localizeHref(currentHref, { locale: code });
    }
  }
</script>

<nav class="w-full sticky top-0 z-50 bg-gray-900/90 backdrop-blur border-b border-white/10 shadow-sm">
  <div class="max-w-7xl mx-auto flex items-center justify-between gap-6 px-6 py-2 text-white">
    <!-- Logo -->
    <a href="/" class="text-2xl font-bold tracking-tight text-white hover:text-indigo-400 flex-shrink-0">
      Inkspire
    </a>

    <!-- Main Links -->
    <div class="hidden md:flex gap-6 mx-auto">
      <a href="/" class="text-gray-300 hover:text-white font-medium">{m.nav_home()}</a>
      <a href="/categories" class="text-gray-300 hover:text-white font-medium">{m.nav_shop()}</a>
      <a href="/contact" class="text-gray-300 hover:text-white font-medium">{m.nav_contact()}</a>

      {#if user?.role === 'admin'}
        <a href="/admin" class="text-gray-300 hover:text-white font-medium">{m.nav_admin()}</a>
        <a href="/orders" class="text-gray-300 hover:text-white font-medium">{m.nav_orders()}</a>
      {/if}
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-5 flex-shrink-0 justify-end">
      <!-- Warenkorb -->
      <a href="/cart" class="relative inline-block text-gray-300 hover:text-white font-medium">
        {m.nav_cart()}
        {#if cartCount > 0}
          <span
            class="absolute -top-2 -right-3 bg-indigo-500 text-white text-xs font-semibold rounded-full px-1.5"
          >
            {cartCount}
          </span>
        {/if}
      </a>

      {#if user}
        <span class="text-gray-300 text-sm">{m.nav_greeting({ name: user.full_name || user.email })}</span>
        <a href="/profile" class="text-gray-300 hover:text-white font-medium">{m.nav_profile()}</a>
        <form method="POST" action="/logout">
          <button
            type="submit"
            class="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 text-sm"
          >
            {m.nav_logout()}
          </button>
        </form>
      {:else}
        <a href="/login" class="text-gray-300 hover:text-white font-medium">{m.nav_login()}</a>
        <a
          href="/register"
          class="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-400 transition text-sm"
        >
          {m.nav_register()}
        </a>
      {/if}

      <!-- Language selector -->
      <div class="flex items-center gap-1 rounded-full border border-white/20 px-2 py-1 text-xs md:text-sm">
        {#each availableLocales as code}
          <a
            href={localizeHref(currentHref, { locale: code })}
            aria-current={locale === code ? 'true' : 'false'}
            class={`px-2 py-1 rounded-full transition ${
              locale === code ? 'bg-white text-gray-900 font-semibold' : 'text-gray-300 hover:text-white'
            }`}
            onclick={(e) => handleLocaleClick(e, code)}
          >
            {code.toUpperCase()}
          </a>
        {/each}
      </div>
    </div>
  </div>
</nav>
