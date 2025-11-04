<script>
  export let data;
  let message = '';
</script>

<section class="relative min-h-screen bg-gradient-to-b from-[#141b33] via-[#10182c] to-[#0c1124] text-white px-6 py-16 overflow-hidden">
  <div class="absolute -top-40 left-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-700/20 blur-3xl -translate-x-1/2"></div>

  <div class="relative z-10 max-w-lg mx-auto">
    <h1 class="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">
      My profile
    </h1>

    <form
      method="POST"
      action="?/update"
      class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 space-y-5"
    >
      <!-- Email -->
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-sm font-semibold text-gray-300 mb-1">E-Mail</label>
        <input
          type="email"
          name="email"
          value={data.user.email}
          readonly
          class="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
        />
      </div>

      <!-- Full Name -->
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-sm font-semibold text-gray-300 mb-1">Full name</label>
        <input
          type="text"
          name="full_name"
          value={data.user.full_name}
          class="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
        />
      </div>

      <!-- Password -->
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-sm font-semibold text-gray-300 mb-1">New password (optional)</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          class="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
        />
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200"
      >
        Update profile
      </button>

      {#if message}
        <p class="text-center text-green-400 font-medium mt-3">{message}</p>
      {/if}
    </form>
  </div>
</section>
  