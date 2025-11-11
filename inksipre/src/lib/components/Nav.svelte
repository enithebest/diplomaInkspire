<script>
  export let user;

  import { onMount } from 'svelte';
  import { m } from '$lib/paraglide/messages';
  let cartCount = 0;

  // Funktion: Warenkorb aus localStorage lesen
  function updateCartCount() {
    try {
      const raw = localStorage.getItem('cart');
      const items = raw ? JSON.parse(raw) : [];
      cartCount = items.length;
    } catch {
      cartCount = 0;
    }
  }

  // Beim Laden einmal abrufen + auf Änderungen reagieren
  onMount(() => {
    updateCartCount();

    // Wenn an anderer Stelle localStorage geändert wird
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  });
</script>

<nav class="w-full sticky top-0 z-50 bg-gray-900/90 backdrop-blur border-b border-white/10 shadow-sm">
  <div class="max-w-7xl mx-auto flex justify-between items-center px-6 py-3 text-white">
    <!-- Logo -->
    <a href="/" class="text-2xl font-bold tracking-tight text-white hover:text-indigo-400">
      Inkspire
    </a>

    <!-- Main Links -->
    <div class="hidden md:flex gap-6">
      <a href="/" class="text-gray-300 hover:text-white font-medium">{m.nav_home()}</a>
      <a href="/categories" class="text-gray-300 hover:text-white font-medium">{m.nav_shop()}</a>
      <a href="/contact" class="text-gray-300 hover:text-white font-medium">{m.nav_contact()}</a>

      {#if user?.role === 'admin'}
        <a href="/admin" class="text-gray-300 hover:text-white font-medium">{m.nav_admin()}</a>
        <a href="/orders" class="text-gray-300 hover:text-white font-medium">{m.nav_orders()}</a>
      {/if}
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-5">
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
    </div>
  </div>
</nav>
