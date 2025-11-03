<script>
	import { enhance } from '$app/forms';
	export let form;
</script>

<section
	class="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0b0b20] via-[#111132] to-[#0b0b20] text-white px-6 py-16 overflow-hidden"
>
	<div
		class="absolute -top-32 left-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-600/20 blur-3xl -translate-x-1/2"
	></div>

	<div
		class="relative z-10 w-full max-w-2xl bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-10"
	>
		<h1
			class="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent"
		>
			Get in Touch
		</h1>

		<p class="text-gray-400 text-center mb-8">
			Have a question, feedback, or idea? Send us a message and we’ll get back to you soon.
		</p>

		<form method="POST" action="?/send" use:enhance class="space-y-6">
			<div>
				<label class="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
				<input
					type="text"
					name="name"
					required
					placeholder="Enter your name"
					class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 placeholder-gray-400 text-gray-100 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 transition"
				/>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
				<input
					type="email"
					name="email"
					required
					placeholder="you@example.com"
					class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 placeholder-gray-400 text-gray-100 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 transition"
				/>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-300 mb-1">Message</label>
				<textarea
					name="message"
					rows="5"
					required
					placeholder="Write your message here..."
					class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 placeholder-gray-400 text-gray-100 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 transition resize-none"
				></textarea>
			</div>

			<button
				type="submit"
				class="w-full py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-lg shadow-lg shadow-indigo-500/20 transition-all duration-200"
			>
				Send Message
			</button>

			{#if form?.success}
				<p class="text-green-400 text-center mt-4 animate-fade-in">{form.success}</p>
			{:else if form?.error}
				<p class="text-red-400 text-center mt-4 animate-fade-in">{form.error}</p>
			{/if}
		</form>
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
		animation: fade-in 0.4s ease-out forwards;
	}
</style>
