<script>
  import { onMount } from 'svelte';
  import { Star, Truck, Printer, Layers, Feather, ChevronDown } from '@lucide/svelte';
  import { productImages } from '../../categories/productImages.js';

  export let data;
  export let form = {};

  const product = data.product;
  const variants = data.variants || [];
  const isAuthenticated = data.isAuthenticated ?? false;
  const hasPurchased = data.hasPurchased ?? false;
  const ratings =
    data?.ratings ?? {
      overall_avg: null,
      shipping_avg: null,
      print_quality_avg: null,
      material_avg: null,
      comfort_avg: null,
      count: 0
    };
  let comments = data.comments || [];
  $: comments = data.comments || [];

  let selectedVariant = null;
  let selectedColor = '';
  let selectedSize = '';
  let showMore = false;

  const colors = Array.from(
    new Set(variants.map((v) => v.color).filter((v) => !!v))
  );
  const userRating = data?.userRating ?? null;
  const ratingCategories = [
    { key: 'overall', label: 'Overall' },
    { key: 'shipping', label: 'Shipping' },
    { key: 'print_quality', label: 'Print quality' },
    { key: 'material', label: 'Material' },
    { key: 'comfort', label: 'Comfort' }
  ];
  const starLevels = [1, 2, 3, 4, 5];
  const summaryCategories = ratingCategories.filter((cat) => cat.key !== 'overall');
  let draftRatings = {
    overall: userRating?.overall ?? null,
    shipping: userRating?.shipping ?? null,
    print_quality: userRating?.print_quality ?? null,
    material: userRating?.material ?? null,
    comfort: userRating?.comfort ?? null
  };
  const categoryIcons = {
    shipping: Truck,
    print_quality: Printer,
    material: Layers,
    comfort: Feather
  };
  const specSections = [
    {
      key: 'fabric',
      title: 'Fabric',
      summary: 'Soft, breathable cotton blend',
      detail:
        'A balanced cotton blend that keeps shape, resists pilling, and feels soft against skin for everyday wear.'
    },
    {
      key: 'fit',
      title: 'Fit',
      summary: 'Regular, true to size',
      detail:
        'Designed for a relaxed silhouette with room to layer. Most customers report it runs true to size.'
    },
    {
      key: 'weight',
      title: 'Weight',
      summary: 'Mid-weight comfort',
      detail:
        'Sturdy enough to feel premium yet breathable for daily use; ideal for layering across seasons.'
    }
  ];
  let specOpen = {
    fabric: false,
    fit: false,
    weight: false
  };
  let derivedOverallAvg = null;

  const colorImageFallbacks = productImages[product?.id]?.colors || {};

  function sizesFor(color) {
    return Array.from(
      new Set(
        variants.filter((v) => v.color === color && v.size).map((v) => v.size)
      )
    );
  }

  function chooseColor(c) {
    selectedColor = c;
    const firstMatch = variants.find((v) => v.color === c) || null;
    selectedVariant = firstMatch;
    selectedSize = firstMatch?.size || '';
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('selectedBaseColor', c);
      }
    } catch (err) {}
  }

  function chooseSize(s) {
    selectedSize = s;
    selectedVariant =
      variants.find((v) => v.color === selectedColor && v.size === s) || null;
  }

  function chooseVariant(variant) {
    selectedVariant = variant;
    selectedColor = variant?.color ?? selectedColor;
    selectedSize = variant?.size ?? selectedSize;
  }

  $: activeImage =
    selectedVariant?.image_url ||
    (selectedColor
      ? colorImageFallbacks[selectedColor?.toLowerCase?.()] ?? product.image_url
      : product.image_url);

  $: if (!selectedVariant && variants.length > 0) {
    const stored =
      typeof localStorage !== 'undefined'
        ? (() => {
            try {
              return localStorage.getItem('selectedBaseColor');
            } catch {
              return null;
            }
          })()
        : null;
    const initialColor =
      (stored && colors.includes(stored) && stored) || variants[0].color || '';
    const initialVariant =
      variants.find((v) => v.color === initialColor) || variants[0];
    selectedVariant = initialVariant;
    selectedColor = initialVariant?.color || initialColor;
    selectedSize = initialVariant?.size || '';
  }

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date);
  }

  function addToCart() {
    if (!selectedVariant) return;
    try {
      const chosenImage =
        selectedVariant.image_url ||
        (selectedColor
          ? colorImageFallbacks[selectedColor?.toLowerCase?.()]
          : null) ||
        product.image_url;

      const item = {
        product_id: product.id,
        variant_id: selectedVariant.id,
        name: product.name,
        color: selectedVariant.color ?? selectedColor,
        size: selectedVariant.size,
        price: selectedVariant.price ?? product.base_price,
        qty: 1,
        image_url: chosenImage
      };
      let cart = [];
      if (typeof localStorage !== 'undefined') {
        try {
          const raw = localStorage.getItem('cart');
          cart = raw ? JSON.parse(raw) : [];
        } catch (err) {
          cart = [];
        }
      }
      cart.push(item);
      if (typeof localStorage !== 'undefined') localStorage.setItem('cart', JSON.stringify(cart));

      const toast = document.createElement('div');
      toast.textContent = 'Product added to cart successfully';
      toast.className =
        'fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 toast-enter';
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('toast-leave');
      }, 1600);
      setTimeout(() => toast.remove(), 2200);
    } catch (e) {
      console.error(e);
    }
  }

  const shortDesc = (product?.description || '').slice(0, 160);

  onMount(() => {
    if (!selectedVariant && variants.length > 0) {
      const first = variants[0];
      selectedVariant = first;
      selectedColor = first.color || '';
      selectedSize = first.size || '';
    }
  });

  const formatRating = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) return '-';
    return num.toFixed(1);
  };

  $: {
    const values = summaryCategories
      .map((cat) => Number(ratings[`${cat.key}_avg`]))
      .filter((n) => Number.isFinite(n) && n > 0);
    derivedOverallAvg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
  }
</script>

{#if !product}
  <p class="text-center mt-20 text-gray-400 text-lg">Product not found.</p>
{:else}
  <!-- Outer container keeps nice margins and dark background -->
  <div class="relative isolate overflow-hidden bg-gray-900 text-gray-200 min-h-screen px-4 py-10 lg:px-8">
    <section class="max-w-7xl mx-auto relative">
      <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_1.4fr] gap-8 items-start">
        <!-- LEFT: big image + thumbnails -->
        <div>
          <div class="rounded-lg bg-gray-800/40 p-4">
            <img
              src={activeImage}
              alt={`${product.name} in ${selectedVariant?.color || selectedColor || 'selected color'}`}
              class="rounded-md shadow-lg w-full max-h-[650px] object-contain bg-white/5"
            />
          </div>

          {#if variants && variants.length > 0}
            <div class="mt-4 flex gap-3 flex-wrap">
              {#each variants as variant (variant.id)}
                {#if variant.image_url}
                  <button
                    type="button"
                    class="rounded-md border border-gray-700 hover:ring-2 hover:ring-[#6366F1] transition p-0 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                    on:click={() => chooseVariant(variant)}
                    aria-label={`Choose ${variant.color || ''} ${variant.size || ''}`}
                  >
                    <img
                      src={variant.image_url}
                      alt={`Thumbnail ${variant.color || ''} ${variant.size || ''}`}
                      class="w-20 h-20 object-cover rounded-md"
                    />
                  </button>
                {/if}
              {/each}
            </div>
          {/if}
        </div>

        <!-- MIDDLE: title, rating, description, price, color/size, actions -->
        <div class="space-y-5">
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <h1 class="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{product.name}</h1>
                <span class="inline-flex items-center gap-2 rounded-2xl px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-100 border border-emerald-400/40"
                  style="background: linear-gradient(135deg, rgba(34,197,94,0.35), rgba(16,185,129,0.2)); box-shadow: 0 8px 18px rgba(16,185,129,0.12);">
                  New Season Drop
                </span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1.5 text-amber-300">
                  {#each starLevels as level}
                    <Star
                      size="18"
                      class={level <= Math.round(derivedOverallAvg ?? 0) ? 'fill-amber-300 stroke-amber-300' : 'stroke-amber-300/70'}
                      aria-hidden="true"
                    />
                  {/each}
                </div>
                <div class="text-sm text-gray-400">{formatRating(derivedOverallAvg)} average</div>
                <div class="text-xs text-gray-500">({ratings.count || 0} ratings)</div>
              </div>
              <div class="text-2xl sm:text-3xl font-bold text-indigo-400">${selectedVariant?.price ?? product.base_price}</div>
            </div>
          </div>

          <!-- Short description -->
          {#if product.description}
            <p class="text-gray-300 leading-relaxed">
              {#if product.description.length > 160}
                {shortDesc}...
                <button
                  class="text-indigo-400 underline text-sm ml-2"
                  on:click={() => (showMore = !showMore)}
                >
                  {showMore ? 'Show less' : 'Read more'}
                </button>
              {:else}
                {product.description}
              {/if}
            </p>
          {/if}

          <!-- Ratings summary card + small icons (compact) -->
          <div class="w-full max-w-sm rounded-2xl border border-white/6 bg-gradient-to-br from-white/4 via-white/3 to-transparent px-5 py-4 shadow-sm space-y-3 backdrop-blur-sm">
            {#each summaryCategories as cat}
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2 text-gray-200">
                  {#if categoryIcons[cat.key]}
                    {@const Icon = categoryIcons[cat.key]}
                    <Icon size="16" class="text-indigo-300" />
                  {/if}
                  <span class="text-sm">{cat.label}</span>
                </div>
                <div class="flex items-center gap-1.5 text-amber-300">
                  {#each starLevels as level}
                    <Star
                      size="16"
                      class={level <= Math.round(ratings[`${cat.key}_avg`] ?? 0) ? 'fill-amber-300 stroke-amber-300' : 'stroke-amber-300/70'}
                      aria-hidden="true"
                    />
                  {/each}
                  <span class="ml-2 text-xs text-gray-400">{formatRating(ratings[`${cat.key}_avg`])}</span>
                </div>
              </div>
            {/each}
          </div>

          <!-- Variant selection -->
          {#if variants && variants.length > 0}
            <div class="space-y-3">
              <h3 class="text-md font-semibold text-indigo-300">Select Variant</h3>

              {#if colors.length > 0}
                <div class="flex items-center gap-3 flex-wrap">
                  {#each colors as c}
                    <button
                      type="button"
                      class={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition transform focus:outline-none ${
                        selectedColor === c ? 'border-indigo-500 ring-2 ring-indigo-400/30 scale-105' : 'border-gray-600'
                      }`}
                      style={`background-color: ${c?.toLowerCase?.() || 'transparent'}`}
                      title={c}
                      on:click={() => chooseColor(c)}
                      aria-pressed={selectedColor === c}
                      aria-label={`Choose color ${c}`}
                    ></button>
                  {/each}
                </div>
              {/if}

              {#if selectedColor}
                <div class="flex items-center gap-3 flex-wrap mt-2">
                  {#each sizesFor(selectedColor) as s}
                    <button
                      class={`px-4 py-2 rounded-md border text-sm font-medium transition ${
                        selectedSize === s
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
                      }`}
                      on:click={() => chooseSize(s)}
                      aria-pressed={selectedSize === s}
                    >
                      {s}
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}

          <!-- Actions -->
          <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              class="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-semibold shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400 transition disabled:opacity-60"
              disabled={!selectedVariant}
              on:click={addToCart}
            >
              Add to cart
            </button>

            <a
              href={selectedVariant
                ? `/customisation/${selectedVariant.id}?color=${selectedColor || selectedVariant.color || ''}`
                : undefined}
              class={`text-center py-3 rounded-lg font-semibold ${
                selectedVariant
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-gray-700 text-gray-300 cursor-not-allowed'
              }`}
              aria-disabled={!selectedVariant}
            >
              Start Designing
            </a>
          </div>

          {#if showMore && product.description}
            <div class="mt-4">
              <h3 class="text-lg font-semibold text-indigo-300 mb-2">Description</h3>
              <p class="text-gray-300 leading-relaxed">{product.description}</p>
            </div>
          {/if}
        </div>

      </div>

      <!-- SPECIFICATIONS horizontal strip -->
      <section class="max-w-7xl w-full mx-auto mt-8">
        <div class="grid gap-4 md:grid-cols-3">
          {#each specSections as spec}
            <button
              type="button"
              class="w-full text-left rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-lg shadow-black/30 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              on:click={() => (specOpen = { ...specOpen, [spec.key]: !specOpen[spec.key] })}
              aria-expanded={specOpen[spec.key]}
              aria-controls={`spec-panel-${spec.key}`}
            >
              <div class="flex items-center justify-between mb-2">
                <p class="text-lg font-semibold text-indigo-300">{spec.title}</p>
                <ChevronDown
                  size="18"
                  class={`${specOpen[spec.key] ? 'rotate-180 text-indigo-300' : 'text-gray-400'} transition-transform`}
                />
              </div>
              <p class="text-sm text-gray-400">{spec.summary}</p>
              {#if specOpen[spec.key]}
                <p
                  id={`spec-panel-${spec.key}`}
                  class="mt-3 text-sm text-gray-300 leading-relaxed"
                >
                  {spec.detail}
                </p>
              {/if}
            </button>
          {/each}
        </div>
      </section>

      <!-- RATINGS & COMMENTS area (below main section) -->
      <section class="max-w-7xl w-full mx-auto mt-12 space-y-6">
        <div class="grid gap-6 lg:grid-cols-[0.8fr_2.2fr] items-start">
          <div id="ratings" class="bg-gray-800/60 rounded-2xl border border-white/5 p-6 space-y-5 max-w-md">
            <div class="flex items-center justify-between gap-4">
              <h2 class="text-2xl font-semibold text-white whitespace-nowrap">Product ratings</h2>
              <span class="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/6 px-4 py-1 text-xs font-semibold text-emerald-300 whitespace-nowrap">
                Verified ratings
              </span>
              
            </div>
            <p class="text-gray-400 text-sm">Tap the stars to share your score.</p>

            {#if !isAuthenticated}
              <p class="text-sm text-gray-300">
                <a class="text-indigo-400 underline" href={`/login?next=/product/${product.id}#ratings`}>Log in</a> to rate this product.
              </p>
            {:else if !hasPurchased}
              <p class="text-sm text-gray-300">
                Only verified buyers can rate this product.
              </p>
            {:else}
              <form method="POST" action="?/rate" class="space-y-4">
                {#each ratingCategories as cat}
                  <div class="space-y-1">
                    <p class="text-sm text-gray-300">{cat.label}</p>
                    <div class="flex items-center gap-2.5" aria-label={`${cat.label} rating`}>
                      {#each starLevels as level}
                        <label class="flex items-center gap-1 text-sm text-gray-200 cursor-pointer select-none">
                          <input
                            type="radio"
                            name={cat.key}
                            value={level}
                            required
                            checked={draftRatings[cat.key] === level}
                            on:change={() => (draftRatings = { ...draftRatings, [cat.key]: level })}
                            class="hidden"
                          />
                          <Star
                            size="20"
                            class={`pointer-events-none ${level <= (draftRatings[cat.key] ?? 0) ? 'fill-amber-300 stroke-amber-300' : 'stroke-amber-300/70'}`}
                          />
                        </label>
                      {/each}
                    </div>
                  </div>
                {/each}

                <button
                  type="submit"
                  class="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                >
                  {userRating ? 'Update rating' : 'Submit rating'}
                </button>

                {#if form?.ratingError}
                  <p class="text-sm text-rose-300">{form.ratingError}</p>
                {/if}
              </form>
            {/if}
          </div>

          <div class="space-y-5 flex flex-col">
            <div class="bg-gray-800/60 rounded-2xl border border-white/5 p-6 flex flex-col">
              <div class="flex flex-col gap-2 mb-6">
                <h2 class="text-2xl font-semibold text-white">Community thoughts</h2>
                <p class="text-gray-400">
                  Share what you like (or would improve) about this product so others can decide faster.
                </p>
              </div>

              <form method="POST" action="?/comment" class="space-y-4" aria-label="Leave a comment">
                {#if !isAuthenticated}
                  <div>
                    <label class="block text-sm text-gray-300 mb-1" for="author_name">Name</label>
                    <input
                      id="author_name"
                      name="author_name"
                      type="text"
                      placeholder="Jane Doe"
                      required
                      class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                    />
                  </div>
                {:else}
                  <p class="text-sm text-gray-400">Commenting as <span class="text-white font-medium">{data?.user?.full_name ?? 'Inkspire user'}</span></p>
                {/if}

                <div>
                  <label class="block text-sm text-gray-300 mb-1" for="comment">Your comment</label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows="4"
                    minlength="5"
                    placeholder="Tell everyone what stood out to you..."
                    required
                    class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                  ></textarea>
                </div>

                <div class="flex flex-col gap-2">
                  <button
                    type="submit"
                    class="self-start rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                  >
                    Post comment
                  </button>

                  {#if form?.success}
                    <p class="text-sm text-emerald-300">{form.success}</p>
                  {:else if form?.error}
                    <p class="text-sm text-rose-300">{form.error}</p>
                  {/if}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="space-y-4 w-full max-w-none">
          <h3 class="text-xl font-semibold text-white">What people already said</h3>
          {#if comments.length === 0}
            <p class="text-gray-400 text-sm">No comments yet. Be the first to leave your impressions.</p>
          {:else}
            <ul class="space-y-4 w-full">
              {#each comments as comment (comment.id)}
                <li class="w-full rounded-2xl border border-white/5 bg-gray-800/60 p-4">
                  <div class="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <span class="font-medium text-white">
                      {comment.registered_name || comment.author_name}
                    </span>
                    <span>{formatDate(comment.created_at)}</span>
                  </div>
                  <p class="text-gray-200 leading-relaxed">{comment.comment}</p>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      </section>
    </section>

    <!-- Toast animations -->
    <style>
      .toast-enter {
        opacity: 0;
        transform: translate(-50%, -20px) scale(0.95);
        animation: toastIn 0.35s ease forwards;
      }

      .toast-leave {
        animation: toastOut 0.45s ease forwards;
      }

      @keyframes toastIn {
        0% {
          opacity: 0;
          transform: translate(-50%, -20px) scale(0.95);
        }
        100% {
          opacity: 1;
          transform: translate(-50%, 0) scale(1);
        }
      }

      @keyframes toastOut {
        0% {
          opacity: 1;
          transform: translate(-50%, 0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translate(-50%, -15px) scale(0.95);
        }
      }
    </style>
  </div>
{/if}
