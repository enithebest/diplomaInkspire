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

		<label for="email" class="block font-medium mb-1">E-Mail</label>
		<input
			type="email"
			name="email"
			id="email"
			required
			class="w-full p-2 border rounded mb-3"
			value={form?.values?.email}  
		/>

		<label for="password" class="block font-medium mb-1">Passwort</label>
		<input
			type="password"
			name="password"
			id="password"
			required
			class="w-full p-2 border rounded mb-4"
		/>

		<button
			type="submit"
			class="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition"
		>
			Einloggen
		</button>

		{#if form?.message}
			<p class="mt-4 text-center text-red-600">{form.message}</p>
		{/if}
	</form>
</div>
