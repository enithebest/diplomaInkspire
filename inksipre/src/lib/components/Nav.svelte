<script>
  import { page } from '$app/stores';
  export let user = null;

  // Main links for all visitors
  const links = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/categories' },
    { name: 'Contact', href: '/contact' }
  ];

  // Only visible for admins
  const adminLinks = [
    { name: 'Admin', href: '/admin' },
    { name: 'Orders', href: '/orders' }
  ];

  const isActive = (path) => $page.url.pathname === path;
</script>

<nav class="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
  <div class="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
    <!-- Logo -->
    <a href="/" class="text-2xl font-bold tracking-tight text-gray-800 hover:text-blue-600">
      Inkspire
    </a>

    <!-- Main Links -->
    <div class="hidden md:flex gap-6">
      {#each links as link}
        <a
          href={link.href}
          class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
          class:is-active={isActive(link.href)}
        >
          {link.name}
        </a>
      {/each}

      {#if user?.role === 'admin'}
        {#each adminLinks as link}
          <a
            href={link.href}
            class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            class:is-active={isActive(link.href)}
          >
            {link.name}
          </a>
        {/each}
      {/if}
    </div>

    <!-- Right-side buttons -->
    <div class="flex items-center gap-4">
      {#if user}
        <a href="/profile" class="text-gray-700 hover:text-blue-600 font-medium">
          Profile
        </a>
        <form method="POST" action="/logout">
          <button
            type="submit"
            class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          >
            Logout
          </button>
        </form>
      {:else}
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
</nav>

<style>
  a.is-active {
    border-bottom: 2px solid #2563eb; /* highlight active page */
  }
</style>
