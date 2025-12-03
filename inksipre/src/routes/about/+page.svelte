<script>
  import { Clock, Mail, MapPin, Phone, ShieldCheck, Globe, RefreshCw } from '@lucide/svelte';

  const lastUpdated = 'December 02, 2025';

  const values = [
    { title: 'Limited drops', desc: 'Small, intentional batches that keep every release special.' },
    { title: 'Responsible sourcing', desc: 'Trusted mills, fair partners, and planet-first dyes.' },
    { title: 'Radical transparency', desc: 'Materials, lead times, and pricing spelled out up front.' }
  ];

  const shippingWindows = [
    { region: 'DE / AT', window: '2–4 business days' },
    { region: 'Rest of EU', window: '4–6 business days' },
    { region: 'North America / APAC', window: '7–12 business days' }
  ];

  const shippingCosts = [
    { label: 'Free shipping', detail: 'Orders over €120 within Germany' },
    { label: 'Domestic', detail: '€5 anywhere in DE' },
    { label: 'EU', detail: '€12 across the EU' },
    { label: 'International', detail: '€18–25 worldwide' }
  ];

  const returnRules = [
    '30-day window from delivery; items must be unused and unwashed.',
    'Customs/custom-made items and final sale pieces are excluded unless defective.',
    'For EU customers we provide a prepaid DHL label; all other regions cover return shipping.'
  ];

  const privacyPoints = [
    'What we collect: account + order details, payment status, and support history. Optional analytics/ads only after you say yes.',
    'Why and how long: accounting + tax records for 5 years; analytics for up to 18 months.',
    'Your rights: request a copy, correct or delete data, and withdraw consent anytime. Reach our DPO at privacy@inkspire.studio.'
  ];

  const tosPoints = [
    'Use of site: no scraping, automated misuse, or harmful activity.',
    'Orders: occasional pricing corrections may occur; VAT is included where applicable.',
    'Intellectual property: all designs, artwork, and content belong to Inkspire.',
    'Liability: we limit liability to the maximum extent permitted by law.',
    'Governing law: German law applies; courts of Leipzig, Germany have jurisdiction.'
  ];
</script>

<svelte:head>
  <title>About Inkspire | Story, Shipping, and Policies</title>
  <meta name="description" content="Learn about Inkspire: our mission, team snapshot, shipping timelines, returns, privacy, cookies, and terms of service." />
</svelte:head>

<section class="relative isolate overflow-hidden bg-gradient-to-b from-[#0a0b1a] via-[#0d122b] to-[#0a0b1a] text-white px-6 py-16 sm:px-8 lg:px-12">
  <div class="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.16),transparent_45%)]"></div>
  <div class="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl"></div>

  <div class="relative z-10 mx-auto flex max-w-6xl flex-col gap-12">
    <header class="space-y-6">
      <div class="flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">About Inkspire</span>
        <span class="inline-flex items-center gap-2 rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-100">
          <MapPin size="16" /> Leipzig studio, shipping worldwide
        </span>
      </div>

      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="space-y-3 lg:max-w-3xl">
          <h1 class="text-4xl font-bold leading-tight sm:text-5xl">Inkspire makes limited-edition streetwear that feels crafted, not mass-made.</h1>
          <p class="text-lg text-gray-200">We blend tactile fabrics, precise prints, and responsive manufacturing so every drop feels personal—from Leipzig to your doorstep.</p>
        </div>
        <div class="min-w-[240px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg shadow-indigo-500/10">
          <div class="flex items-center gap-2 text-sm font-semibold text-indigo-100">
            <Clock size="16" />
            Last updated
          </div>
          <p class="mt-1 text-base text-white">{lastUpdated}</p>
          <p class="text-sm text-gray-300">Inkspire Studio, Karl-Liebknecht-Str. 12, 04107 Leipzig</p>
        </div>
      </div>

      <div class="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-indigo-500/10 sm:grid-cols-2 lg:grid-cols-4">
        <div class="flex items-start gap-3">
          <div class="rounded-xl bg-indigo-500/15 p-2 text-indigo-200">
            <MapPin size="18" />
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-gray-300">Studio</p>
            <p class="text-sm font-semibold text-white">Karl-Liebknecht-Str. 12<br />04107 Leipzig, Germany</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="rounded-xl bg-indigo-500/15 p-2 text-indigo-200">
            <Mail size="18" />
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-gray-300">Support email</p>
            <a href="mailto:support@inkspire.studio" class="text-sm font-semibold text-white hover:text-indigo-200">support@inkspire.studio</a>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="rounded-xl bg-indigo-500/15 p-2 text-indigo-200">
            <Phone size="18" />
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-gray-300">Phone</p>
            <a href="tel:+49-341-000000" class="text-sm font-semibold text-white hover:text-indigo-200">+49 341 000000</a>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="rounded-xl bg-indigo-500/15 p-2 text-indigo-200">
            <Clock size="18" />
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-gray-300">Support hours</p>
            <p class="text-sm font-semibold text-white">Mon–Fri, 9:00–18:00 CET</p>
          </div>
        </div>
      </div>
    </header>

    <section class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div class="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-indigo-500/10">
        <div class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">
          <ShieldCheck size="16" />
          Mission & values
        </div>
        <p class="text-lg text-gray-100">Inkspire exists to bring elevated streetwear to life through small-batch drops, honest sourcing, and storytelling you can feel. We collaborate closely with artists and printers to keep every release transparent and traceable.</p>
        <div class="grid gap-3 sm:grid-cols-3">
          {#each values as item}
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-sm font-semibold text-white">{item.title}</p>
              <p class="mt-1 text-sm text-gray-300">{item.desc}</p>
            </div>
          {/each}
        </div>
      </div>

      <div class="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-indigo-500/10">
        <div class="flex items-center justify-between gap-3">
          <div class="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">Team snapshot</div>
          <span class="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-200">Founder note ready</span>
        </div>
        <p class="text-sm text-gray-200">Drop in a team photo or a short founder message to show the faces behind the presses. Keep it raw, keep it human.</p>
        <div class="relative overflow-hidden rounded-2xl border border-dashed border-white/20 bg-gradient-to-br from-white/5 via-indigo-500/5 to-white/5 p-5">
          <div class="grid gap-4 sm:grid-cols-[1.2fr_0.8fr] sm:items-center">
            <div class="flex h-full flex-col justify-center gap-2">
              <p class="text-base font-semibold text-white">“Every garment should tell you who made it and why it matters.”</p>
              <p class="text-sm text-gray-300">Add your founder blurb or a quick audio/video clip reference here.</p>
            </div>
            <div class="flex h-36 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm text-gray-300 sm:h-40">
              Drop photo / clip placeholder
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div class="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-indigo-500/10">
        <div class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">
          <Globe size="16" />
          Shipping
        </div>
        <div class="flex flex-wrap gap-2">
          <span class="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-100">DHL Paket (EU)</span>
          <span class="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-100">UPS Worldwide (international)</span>
          <span class="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-200">Handling time: 1–2 days</span>
        </div>
        <div class="grid gap-3 sm:grid-cols-3">
          {#each shippingWindows as lane}
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-sm font-semibold text-white">{lane.region}</p>
              <p class="text-sm text-gray-300">{lane.window}</p>
            </div>
          {/each}
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          {#each shippingCosts as cost}
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-sm font-semibold text-white">{cost.label}</p>
              <p class="text-sm text-gray-300">{cost.detail}</p>
            </div>
          {/each}
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-200">
          Customs and import duties are paid by the recipient. Tracking emails are sent automatically the moment a label is printed.
        </div>
      </div>

      <div class="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-indigo-500/10">
        <div class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">
          <RefreshCw size="16" />
          Returns & refunds
        </div>
        <ul class="space-y-2 text-sm text-gray-200">
          {#each returnRules as rule}
            <li class="flex gap-2">
              <span class="mt-1 h-2 w-2 rounded-full bg-indigo-300"></span>
              <span>{rule}</span>
            </li>
          {/each}
        </ul>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-100">
          To start a return, email <a class="font-semibold text-indigo-100 hover:text-white" href="mailto:returns@inkspire.studio">returns@inkspire.studio</a> with your order number. EU customers receive a prepaid DHL label; other regions can choose their preferred carrier.
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-200">
          Refunds are issued within 5 business days after inspection. We can also arrange exchanges or repairs when stock and construction allow.
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-indigo-500/10">
        <div class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">
          <ShieldCheck size="16" />
          Privacy & cookies
        </div>
        <ul class="space-y-2 text-sm text-gray-200">
          {#each privacyPoints as item}
            <li class="flex gap-2">
              <span class="mt-1 h-2 w-2 rounded-full bg-indigo-300"></span>
              <span>{item}</span>
            </li>
          {/each}
        </ul>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-100">
          Cookie notice: we use essential cookies for cart, checkout, and authentication. Analytics and advertising cookies stay off until you opt in, and you can change that choice anytime.
        </div>
      </div>

      <div class="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-indigo-500/10">
        <div class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">
          <Globe size="16" />
          Terms of service
        </div>
        <ul class="space-y-2 text-sm text-gray-200">
          {#each tosPoints as item}
            <li class="flex gap-2">
              <span class="mt-1 h-2 w-2 rounded-full bg-indigo-300"></span>
              <span>{item}</span>
            </li>
          {/each}
        </ul>
      </div>
    </section>
  </div>
</section>
