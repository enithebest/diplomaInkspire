<script>
  // Receive the user prop from +layout.svelte
  export let user;
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

      <!-- Admin links -->
      {#if user?.role === 'admin'}
        <a href="/admin" class="text-gray-700 hover:text-blue-600 font-medium">Admin</a>
        <a href="/orders" class="text-gray-700 hover:text-blue-600 font-medium">Orders</a>
      {/if}
    </div>

    <!-- Right-side buttons -->
    <div class="flex items-center gap-4">
      {#if user}
        <!-- Logged in -->
        <span class="text-gray-700">Hi, {user.full_name || user.email}!</span>
        <a href="/profile" class="text-gray-700 hover:text-blue-600 font-medium">Profile</a>
        <form method="POST" action="/logout">
          <button
            type="submit"
            class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          >
            Logout
          </button>
        </form>
      {:else}
        <!-- Not logged in -->
        <a href="/login" class="text-gray-700 hover:text-blue-600 font-medium">Login</a>
        <a
          href="/register"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </a>
      {/if}
    </div>
  </div>

  <!-- Optional debug: remove in production -->

</nav>

