<script>
	import { Mail, MapPin, Phone, Facebook, Instagram, Twitter } from '@lucide/svelte';
	import * as m from '$lib/paraglide/messages/_index.js';
</script>

<footer class="bg-gray-900 text-gray-300">
	<!-- Top -->
	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
		<!-- Brand -->
		<div>
			<a href="/" class="text-2xl font-bold tracking-tight text-white">Inkspire</a>
			<p class="mt-3 text-sm text-gray-400">{m.footer_tagline()}</p>
			<div class="mt-5 flex gap-3">
				<a
					href="https://twitter.com/"
					rel="noopener noreferrer"
					target="_blank"
					aria-label="Inkspire on Twitter"
					class="rounded-full bg-white/5 p-2 transition hover:bg-white/10"
				>
					<Twitter size="18" />
				</a>
				<a
					href="https://facebook.com/"
					rel="noopener noreferrer"
					target="_blank"
					aria-label="Inkspire on Facebook"
					class="rounded-full bg-white/5 p-2 transition hover:bg-white/10"
				>
					<Facebook size="18" />
				</a>
				<a
					href="https://instagram.com/"
					rel="noopener noreferrer"
					target="_blank"
					aria-label="Inkspire on Instagram"
					class="rounded-full bg-white/5 p-2 transition hover:bg-white/10"
				>
					<Instagram size="18" />
				</a>
			</div>
		</div>

		<!-- Shop -->
		<div>
			<h3 class="font-semibold text-white">{m.footer_shop_header()}</h3>
			<ul class="mt-4 space-y-2 text-sm">
				<li><a class="hover:text-white" href="/categories">{m.footer_shop_all_categories()}</a></li>
				<li><a class="hover:text-white" href="/cart">{m.footer_shop_cart()}</a></li>
				<li><a class="hover:text-white" href="/orders">{m.footer_shop_orders()}</a></li>
				<li><a class="hover:text-white" href="/profile">{m.footer_shop_profile()}</a></li>
			</ul>
		</div>

		<!-- Company -->
		<div>
			<h3 class="font-semibold text-white">{m.footer_company_header()}</h3>
			<ul class="mt-4 space-y-2 text-sm">
				<li><a class="hover:text-white" href="/contact">{m.footer_company_contact()}</a></li>
				<li><a class="hover:text-white" href="/about">{m.footer_company_about()}</a></li>
				<li><a class="hover:text-white" href="/careers">{m.footer_company_careers()}</a></li>
				<li><a class="hover:text-white" href="/press">{m.footer_company_press()}</a></li>
			</ul>
		</div>

		<!-- Newsletter / Contact -->
		<div>
			<h3 class="font-semibold text-white">{m.footer_newsletter_header()}</h3>
			<p class="mt-3 text-sm text-gray-400">{m.footer_newsletter_subtitle()}</p>
			<form class="mt-4" on:submit|preventDefault>
				<label for="newsletter-email" class="sr-only">Email address</label>
				<div class="flex gap-2">
					<input
						id="newsletter-email"
						type="email"
						placeholder={m.footer_newsletter_placeholder()}
						class="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
					/>
					<button
						type="submit"
						class="rounded-md bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#6366F1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1] [html[data-theme='light']_&]:bg-amber-500 [html[data-theme='light']_&]:hover:bg-amber-400 [html[data-theme='light']_&]:focus-visible:outline-amber-400"
					>
						{m.footer_newsletter_subscribe()}
					</button>
				</div>
			</form>

			<ul class="mt-6 space-y-2 text-sm">
				<li class="flex items-center gap-2">
					<Phone size="16" />
					<a href="tel:+10000000000" class="hover:text-white">{m.footer_contact_phone()}</a>
				</li>
				<li class="flex items-center gap-2">
					<Mail size="16" />
					<a href="mailto:support@inkspire.example" class="hover:text-white"
						>{m.footer_contact_email()}</a
					>
				</li>
				<li class="flex items-center gap-2">
					<MapPin size="16" /> <span>{m.footer_contact_location()}</span>
				</li>
			</ul>
		</div>
	</div>

	<!-- Bottom -->
	<div class="border-t border-white/10">
		<div
			class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm sm:flex-row"
		>
			<p class="text-gray-400">{m.footer_copyright({ year: new Date().getFullYear() })}</p>
			<div class="flex gap-4">
				<a href="/privacy" class="hover:text-white">{m.footer_privacy()}</a>
				<a href="/terms" class="hover:text-white">{m.footer_terms()}</a>
				<a href="/cookies" class="hover:text-white">{m.footer_cookies()}</a>
			</div>
		</div>
	</div>
</footer>
