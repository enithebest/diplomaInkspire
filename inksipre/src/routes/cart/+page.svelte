<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages/_index.js';
	import { theme } from '$lib/stores/theme';

	let cart = [];
	let showRemoveToast = false;
	let total = 0;
	let totalFormatted = '0.00';

	function loadCart() {
		try {
			const raw = localStorage.getItem('cart');
			cart = raw ? JSON.parse(raw) : [];
		} catch {
			cart = [];
		}
		updateTotals();
	}
	
	function updateTotals() {
		total = cart.reduce(
			(sum, { price, qty }) => sum + (Number(price) || 0) * (Number(qty) || 1),
			0
		);
		totalFormatted = total.toFixed(2);
	}

	function removeItem(index) {
		cart = cart.filter((_, i) => i !== index);
		localStorage.setItem('cart', JSON.stringify(cart));
		window.dispatchEvent(new Event('storage'));
		updateTotals();
		showRemoveToast = true;
		setTimeout(() => (showRemoveToast = false), 2000);
	}

	function clearCart() {
		localStorage.removeItem('cart');
		cart = [];
		window.dispatchEvent(new Event('storage'));
		updateTotals();
	}



	function updateQty(index, value) {
		const qty = Math.max(1, Number(value) || 1);
		cart = cart.map((item, i) => (i === index ? { ...item, qty } : item));
		localStorage.setItem('cart', JSON.stringify(cart));
		updateTotals();
	}

	onMount(loadCart);

	function goToCheckout() {
		const isAuthenticated = Boolean($page.data?.user);
		if (!isAuthenticated) {
			const url = `/login?reason=order_required&next=${encodeURIComponent('/checkout')}`;
			window.location.href = url;
			return;
		}
		window.location.href = '/checkout';
	}

	$: isLight = $theme === 'light';
</script>

{#if showRemoveToast}
	<div
		class="fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-red-600/90 px-6 py-3 text-sm font-medium text-white shadow-xl shadow-red-900/30 backdrop-blur"
	>
		{m.cart_toast_removed()}
	</div>
{/if}

<section
	class={`relative isolate min-h-screen overflow-hidden px-6 py-16 transition-colors duration-300 ${isLight ? 'bg-[#f4efe7] text-slate-800' : 'bg-gray-950 text-gray-100'}`}
>
	<div class="absolute inset-0 -z-10 opacity-40">
		<div
			class="absolute top-[-12rem] right-[-8rem] h-96 w-96 rounded-full bg-indigo-600 blur-3xl"
		></div>
		<div
			class="absolute bottom-[-10rem] left-[-8rem] h-80 w-80 rounded-full bg-blue-500 blur-3xl"
		></div>
	</div>

	<div class="mx-auto max-w-6xl space-y-10">
		<div class="space-y-2 text-center">
			<p
				class={`text-sm tracking-[0.2em] uppercase ${isLight ? 'text-amber-700/80' : 'text-indigo-300/80'}`}
			>
				Review your cart
			</p>
			<h1
				class={`text-4xl font-semibold ${isLight ? 'text-slate-900 drop-shadow-[0_10px_35px_rgba(245,158,11,0.2)]' : 'text-white drop-shadow-[0_10px_35px_rgba(99,102,241,0.35)]'}`}
			>
				{m.cart_title()}
			</h1>
		</div>

		{#if cart.length === 0}
			<div
				class={`mx-auto max-w-xl rounded-2xl p-8 text-center shadow-2xl backdrop-blur ${isLight ? 'border border-stone-200 bg-white/85' : 'border border-gray-800 bg-white/5'}`}
			>
				<p class={`mb-4 text-lg ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
					{m.cart_empty()}
				</p>
				<a
					class={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 ${isLight ? 'bg-amber-500 shadow-amber-500/30 hover:bg-amber-400' : 'border border-[#4F46E5]/60 bg-[#4F46E5]/80 shadow-[#4F46E5]/40 hover:bg-[#6366F1]'}`}
					href="/categories"
				>
					Continue shopping
				</a>
			</div>
		{:else}
			<div class="grid gap-8 lg:grid-cols-[2fr_1fr]">
				<div class="space-y-4">
					{#each cart as item, i}
						<article
							class={`relative overflow-hidden rounded-2xl p-4 shadow-xl backdrop-blur ${isLight ? 'border border-stone-200 bg-white/85' : 'border border-gray-800 bg-white/5'}`}
						>
							<div
								class="pointer-events-none absolute inset-0 rounded-2xl border border-white/5"
							></div>
							<div class="flex gap-4">
								<div
									class="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border border-gray-700 bg-gray-900/80"
								>
									{#if item.image_url}
										<img src={item.image_url} alt={item.name} class="h-full w-full object-cover" />
									{:else if item.color}
										<div
											class="h-full w-full"
											style={`background:${item.color};`}
											aria-label={`Color ${item.color}`}
										></div>
									{:else}
										<div class="h-full w-full bg-gray-800"></div>
									{/if}
									<div class="absolute inset-0 rounded-xl ring-1 ring-white/5"></div>
								</div>

								<div class="flex flex-1 flex-col gap-3">
									<div class="flex items-start justify-between gap-3">
										<div class="space-y-1">
											<h2
												class={`text-lg leading-tight font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}
											>
												{item.name}
											</h2>
											<p class="flex items-center gap-2 text-sm text-gray-300">
												{m.cart_color_label()}
												<span class="inline-flex items-center gap-1 text-white">
													{#if item.color}
														<span
															class="inline-block h-3.5 w-3.5 rounded-full border border-white/40"
															style={`background:${item.color};`}
															aria-hidden="true"
														></span>
													{/if}
													<span class="capitalize">{item.color}</span>
												</span>
												<span class="mx-2 text-gray-500">|</span>
												{m.cart_size_label()} <span class="text-white uppercase">{item.size}</span>
											</p>
										</div>
										<button
											onclick={() => removeItem(i)}
											class={`text-sm font-semibold transition ${isLight ? 'text-rose-600 hover:text-rose-500' : 'text-red-400 hover:text-red-300'}`}
										>
											{m.cart_remove_button()}
										</button>
									</div>

									<div
										class="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-300"
									>
										<span
											class="inline-flex items-center gap-1 text-base font-semibold text-indigo-200"
										>
											${item.price}
										</span>
										<div class="flex items-center gap-2">
											<span class="text-xs tracking-wide text-gray-400 uppercase">Qty</span>
											<input
												type="number"
												min="1"
												aria-label="Quantity"
												value={item.qty || 1}
												class="w-20 rounded-lg border border-gray-700 bg-gray-900/80 px-3 py-2 text-white shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
												onchange={(e) => updateQty(i, e.target.value)}
											/>
										</div>
									</div>
								</div>
							</div>
						</article>
					{/each}
				</div>

				<aside
					class={`space-y-5 rounded-2xl p-6 shadow-2xl backdrop-blur ${isLight ? 'border border-stone-200 bg-white/88' : 'border border-gray-800 bg-white/5'}`}
				>
					<div class="flex items-center justify-between">
						<h3 class={`text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
							{m.cart_total_label()}
						</h3>
						<span class={`text-3xl font-bold ${isLight ? 'text-amber-700' : 'text-indigo-200'}`}
							>${totalFormatted}</span
						>
					</div>
					<p class="text-sm text-gray-400">Taxes and shipping calculated at checkout.</p>
					<div class="grid gap-3">
						<button
							type="button"
							onclick={goToCheckout}
							class={`w-full rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 ${isLight ? 'bg-amber-500 shadow-amber-500/30 hover:bg-amber-400' : 'bg-[#4F46E5]/90 shadow-[#4F46E5]/40 hover:bg-[#6366F1]'}`}
						>
							{m.cart_checkout_button()}
						</button>
						<button
							onclick={clearCart}
							class={`w-full rounded-xl border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${isLight ? 'border-stone-200 bg-stone-100 text-slate-700 hover:border-amber-400 hover:text-slate-900' : 'border-gray-700 bg-gray-900/60 text-gray-200 hover:border-indigo-500 hover:text-white'}`}
						>
							{m.cart_clear_button()}
						</button>
					</div>
				</aside>
			</div>
		{/if}
	</div>
</section>


