Do tasks one by one. 

- [ ] Allow the teacher to upload a pdf to the database and embed it in a lesson. 

# PDF Upload and Embedding in Lessons

- [x] Set up Supabase Storage for PDF files
  - [x] Create a 'pdfs' bucket in Supabase Storage

- [ ] Create a PDF upload component
  - [ ] Create `src/lib/components/Course/components/Lesson/Materials/PDFUploader.svelte`
  - [ ] Implement file selection and upload functionality
  - [ ] Handle upload states (idle, uploading, success, error)

- [ ] Integrate PDF uploader in the Lesson creation/edit page
  - [ ] Add PDFUploader component to the lesson form for example here http://localhost:5173/courses/72110d66-3715-4824-9f58-034f91265014/lessons/6af3ae4d-8217-405e-b587-0f04d7347f5c
  have a look here apps/dashboard/src/lib/components/Course/components/Lesson/Materials/index.svelte
  - [ ] add a button to upload and after the pdf is uploaded fill in the form field with the url of the pdf
  - [ ] Handle successful uploads by saving PDF reference to the lesson


Here's a basic implementation of the PDFUploader.svelte component, similar to the Avatar component you shared:


<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { supabase } from '../supabaseClient'

  export let url: string | null = null

  let uploading = false
  let files: FileList

  const dispatch = createEventDispatcher()

  const uploadPDF = async () => {
    try {
      uploading = true

      if (!files || files.length === 0) {
        throw new Error('You must select a PDF to upload.')
      }

      const file = files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`

      const { error } = await supabase.storage
        .from('pdfs')
        .upload(fileName, file)

      if (error) {
        throw error
      }

      url = fileName
      dispatch('upload', { url: fileName })
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      uploading = false
    }
  }
</script>

<div>
  <label class="button primary block" for="single">
    {uploading ? 'Uploading ...' : 'Upload PDF'}
  </label>
  <input
    type="file"
    id="single"
    accept="application/pdf"
    bind:files
    on:change={uploadPDF}
    disabled={uploading}
  />
</div>

{#if url}
  <p>Uploaded PDF: {url}</p>
{/if}