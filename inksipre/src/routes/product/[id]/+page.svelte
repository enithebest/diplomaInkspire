<script>
  import { onMount } from 'svelte';
  import { productImages } from '../../categories/productImages.js';

  export let data;
  export let form = {};

  const product = data.product;
  const variants = data.variants || [];
  const isAuthenticated = data.isAuthenticated ?? false;
  let comments = data.comments || [];
  $: comments = data.comments || [];

  let selectedVariant = null;
  let selectedColor = '';
  let selectedSize = '';
  let showMore = false;

  const colors = Array.from(
    new Set(variants.map((v) => v.color).filter((v) => !!v))
  );

  const colorImageFallbacks = productImages[product.id]?.colors || {};

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
        'fixed top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 toast-enter';
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
</script>

{#if !product}
  <p class="text-center mt-20 text-gray-400 text-lg">Product not found.</p>
{:else}
  <div class="relative isolate overflow-hidden bg-gray-900 text-gray-200 min-h-screen px-6 py-12 lg:px-12">
  <section class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
    <div>
      <img
        src={activeImage}
        alt={`${product.name} in ${selectedVariant?.color || selectedColor || 'selected color'}`}
        class="rounded-lg shadow-lg w-full max-h-[500px] object-cover"
      />

      {#if variants && variants.length > 0}
        <div class="flex gap-3 mt-4 flex-wrap justify-center">
          {#each variants as variant}
            {#if variant.image_url}
              <button
                type="button"
                class="rounded-md border border-gray-700 hover:ring-2 hover:ring-[#6366F1] transition p-0"
                on:click={() => chooseVariant(variant)}
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

    <div class="space-y-5">
      <h1 class="text-4xl font-bold text-white">{product.name}</h1>

      {#if product.description}
        <p class="text-gray-300 leading-relaxed">
          {#if product.description.length > 160}
            {shortDesc}...
            <button
              class="text-indigo-400 underline text-sm"
              on:click={() => (showMore = !showMore)}
            >
              {showMore ? 'Show less' : 'Read more'}
            </button>
          {:else}
            {product.description}
          {/if}
        </p>
      {/if}

      <p class="text-2xl font-semibold text-indigo-400">
        ${selectedVariant?.price ?? product.base_price}
      </p>

      {#if variants && variants.length > 0}
        <div class="mt-6 space-y-4">
          <h3 class="text-lg font-semibold text-indigo-400">Select Variant</h3>

          {#if colors.length > 0}
            <div class="flex items-center gap-3 flex-wrap">
              {#each colors as c}
                <button
                  type="button"
                  class={`w-9 h-9 rounded-full border-2 ${
                    selectedColor === c ? 'border-[#4F46E5] ring-2 ring-[#6366F1]/60' : 'border-gray-600'
                  } flex items-center justify-center`}
                  style={`background-color: ${c?.toLowerCase?.() || 'transparent'}`}
                  title={c}
                  on:click={() => chooseColor(c)}
                ></button>
              {/each}
            </div>
          {/if}

          {#if selectedColor}
            <div class="flex items-center gap-2 flex-wrap">
              {#each sizesFor(selectedColor) as s}
                <button
                  class={`px-3 py-1.5 rounded-md border text-sm ${
                    selectedSize === s
                      ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                      : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
                  }`}
                  on:click={() => chooseSize(s)}
                >
                  {s}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          class="bg-[#4F46E5] hover:bg-[#6366F1] text-white py-3 rounded-lg font-semibold disabled:opacity-50"
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
              ? 'bg-[#4F46E5] hover:bg-[#6366F1] text-white'
              : 'bg-gray-700 text-gray-300 cursor-not-allowed'
          }`}
          aria-disabled={!selectedVariant}
        >
          Start Designing
        </a>
      </div>

      {#if showMore && product.description}
        <div class="mt-6">
          <h3 class="text-lg font-semibold text-indigo-400 mb-2">Description</h3>
          <p class="text-gray-300 leading-relaxed">{product.description}</p>
        </div>
      {/if}

      <div class="mt-6">
        <h3 class="text-lg font-semibold text-indigo-400 mb-2">Specifications</h3>
        <ul class="list-disc list-inside text-gray-300 space-y-1">
          <li>Fabric: Cotton blend</li>
          <li>Fit: Regular</li>
          <li>Weight: Mid-weight</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="max-w-4xl mx-auto mt-16 space-y-6">
    <div class="bg-gray-800/60 rounded-2xl border border-white/5 p-6">
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
            class="self-start rounded-lg bg-[#4F46E5] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#4F46E5]/30 transition hover:bg-[#6366F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1]"
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

    <div class="space-y-4">
      <h3 class="text-xl font-semibold text-white">What people already said</h3>
      {#if comments.length === 0}
        <p class="text-gray-400 text-sm">No comments yet. Be the first to leave your impressions.</p>
      {:else}
        <ul class="space-y-4">
          {#each comments as comment}
            <li class="rounded-2xl border border-white/5 bg-gray-800/60 p-4">
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
  </div>
{/if}

<style>
  .toast-enter {
    opacity: 0;
    transform: translate(-50%, -20px) scale(0.95);
    animation: toastIn 0.4s ease forwards;
  }

  .toast-leave {
    animation: toastOut 0.6s ease forwards;
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
