<script>
	// Enthält mögliche Fehlermeldungen aus +page.server.js
	export let form;
</script>

<div class="flex justify-center items-center min-h-screen bg-gray-100">
	<form
		method="POST"
		class="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
	>
		<h1 class="text-2xl font-bold text-center mb-4">Registrieren</h1>

		<label for="email" class="block font-medium">E-Mail</label>
		<input
			id="email"
			name="email"
			type="email"
			required
			class="w-full p-2 border rounded"
			placeholder="deine@email.com"
		/>

		<label for="password" class="block font-medium">Passwort</label>
		<input
			id="password"
			name="password"
			type="password"
			required
			class="w-full p-2 border rounded"
			placeholder="••••••••"
		/>

		<button
			type="submit"
			class="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition"
		>
			Registrieren
		</button>

		{#if form?.message}
			<p class="text-red-500 text-center mt-2">{form.message}</p>
		{/if}

		<p class="text-center text-sm mt-4">
			Schon registriert?
			<a href="/login" class="text-blue-600 hover:underline">Zum Login</a>
		</p>
	</form>
</div>
