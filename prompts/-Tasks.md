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
  have a look here apps/dashboard/src/lib/components/Course/components/Lesson/Materials/index.svelte and find the right filies that influence
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


here's some code thhat may be of use 

<script lang="ts">
  import isEmpty from 'lodash/isEmpty';
  import { fade } from 'svelte/transition';
  import { useCompletion } from 'ai/svelte';
  import MODES from '$lib/utils/constants/mode.js';
  import TrashCanIcon from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import IconButton from '$lib/components/IconButton/index.svelte';
  import { formatYoutubeVideo } from '$lib/utils/functions/formatYoutubeVideo';
  import Modal from '$lib/components/Modal/index.svelte';
  import { Popover } from 'carbon-components-svelte';
  import AlignBoxTopLeftIcon from 'carbon-icons-svelte/lib/AlignBoxTopLeft.svelte';
  import ListIcon from 'carbon-icons-svelte/lib/List.svelte';
  import IbmWatsonKnowledgeStudioIcon from 'carbon-icons-svelte/lib/IbmWatsonKnowledgeStudio.svelte';
  import MagicWandFilled from 'carbon-icons-svelte/lib/MagicWandFilled.svelte';
  import Tabs from '$lib/components/Tabs/index.svelte';
  import TabContent from '$lib/components/TabContent/index.svelte';
  import Box from '$lib/components/Box/index.svelte';
  import PrimaryButton from '$lib/components/PrimaryButton/index.svelte';
  import { VARIANTS } from '$lib/components/PrimaryButton/constants';
  import TextField from '$lib/components/Form/TextField.svelte';
  import {
    lesson,
    lessons,
    lessonByTranslation,
    handleUpdateLessonMaterials,
    isLessonDirty,
    uploadCourseVideoStore,
    deleteLessonVideo
  } from '$lib/components/Course/components/Lesson/store/lessons';
  import VideoUploader from '$lib/components/Course/components/Lesson/Materials/Video/Index.svelte';
  import { course } from '$lib/components/Course/store';
  import TextEditor from '$lib/components/TextEditor/index.svelte';
  import * as CONSTANTS from './constants';
  import { orderedTabs } from './constants';
  import ComponentNote from './components/ComponentNote.svelte';
  import ComponentSlide from './components/ComponentSlide.svelte';
  import ComponentVideo from './components/ComponentVideo.svelte';
  import HtmlRender from '$lib/components/HTMLRender/HTMLRender.svelte';
  import type { LessonPage } from '$lib/utils/types';
  import { snackbar } from '$lib/components/Snackbar/store';
  import { isHtmlValueEmpty } from '$lib/utils/functions/toHtml';
  import { t, lessonFallbackNote } from '$lib/utils/functions/translations';
  import { supabase } from '$lib/utils/functions/supabase';
  import type { LOCALE } from '$lib/utils/types';
  import Loader from './Loader.svelte';
  import PDFUploader from './PDFUploader.svelte';
  import { MATERIAL_TYPES } from './constants';

  export let mode = MODES.view;
  export let prevMode = '';
  export let lessonId = '';
  export let isSaving = false;
  export let isStudent = false;
  export let toggleMode = () => {};

  let localeExists: Record<string, boolean> = {};
  let lessonTitle = '';
  let prevContent = '';
  let initAutoSave = false;
  let timeoutId: NodeJS.Timeout;
  let tabs = CONSTANTS.tabs;
  let currentTab = tabs[0].value;
  let errors: {
    video: string;
  };
  let editorWindowRef: Window;
  let aiButtonRef: HTMLDivElement;
  let openPopover = false;
  let player: HTMLVideoElement;
  let componentsToRender = getComponentOrder(tabs);
  let aiButtonClass =
    'flex items-center px-5 py-2 border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md w-full mb-2';
  let pdfUrl: string | null = null;

  const onChange = (tab) => {
    return () => {
      currentTab = tab;
    };
  };

  const getValue = (label: string) => {
    const tabValue = tabs.find((tab) => tab.label === label)?.value;
    return tabValue;
  };

  async function saveOrUpdateTranslation(locale, lessonId) {
    const content = $lessonByTranslation[lessonId][locale];

    if (typeof localeExists[locale] === 'undefined') {
      const { data } = await supabase
        .from('lesson_language')
        .select(`id`)
        .eq('lesson_id', lessonId)
        .eq('locale', locale)
        .maybeSingle();

      localeExists[locale] = !!(data && data?.id);
    }

    if (localeExists[locale]) {
      const { error: updateError } = await supabase
        .from('lesson_language')
        .update({ content })
        .eq('lesson_id', lessonId)
        .eq('locale', locale);

      if (updateError) {
        console.error('Error updating translation:', updateError.message);
        snackbar.error('snackbar.materials.update_translations');
      }
    } else {
      const { error: insertError } = await supabase.from('lesson_language').insert({
        locale,
        lesson_id: lessonId,
        content
      });

      if (insertError) {
        console.error('Error inserting translation:', insertError.message);
        snackbar.error('snackbar.materials.creating_new');
        return;
      }

      localeExists[locale] = true;
    }
  }

  async function saveLesson(materials?: LessonPage['materials']) {
    const _lesson = !!materials
      ? {
          ...$lesson,
          materials
        }
      : $lesson;

    console.log('updating lesson');
    const [lessonRes] = await Promise.all([
      handleUpdateLessonMaterials(_lesson, lessonId),
      saveOrUpdateTranslation($lesson.locale, lessonId)
    ]);

    return lessonRes;
  }

  function isMaterialsEmpty(
    materials: LessonPage['materials'],
    translation: Record<LOCALE, string>
  ) {
    const { slide_url, videos, note } = materials;

    return (
      isHtmlValueEmpty(note) &&
      !slide_url &&
      isEmpty(videos) &&
      Object.values(translation || {}).every((t) => isHtmlValueEmpty(t))
    );
  }

  function handleSave(prevMode: string) {
    if (prevMode === MODES.edit) {
      saveLesson();
    }
  }

  function addBadgeValueToTab(materials: LessonPage['materials']) {
    const { slide_url, videos, note } = materials;

    tabs = tabs.map((tab) => {
      let badgeValue = 0;

      if (tab.value === 1 && !isHtmlValueEmpty(note)) {
        badgeValue = 1;
      } else if (tab.value === 2 && !!slide_url) {
        badgeValue = 1;
      } else if (tab.value === 3 && !isEmpty(videos)) {
        badgeValue = 1;
      }
      tab.badgeValue = badgeValue;
      return tab;
    });
  }

  const openAddVideoModal = () => {
    $uploadCourseVideoStore.isModalOpen = true;
  };

  const { input, handleSubmit, completion, isLoading } = useCompletion({
    api: '/api/completion'
  });

  function updateNoteByCompletion(completion: string) {
    if (!completion) return;

    if ($lessonByTranslation[lessonId]) {
      $lessonByTranslation[lessonId][$lesson.locale] = `${prevContent}${completion}`;
    }

    autoSave($lesson.materials, $lessonByTranslation[lessonId], false, lessonId);

    if (editorWindowRef) {
      const tmceBody = editorWindowRef?.document?.querySelector('body');
      if (typeof tmceBody?.scrollHeight === 'number') {
        editorWindowRef?.scrollTo(0, tmceBody.scrollHeight);
      }
    }
  }

  function callAI(type = '') {
    prevContent = $lessonByTranslation[lessonId]?.[$lesson.locale] || '';

    const _lesson = $lessons.find((les) => les.id === $lesson.id);
    $input = JSON.stringify({
      type,
      lessonTitle: _lesson?.title || '',
      courseTitle: $course.title,
      locale: $lesson.locale
    });

    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 500);
  }

  function initPlyr(_player: any, _video: LessonPage['materials']['videos']) {
    if (!_player) return;

    const players = Array.from(document.querySelectorAll('.plyr-video-trigger')).map((p) => {
      // @ts-ignore
      return new Plyr(p);
    });

    // @ts-ignore
    window.players = players;
  }

  function autoSave(
    updatedMaterials: LessonPage['materials'],
    translation: Record<LOCALE, string>,
    _isLoading?: boolean,
    lessonId?: string
  ) {
    if (mode === MODES.view) return;

    if (timeoutId) clearTimeout(timeoutId);

    if (!initAutoSave) {
      initAutoSave = true;
      return;
    }

    isSaving = true;
    timeoutId = setTimeout(async () => {
      const { error } = await saveLesson(updatedMaterials);

      if (error) {
        console.error('error saving lesson', error);
        snackbar.error('snackbar.materials.apology');
      }
      isSaving = false;
    }, 1000);
  }

  async function onLessonIdChange(_lid: string) {
    initAutoSave = false;
    isSaving = false;

    tabs = orderedTabs(tabs, $course.metadata?.lessonTabsOrder);
    currentTab = tabs[0].value;
    componentsToRender = getComponentOrder(tabs);
  }

  const onClose = () => {
    $uploadCourseVideoStore.isModalOpen = false;
  };

  function getComponentOrder(tabs = CONSTANTS.tabs) {
    const componentMap = {
      '1': ComponentNote,
      '2': ComponentSlide,
      '3': ComponentVideo
    };

    const componentNames = tabs
      .map((tab) => {
        // @ts-ignore
        const component = componentMap[tab.value];
        return component || null;
      })
      .filter(Boolean);

    return componentNames;
  }

  function handlePDFUpload(event: CustomEvent<{ url: string }>) {
    pdfUrl = event.detail.url;
    $lesson.materials = {
      ...$lesson.materials,
      pdf: { url: pdfUrl }
    };
    $isLessonDirty = true;
  }

  $: autoSave($lesson.materials, $lessonByTranslation[lessonId], $isLoading, lessonId);

  $: onLessonIdChange(lessonId);

  $: handleSave(prevMode);

  $: addBadgeValueToTab($lesson.materials);

  $: updateNoteByCompletion($completion);

  $: initPlyr(player, $lesson.materials.videos);

  $: lessonTitle = $lesson.title;

  $: editorValue = lessonFallbackNote(
    $lesson.materials.note,
    $lessonByTranslation[lessonId],
    $lesson.locale
  );
</script>

<Modal
  {onClose}
  bind:open={$uploadCourseVideoStore.isModalOpen}
  width="w-4/5 w-[90%] h-[80%] md:h-[566px]"
  modalHeading={$t('course.navItem.lessons.materials.tabs.video.add_video.title')}
>
  <VideoUploader {lessonId} />
</Modal>

<HtmlRender className="m-auto text-center">
  <svelte:fragment slot="content">
    <h1 class="text-2xl md:text-4xl mt-0 capitalize">
      {lessonTitle}
    </h1>
  </svelte:fragment>
</HtmlRender>

{#if $lesson.isFetching}
  <Loader />
{:else if mode === MODES.edit}
  <Tabs {tabs} {currentTab} {onChange}>
    <slot:fragment slot="content">
      <TabContent
        value={getValue('course.navItem.lessons.materials.tabs.note.title')}
        index={currentTab}
      >
        <div class="flex gap-1 justify-end">
          <div bind:this={aiButtonRef} class="flex flex-row-reverse">
            <PrimaryButton
              className="flex items-center relative"
              onClick={() => {
                openPopover = !openPopover;
              }}
              isLoading={$isLoading}
              isDisabled={$isLoading}
              variant={VARIANTS.OUTLINED}
              disableScale
            >
              <MagicWandFilled size={20} class="carbon-icon mr-3" />
              AI
              <Popover
                caret
                align="left"
                bind:open={openPopover}
                on:click:outside={({ detail }) => {
                  openPopover = aiButtonRef?.contains(detail.target);
                }}
              >
                <div class="p-2">
                  <button class={aiButtonClass} on:click={() => callAI('outline')}>
                    <ListIcon class="carbon-icon mr-2" />
                    {$t('course.navItem.lessons.materials.tabs.note.ai.outline')}
                  </button>
                  <button class={aiButtonClass} on:click={() => callAI('note')}>
                    <AlignBoxTopLeftIcon class="carbon-icon mr-2" />
                    {$t('course.navItem.lessons.materials.tabs.note.ai.note')}
                  </button>
                  <button class={aiButtonClass} on:click={() => callAI('activities')}>
                    <IbmWatsonKnowledgeStudioIcon class="carbon-icon mr-2" />
                    {$t('course.navItem.lessons.materials.tabs.note.ai.activities')}
                  </button>
                </div>
              </Popover>
            </PrimaryButton>
          </div>
        </div>

        <div class="h-[60vh] mt-5">
          <TextEditor
            id={lessonId}
            bind:editorWindowRef
            value={editorValue}
            onChange={(html) => {
              if (mode === MODES.view) return;
              $lessonByTranslation[lessonId][$lesson.locale] = html;
              try {
                // Backup locale of lesson content
                localStorage.setItem(`lesson-${lessonId}-${$lesson.locale}`, html);
              } catch (error) {}
              $isLessonDirty = true;
            }}
            placeholder={$t('course.navItem.lessons.materials.tabs.note.placeholder')}
          />
        </div>
      </TabContent>

      <TabContent
        value={getValue('course.navItem.lessons.materials.tabs.slide.title')}
        index={currentTab}
      >
        {#if mode === MODES.edit}
          <TextField
            label={$t('course.navItem.lessons.materials.tabs.slide.slide_link')}
            bind:value={$lesson.materials.slide_url}
            onInputChange={() => ($isLessonDirty = true)}
            helperMessage={$t('course.navItem.lessons.materials.tabs.slide.helper_message')}
          />
          <div class="mt-4">
            <PDFUploader url={pdfUrl} on:upload={handlePDFUpload} />
          </div>
          <TextField
            label={$t('course.navItem.lessons.materials.tabs.pdf.uploaded')}
            value={$lesson.materials.pdf?.url || ''}
            readonly
            className="mt-2"
          />
        {/if}
      </TabContent>
      <TabContent
        value={getValue('course.navItem.lessons.materials.tabs.video.title')}
        index={currentTab}
      >
        <PrimaryButton
          label={$t('course.navItem.lessons.materials.tabs.video.button')}
          onClick={openAddVideoModal}
          className="mb-2"
        />
        {#if $lesson.materials.videos.length}
          <div class="flex flex-col items-start w-full h-full">
            {#each $lesson.materials.videos as video, index}
              {#if mode === MODES.edit}
                <div class="ml-auto">
                  <IconButton
                    value="delete-video"
                    contained={true}
                    onClick={() => deleteLessonVideo(index)}
                  >
                    <TrashCanIcon size={20} class="carbon-icon dark:text-white" />
                  </IconButton>
                </div>
              {/if}
              <div class="w-full h-full flex flex-col gap-2 overflow-hidden">
                {#key video.link}
                  <div class="mb-5">
                    {#if video.type === 'youtube'}
                      <iframe
                        width="100%"
                        height="569"
                        class="iframe"
                        src={formatYoutubeVideo(video.link, errors)}
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                      />
                    {:else if video.type === 'generic'}
                      <iframe
                        width="100%"
                        height="569"
                        class="iframe"
                        src={video.link}
                        title="Embeded Video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                      />
                    {:else if video.metadata?.svid}
                      <div style="position:relative;padding-bottom:51.416579%">
                        <iframe
                          src="https://muse.ai/embed/{video.metadata
                            ?.svid}?logo=https://app.rebuildyou.co/logo-512.png&subtitles=auto&cover_play_position=center"
                          style="width:100%;height:100%;position:absolute;left:0;top:0"
                          frameborder="0"
                          allowfullscreen
                          title="Muse AI Video Embed"
                        />
                      </div>
                    {:else}
                      <video bind:this={player} class="plyr-video-trigger" playsinline controls>
                        <source src={video.link} type="video/mp4" />
                        <track kind="captions" />
                      </video>
                    {/if}
                  </div>
                {/key}
              </div>
            {/each}
          </div>
        {/if}
      </TabContent>
    </slot:fragment>
  </Tabs>
{:else if !isMaterialsEmpty($lesson.materials, $lessonByTranslation[lessonId])}
  {#key lessonId}
    <div class="w-full mb-20" in:fade={{ delay: 500 }} out:fade>
      {#each componentsToRender as Component}
        <svelte:component this={Component} {lessonId} />
      {/each}
    </div>
  {/key}
{:else}
  <Box className="text-center">
    <img src="/no-video.svg" alt="Video not found" />
    <h3 class="text-xl font-normal dark:text-white py-2">
      {$t('course.navItem.lessons.materials.body_heading')}
    </h3>

    {#if !isStudent}
      <p class="text-sm text-center font-normal py-2">
        {$t('course.navItem.lessons.materials.body_content')}
        <strong>{$t('course.navItem.lessons.materials.get_started')}</strong>
        {$t('course.navItem.lessons.materials.button')}.
      </p>
      <PrimaryButton
        label={$t('course.navItem.lessons.materials.get_started')}
        className="rounded-md"
        onClick={toggleMode}
      />
    {/if}
  </Box>
{/if}



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


<script lang="ts">
  import PrimaryButton from '$lib/components/PrimaryButton/index.svelte';
  import TextField from '$lib/components/Form/TextField.svelte';
  // import Select from '$lib/components/Form/Select.svelte';
  import {
    lessons,
    lessonSections,
    handleSaveLesson,
    handleSaveLessonSection
  } from '$lib/components/Course/components/Lesson/store/lessons';
  import { course } from '$lib/components/Course/store';
  import Modal from '$lib/components/Modal/index.svelte';
  import { goto } from '$app/navigation';
  import { handleAddLessonWidget } from './store';
  import { t } from '$lib/utils/functions/translations';
  import { COURSE_TYPE } from '$lib/utils/types';
  import type { Lesson } from '$lib/utils/types';

  let errors = {
    title: ''
  };
  let lesson: Lesson = {
    id: '',
    course_id: $course.id || '',
    title: '',
    profile: undefined,
    call_url: undefined,
    lesson_at: new Date().toDateString(),
    is_unlocked: true,
    lesson_completion: [],
    created_at: ''
  };

  const handleSave = async () => {
    if (!lesson.title.trim()) {
      errors.title = 'title cannot be empty';
      return;
    }

    if ($handleAddLessonWidget.isSection) {
      const savedSection = await handleSaveLessonSection(
        {
          title: lesson.title,
          order: $lessonSections.length
        },
        $course.id
      );

      if (Array.isArray(savedSection) && savedSection[0]) {
        const newLessonSection = savedSection[0];

        lessonSections.update((sections) => {
          return [
            ...sections,
            {
              id: newLessonSection.id,
              title: lesson.title,
              order: newLessonSection.order,
              course_id: newLessonSection.course_id,
              lessons: [],
              created_at: ''
            }
          ];
        });
      }
    } else {
      lesson.section_id = $handleAddLessonWidget.id || undefined;
      const savedLesson = await handleSaveLesson(lesson, $course.id);

      if (Array.isArray(savedLesson) && savedLesson[0]) {
        const newLesson = savedLesson[0];
        lesson.id = newLesson.id;
        $lessons = [...$lessons, lesson];

        lessonSections.update((sections) =>
          sections.map((s) => {
            if (s.id === newLesson.section_id) {
              s.lessons = [...s.lessons, lesson];
            }

            return s;
          })
        );
        goto('/courses/' + $course.id + '/lessons/' + lesson.id);
      }
    }

    handleClose();
  };

  function handleClose() {
    $handleAddLessonWidget.open = false;

    lesson = {
      id: '',
      course_id: $course.id || '',
      title: '',
      profile: undefined,
      call_url: undefined,
      lesson_at: new Date().toDateString(),
      is_unlocked: true,
      lesson_completion: [],
      created_at: ''
    };
  }
</script>

<Modal
  onClose={handleClose}
  bind:open={$handleAddLessonWidget.open}
  width="w-[80%] md:w-[65%]"
  maxWidth="max-w-2xl"
  containerClass="overflow-hidden"
  modalHeading={$t(
    `course.navItem.lessons.add_lesson.${
      $handleAddLessonWidget.isSection ? 'modal_heading_section' : 'modal_heading'
    }`
  )}
>
  <form
    on:submit|preventDefault={handleSave}
    class="relative m-auto py-2 md:py-3 px-2 md:px-5 mb-2 md:mb-4 flex flex-wrap items-center dark:bg-neutral-800"
  >
    <div class="w-full">
      <TextField
        label={$t(
          `course.navItem.lessons.add_lesson.${
            $handleAddLessonWidget.isSection ? 'lesson_section_title' : 'lesson_title'
          }`
        )}
        bind:value={lesson.title}
        autoFocus={true}
        className="flex-1 min-w-lg max-w-lg"
        isRequired={true}
        errorMessage={errors.title}
      />
      {#if $course.type == COURSE_TYPE.LIVE_CLASS}
        <!-- <div
          class="flex items-start justify-evenly gap-1 flex-col lg:flex-row lg:items-center mt-2 w-4/5"
        >
          <div class="lg:mb-0">
            <Select
              bind:value={lesson.profile}
              options={$group.tutors}
              labelKey="fullname"
              className="sm:my-1 w-[100%]"
            />
          </div>

          <div class="flex items-center lg:mb-0">
            <input
              type="date"
              name="lesson-date-picker"
              class="p-2 my-2 rounded-md sm:w-[179px] dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div class="flex items-center mb-3 lg:mb-0">
            <TextField className="w-[179px]" placeholder="https://meet.google.com/mga-dsjs-fmb" />
          </div>
        </div> -->
      {/if}
    </div>
  </form>

  <div class="flex flex-row-reverse">
    <PrimaryButton label={$t('course.navItem.lessons.add_lesson.save')} onClick={handleSave} />
  </div>
</Modal>


<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100;200;300;400&family=Roboto:wght@100;300;400;500;700;900&display=swap"
    rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>
  <title>Lesson Note</title>
  <style>
    html {
      -webkit-print-color-adjust: exact;
    }

    header {
      background-image: url("https://koxqonvbkeakwvmdegcf.supabase.co/storage/v1/object/public/avatars/course/course-pdf-background.jpg");
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      border-color: rgb(0, 48, 255);
    }

    body {
      font-family: 'Roboto', sans-serif;
    }

    .hero {
      background-color: rgb(0, 48, 255);
    }

    .prose h1 {
      margin: 0;
    }

    .prose h2 {
      margin: 0.5rem 0 3rem 0;
    }

    .prose h3 {
      margin: 0.5rem 0;
    }

    h4 {
      font-family: 'Roboto Mono', monospace;
    }

    span {
      font-size: 0.8rem;
    }

    section {
      margin-top: 5%;
    }

    .root {
      width: 95%;
    }

    .footer {
      font-size: 3rem;
      scale: 3;
    }
  </style>
  <style type="text/tailwindcss">
    @tailwind base;
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        .prose {
          max-width: unset;
        }
      </style>
</head>

<body class="w-full">
  <header class="border-l-[50px] mb-[15%] h-[100vh] m-0 relative">
    <h1 class="font-bold text-8xl text-black m-0 w-3/4 absolute left-5 top-40">React js for Beginners</h1>
    <h4 class="text-md text-2xl font-light text-black m-0 absolute left-10 bottom-24">By TheSpace</h4>
  </header>

  <div class="root mx-auto mt-5 prose">

    <div class="hero w-full h-40 flex flex-col items-center justify-center gap-2 rounded-lg m-0">
      <h3
        class="my-0 rounded-full w-10 text-center mx-auto py-1 text-blue-700 bg-white text-md font-bold tracking-tighter">
        32
      </h3>
      <h1 class="font-bold text-5xl text-white m-0">The Yams</h1>
      <h4 class="text-md font-normal text-white m-0">By The Space</h4>
    </div>

    <main>
      <section>
        <h1>Lesson Note: Introduction and Counselling</h1>
        <h2>Course: The Ultimate Guide to relocating to the UK via Study Path</h2>
        <h3>Lesson Overview:</h3>
        <p>This lesson serves as the introduction to the course &quot;The Ultimate Guide to relocating to the UK via
          Study Path.&quot; In this session, we will provide an overview of the course and discuss the importance of
          effective counseling in the relocation process.</p>
        <h3>Learning Objectives:</h3>
        <p>By the end of this lesson, students should be able to:</p>
        <ul>
          <li>Understand the goals and structure of the course.</li>
          <li>Recognize the significance of counseling in the relocation process.</li>
          <li>Acquire knowledge about the necessary steps involved in relocating to the UK through the study path.</li>
        </ul>
        <h3>Lesson Content:</h3>
        <ol>
          <li>
            <p><strong>Introduction to the Course</strong></p>
            <ul>
              <li>Briefly introduce the course title and explain its relevance to students&#39; interests.</li>
              <li>Highlight the main topics and modules covered throughout the course.</li>
            </ul>
          </li>
          <li>
            <p><strong>Importance of Counseling</strong></p>
            <ul>
              <li>Define the role of counseling in the relocation process.</li>
              <li>Discuss how counseling can assist students in making informed decisions regarding their studies and
                life in the UK.</li>
              <li>Explain the benefits of seeking professional guidance during the relocation journey.</li>
            </ul>
          </li>
          <li>
            <p><strong>Steps for Relocating to the UK via Study Path</strong></p>
            <ul>
              <li>Provide an overview of the necessary steps involved in relocating to the UK for study purposes.</li>
              <li>Discuss the importance of thorough planning, research, and documentation in the relocation process.
              </li>
              <li>Highlight key points such as visa applications, university admissions, accommodation arrangements, and
                financial considerations.</li>
            </ul>
          </li>
          <li>
            <p><strong>Q&amp;A and Discussion Time</strong></p>
            <ul>
              <li>Allocate time for students to ask questions, provide comments, or share personal experiences.</li>
              <li>Encourage active participation and foster a supportive learning environment.</li>
            </ul>
          </li>
        </ol>
        <h3>Conclusion:</h3>
        <p>In this lesson, we introduced the course &quot;The Ultimate Guide to relocating to the UK via Study
          Path&quot; and emphasized the significance of counseling in the relocation process. We explored the essential
          steps involved in relocating to the UK and highlighted the importance of thorough planning and research.
          Students should now have a better understanding of the course objectives and overall expectations. In the next
          session, we will delve deeper into the specific requirements for studying in the UK and provide detailed
          guidance on university admissions.</p>

      </section>

      <section>
        <h1 class="text-xl font-bold my-1">Extra Resources</h1>
        <div class="flex mt-2 mb-1">
          <p class="m-0 mr-2">Slide Link:</p> <a href=https://youtu.be/dyLaKhePzj8 style="color: blue"
            class="underline">Open Here</a>
        </div>

        <p class="m-0">Video Link:</p>
        <div class="m-0">
          <ol class="m-0">

            <li key={index + 1}><a href=https://youtu.be/0fYi8SGA20k style="color: blue"
                class="underline">https://youtu.be/0fYi8SGA20k</a></li>

            <li key={index + 1}><a href=https://youtu.be/0fYi8SGA20k style="color: blue"
                class="underline">https://youtu.be/0fYi8SGA20k</a></li>

          </ol>
        </div>

      </section>
    </main>

    <div class="materials">
      {{#each materials}}
        {{#if (eq this.type "pdf")}}
          <div class="pdf-material">
            <h3>PDF Material</h3>
            <embed src="{{this.content}}" type="application/pdf" width="100%" height="600px" />
          </div>
        {{else}}
          <!-- ... existing material type handling ... -->
        {{/if}}
      {{/each}}
    </div>

  </div>
</body>

</html>


