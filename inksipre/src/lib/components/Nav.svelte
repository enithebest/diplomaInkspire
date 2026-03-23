<script>
	export let user = null;
	export let locale = 'en';
	export let locales = ['en'];

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { localizeHref, setLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages/_index.js';
	import { theme } from '$lib/stores/theme';
	import {
		Globe,
		LogIn,
		LogOut,
		Menu,
		MoonStar,
		ShoppingCart,
		SunMedium,
		UserRound,
		X
	} from 'lucide-svelte';

	let cartCount = 0;
	let mobileMenuOpen = false;
	let userMenuOpen = false;
	let navHidden = false;
	let hovered = false;
	let lastScrollY = 0;
	let scrollY = 0;

	function updateCartCount() {
		try {
			const raw = localStorage.getItem('cart');
			const items = raw ? JSON.parse(raw) : [];
			cartCount = items.length;
		} catch {
			cartCount = 0;
		}
	}

	onMount(() => {
		updateCartCount();

		window.addEventListener('storage', updateCartCount);
		const handleCartUpdated = () => updateCartCount();
		window.addEventListener('cart-updated', handleCartUpdated);

		const handleScroll = () => {
			const y = window.scrollY || 0;
			scrollY = y;
			navHidden = y > lastScrollY && y > 40;
			lastScrollY = y;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('storage', updateCartCount);
			window.removeEventListener('cart-updated', handleCartUpdated);
			window.removeEventListener('scroll', handleScroll);
		};
	});

	$: availableLocales = locales?.length ? locales : ['en'];
	$: currentHref = `${$page.url.pathname}${$page.url.search}${$page.url.hash}`;
	$: isLight = $theme === 'light';
	$: isCategoriesPage = /\/categories\/?$/.test($page.url.pathname);
	$: useOverlayStyle = isCategoriesPage && scrollY < 48 && !hovered;
	$: $page.url.pathname, (mobileMenuOpen = false), (userMenuOpen = false);

	function handleLocaleClick(e, code) {
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
			return;
		}

		e.preventDefault();

		try {
			const res = setLocale(code);
			if (res instanceof Promise) res.catch(() => {});
		} catch {
			window.location.href = localizeHref(currentHref, { locale: code });
		}
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
		if (mobileMenuOpen) userMenuOpen = false;
	}
</script>

<nav
	class={`fixed top-0 z-50 w-full transition-all duration-300 ${
		navHidden ? '-translate-y-full' : 'translate-y-0'
	} ${
		useOverlayStyle
			? 'bg-transparent'
			: hovered
			? isLight
				? 'bg-[#fff9ef]/90 shadow-[0_20px_60px_rgba(148,163,184,0.18)] backdrop-blur'
				: 'bg-gray-900/90 shadow-sm backdrop-blur'
			: isLight
				? 'bg-[#fff9ef]/80 shadow-[0_16px_40px_rgba(148,163,184,0.12)] backdrop-blur'
				: 'bg-gray-900/80 shadow-sm backdrop-blur'
	}`}
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
>
	<div
		class={`mx-auto grid max-w-7xl grid-cols-3 items-center gap-4 px-6 py-3 transition-colors duration-200 ${
			useOverlayStyle ? 'text-white' : isLight ? 'text-slate-900' : 'text-white'
		}`}
	>
		<div class="flex items-center justify-start gap-3 text-sm font-medium md:gap-6">
			<button
				type="button"
				class={`flex h-10 w-10 items-center justify-center rounded-full border transition md:hidden ${
					useOverlayStyle
						? 'border-white/20 bg-black/15 text-white hover:border-white/40 hover:bg-black/25 backdrop-blur-sm'
						: isLight
							? 'border-slate-200 bg-white/80 text-slate-900 hover:bg-white'
							: 'border-white/10 bg-white/5 text-white hover:bg-white/10'
				}`}
				aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={mobileMenuOpen}
				aria-controls="mobile-nav-menu"
				onclick={toggleMobileMenu}
			>
				{#if mobileMenuOpen}
					<X class="h-5 w-5" aria-hidden="true" />
				{:else}
					<Menu class="h-5 w-5" aria-hidden="true" />
				{/if}
			</button>
			<a
				href="/"
				class={`hidden md:inline ${
					useOverlayStyle
						? 'text-white/80 hover:text-white'
						: isLight
							? 'text-slate-600 hover:text-slate-950'
							: 'text-gray-300 hover:text-white'
				}`}
				>{m.nav_home()}</a
			>
			<a
				href="/categories"
				class={`hidden md:inline ${
					useOverlayStyle
						? 'text-white/80 hover:text-white'
						: isLight
							? 'text-slate-600 hover:text-slate-950'
							: 'text-gray-300 hover:text-white'
				}`}
				>{m.nav_shop()}</a
			>
			<a
				href="/contact"
				class={`hidden lg:inline ${
					useOverlayStyle
						? 'text-white/80 hover:text-white'
						: isLight
							? 'text-slate-600 hover:text-slate-950'
							: 'text-gray-300 hover:text-white'
				}`}
				>{m.nav_contact()}</a
			>
			<a
				href="/about"
				class={`hidden lg:inline ${
					useOverlayStyle
						? 'text-white/80 hover:text-white'
						: isLight
							? 'text-slate-600 hover:text-slate-950'
							: 'text-gray-300 hover:text-white'
				}`}
				>{m.nav_about()}</a
			>
		</div>

		<div class="flex justify-center">
			<a
				href="/"
				class={`text-2xl font-semibold tracking-tight transition-colors ${
					useOverlayStyle
						? '!text-white hover:text-white/80'
						: isLight
							? 'text-amber-500 hover:text-amber-700'
							: 'text-white hover:text-indigo-300'
				}`}
				style={useOverlayStyle ? 'text-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);' : undefined}
			>
				Inkspire
			</a>
		</div>

		<div class="flex flex-shrink-0 items-center justify-end gap-2 md:gap-3">
			<div
				class={`hidden items-center gap-1 rounded-full border px-2 py-1 text-[11px] tracking-wide uppercase sm:flex ${
					useOverlayStyle
						? 'border-white/20 bg-black/15 text-white/75 backdrop-blur-sm'
						: isLight
						? 'border-slate-200 bg-white/80 text-slate-500'
						: 'border-white/10 bg-white/5 text-gray-300'
				}`}
			>
				<Globe
					class={`h-4 w-4 ${
						useOverlayStyle ? 'text-white/65' : isLight ? 'text-slate-400' : 'text-gray-400'
					}`}
					aria-hidden="true"
				/>
				{#each availableLocales as code}
					<a
						href={localizeHref(currentHref, { locale: code })}
						aria-current={locale === code ? 'true' : 'false'}
						class={`rounded-full px-2 py-1 transition ${
							locale === code
								? useOverlayStyle
									? 'bg-white text-slate-900'
									: isLight
									? 'bg-slate-900 font-semibold text-white'
									: 'bg-white font-semibold text-gray-900'
								: useOverlayStyle
									? 'text-white/80 hover:text-white'
									: isLight
									? 'text-slate-500 hover:text-slate-900'
									: 'text-gray-300 hover:text-white/90'
						}`}
						onclick={(e) => handleLocaleClick(e, code)}
					>
						{code.toUpperCase()}
					</a>
				{/each}
			</div>

			<a
				href="/cart"
				class={`relative flex h-10 w-10 items-center justify-center rounded-full transition ${
					useOverlayStyle
						? 'bg-black/15 hover:bg-black/25 backdrop-blur-sm'
						: isLight
							? 'bg-white/80 hover:bg-white'
							: 'bg-white/5 hover:bg-white/10'
				}`}
				aria-label={m.nav_cart()}
			>
				<ShoppingCart
					class={`h-5 w-5 ${useOverlayStyle ? 'text-white' : isLight ? 'text-slate-900' : 'text-white'}`}
					aria-hidden="true"
				/>
				{#if cartCount > 0}
					<span
						class={`absolute -top-1 -right-1 flex h-5 min-w-[18px] items-center justify-center rounded-full px-1 text-[11px] font-semibold text-white ${isLight ? 'bg-amber-500' : 'bg-indigo-500'}`}
					>
						{cartCount}
					</span>
				{/if}
			</a>

			{#if user}
				<div class="relative">
					<button
						type="button"
						class={`flex h-10 w-10 items-center justify-center rounded-full transition ${
							useOverlayStyle
								? 'bg-black/15 hover:bg-black/25 backdrop-blur-sm'
								: isLight
									? 'bg-white/80 hover:bg-white'
									: 'bg-white/5 hover:bg-white/10'
						}`}
						aria-haspopup="menu"
						aria-expanded={userMenuOpen}
						onclick={() => (userMenuOpen = !userMenuOpen)}
					>
						<UserRound
							class={`h-5 w-5 ${useOverlayStyle ? 'text-white' : isLight ? 'text-slate-900' : 'text-white'}`}
							aria-hidden="true"
						/>
					</button>

					{#if userMenuOpen}
						<div
							class={`absolute right-0 mt-2 w-52 rounded-2xl border py-2 shadow-2xl backdrop-blur-sm ${
								isLight ? 'border-slate-200 bg-[#fffaf2]/95' : 'border-white/10 bg-gray-900/95'
							}`}
						>
							<div
								class={`truncate px-4 pb-2 text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}
							>
								{user.full_name || user.email}
							</div>
							<a
								href="/profile"
								class={`flex items-center gap-2 px-4 py-2 text-sm transition ${isLight ? 'text-slate-800 hover:bg-slate-900/5' : 'text-gray-100 hover:bg-white/5'}`}
								>{m.nav_profile()}</a
							>
							{#if user?.role === 'admin'}
								<a
									href="/admin"
									class={`flex items-center gap-2 px-4 py-2 text-sm transition ${isLight ? 'text-slate-800 hover:bg-slate-900/5' : 'text-gray-100 hover:bg-white/5'}`}
									>{m.nav_admin()}</a
								>
								<a
									href="/orders"
									class={`flex items-center gap-2 px-4 py-2 text-sm transition ${isLight ? 'text-slate-800 hover:bg-slate-900/5' : 'text-gray-100 hover:bg-white/5'}`}
									>{m.nav_orders()}</a
								>
							{/if}
							<form method="POST" action="/logout" class="mt-1">
								<button
									type="submit"
									class={`flex w-full items-center gap-2 px-4 py-2 text-sm transition ${
										isLight
											? 'text-rose-600 hover:bg-rose-50 hover:text-rose-700'
											: 'text-red-300 hover:bg-white/5 hover:text-red-200'
									}`}
								>
									<LogOut class="h-4 w-4" aria-hidden="true" />
									{m.nav_logout()}
								</button>
							</form>
						</div>
					{/if}
				</div>
			{:else}
				<div class="hidden items-center gap-2 sm:flex">
					<a
						href="/login"
						class={`flex h-10 items-center gap-2 rounded-full border px-3 text-sm transition ${
							useOverlayStyle
								? 'border-white/20 bg-black/15 text-white hover:border-white/40 hover:bg-black/25 backdrop-blur-sm'
								: isLight
								? 'border-slate-200 bg-white/80 text-slate-800 hover:border-slate-300 hover:text-slate-950'
								: 'border-white/10 text-gray-100 hover:border-white/30 hover:text-white'
						}`}
					>
						<LogIn class="h-4 w-4" aria-hidden="true" />
						<span class="hidden sm:inline">{m.nav_login()}</span>
					</a>
					<a
						href="/register"
						class={`inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold text-white transition ${
							isLight ? 'bg-amber-500 hover:bg-amber-400' : 'bg-[#4F46E5] hover:bg-[#6366F1]'
						}`}
					>
						{m.nav_register()}
					</a>
				</div>
			{/if}

			<button
				type="button"
				class={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
					useOverlayStyle
						? 'border-white/20 bg-black/15 text-white hover:border-white/40 hover:bg-black/25 backdrop-blur-sm'
						: isLight
						? 'border-amber-200 bg-white/80 text-amber-600 hover:border-amber-300 hover:bg-amber-50'
						: 'border-white/10 bg-white/5 text-amber-200 hover:bg-white/10'
				}`}
				aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
				onclick={() => theme.toggle()}
			>
				{#if isLight}
					<MoonStar class="h-5 w-5" aria-hidden="true" />
				{:else}
					<SunMedium class="h-5 w-5" aria-hidden="true" />
				{/if}
			</button>
		</div>
	</div>

	{#if mobileMenuOpen}
		<div
			id="mobile-nav-menu"
			class={`border-t px-6 pb-5 md:hidden ${
				useOverlayStyle
					? 'border-white/10 bg-black/35 backdrop-blur-md'
					: isLight
						? 'border-slate-200 bg-[#fff9ef]/95 backdrop-blur'
						: 'border-white/10 bg-gray-900/95 backdrop-blur'
			}`}
		>
			<div class="flex flex-col gap-2 pt-4">
				<a
					href="/"
					class={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
						isLight ? 'text-slate-800 hover:bg-slate-900/5' : 'text-white hover:bg-white/5'
					}`}
					>{m.nav_home()}</a
				>
				<a
					href="/categories"
					class={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
						isLight ? 'text-slate-800 hover:bg-slate-900/5' : 'text-white hover:bg-white/5'
					}`}
					>{m.nav_shop()}</a
				>
				<a
					href="/contact"
					class={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
						isLight ? 'text-slate-800 hover:bg-slate-900/5' : 'text-white hover:bg-white/5'
					}`}
					>{m.nav_contact()}</a
				>
				<a
					href="/about"
					class={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
						isLight ? 'text-slate-800 hover:bg-slate-900/5' : 'text-white hover:bg-white/5'
					}`}
					>{m.nav_about()}</a
				>
				<a
					href="/cart"
					class={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
						isLight ? 'text-slate-800 hover:bg-slate-900/5' : 'text-white hover:bg-white/5'
					}`}
				>
					{m.nav_cart()}{#if cartCount > 0} ({cartCount}){/if}
				</a>
			</div>

			<div class="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border p-3 text-[11px] uppercase tracking-wide sm:hidden">
				<Globe
					class={`h-4 w-4 ${
						useOverlayStyle ? 'text-white/65' : isLight ? 'text-slate-400' : 'text-gray-400'
					}`}
					aria-hidden="true"
				/>
				{#each availableLocales as code}
					<a
						href={localizeHref(currentHref, { locale: code })}
						aria-current={locale === code ? 'true' : 'false'}
						class={`rounded-full px-3 py-1.5 transition ${
							locale === code
								? isLight
									? 'bg-slate-900 font-semibold text-white'
									: 'bg-white font-semibold text-gray-900'
								: isLight
									? 'text-slate-500 hover:text-slate-900'
									: 'text-gray-300 hover:text-white/90'
						}`}
						onclick={(e) => handleLocaleClick(e, code)}
					>
						{code.toUpperCase()}
					</a>
				{/each}
			</div>

			{#if user}
				<div class="mt-4 rounded-2xl border p-3">
					<div class={`px-1 pb-2 text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
						{user.full_name || user.email}
					</div>
					<div class="flex flex-col gap-2">
						<a
							href="/profile"
							class={`rounded-xl px-3 py-2 text-sm transition ${
								isLight ? 'text-slate-800 hover:bg-slate-900/5' : 'text-gray-100 hover:bg-white/5'
							}`}
							>{m.nav_profile()}</a
						>
						{#if user?.role === 'admin'}
							<a
								href="/admin"
								class={`rounded-xl px-3 py-2 text-sm transition ${
									isLight ? 'text-slate-800 hover:bg-slate-900/5' : 'text-gray-100 hover:bg-white/5'
								}`}
								>{m.nav_admin()}</a
							>
							<a
								href="/orders"
								class={`rounded-xl px-3 py-2 text-sm transition ${
									isLight ? 'text-slate-800 hover:bg-slate-900/5' : 'text-gray-100 hover:bg-white/5'
								}`}
								>{m.nav_orders()}</a
							>
						{/if}
						<form method="POST" action="/logout">
							<button
								type="submit"
								class={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
									isLight
										? 'text-rose-600 hover:bg-rose-50 hover:text-rose-700'
										: 'text-red-300 hover:bg-white/5 hover:text-red-200'
								}`}
							>
								<LogOut class="h-4 w-4" aria-hidden="true" />
								{m.nav_logout()}
							</button>
						</form>
					</div>
				</div>
			{:else}
				<div class="mt-4 grid grid-cols-2 gap-2 sm:hidden">
					<a
						href="/login"
						class={`flex items-center justify-center gap-2 rounded-full border px-3 py-3 text-sm transition ${
							isLight
								? 'border-slate-200 bg-white/80 text-slate-800 hover:border-slate-300 hover:text-slate-950'
								: 'border-white/10 text-gray-100 hover:border-white/30 hover:text-white'
						}`}
					>
						<LogIn class="h-4 w-4" aria-hidden="true" />
						<span>{m.nav_login()}</span>
					</a>
					<a
						href="/register"
						class={`inline-flex items-center justify-center rounded-full px-3 py-3 text-sm font-semibold text-white transition ${
							isLight ? 'bg-amber-500 hover:bg-amber-400' : 'bg-[#4F46E5] hover:bg-[#6366F1]'
						}`}
					>
						{m.nav_register()}
					</a>
				</div>
			{/if}
		</div>
	{/if}
</nav>
