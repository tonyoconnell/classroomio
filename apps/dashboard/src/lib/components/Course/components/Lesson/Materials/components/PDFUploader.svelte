<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { supabase } from '$lib/utils/functions/supabase';
  import PrimaryButton from '$lib/components/PrimaryButton/index.svelte';

  export let url: string | null = null;

  let uploading = false;
  let files: FileList;
  let fileInput: HTMLInputElement;

  const dispatch = createEventDispatcher();

  const triggerFileInput = () => {
    fileInput.click();
  };

  const uploadPDF = async () => {
    try {
      uploading = true;

      if (!files || files.length === 0) {
        throw new Error('You must select a PDF to upload.');
      }

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
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      uploading = false;
    }
  }
</script>

<div class="flex items-center space-x-2">
  <PrimaryButton
    onClick={triggerFileInput}
    isDisabled={uploading}
    label={uploading ? 'Uploading...' : 'Upload PDF'}
  />
  <input
    type="file"
    id="pdf-upload"
    accept="application/pdf"
    bind:files
    on:change={uploadPDF}
    disabled={uploading}
    class="hidden"
    bind:this={fileInput}
  />
</div>