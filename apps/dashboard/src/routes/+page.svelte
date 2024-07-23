<script>
  import { onMount } from 'svelte';
  import FlowStreamReferenceIcon from 'carbon-icons-svelte/lib/FlowStreamReference.svelte';
  import ChartClusterBarIcon from 'carbon-icons-svelte/lib/ChartClusterBar.svelte';
  import MachineLearningModelIcon from 'carbon-icons-svelte/lib/MachineLearningModel.svelte';
  import TextField from '$lib/components/Form/TextField.svelte';
  import PrimaryButton from '$lib/components/PrimaryButton/index.svelte';
  import { getSupabase } from '$lib/utils/functions/supabase';
  import { validateEmail } from '$lib/utils/functions/validateEmail';
  import LoginForm from '$lib/components/AuthUI/LoginForm.svelte';  // Import the LoginForm component

  let email = '';
  let isAdding = false;
  let success = false;

  const supabase = getSupabase();
  const animate = 'transition delay-75 duration-300 ease-in-out';

  async function handleSubmit() {
    if (!email || !validateEmail(email)) return;
    isAdding = true;

    await supabase.from('waitinglist').insert([{ email }]);

    success = true;

    setTimeout(() => {
      isAdding = false;
      success = false;
      email = '';
    }, 5000);
  }

  onMount(() => {
    console.log('Welcome to CIO');
  });
</script>

<svelte:head>
  <title>Rebuild You</title>
</svelte:head>

<div class="md:h-[93vh] w-screen flex items-center justify-center flex-col m-2 sm:m-0 font-sans">
  <div class="flex flex-col md:flex-row mt-4">
    <!-- Your existing content here -->
  </div>
  
  <!-- Add the LoginForm component -->
  <LoginForm />
</div>