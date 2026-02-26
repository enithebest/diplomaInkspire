<script>
  export let user = null;
  export let locale = 'en';
  export let locales = ['en'];

  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { localizeHref, setLocale } from '$lib/paraglide/runtime';
  import * as m from '$lib/paraglide/messages/_index.js';
  import { Globe, LogIn, LogOut, ShoppingCart, UserRound } from 'lucide-svelte';
  let cartCount = 0;
  let userMenuOpen = false;

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
    const handleCartUpdated = () => updateCartCount();
    window.addEventListener('cart-updated', handleCartUpdated);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cart-updated', handleCartUpdated);
    };
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
  <div class="max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 py-3 text-white">
    <div class="flex items-center gap-8">
      <a href="/" class="text-2xl font-bold tracking-tight text-white hover:text-indigo-400 flex-shrink-0">
        Inkspire
      </a>

      <div class="hidden md:flex items-center gap-6 text-sm font-medium">
        <a href="/" class="text-gray-300 hover:text-white">{m.nav_home()}</a>
        <a href="/categories" class="text-gray-300 hover:text-white">{m.nav_shop()}</a>
        <a href="/contact" class="text-gray-300 hover:text-white">{m.nav_contact()}</a>
        <a href="/about" class="text-gray-300 hover:text-white">{m.nav_about()}</a>
      </div>
    </div>

    <div class="flex items-center gap-2 md:gap-3 flex-shrink-0">
      <div class="hidden sm:flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2 py-1 text-[11px] uppercase tracking-wide text-gray-300">
        <Globe class="h-4 w-4 text-gray-400" aria-hidden="true" />
        {#each availableLocales as code}
          <a
            href={localizeHref(currentHref, { locale: code })}
            aria-current={locale === code ? 'true' : 'false'}
            class={`px-2 py-1 rounded-full transition ${
              locale === code ? 'bg-white text-gray-900 font-semibold' : 'text-gray-300 hover:text-white/90'
            }`}
            onclick={(e) => handleLocaleClick(e, code)}
          >
            {code.toUpperCase()}
          </a>
        {/each}
      </div>

      <a
        href="/cart"
        class="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition"
        aria-label={m.nav_cart()}
      >
        <ShoppingCart class="h-5 w-5 text-white" aria-hidden="true" />
        {#if cartCount > 0}
          <span
            class="absolute -top-1 -right-1 min-w-[18px] h-5 rounded-full bg-indigo-500 px-1 text-[11px] font-semibold text-white flex items-center justify-center"
          >
            {cartCount}
          </span>
        {/if}
      </a>

      {#if user}
        <div class="relative">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition"
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
            onclick={() => (userMenuOpen = !userMenuOpen)}
          >
            <UserRound class="h-5 w-5 text-white" aria-hidden="true" />
          </button>

          {#if userMenuOpen}
            <div class="absolute right-0 mt-2 w-52 rounded-2xl bg-gray-900/95 border border-white/10 shadow-2xl backdrop-blur-sm py-2">
              <div class="px-4 pb-2 text-xs text-gray-400 truncate">{user.full_name || user.email}</div>
              <a
                href="/profile"
                class="flex items-center gap-2 px-4 py-2 text-sm text-gray-100 hover:bg-white/5 transition"
              >
                {m.nav_profile()}
              </a>
              {#if user?.role === 'admin'}
                <a
                  href="/admin"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-100 hover:bg-white/5 transition"
                >
                  {m.nav_admin()}
                </a>
                <a
                  href="/orders"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-100 hover:bg-white/5 transition"
                >
                  {m.nav_orders()}
                </a>
              {/if}
              <form method="POST" action="/logout" class="mt-1">
                <button
                  type="submit"
                  class="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-white/5 transition"
                >
                  <LogOut class="h-4 w-4" aria-hidden="true" />
                  {m.nav_logout()}
                </button>
              </form>
            </div>
          {/if}
        </div>
      {:else}
        <div class="flex items-center gap-2">
          <a
            href="/login"
            class="flex h-10 items-center gap-2 rounded-full border border-white/10 px-3 text-sm text-gray-100 hover:border-white/30 hover:text-white transition"
          >
            <LogIn class="h-4 w-4" aria-hidden="true" />
            <span class="hidden sm:inline">{m.nav_login()}</span>
          </a>
          <a
            href="/register"
            class="inline-flex items-center rounded-full bg-[#4F46E5] hover:bg-[#6366F1] text-sm font-semibold text-white px-3 py-2 transition"
          >
            {m.nav_register()}
          </a>
        </div>
      {/if}
    </div>
  </div>
</nav>
