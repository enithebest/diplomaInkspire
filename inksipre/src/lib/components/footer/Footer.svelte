<script>
  import { Mail, MapPin, Phone, Facebook, Instagram, Twitter } from '@lucide/svelte';
</script>

<footer class="bg-gray-900 text-gray-300">
  <!-- Top -->
  <div class="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
    <!-- Brand -->
    <div>
      <a href="/" class="text-white text-2xl font-bold tracking-tight">Inkspire</a>
      <p class="mt-3 text-sm text-gray-400">
        Customize quality apparel and merch with fast turnaround and premium prints.
      </p>
      <div class="flex gap-3 mt-5">
        <a href="https://twitter.com/" rel="noopener noreferrer" target="_blank" aria-label="Inkspire on Twitter" class="rounded-full p-2 bg-white/5 hover:bg-white/10 transition">
          <Twitter size="18" />
        </a>
        <a href="https://facebook.com/" rel="noopener noreferrer" target="_blank" aria-label="Inkspire on Facebook" class="rounded-full p-2 bg-white/5 hover:bg-white/10 transition">
          <Facebook size="18" />
        </a>
        <a href="https://instagram.com/" rel="noopener noreferrer" target="_blank" aria-label="Inkspire on Instagram" class="rounded-full p-2 bg-white/5 hover:bg-white/10 transition">
          <Instagram size="18" />
        </a>
      </div>
    </div>

    <!-- Shop -->
    <div>
      <h3 class="text-white font-semibold">Shop</h3>
      <ul class="mt-4 space-y-2 text-sm">
        <li><a class="hover:text-white" href="/categories">All Categories</a></li>
        <li><a class="hover:text-white" href="/cart">Cart</a></li>
        <li><a class="hover:text-white" href="/orders">Orders</a></li>
        <li><a class="hover:text-white" href="/profile">Profile</a></li>
      </ul>
    </div>

    <!-- Company -->
    <div>
      <h3 class="text-white font-semibold">Company</h3>
      <ul class="mt-4 space-y-2 text-sm">
        <li><a class="hover:text-white" href="/contact">Contact</a></li>
        <li><a class="hover:text-white" href="/about">About</a></li>
        <li><a class="hover:text-white" href="/careers">Careers</a></li>
        <li><a class="hover:text-white" href="/press">Press</a></li>
      </ul>
    </div>

    <!-- Newsletter / Contact -->
    <div>
      <h3 class="text-white font-semibold">Stay in the loop</h3>
      <p class="mt-3 text-sm text-gray-400">Get product updates and special offers.</p>
      <form class="mt-4" on:submit|preventDefault>
        <label for="newsletter-email" class="sr-only">Email address</label>
        <div class="flex gap-2">
          <input
            id="newsletter-email"
            type="email"
            placeholder="you@example.com"
            class="flex-1 rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button type="submit" class="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            Subscribe
          </button>
        </div>
      </form>

      <ul class="mt-6 space-y-2 text-sm">
        <li class="flex items-center gap-2"><Phone size="16" /> <a href="tel:+10000000000" class="hover:text-white">+1 (000) 000-0000</a></li>
        <li class="flex items-center gap-2"><Mail size="16" /> <a href="mailto:support@inkspire.example" class="hover:text-white">support@inkspire.example</a></li>
        <li class="flex items-center gap-2"><MapPin size="16" /> <span>Vienna, AT</span></li>
      </ul>
    </div>
  </div>

  <!-- Bottom -->
  <div class="border-t border-white/10">
    <div class="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
      <p class="text-gray-400">© {new Date().getFullYear()} Inkspire. All rights reserved.</p>
      <div class="flex gap-4">
        <a href="/privacy" class="hover:text-white">Privacy</a>
        <a href="/terms" class="hover:text-white">Terms</a>
        <a href="/cookies" class="hover:text-white">Cookies</a>
      </div>
    </div>
  </div>
</footer>

