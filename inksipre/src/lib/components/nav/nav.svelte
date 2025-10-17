<script>
  // No props needed for now, but you could later pass items or links dynamically
</script>

<nav aria-label="Global" class="flex items-center justify-between p-6 lg:px-8">
  <div class="flex lg:flex-1">
    <a href="/" class="-m-1.5 p-1.5">
      <span class="sr-only">Your Company</span>
      <h1 class="text-white text-2xl font-bold">Inkspire</h1>
    </a>
    <a
      href="/customisation/1"
      class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition ml-4"
    >
      Go to Customisation (test)
    </a>
  </div>

  <div class="flex lg:hidden">
    <button
      type="button"
      command="show-modal"
      commandfor="mobile-menu"
      class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
    >
      <span class="sr-only">Open main menu</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        aria-hidden="true"
        class="size-6"
      >
        <path
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>

  <div class="hidden lg:flex lg:gap-x-12">
    <a href="/categories" class="text-sm/6 font-semibold text-white">Categories</a>
    <a href="/" class="text-sm/6 font-semibold text-white">Features</a>
    <a href="/" class="text-sm/6 font-semibold text-white">Marketplace</a>
    <a href="/" class="text-sm/6 font-semibold text-white">Company</a>
  </div>

  <div class="hidden lg:flex lg:flex-1 lg:justify-end">
    <a href="/login" class="text-sm/6 font-semibold text-white">
      Log in <span aria-hidden="true">&rarr;</span>
    </a>
  </div>
</nav>
