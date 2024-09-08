<script>
  import { onMount } from 'svelte';
  import PrimaryButton from '$lib/components/PrimaryButton/index.svelte';

  onMount(() => {
    console.log('Welcome to Rebuild You');
  });
</script>

<svelte:head>
  <title>Rebuild You</title>
</svelte:head>

<div class="min-h-screen w-full bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center font-sans p-4">
  <div class="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center max-w-md w-full">
    <!-- Logo -->
    <img src="/logo-192.png" alt="Rebuild You Logo" class="mb-8 w-32 h-auto" />
    
    <h1 class="text-3xl font-bold mb-6 text-center">Welcome to Rebuild You</h1>
    
    <!-- Buttons -->
    <div class="flex flex-col items-center gap-4 w-full">
      <a href="/login" class="w-full">
        <PrimaryButton className="w-full max-w-xs mx-auto py-3 text-lg font-semibold transition-transform hover:scale-105">
          I am a teacher
        </PrimaryButton>
      </a>
      <a href="https://learn.rebuildyou.co" class="w-full">
        <PrimaryButton className="w-full max-w-xs mx-auto py-3 text-lg font-semibold transition-transform hover:scale-105">
          I am a student
        </PrimaryButton>
      </a>
    </div>
  </div>
  
  <footer class="mt-8 text-white/80 text-sm">
    © 2024 Rebuild You. All rights reserved.
  </footer>
</div>