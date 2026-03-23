<script>
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages/_index.js';
	import { phoneCountryFallback } from '$lib/data/phoneCountryFallback.js';
	import { theme } from '$lib/stores/theme';
	export let data = {};
	export let form = {};

	let prefixes = data.phoneCountries?.length ? data.phoneCountries : phoneCountryFallback;

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
	let selectedPrefix = phoneCountryFallback[0].code;
	let selectedAttachmentName = '';

	$: if (form?.values) {
		nameValue = form.values.name ?? '';
		emailValue = form.values.email ?? '';
		phoneValue = form.values.phone ?? '';
		messageValue = form.values.message ?? '';
		selectedPrefix = form.values.prefix ?? phoneCountryFallback[0].code;
	}

	$: if (form?.success) {
		nameValue = '';
		emailValue = '';
		phoneValue = '';
		messageValue = '';
		selectedPrefix = phoneCountryFallback[0].code;
		selectedAttachmentName = '';
	}

	$: isLight = $theme === 'light';

	$: if (data.phoneCountries?.length) {
		prefixes = data.phoneCountries;
		if (!prefixes.some((option) => option.code === selectedPrefix)) {
			selectedPrefix = prefixes[0].code;
		}
	}
</script>

<section
	class={`relative min-h-screen px-4 pt-16 pb-32 sm:px-6 lg:px-10 ${isLight ? 'bg-gradient-to-b from-[#fbf7f1] via-[#f4efe7] to-[#efe7db] text-slate-900' : 'bg-gradient-to-b from-[#0b0b20] via-[#111132] to-[#0b0b20] text-white'}`}
>
	<div
		class="pointer-events-none absolute -top-32 left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute right-1/4 -bottom-48 h-[700px] w-[700px] rounded-full bg-purple-600/20 blur-3xl"
	></div>

	<div
		class="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16"
	>
		<div class="order-2 space-y-10 lg:order-1">
			<header class="space-y-4">
				<p class="text-sm tracking-[0.3em] text-indigo-300/80 uppercase">{m.contact_badge()}</p>
				<h1 class="text-4xl leading-tight font-bold sm:text-5xl">{m.contact_title()}</h1>
				<p class="text-lg text-gray-300">{m.contact_subtitle()}</p>
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
				<iframe
					width="100%"
					height="300"
					title="Inkspire location map"
					style="border:0;"
					loading="lazy"
					allowfullscreen
					referrerpolicy="no-referrer-when-downgrade"
					class="rounded-2xl"
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3033.5770785481867!2d19.515169!3d42.068284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135268f782179bb9%3A0x63b69e0b9b318d32!2sShkod%C3%ABr%20City%20Center!5e0!3m2!1sen!2s!4v1700000000001"
				></iframe>
			</div>

			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
				{#each features as item, index (index)}
					<div class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
						<h3 class="text-lg font-semibold text-indigo-200">{item.title()}</h3>
						<p class="mt-1 text-sm text-gray-300">{item.desc()}</p>
					</div>
				{/each}
			</div>
		</div>

		<div class="order-1 w-full lg:order-2 lg:pl-6">
			<div class="mx-auto w-full max-w-2xl lg:mx-auto lg:w-[640px] lg:max-w-none">
				<div class="relative">
					<div
						class="flex flex-col space-y-8 rounded-3xl border border-white/10 bg-white/10 p-8
								shadow-2xl backdrop-blur-xl sm:p-10"
					>
						<div class="space-y-2">
							<h2 class="text-4xl font-semibold">{m.contact_form_title()}</h2>
							<p class="text-sm text-gray-300">{m.contact_form_subtitle()}</p>
						</div>

						<form
							method="POST"
							action="?/send"
							enctype="multipart/form-data"
							use:enhance
							class="flex flex-col gap-5"
						>
							<div>
								<label class="text-sm font-medium text-gray-300" for="contact-name"
									>{m.contact_form_name_label()}</label
								>
								<input
									id="contact-name"
									type="text"
									name="name"
									bind:value={nameValue}
									required
									minlength="2"
									class="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-100
									       placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
								/>
							</div>

							<div>
								<label class="text-sm font-medium text-gray-300" for="contact-email"
									>{m.contact_form_email_label()}</label
								>
								<input
									id="contact-email"
									type="email"
									name="email"
									bind:value={emailValue}
									required
									class="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-100
									       placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
								/>
							</div>

							<div>
								<label class="text-sm font-medium text-gray-300" for="contact-phone"
									>{m.contact_form_phone_label()}</label
								>
								<div class="mt-1 flex flex-col gap-3 sm:flex-row">
									<select
										name="prefix"
										bind:value={selectedPrefix}
										required
										class="rounded-xl border border-white/10 bg-[#4F46E5] px-4 py-3 text-white
											   focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none sm:w-40"
									>
										{#each prefixes as option (option.code)}
											<option value={option.code}>
												{option.code} - {option.country}
											</option>
										{/each}
									</select>

									<input
										id="contact-phone"
										type="tel"
										name="phone"
										bind:value={phoneValue}
										required
										minlength="6"
										class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-100
										       placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
									/>
								</div>

								<p class="mt-1 text-xs text-gray-400">{m.contact_form_phone_hint()}</p>
							</div>

							<div>
								<label class="text-sm font-medium text-gray-300" for="contact-message"
									>{m.contact_form_message_label()}</label
								>

								<textarea
									id="contact-message"
									name="message"
									rows="4"
									bind:value={messageValue}
									required
									minlength="10"
									maxlength="1500"
									class="mt-1 min-h-[180px] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4
										   py-3 text-gray-100 placeholder-gray-400 focus:border-indigo-400 focus:ring-2
										   focus:ring-indigo-400 focus:outline-none"
								></textarea>
							</div>

							<div class="group relative">
								<div class="mb-2 flex items-center justify-between gap-3">
									<label class="text-sm font-medium text-gray-300" for="contact-attachment"
										>{m.contact_form_attachment_label()}</label
									>
									<span
										class={`rounded-full px-3 py-1 text-[11px] font-medium ${
											isLight ? 'bg-amber-100 text-amber-700' : 'bg-indigo-500/15 text-indigo-200'
										}`}
									>
										{m.contact_form_attachment_optional()}
									</span>
								</div>

								<label
									for="contact-attachment"
									class={`relative block cursor-pointer overflow-hidden rounded-2xl border border-dashed p-5 transition ${
										isLight
											? 'border-stone-300 bg-white/70 hover:border-amber-400 hover:bg-amber-50/70'
											: 'border-white/15 bg-white/5 hover:border-indigo-400 hover:bg-indigo-500/10'
									}`}
								>
									<div class="space-y-2">
										<p class={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
											{m.contact_form_attachment_cta()}
										</p>
										<p class={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
											{#if selectedAttachmentName}
												{m.contact_form_attachment_selected({ file: selectedAttachmentName })}
											{:else}
												{m.contact_form_attachment_hint()}
											{/if}
										</p>
									</div>

									<input
										id="contact-attachment"
										type="file"
										name="attachment"
										accept="image/png,image/jpeg,image/webp"
										class="sr-only"
										onchange={(event) => {
											const file = event.currentTarget?.files?.[0];
											selectedAttachmentName = file?.name ?? '';
										}}
									/>
								</label>

								<div
									class={`pointer-events-none absolute top-full right-0 z-20 mt-3 hidden w-full max-w-sm rounded-2xl border p-4 text-xs shadow-xl group-hover:block ${
										isLight
											? 'border-stone-200 bg-white text-slate-700'
											: 'border-white/10 bg-gray-950 text-gray-200'
									}`}
								>
									<p
										class={`mb-2 text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}
									>
										{m.contact_form_attachment_guidelines_title()}
									</p>
									<ul class="space-y-1.5">
										<li>{m.contact_form_attachment_guideline_formats()}</li>
										<li>{m.contact_form_attachment_guideline_size()}</li>
										<li>{m.contact_form_attachment_guideline_quality()}</li>
										<li>{m.contact_form_attachment_guideline_privacy()}</li>
									</ul>
								</div>
							</div>

							<div class="space-y-3">
								<button
									type="submit"
									class={`w-full rounded-xl py-3 text-lg font-semibold text-white shadow-lg transition ${isLight ? 'bg-amber-500 shadow-amber-500/30 hover:bg-amber-400' : 'bg-[#4F46E5] shadow-[#4F46E5]/30 hover:bg-[#6366F1]'}`}
								>
									{m.contact_form_submit()}
								</button>

								{#if form?.success}
									<p class="text-center text-sm text-emerald-300">{form.success}</p>
								{:else if form?.error}
									<p class="text-center text-sm text-rose-300">{form.error}</p>
								{/if}
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
