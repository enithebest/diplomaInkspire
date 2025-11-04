<script>
  export let user;

  import { onMount } from 'svelte';
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

<nav class="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
  <div class="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
    <!-- Logo -->
    <a href="/" class="text-2xl font-bold tracking-tight text-gray-800 hover:text-blue-600">
      Inkspire
    </a>

    <!-- Main Links -->
    <div class="hidden md:flex gap-6">
      <a href="/" class="text-gray-700 hover:text-blue-600 font-medium">Home</a>
      <a href="/categories" class="text-gray-700 hover:text-blue-600 font-medium">Shop</a>
      <a href="/contact" class="text-gray-700 hover:text-blue-600 font-medium">Contact</a>

      {#if user?.role === 'admin'}
        <a href="/admin" class="text-gray-700 hover:text-blue-600 font-medium">Admin</a>
        <a href="/orders" class="text-gray-700 hover:text-blue-600 font-medium">Orders</a>
      {/if}
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-5">
      <!-- Warenkorb -->
      <a href="/cart" class="text-gray-700 hover:text-blue-600 font-medium">
        Cart
        {#if cartCount > 0}
          <span
            class="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-semibold rounded-full px-1.5"
          >
            {cartCount}
          </span>
        {/if}
      </a>

      {#if user}
        <span class="text-gray-700 text-sm">Hi, {user.full_name || user.email}!</span>
        <a href="/profile" class="text-gray-700 hover:text-blue-600 font-medium">Profile</a>
        <form method="POST" action="/logout">
          <button
            type="submit"
            class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 text-sm"
          >
            Logout
          </button>
        </form>
      {:else}
        <a href="/login" class="text-gray-700 hover:text-blue-600 font-medium">Login</a>
        <a
          href="/register"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
        >
          Register
        </a>
      {/if}
    </div>
  </div>
</nav>
