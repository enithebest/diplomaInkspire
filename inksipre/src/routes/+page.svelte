<script>
  let menuOpen = false;
</script>

<nav class="bg-white/80 backdrop-blur-lg shadow-lg text-gray-900 p-4 fixed w-full z-50 transition-all duration-300 ease-in-out">
  <div class="container mx-auto flex justify-between items-center">
    <a href="#" class="text-2xl font-extrabold text-indigo-600 tracking-tight hover:text-indigo-700 transition-colors">Inkspire</a>
    
    <button class="sm:hidden focus:outline-none" on:click={() => menuOpen = !menuOpen}>
      <svg class="w-6 h-6 transition-transform duration-300 {menuOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}" />
      </svg>
    </button>
    
    <ul class="hidden sm:flex space-x-8 font-semibold">
      <li><a href="#" class="relative hover:text-indigo-600 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all hover:after:w-full">Home</a></li>
      <li><a href="#" class="relative hover:text-indigo-600 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all hover:after:w-full">Shop</a></li>
      <li><a href="#" class="relative hover:text-indigo-600 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all hover:after:w-full">About</a></li>
      <li><a href="#" class="relative hover:text-indigo-600 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all hover:after:w-full">Contact</a></li>
    </ul>
  </div>
  
  {#if menuOpen}
    <ul class="sm:hidden bg-white/95 backdrop-blur-lg text-gray-900 flex flex-col p-6 space-y-4 shadow-2xl rounded-b-2xl mt-2 animate-slide-down">
      <li><a href="#" class="hover:text-indigo-600 transition-colors py-2 border-b border-gray-200 last:border-b-0">Home</a></li>
      <li><a href="#" class="hover:text-indigo-600 transition-colors py-2 border-b border-gray-200 last:border-b-0">Shop</a></li>
      <li><a href="#" class="hover:text-indigo-600 transition-colors py-2 border-b border-gray-200 last:border-b-0">About</a></li>
      <li><a href="#" class="hover:text-indigo-600 transition-colors py-2 border-b border-gray-200 last:border-b-0">Contact</a></li>
    </ul>
  {/if}
</nav>

<style>
  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-slide-down {
    animation: slide-down 0.3s ease-out;
  }
</style>

<!-- Hero Section -->
<section class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-32 text-center text-white relative overflow-hidden">
  <div class="container mx-auto relative z-10">
    <h1 class="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-lg">Welcome to Inkspire</h1>
    <p class="text-lg sm:text-xl mb-8 drop-shadow-md">Your one-stop shop for premium inks and stationery.</p>
    <a href="#" class="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-indigo-50 transition shadow-lg">Shop Now</a>
  </div>
  <!-- Decorative shapes -->
  <div class="absolute -top-10 -left-10 w-72 h-72 bg-purple-300 rounded-full opacity-30 animate-pulse"></div>
  <div class="absolute -bottom-20 -right-20 w-96 h-96 bg-pink-300 rounded-full opacity-30 animate-pulse"></div>
</section>
<!-- Product Section -->
<section class="py-20 bg-gray-50">
  <div class="container mx-auto text-center mb-12">
    <h2 class="text-3xl sm:text-4xl font-bold text-gray-800">Our Products</h2>
    <p class="text-gray-600 mt-2">Check out our premium inks and stylish clothing</p>
  </div>

  <div class="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    <!-- Product Card -->
    <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 flex flex-col items-center">
      <img src="https://via.placeholder.com/200x250.png?text=T-Shirt" alt="T-Shirt" class="rounded-lg mb-4">
      <h3 class="text-lg font-semibold text-gray-800">Classic T-Shirt</h3>
      <p class="text-indigo-600 font-bold mt-2">$25.00</p>
      <button class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition">Add to Cart</button>
    </div>

    <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 flex flex-col items-center">
      <img src="https://via.placeholder.com/200x250.png?text=Hoodie" alt="Hoodie" class="rounded-lg mb-4">
      <h3 class="text-lg font-semibold text-gray-800">Stylish Hoodie</h3>
      <p class="text-indigo-600 font-bold mt-2">$45.00</p>
      <button class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition">Add to Cart</button>
    </div>

    <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 flex flex-col items-center">
      <img src="https://via.placeholder.com/200x250.png?text=Cap" alt="Cap" class="rounded-lg mb-4">
      <h3 class="text-lg font-semibold text-gray-800">Trendy Cap</h3>
      <p class="text-indigo-600 font-bold mt-2">$15.00</p>
      <button class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition">Add to Cart</button>
    </div>

    <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 flex flex-col items-center">
      <img src="https://via.placeholder.com/200x250.png?text=Jacket" alt="Jacket" class="rounded-lg mb-4">
      <h3 class="text-lg font-semibold text-gray-800">Leather Jacket</h3>
      <p class="text-indigo-600 font-bold mt-2">$85.00</p>
      <button class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition">Add to Cart</button>
    </div>
  </div>
</section>

<!-- Footer -->
<footer class="bg-gray-900 text-gray-200 py-8 mt-12">
  <div class="container mx-auto text-center">
    <p>&copy; {new Date().getFullYear()} Inkspire. All rights reserved.</p>
    <div class="flex justify-center space-x-6 mt-4">
      <a href="#" class="hover:text-indigo-400 transition">Facebook</a>
      <a href="#" class="hover:text-pink-400 transition">Instagram</a>
      <a href="#" class="hover:text-blue-400 transition">Twitter</a>
    </div>
  </div>
</footer>
