<script>
  let menuOpen = false;
</script>

<style>
  /* Optional: custom styles can go here if needed */
</style>

<!-- Navbar -->
<nav class="bg-black text-white p-4">
  <div class="container mx-auto flex justify-between items-center">
    <a href="/" class="text-2xl font-bold">Inkspire</a>
    <button class="sm:hidden" onclick={() => menuOpen = !menuOpen}>
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="{menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}" />
      </svg>
    </button>
    <ul class="hidden sm:flex space-x-6">
      <li><a href="/login" class="hover:text-gray-400">Login</a></li>
      <li><a href="/" class="hover:text-gray-400">Shop</a></li>
      <li><a href="/" class="hover:text-gray-400">About</a></li>
      <li><a href="/" class="hover:text-gray-400">Contact</a></li>
    </ul>
  </div>
  <!-- Mobile Menu -->
  {#if menuOpen}
    <ul class="sm:hidden bg-black text-white flex flex-col p-4 space-y-2">
      <li><a href="/" class="hover:text-gray-400">Login</a></li>
      <li><a href="/" class="hover:text-gray-400">Shop</a></li>
      <li><a href="/" class="hover:text-gray-400">About</a></li>
      <li><a href="/" class="hover:text-gray-400">Contact</a></li>
    </ul>
  {/if}
</nav>

<!-- Hero Section -->
<section class="bg-gray-50 py-20 text-center">
  <h1 class="text-4xl sm:text-5xl font-bold mb-4">Welcome to Inkspire</h1>
  <p class="text-lg sm:text-xl mb-8">Your one-stop shop for premium inks and stationery.</p>
  <a href="/" class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">Shop Now</a>
</section>

<!-- Footer -->
<footer class="bg-black text-white py-6 mt-12">
  <div class="container mx-auto text-center">
    <p>&copy; {new Date().getFullYear()} Inkspire. All rights reserved.</p>
    <div class="flex justify-center space-x-4 mt-2">
      <a href="/" class="hover:text-gray-400">Facebook</a>
      <a href="/" class="hover:text-gray-400">Instagram</a>
      <a href="/" class="hover:text-gray-400">Twitter</a>
    </div>
  </div>
</footer>
