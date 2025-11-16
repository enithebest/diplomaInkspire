<script>
	import { enhance } from '$app/forms';
	export let form = {};

	const prefixes = [
		{ code: '+43', country: 'Austria' },
		{ code: '+49', country: 'Germany' },
		{ code: '+41', country: 'Switzerland' },
		{ code: '+355', country: 'Albania' },
		{ code: '+39', country: 'Italy' },
		{ code: '+44', country: 'United Kingdom' }
	];
</script>

<section
	class="relative min-h-screen bg-gradient-to-b from-[#0b0b20] via-[#111132] to-[#0b0b20] text-white px-4 sm:px-6 lg:px-10 pt-16 pb-32 overflow-hidden"
>
	<div
		class="pointer-events-none absolute -top-32 left-1/2 w-[900px] h-[900px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute -bottom-48 right-1/4 w-[700px] h-[700px] rounded-full bg-purple-600/20 blur-3xl"
	></div>

	<div class="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
		<div class="order-2 lg:order-1 space-y-10">
			<header class="space-y-4">
				<p class="text-sm uppercase tracking-[0.3em] text-indigo-300/80">We reply within 24h</p>
				<h1 class="text-4xl sm:text-5xl font-bold leading-tight">
					Contact <span class="text-indigo-300">Inkspire</span>
				</h1>
				<p class="text-gray-300 text-lg">
					Need a quote, custom design help, or support with an order? Reach out by phone, in person, or
					use the form. We are real humans ready to help.
				</p>
			</header>

			<div class="space-y-5">
				<div class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
					<h2 class="text-xl font-semibold">Call Us</h2>
					<p class="mt-2 text-gray-300">+43 660 123 4567</p>
				</div>
				<div class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
					<h2 class="text-xl font-semibold">Visit</h2>
					<p class="mt-2 text-gray-300">
						Inkspire HQ<br />
						Triester Strasse 42<br />
						1100 Vienna, Austria
					</p>
				</div>
				<div class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
					<h2 class="text-xl font-semibold">Opening Hours</h2>
					<p class="mt-2 text-gray-300">
						Mon-Fri: 08:00-18:00<br />
						Sat: 09:00-14:00<br />
						Sun: Closed
					</p>
				</div>
			</div>

			<div class="rounded-2xl border border-white/10 shadow-xl">
				<iframe
					width="100%"
					height="300"
					style="border:0;"
					loading="lazy"
					allowfullscreen
					referrerpolicy="no-referrer-when-downgrade"
					class="rounded-2xl"
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2653.949837829918!2d16.378136!3d48.17023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476d07b15efc1be9%3A0x3d44a14bcbb15741!2sTriester%20Str.%2042%2C%201100%20Wien!5e0!3m2!1sen!2at!4v1700000000000"
				></iframe>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
				{#each [
					{ title: 'Fast Support', desc: 'Average response time < 24h' },
					{ title: 'Reliable Team', desc: 'Dedicated contact for every order' },
					{ title: 'High Quality', desc: 'In-house production control' },
					{ title: 'Secure Data', desc: 'Your uploads stay private' }
				] as item}
					<div class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
						<h3 class="text-lg font-semibold text-indigo-200">{item.title}</h3>
						<p class="mt-1 text-gray-300 text-sm">{item.desc}</p>
					</div>
				{/each}
			</div>
		</div>

		<div class="order-1 lg:order-2 w-full lg:pl-6">
			<div class="mx-auto w-full max-w-xl lg:ml-auto lg:mr-0 lg:max-w-none lg:w-[520px]">
				<div class="lg:sticky lg:top-10">
					<div
						class="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 lg:min-h-[calc(100vh-5rem)] lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto flex flex-col"
					>
						<div class="space-y-2 shrink-0">
						<h2 class="text-3xl font-semibold">Send Us a Message</h2>
						<p class="text-sm text-gray-300">Tell us what you need and we will get back quickly.</p>
					</div>

						<form method="POST" action="?/send" use:enhance class="flex-1 flex flex-col gap-5">
						<div>
							<label class="text-sm font-medium text-gray-300">Full Name</label>
							<input
								type="text"
								name="name"
								autocomplete="name"
								required
								placeholder="Enter your name"
								class="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							/>
						</div>

						<div>
							<label class="text-sm font-medium text-gray-300">Email Address</label>
							<input
								type="email"
								name="email"
								autocomplete="email"
								required
								placeholder="you@example.com"
								class="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							/>
						</div>

						<div>
							<label class="text-sm font-medium text-gray-300">Phone Number</label>
							<div class="mt-1 flex flex-col gap-3 sm:flex-row">
								<select
									name="prefix"
									required
									class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-100 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:w-40"
								>
									{#each prefixes as option}
										<option value={option.code} class="text-black">
											{option.code} — {option.country}
										</option>
									{/each}
								</select>

								<input
									type="tel"
									name="phone"
									autocomplete="tel"
									required
									placeholder="123 456 789"
									class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
								/>
							</div>
						</div>

						<div>
							<label class="text-sm font-medium text-gray-300">Message</label>
							<textarea
								name="message"
								rows="4"
								required
								placeholder="Tell us about your project or question..."
								class="mt-1 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							></textarea>
						</div>

						<div class="mt-auto space-y-3">
							<button
								type="submit"
								class="w-full rounded-xl bg-indigo-500 py-3 text-lg font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:opacity-60"
							>
								Send Message
							</button>

							{#if form?.success}
								<p class="text-center text-sm text-emerald-300 animate-fade-in">{form.success}</p>
							{:else if form?.error}
								<p class="text-center text-sm text-rose-300 animate-fade-in">{form.error}</p>
							{/if}
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in {
		animation: fade-in 0.35s ease-out forwards;
	}
</style>
