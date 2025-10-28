<script>
  import { enhance } from '$app/forms';
  import Warning from '$lib/components/Warning.svelte';
  let form;
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-900 p-4">
  <div class="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-8">
    
    <!-- Header -->
    <div class="text-center mb-8">
      <i class="fas fa-user-cog text-4xl text-blue-500 mb-2 inline-block"></i>
      <h1 class="text-2xl font-semibold text-white">Login</h1>
      <p class="text-gray-400 text-sm">Secure access to your account</p>
    </div>

    <!-- Login Form -->
    <form method="POST" action="?/login" use:enhance class="space-y-6">
      
      <!-- Email -->
      <div>
        <label for="email" class="block text-gray-400 font-medium mb-1">Email address</label>
        <div class="relative">
          <i class="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="email" name="email" id="email"
            required
            placeholder="you@example.com"
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="block text-gray-400 font-medium mb-1">Password</label>
        <div class="relative">
          <i class="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="password" name="password" id="password"
            required
            placeholder="••••••••"
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
      >
        <i class="fas fa-sign-in-alt"></i>
        Log in
      </button>

      <!-- Server Error -->
      {#if form?.message}
        <Warning message={form.message} />
      {/if}

      <!-- Footer -->
      <p class="text-gray-400 text-sm text-center">
        Don't have an account? 
        <a href="/register" class="text-blue-500 font-medium hover:text-blue-400">Register here</a>
      </p>
    </form>
  </div>
</div>
