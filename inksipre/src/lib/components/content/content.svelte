<script>
  import * as m from '$lib/paraglide/messages/_index.js';
</script>

<div id="mockups" class="relative isolate overflow-hidden bg-gray-900 px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
  <div class="absolute inset-0 -z-10 overflow-hidden">
    <svg aria-hidden="true" class="absolute top-0 left-[max(50%,25rem)] h-256 w-512 -translate-x-1/2 mask-[radial-gradient(64rem_64rem_at_top,white,transparent)] stroke-gray-800">
      <defs>
        <pattern id="mockup-pattern" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
          <path d="M100 200V.5M.5 .5H200" fill="none" />
        </pattern>
      </defs>
      <svg x="50%" y="-1" class="overflow-visible fill-gray-800/50">
        <path d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z" stroke-width="0" />
      </svg>
      <rect width="100%" height="100%" fill="url(#mockup-pattern)" stroke-width="0" />
    </svg>
  </div>

  <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
    <!-- Hero Text -->
    <div class="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
      <div class="lg:pr-4">
        <div class="lg:max-w-lg">
          <p class="text-base/7 font-semibold text-indigo-400">{m.content_banner_small()}</p>
          <h1 class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">{m.content_title()}</h1>
          <p class="mt-6 text-xl/8 text-gray-300">{m.content_intro()}</p>
        </div>
      </div>
    </div>

    <!-- Video Preview -->
    <div class="-mt-12 -ml-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
      <video
        class="w-full max-w-2xl max-h-140 rounded-xl bg-gray-800 shadow-xl ring-1 ring-white/10 object-cover"
        src="/videos/mockup-demo.mp4"
        autoplay
        muted
        loop
        playsinline
        controls
        poster="/videos/mockup-poster.jpg"
      >
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- Features -->
    <div class="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
      <div class="lg:pr-4">
        <div class="max-w-xl text-base/7 text-gray-400 lg:max-w-lg">
          <p>{m.content_paragraph2()}</p>

          <ul role="list" class="mt-8 space-y-8 text-gray-400">
            <li class="flex gap-x-3">
              <svg viewBox="0 0 20 20" fill="currentColor" class="mt-1 size-5 flex-none text-indigo-400">
                <path d="M5.5 17a4.5 4.5 0 0 1-1.44-8.765 4.5 4.5 0 0 1 8.302-3.046 3.5 3.5 0 0 1 4.504 4.272A4 4 0 0 1 15 17H5.5Z" />
              </svg>
              <span><strong class="font-semibold text-white">{m.content_feature_instant_title()}</strong> {m.content_feature_instant_desc()}</span>
            </li>
            <li class="flex gap-x-3">
              <svg viewBox="0 0 20 20" fill="currentColor" class="mt-1 size-5 flex-none text-indigo-400">
                <path d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Z" />
              </svg>
              <span><strong class="font-semibold text-white">{m.content_feature_cloud_title()}</strong> {m.content_feature_cloud_desc()}</span>
            </li>
            <li class="flex gap-x-3">
              <svg viewBox="0 0 20 20" fill="currentColor" class="mt-1 size-5 flex-none text-indigo-400">
                <path d="M4 13a2 2 0 1 0 0 4h12a2 2 0 1 0 0-4H4Z" />
              </svg>
              <span><strong class="font-semibold text-white">{m.content_feature_lighting_title()}</strong> {m.content_feature_lighting_desc()}</span>
            </li>
          </ul>
          
          <h2 class="mt-16 text-2xl font-bold tracking-tight text-white">{m.content_web_tools_title()}</h2>
          <p class="mt-6">{m.content_web_tools_paragraph()}</p>
        </div>
      </div>
    </div>
  </div>
</div>
