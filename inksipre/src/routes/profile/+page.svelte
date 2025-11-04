<script>
  let { data } = $props();

  let message = $state('');

  let lang = $state('de');

  const translations = {
    de: {
      title: 'Mein Profil',
      email: 'E-Mail',
      name: 'Vollständiger Name',
      password: 'Neues Passwort (optional)',
      update: 'Profil aktualisieren',
      success: 'Profil wurde erfolgreich aktualisiert!'
    },
    en: {
      title: 'My Profile',
      email: 'Email',
      name: 'Full Name',
      password: 'New Password (optional)',
      update: 'Update Profile',
      success: 'Profile updated successfully!'
    }
  };

  const t = (key) => translations[lang][key];
</script>


<section class="relative min-h-screen bg-gradient-to-b from-[#141b33] via-[#10182c] to-[#0c1124] text-white px-6 py-16 overflow-hidden">
  <div class="absolute -top-40 left-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-700/20 blur-3xl -translate-x-1/2"></div>

  <!-- Sprachumschalter -->
  <div class="absolute top-6 right-6 z-20 flex gap-2">
    <button
      onclick={() => (lang = 'de')}
      class="px-3 py-1 rounded-lg text-sm font-semibold border border-white/10 bg-white/10 hover:bg-white/20 transition"
      class:bg-blue-600={lang === 'de'}
    >
      DE
    </button>
    <button
      onclick={() => (lang = 'en')}
      class="px-3 py-1 rounded-lg text-sm font-semibold border border-white/10 bg-white/10 hover:bg-white/20 transition"
      class:bg-blue-600={lang === 'en'}
    >
      EN
    </button>
  </div>

  <div class="relative z-10 max-w-lg mx-auto">
    <h1 class="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">
      {t('title')}
    </h1>

    <form
      method="POST"
      action="?/update"
      class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 space-y-5"
    >
      <!-- E-Mail -->
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-sm font-semibold text-gray-300 mb-1">{t('email')}</label>
        <input
          type="email"
          name="email"
          value={data.user.email}
          readonly
          class="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
        />
      </div>

      <!-- Name -->
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-sm font-semibold text-gray-300 mb-1">{t('name')}</label>
        <input
          type="text"
          name="full_name"
          value={data.user.full_name}
          class="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
        />
      </div>

      <!-- Passwort -->
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-sm font-semibold text-gray-300 mb-1">{t('password')}</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          class="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
        />
      </div>

      <!-- Button -->
      <button
        type="submit"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200"
      >
        {t('update')}
      </button>

      {#if message}
        <p class="text-center text-green-400 font-medium mt-3">{t('success')}</p>
      {/if}
    </form>
  </div>
</section>
