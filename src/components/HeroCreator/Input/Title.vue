<script setup lang="ts">
  import { ITitleInputHandler } from '@boardmeister/antetype-conditions';
  import { ITemplateDesignerModules } from "@/type/templateDesigner";

  const props = defineProps(['input', 'modules']);
  const input = ref<HTMLInputElement>(null);
  const getInput = () => props.input.input as ITitleInputHandler;
  const getModules = () => props.modules as ITemplateDesignerModules;
  const text = ref(getInput().value);

  const update = (): void => {
    getInput().value = text.value;
    const view = getModules().core.view;
    void view.recalculate().then(() => {
      view.redraw();
    })
  }

  onMounted(() => {
    if (input.value) {
      setTimeout(() => {
        input.value.focus()
      });
    }
  })
</script>

<template>
  <input ref="input" v-model="text" @input="update"
         class="w-100 bg-white d-block rounded px-1 py-1 input-remove-default">
</template>

<style scoped>
  .input-remove-default:focus-visible {
    outline: none;
  }
</style>
