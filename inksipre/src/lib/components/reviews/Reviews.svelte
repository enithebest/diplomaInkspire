<script>
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages/_index.js';
	import { theme } from '$lib/stores/theme';

	const reviews = [
		{
			name: 'Amelia R.',
			role: 'Designer',
			rating: 5,
			comment:
				'Fantastic quality and super fast delivery. The print came out exactly as I imagined!',
			img: 'https://i.pravatar.cc/80?img=1'
		},
		{
			name: 'Jon M.',
			role: 'Developer',
			rating: 5,
			comment: 'Smooth customization experience. Love the colors and feel.',
			img: 'https://i.pravatar.cc/80?img=2'
		},
		{
			name: 'Sara K.',
			role: 'Student',
			rating: 4,
			comment: 'Great value. I ordered two hoodies-both look amazing!',
			img: 'https://i.pravatar.cc/80?img=3'
		},
		{
			name: 'Priya S.',
			role: 'Marketer',
			rating: 5,
			comment: 'Customer service was quick and helpful. Completely satisfied.',
			img: 'https://i.pravatar.cc/80?img=4'
		},
		{
			name: 'Leon T.',
			role: 'Photographer',
			rating: 5,
			comment: 'Print detail is crisp. Definitely ordering again.',
			img: 'https://i.pravatar.cc/80?img=5'
		},
		{
			name: 'Mina H.',
			role: 'Artist',
			rating: 5,
			comment: 'Colors pop and fabric feels premium. 10/10.',
			img: 'https://i.pravatar.cc/80?img=6'
		},
		{
			name: 'Alex G.',
			role: 'Founder',
			rating: 4,
			comment: 'Easy process and delivery on time. Nicely packed.',
			img: 'https://i.pravatar.cc/80?img=7'
		},
		{
			name: 'Luca P.',
			role: 'Engineer',
			rating: 5,
			comment: 'Loved the customization options. Exactly what I needed.',
			img: 'https://i.pravatar.cc/80?img=8'
		},
		{
			name: 'Naomi W.',
			role: 'Teacher',
			rating: 5,
			comment: 'The mug print is flawless and dishwasher safe. Perfect!',
			img: 'https://i.pravatar.cc/80?img=9'
		},
		{
			name: 'Omar D.',
			role: 'Writer',
			rating: 5,
			comment: 'Great finish and accurate sizing. Highly recommend.',
			img: 'https://i.pravatar.cc/80?img=10'
		}
	];

	let scroller;
	$: isLight = $theme === 'light';

	function scrollByCards(dir = 1) {
		if (!scroller) return;
		const card = scroller.querySelector('[data-card]');
		const gap = 16;
		const step = card ? card.clientWidth + gap : scroller.clientWidth * 0.8;
		scroller.scrollBy({ left: dir * step, behavior: 'smooth' });
	}

	onMount(() => {
		const onWheel = (e) => {
			if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
				e.preventDefault();
				scroller.scrollLeft += e.deltaY;
			}
		};
		scroller?.addEventListener('wheel', onWheel, { passive: false });
		return () => scroller?.removeEventListener('wheel', onWheel);
	});
</script>

<section class={`py-16 transition-colors duration-300 ${isLight ? 'bg-[#efe7db]' : 'bg-gray-950'}`}>
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-6 flex items-end justify-between">
			<div>
				<h2
					class={`text-2xl font-semibold sm:text-3xl ${isLight ? 'text-slate-900' : 'text-white'}`}
				>
					{m.reviews_title()}
				</h2>
				<p class={`mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{m.reviews_subtitle()}</p>
			</div>
		</div>

		<div class="relative">
			<div
				bind:this={scroller}
				class="reviews-scroller flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
				style="scrollbar-width: thin;"
				aria-label={m.reviews_carousel_aria()}
			>
				{#each reviews as r}
					<div
						data-card
						class={`max-w-xs min-w-[280px] shrink-0 snap-start rounded-xl p-5 ${isLight ? 'border border-stone-200 bg-white/85 shadow-[0_18px_45px_-30px_rgba(217,119,6,0.28)]' : 'border border-white/10 bg-white/5 shadow-[0_15px_50px_-35px_rgba(99,102,241,0.9)]'}`}
					>
						<div class="flex items-center gap-3">
							<img
								src={r.img}
								alt={r.name}
								class="h-10 w-10 rounded-full object-cover"
								loading="lazy"
								decoding="async"
							/>
							<div>
								<p class={`font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>{r.name}</p>
								<p class={`text-sm ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{r.role}</p>
							</div>
						</div>
						<div
							class="mt-3 text-yellow-400"
							aria-label={m.reviews_rating_out_of({ rating: r.rating })}
						>
							{'★★★★★'.slice(0, r.rating)}<span class={isLight ? 'text-stone-300' : 'text-gray-600'}
								>{'★★★★★'.slice(r.rating)}</span
							>
						</div>
						<p
							class={`mt-3 text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-200'}`}
						>
							{r.comment}
						</p>
					</div>
				{/each}
			</div>

			<div class="mt-4 flex justify-center gap-4 sm:hidden">
				<button
					class={`h-10 w-10 rounded-full border ${isLight ? 'border-stone-200 bg-white text-slate-900' : 'border-white/20 text-white'}`}
					on:click={() => scrollByCards(-1)}
					aria-label="Previous reviews">◀</button
				>
				<button
					class={`h-10 w-10 rounded-full border ${isLight ? 'border-stone-200 bg-white text-slate-900' : 'border-white/20 text-white'}`}
					on:click={() => scrollByCards(1)}
					aria-label="Next reviews">▶</button
				>
			</div>
		</div>
	</div>
</section>

<style>
	:global(.reviews-scroller) {
		scrollbar-color: #4b5563 transparent;
	}

	:global(.reviews-scroller::-webkit-scrollbar) {
		height: 6px;
		background: transparent;
	}

	:global(.reviews-scroller::-webkit-scrollbar-thumb) {
		background: linear-gradient(90deg, rgba(99, 102, 241, 0.4), rgba(79, 70, 229, 0.1));
		border-radius: 9999px;
	}

	:global(.reviews-scroller::-webkit-scrollbar-track) {
		background: transparent;
	}
</style>
