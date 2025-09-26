<script>
	import { enhance } from '$app/forms';
	export let form;
</script>

<div class="flex justify-center items-center min-h-screen bg-gray-100">
	<form
		method="POST"
		action="?/login"
		use:enhance
		class="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
	>
		<h1 class="text-2xl font-bold text-center mb-4">Login</h1>

		<label class="block mb-1 font-medium" for="email">E-Mail</label>
		<input class="w-full p-2 border rounded mb-3" type="email" name="email" id="email" required />

		<label class="block mb-1 font-medium" for="password">Passwort</label>
		<input class="w-full p-2 border rounded mb-4" type="password" name="password" id="password" required />

		<button
			type="submit"
			class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
		>
			Login
		</button>

		{#if form?.message}
			<p class="mt-4 text-red-600 text-center">{form.message}</p>
		{/if}
	</form>
</div>
