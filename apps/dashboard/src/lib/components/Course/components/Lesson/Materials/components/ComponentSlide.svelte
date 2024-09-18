<script lang="ts">
  import { lesson } from '$lib/components/Course/components/Lesson/store/lessons';
  import { t } from '$lib/utils/functions/translations';
  import { onMount } from 'svelte';

  export let lessonId: string;

  $: slideUrl = $lesson.materials.slide_url;
  $: isPDF = slideUrl?.toLowerCase().endsWith('.pdf');
  $: isGoogleSlides = slideUrl?.includes('docs.google.com/presentation');

  let iframeLoaded = false;
  let iframeError = false;

  function handleIframeLoad() {
    iframeLoaded = true;
  }

  function handleIframeError() {
    iframeError = true;
  }

  function getEmbedUrl(url: string) {
    if (isGoogleSlides) {
      // Convert Google Slides URL to embed URL
      return url.replace('/edit?usp=sharing', '/embed?start=false&loop=false&delayms=3000');
    }
    return url;
  }

  onMount(() => {
    console.log("ComponentSlide mounted. Slide URL:", slideUrl);
  });
</script>

<div class="w-full">
  <h2 class="text-2xl font-bold mb-4">{$t('course.navItem.lessons.materials.tabs.slide.title')}</h2>
  
  {#if slideUrl}
    {#if isPDF}
      <iframe 
        src={slideUrl} 
        width="100%" 
        height="600px" 
        title="PDF Viewer"
        on:load={handleIframeLoad}
        on:error={handleIframeError}
      ></iframe>
    {:else}
      <iframe 
        src={getEmbedUrl(slideUrl)} 
        width="100%" 
        height="600px" 
        title="Slideshow"
        frameborder="0" 
        allowfullscreen="true" 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true"
        on:load={handleIframeLoad}
        on:error={handleIframeError}
      ></iframe>
    {/if}
    {#if !iframeLoaded}
      <p>Loading... If this persists, there might be an issue with the URL.</p>
    {/if}
    {#if iframeError}
      <p class="text-red-500">Error loading the content. Please check the URL and try again.</p>
    {/if}
  {:else}
    <p>{$t('course.navItem.lessons.materials.tabs.slide.no_slide')}</p>
  {/if}
</div>
