<script>
  import { Clock, Mail, MapPin, Phone, ShieldCheck, Globe, RefreshCw } from '@lucide/svelte';
  import * as m from '$lib/paraglide/messages/_index.js';

  const values = [
    { title: m.about_value1_title, desc: m.about_value1_desc },
    { title: m.about_value2_title, desc: m.about_value2_desc },
    { title: m.about_value3_title, desc: m.about_value3_desc }
  ];

  const shippingWindows = [
    { region: m.about_shipping_window_de_at, window: m.about_shipping_window_de_at_value },
    { region: m.about_shipping_window_eu, window: m.about_shipping_window_eu_value },
    { region: m.about_shipping_window_world, window: m.about_shipping_window_world_value }
  ];

  const shippingCosts = [
    { label: m.about_shipping_cost_free, detail: m.about_shipping_cost_free_detail },
    { label: m.about_shipping_cost_domestic, detail: m.about_shipping_cost_domestic_detail },
    { label: m.about_shipping_cost_eu, detail: m.about_shipping_cost_eu_detail },
    { label: m.about_shipping_cost_intl, detail: m.about_shipping_cost_intl_detail }
  ];

  const returnRules = [m.about_return_rule1, m.about_return_rule2, m.about_return_rule3];
  const privacyPoints = [m.about_privacy_point1, m.about_privacy_point2, m.about_privacy_point3];
  const tosPoints = [
    m.about_tos_point1,
    m.about_tos_point2,
    m.about_tos_point3,
    m.about_tos_point4,
    m.about_tos_point5
  ];
</script>

<svelte:head>
  <title>{m.about_page_title()}</title>
  <meta name="description" content={m.about_meta_description()} />
</svelte:head>

<section class="relative isolate overflow-hidden bg-gradient-to-b from-[#0a0b1a] via-[#0d122b] to-[#0a0b1a] text-white px-6 py-16 sm:px-8 lg:px-12">
  <div class="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.16),transparent_45%)]"></div>
  <div class="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl"></div>

  <div class="relative z-10 mx-auto flex max-w-6xl flex-col gap-12">
    <header class="space-y-6">
      <div class="flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">{m.about_badge()}</span>
        <span class="inline-flex items-center gap-2 rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-100">
          <MapPin size="16" /> {m.about_badge_location()}
        </span>
      </div>

      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="space-y-3 lg:max-w-3xl">
          <h1 class="text-4xl font-bold leading-tight sm:text-5xl">{m.about_hero_title()}</h1>
          <p class="text-lg text-gray-200">{m.about_hero_subtitle()}</p>
        </div>
        <div class="min-w-[240px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg shadow-indigo-500/10">
          <div class="flex items-center gap-2 text-sm font-semibold text-indigo-100">
            <Clock size="16" />
            {m.about_last_updated_label()}
          </div>
          <p class="mt-1 text-base text-white">{m.about_last_updated_value()}</p>
          <p class="text-sm text-gray-300">{m.about_address_value()}</p>
        </div>
      </div>

      <div class="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-indigo-500/10 sm:grid-cols-2 lg:grid-cols-4">
        <div class="flex items-start gap-3">
          <div class="rounded-xl bg-indigo-500/15 p-2 text-indigo-200">
            <MapPin size="18" />
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-gray-300">{m.about_address_label()}</p>
            <p class="text-sm font-semibold text-white" style="white-space: pre-line">{m.about_address_value()}</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="rounded-xl bg-indigo-500/15 p-2 text-indigo-200">
            <Mail size="18" />
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-gray-300">{m.about_email_label()}</p>
            <a href="mailto:support@inkspire.studio" class="text-sm font-semibold text-white hover:text-indigo-200">{m.about_email_value()}</a>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="rounded-xl bg-indigo-500/15 p-2 text-indigo-200">
            <Phone size="18" />
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-gray-300">{m.about_phone_label()}</p>
            <a href="tel:+49-341-000000" class="text-sm font-semibold text-white hover:text-indigo-200">{m.about_phone_value()}</a>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="rounded-xl bg-indigo-500/15 p-2 text-indigo-200">
            <Clock size="18" />
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-gray-300">{m.about_hours_label()}</p>
            <p class="text-sm font-semibold text-white">{m.about_hours_value()}</p>
          </div>
        </div>
      </div>
    </header>

    <section class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div class="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-indigo-500/10">
        <div class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">
          <ShieldCheck size="16" />
          {m.about_mission_heading()}
        </div>
        <p class="text-lg text-gray-100">{m.about_mission_intro()}</p>
        <div class="grid gap-3 sm:grid-cols-3">
          {#each values as item}
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-sm font-semibold text-white">{item.title()}</p>
              <p class="mt-1 text-sm text-gray-300">{item.desc()}</p>
            </div>
          {/each}
        </div>
      </div>

      <div class="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-indigo-500/10">
        <div class="flex items-center justify-between gap-3">
          <div class="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">{m.about_team_heading()}</div>
          <span class="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-200">{m.about_team_chip()}</span>
        </div>
        <p class="text-sm text-gray-200">{m.about_team_body()}</p>
        <div class="relative overflow-hidden rounded-2xl border border-dashed border-white/20 bg-gradient-to-br from-white/5 via-indigo-500/5 to-white/5 p-5">
          <div class="grid gap-4 sm:grid-cols-[1.2fr_0.8fr] sm:items-center">
            <div class="flex h-full flex-col justify-center gap-2">
              <p class="text-base font-semibold text-white">{m.about_team_quote()}</p>
              <p class="text-sm text-gray-300">{m.about_team_note()}</p>
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
          {m.about_shipping_heading()}
        </div>
        <div class="flex flex-wrap gap-2">
          <span class="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-100">{m.about_shipping_badge_dhl()}</span>
          <span class="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-100">{m.about_shipping_badge_ups()}</span>
          <span class="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-200">{m.about_shipping_badge_handling()}</span>
        </div>
        <div class="grid gap-3 sm:grid-cols-3">
          {#each shippingWindows as lane}
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-sm font-semibold text-white">{lane.region()}</p>
              <p class="text-sm text-gray-300">{lane.window()}</p>
            </div>
          {/each}
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          {#each shippingCosts as cost}
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-sm font-semibold text-white">{cost.label()}</p>
              <p class="text-sm text-gray-300">{cost.detail()}</p>
            </div>
          {/each}
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-200">
          {m.about_shipping_customs()}
        </div>
      </div>

      <div class="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-indigo-500/10">
        <div class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">
          <RefreshCw size="16" />
          {m.about_returns_heading()}
        </div>
        <ul class="space-y-2 text-sm text-gray-200">
          {#each returnRules as rule}
            <li class="flex gap-2">
              <span class="mt-1 h-2 w-2 rounded-full bg-indigo-300"></span>
              <span>{rule()}</span>
            </li>
          {/each}
        </ul>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-100">
          {m.about_return_start()}
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-200">
          {m.about_return_refund()}
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-indigo-500/10">
        <div class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">
          <ShieldCheck size="16" />
          {m.about_privacy_heading()}
        </div>
        <ul class="space-y-2 text-sm text-gray-200">
          {#each privacyPoints as item}
            <li class="flex gap-2">
              <span class="mt-1 h-2 w-2 rounded-full bg-indigo-300"></span>
              <span>{item()}</span>
            </li>
          {/each}
        </ul>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-100">
          {m.about_cookie_notice()}
        </div>
      </div>

      <div class="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-indigo-500/10">
        <div class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">
          <Globe size="16" />
          {m.about_tos_heading()}
        </div>
        <ul class="space-y-2 text-sm text-gray-200">
          {#each tosPoints as item}
            <li class="flex gap-2">
              <span class="mt-1 h-2 w-2 rounded-full bg-indigo-300"></span>
              <span>{item()}</span>
            </li>
          {/each}
        </ul>
      </div>
    </section>
  </div>
</section>
