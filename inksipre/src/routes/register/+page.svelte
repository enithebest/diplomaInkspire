<script>
    import { enhance } from '$app/forms';
    import Warning from '$lib/components/Warning.svelte';
    export let form;
</script>
<div class="flex justify-center items-center min-h-screen bg-gray-100">
    <form action="?/register" method="POST" use:enhance class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold text-center mb-4">Register</h1>
        
        <label for="email" class="block font-medium">E-Mail</label>
        <input type="text" name="email" id="email" required class="w-full p-2 border rounded mb-3" />
        
        <label for="username" class="block font-medium">Username</label>
        <input type="text" name="username" id="username" required class="w-full p-2 border rounded mb-3" />
        
        <label for="password" class="block font-medium">Password</label>
        <input type="password" name="password" id="password" required class="w-full p-2 border rounded mb-4" />
        
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">Register</button>
        
        {#if form}
            <Warning message={form.message} class="mt-4" />
        {/if}
    </form>
</div>