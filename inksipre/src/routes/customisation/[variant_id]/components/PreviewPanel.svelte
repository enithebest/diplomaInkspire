<script>
	import { onDestroy } from 'svelte';

	export let primaryButton = '';
	export let modelPath = '';
	export let modelReady = false;
	export let previewExpanded = false;
	export let onActivatePreview;
	export let onTogglePreview;
	export let onDownload;
	export let onContainerReady;

	let hostEl;
	let containerEl;
	let observer;
	let previewActivated = false;

	const activatePreview = () => {
		if (previewActivated) return;
		previewActivated = true;
		onActivatePreview?.();
		observer?.disconnect();
		observer = null;
	};

	$: if (hostEl && !previewActivated && typeof IntersectionObserver !== 'undefined') {
		observer?.disconnect();
		observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					activatePreview();
				}
			},
			{ threshold: 0.2 }
		);
		observer.observe(hostEl);
	}

	$: onContainerReady?.(containerEl);

	onDestroy(() => observer?.disconnect());
</script>

{#if previewExpanded}
	<div
		class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
		role="button"
		tabindex="0"
		aria-label="Close expanded preview"
		onclick={() => onTogglePreview?.(false)}
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && onTogglePreview?.(false)}
	></div>
{/if}

<div
	bind:this={hostEl}
	class={`relative flex-1 ${previewExpanded ? 'z-50' : ''}`}
	onmouseenter={activatePreview}
	onfocusin={activatePreview}
	ontouchstart={activatePreview}
>
	<div
		class={`relative overflow-hidden rounded-3xl border border-gray-700 bg-gray-900/80 shadow-2xl backdrop-blur-md transition-all duration-200 ease-out
      ${previewExpanded ? 'fixed top-1/2 left-1/2 h-[80vh] min-h-[480px] w-[90vw] max-w-6xl -translate-x-1/2 -translate-y-1/2' : 'h-[60vh] max-h-[650px] min-h-[360px]'}
    `}
	>
		<div
			bind:this={containerEl}
			class="flex h-full w-full cursor-grab items-center justify-center"
		></div>
		{#if modelPath}
			{#if !modelReady}
				<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
					<div class="rounded-lg border border-white/10 bg-black/55 px-4 py-2 text-sm text-white">
						Loading 3D preview...
					</div>
				</div>
			{/if}
		{:else}
			<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
				<div class="rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-sm text-white">
					3D preview coming soon
				</div>
			</div>
		{/if}
		{#if previewExpanded}
			<div class="absolute top-4 right-4 z-50 flex gap-2">
				<button
					class={`${primaryButton} px-3 py-2 text-xs`}
					onclick={() => onTogglePreview?.(false)}
				>
					Close
				</button>
			</div>
		{/if}
	</div>
	<div class="mt-3 flex justify-end gap-2">
		<button
			class={`${primaryButton} flex items-center gap-2 px-3 py-2 text-sm`}
			onclick={() => {
				activatePreview();
				onTogglePreview?.(true);
			}}
			aria-pressed={previewExpanded}
			disabled={!modelPath || previewExpanded}
			title="Expand preview"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M4 9V5a1 1 0 011-1h4M20 15v4a1 1 0 01-1 1h-4M15 4h4a1 1 0 011 1v4M9 20H5a1 1 0 01-1-1v-4"
				/>
			</svg>
			Maximize
		</button>
		<button
			class={`${primaryButton} px-4 py-2 text-sm`}
			onclick={() => {
				activatePreview();
				onDownload?.();
			}}
			disabled={!modelPath || !modelReady}
		>
			Download render
		</button>
	</div>
</div>

<p class="text-center text-sm text-gray-400">Drag to rotate / Scroll to zoom</p>
