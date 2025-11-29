<script>
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages/_index.js';
	export let form = {};

	const prefixes = [
		{ code: '+43', country: m.contact_country_austria },
		{ code: '+49', country: m.contact_country_germany },
		{ code: '+41', country: m.contact_country_switzerland },
		{ code: '+355', country: m.contact_country_albania },
		{ code: '+39', country: m.contact_country_italy },
		{ code: '+44', country: m.contact_country_uk }
	];

	const features = [
		{ title: m.contact_feature_fast_title, desc: m.contact_feature_fast_desc },
		{ title: m.contact_feature_reliable_title, desc: m.contact_feature_reliable_desc },
		{ title: m.contact_feature_quality_title, desc: m.contact_feature_quality_desc },
		{ title: m.contact_feature_secure_title, desc: m.contact_feature_secure_desc }
	];

	let nameValue = '';
	let emailValue = '';
	let phoneValue = '';
	let messageValue = '';
	let selectedPrefix = prefixes[0].code;

	$: if (form?.values) {
		nameValue = form.values.name ?? '';
		emailValue = form.values.email ?? '';
		phoneValue = form.values.phone ?? '';
		messageValue = form.values.message ?? '';
		selectedPrefix = form.values.prefix ?? prefixes[0].code;
	}

	$: if (form?.success) {
		nameValue = '';
		emailValue = '';
		phoneValue = '';
		messageValue = '';
		selectedPrefix = prefixes[0].code;
	}
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
				<p class="text-sm uppercase tracking-[0.3em] text-indigo-300/80">{m.contact_badge()}</p>
				<h1 class="text-4xl sm:text-5xl font-bold leading-tight">
					{m.contact_title()}
				</h1>
				<p class="text-gray-300 text-lg">
					{m.contact_subtitle()}
				</p>
			</header>

			<div class="space-y-5">
				<div class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
					<h2 class="text-xl font-semibold">{m.contact_call_heading()}</h2>
					<p class="mt-2 text-gray-300">{m.contact_call_phone()}</p>
				</div>
				<div class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
					<h2 class="text-xl font-semibold">{m.contact_visit_heading()}</h2>
					<p class="mt-2 text-gray-300">
						{m.contact_visit_line1()}<br />
						{m.contact_visit_line2()}<br />
						{m.contact_visit_line3()}
					</p>
				</div>
				<div class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
					<h2 class="text-xl font-semibold">{m.contact_hours_heading()}</h2>
					<p class="mt-2 text-gray-300">
						{m.contact_hours_weekdays()}<br />
						{m.contact_hours_saturday()}<br />
						{m.contact_hours_sunday()}
					</p>
				</div>
			</div>

			<div class="rounded-2xl border border-white/10 shadow-xl">
				<!-- svelte-ignore a11y_missing_attribute -->
				<iframe
					width="100%"
					height="300"
					style="border:0;"
					loading="lazy"
					allowfullscreen
					referrerpolicy="no-referrer-when-downgrade"
					class="rounded-2xl"
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3033.5770785481867!2d19.515169!3d42.068284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135268f782179bb9%3A0x63b69e0b9b318d32!2sShkod%C3%ABr%20City%20Center!5e0!3m2!1sen!2s!4v1700000000001"
				></iframe>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
				{#each features as item}
					<div class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
						<h3 class="text-lg font-semibold text-indigo-200">{item.title()}</h3>
						<p class="mt-1 text-gray-300 text-sm">{item.desc()}</p>
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
							<h2 class="text-3xl font-semibold">{m.contact_form_title()}</h2>
							<p class="text-sm text-gray-300">{m.contact_form_subtitle()}</p>
						</div>

						<form method="POST" action="?/send" use:enhance class="flex-1 flex flex-col gap-5">
							<div>
								<!-- svelte-ignore a11y_label_has_associated_control -->
								<label class="text-sm font-medium text-gray-300">{m.contact_form_name_label()}</label>
								<input
									type="text"
									name="name"
									bind:value={nameValue}
									required
									minlength="2"
									maxlength="80"
									placeholder={m.contact_form_name_placeholder()}
									class="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
									aria-invalid={Boolean(form?.error)}
								/>
							</div>

							<div>
								<!-- svelte-ignore a11y_label_has_associated_control -->
								<label class="text-sm font-medium text-gray-300">{m.contact_form_email_label()}</label>
								<input
									type="email"
									name="email"
									bind:value={emailValue}
									required
									placeholder={m.contact_form_email_placeholder()}
									class="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
									aria-invalid={Boolean(form?.error)}
								/>
							</div>

							<div>
								<!-- svelte-ignore a11y_label_has_associated_control -->
								<label class="text-sm font-medium text-gray-300">{m.contact_form_phone_label()}</label>
								<div class="mt-1 flex flex-col gap-3 sm:flex-row">
									<select
										name="prefix"
										bind:value={selectedPrefix}
										required
										class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-100 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:w-40"
									>
										{#each prefixes as option}
											<option value={option.code} class="text-black">
												{option.code} - {option.country()}
											</option>
										{/each}
									</select>

									<input
										type="tel"
										name="phone"
										bind:value={phoneValue}
										required
										pattern="[0-9()+\s-]{6,20}"
										minlength="6"
										maxlength="20"
										placeholder={m.contact_form_phone_placeholder()}
										class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
										aria-invalid={Boolean(form?.error)}
									/>
								</div>
								<p class="text-xs text-gray-400 mt-1">{m.contact_form_phone_hint()}</p>
							</div>

							<div>
								<!-- svelte-ignore a11y_label_has_associated_control -->
								<label class="text-sm font-medium text-gray-300">{m.contact_form_message_label()}</label>
								<textarea
									name="message"
									rows="4"
									bind:value={messageValue}
									required
									minlength="10"
									maxlength="1500"
									placeholder={m.contact_form_message_placeholder()}
									class="mt-1 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
									aria-invalid={Boolean(form?.error)}
								></textarea>
							</div>

							<div class="mt-auto space-y-3">
								<button
									type="submit"
									class="w-full rounded-xl bg-indigo-500 py-3 text-lg font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:opacity-60"
								>
									{m.contact_form_submit()}
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
