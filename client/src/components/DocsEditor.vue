<template>
  <div
    v-if="editor"
    class="flex gap-[10px] flex-wrap mb-[10px]"
  >
    <button
      @click="editor?.chain().focus().toggleBold().run()"
      :disabled="!editor.can().chain().focus().toggleBold().run()"
      :class="{ 'is-active': editor.isActive('bold') }"
    >
      bold
    </button>
    <button
      @click="editor?.chain().focus().toggleItalic().run()"
      :disabled="!editor.can().chain().focus().toggleItalic().run()"
      :class="{ 'is-active': editor.isActive('italic') }"
    >
      italic
    </button>
    <button
      @click="editor?.chain().focus().toggleStrike().run()"
      :disabled="!editor.can().chain().focus().toggleStrike().run()"
      :class="{ 'is-active': editor.isActive('strike') }"
    >
      strike
    </button>
    <button
      @click="editor?.chain().focus().setParagraph().run()"
      :class="{ 'is-active': editor.isActive('paragraph') }"
    >
      paragraph
    </button>
    <button
      @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
      :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
    >
      h1
    </button>
    <button
      @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
      :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
    >
      h2
    </button>
    <button
      @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
      :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
    >
      h3
    </button>
    <button
      @click="editor?.chain().focus().undo().run()"
      :disabled="!editor.can().chain().focus().undo().run()"
    >
      undo
    </button>
    <button
      @click="editor?.chain().focus().redo().run()"
      :disabled="!editor.can().chain().focus().redo().run()"
    >
      redo
    </button>
  </div>
  <editor-content :editor="editor" class="h-[700px] border p-[20px] rounded-lg mb-[30px] overflow-y-auto"/>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const emit = defineEmits<{
  (e: "update:modelValue", html: string): void
}>()

const editor = useEditor({
  content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
  extensions: [StarterKit],
  editorProps: {
    attributes: {
      class: "focus:outline-none",
    },
  },
  onUpdate: () => {
    emit("update:modelValue", editor.value!.getHTML())
  },
})
</script>

<style scoped>
button {
  @apply px-[10px] py-[5px] border border-black rounded-[10px] transition;
}

.is-active {
  @apply bg-black text-white;
}
</style>
