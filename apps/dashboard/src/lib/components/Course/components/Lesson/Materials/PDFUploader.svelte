<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { supabase } from '$lib/utils/functions/supabase';
  import PrimaryButton from '$lib/components/PrimaryButton/index.svelte';
  import { snackbar } from '$lib/components/Snackbar/store';
  import { t } from '$lib/utils/functions/translations';

  export let url: string | null = null;

  let uploading = false;
  let files: FileList;
  let inputElement: HTMLInputElement;

  const dispatch = createEventDispatcher();

  const uploadPDF = async () => {
    try {
      if (!files || files.length === 0) {
        throw new Error($t('course.navItem.lessons.materials.tabs.pdf.no_file'));
      }

      uploading = true;

      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('pdfs')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('pdfs')
        .getPublicUrl(fileName);

      url = publicUrl;
      dispatch('upload', { url: publicUrl });
      snackbar.success($t('course.navItem.lessons.materials.tabs.pdf.upload_success'));
    } catch (error) {
      if (error instanceof Error) {
        snackbar.error(error.message);
      }
    } finally {
      uploading = false;
    }
  }

  function handleFileSelect() {
    if (files && files.length > 0) {
      uploadPDF();
    }
  }
</script>

<div class="flex flex-col space-y-2">
  <input
    type="file"
    bind:this={inputElement}
    bind:files
    on:change={handleFileSelect}
    accept="application/pdf"
    class="hidden"
  />
  <PrimaryButton 
    label={uploading ? $t('course.navItem.lessons.materials.tabs.pdf.uploading') : $t('course.navItem.lessons.materials.tabs.pdf.upload')}
    onClick={() => inputElement.click()}
    isDisabled={uploading}
  />
</div>

{#if url}
  <div class="mt-2 text-sm text-gray-600">
    <a href={url} target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">
      {url.split('/').pop()}
    </a>
  </div>
{/if}