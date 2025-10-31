<script>
  export let data;
  let message = '';
</script>

<h1 class="text-2xl font-bold mb-4">My Profile</h1>

<form method="POST" action="?/update" class="space-y-4 max-w-md">
  <div>
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label>Email</label>
    <input type="email" name="email" value={data.user.email} readonly class="input input-bordered w-full" />
  </div>

  

  <div>
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label>Full Name</label>
    <input type="text" name="full_name" value={data.user.full_name} class="input input-bordered w-full" />
  </div>

  <div>
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label>New Password (optional)</label>
    <input type="password" name="password" class="input input-bordered w-full" />
  </div>

  <button type="submit" class="btn btn-primary w-full">Update Profile</button>

  {#if message}
    <p class="text-green-600 mt-2">{message}</p>
  {/if}
</form>
