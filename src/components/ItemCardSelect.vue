<template>
  <v-autocomplete
    clearable
    v-model="selectedId"
    :items="items"
    item-title="name"
    item-value="id"
    :label="placeholder"
    :hint="t('label.stash')"
    variant="outlined"
    @input="onStash"
  ></v-autocomplete>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { ItemData } from "@/data/repository/ItemData";
import type { ItemType } from "@/data/type/ItemType";
import type { ItemDataRepository } from "@/data/repository/ItemDataRepository";
import { useI18n } from "vue-i18n";
import { sortBy } from "lodash-es";

const props = defineProps<{
  items: ItemData[];
  itemType: ItemType | null;
  subTypeList: Function;
  value: string | null;
  repository: ItemDataRepository;
}>();
const emit = defineEmits(["clear", "selected", "stash"]);
const placeholder = "Select " + props.itemType;
const selectedId = ref(props.value);

const { t } = useI18n();

let items = computed(() =>
  sortBy(
    props.items.map((item) => {
      return {
        ...item,
        name: t(item.translation_key),
      };
    }),
    ["name"]
  )
);

function onStash() {
  emit("stash");
  selectedId.value = null;
}

watch(selectedId, (newSelectedId) => {
  emit("selected", newSelectedId);
});
</script>

<style scoped></style>
