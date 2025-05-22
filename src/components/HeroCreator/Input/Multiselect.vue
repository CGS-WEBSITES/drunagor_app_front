<script setup lang="ts">
  import { IMultiselectOption } from '@boardmeister/antetype-conditions';
  import {ITemplateDesignerModules} from "@/type/templateDesigner";
  const props = defineProps(['input', 'modules'])
  const choices = ref<string[]|null>(null);
  const getModules = () => props.modules as ITemplateDesignerModules;
  const getOptions = (): IMultiselectOption[] =>  props.input?.input?.options ?? [];
  const updateChoices = (): void => {
    for (const option of getOptions()) {
      option.checked = choices.value!.indexOf(option.value) !== -1;
    }

    const view = getModules().core.view;
    void view.recalculate().then(() => {
      view.redraw();
    })
  }
</script>

<template>
  <select v-model="choices" multiple @change="updateChoices" :size="getOptions().length">
    <option v-for="option in getOptions()"
            :value="option.value"
            :selected="option.checked">
      {{ option.label }}
    </option>
  </select>
</template>

<style scoped>
  select[multiple] option:checked {
    background: red linear-gradient(0deg, red 0%, red 100%);
  }
</style>
