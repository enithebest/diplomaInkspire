<script>
	import { enhance } from '$app/forms';
	export let form;
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
	<div class="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-md">
		<h1 class="text-3xl font-bold mb-6 text-center text-gray-800"> Contact Us</h1>
		<p class="text-gray-600 mb-6 text-center">
			Have questions, suggestions, or need help? Fill out the form below and we'll get back to you soon.
		</p>

		<form method="POST" action="?/send" use:enhance class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700">Name</label>
				<input
					type="text"
					name="name"
					required
					class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
				/>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700">Email</label>
				<input
					type="email"
					name="email"
					required
					class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
				/>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700">Message</label>
				<textarea
					name="message"
					rows="5"
					required
					class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
				></textarea>
			</div>

			<button
				type="submit"
				class="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
			>
				Send Message
			</button>

			{#if form?.success}
				<p class="text-green-600 text-center mt-3">{form.success}</p>
			{:else if form?.error}
				<p class="text-red-600 text-center mt-3">{form.error}</p>
			{/if}
		</form>
	</div>
</div>
