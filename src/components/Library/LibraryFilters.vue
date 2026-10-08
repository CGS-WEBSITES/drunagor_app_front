<template>
  <div class="library-filters">
    <div class="library-filters__status">
      <button
        class="library-filters__toggle library-filters__toggle--owned"
        :class="{ active: status === 'owned' }"
        @click="status = status === 'owned' ? 'all' : 'owned'"
      >
        Owned
      </button>
      <button
        class="library-filters__toggle library-filters__toggle--wish"
        :class="{ active: status === 'wishlist' }"
        @click="status = status === 'wishlist' ? 'all' : 'wishlist'"
      >
        Wishlist
      </button>
    </div>

    <label class="library-filters__label">Find a component</label>
    <v-text-field
      v-model="search"
      placeholder="Hero, monster, boss, item..."
      prepend-inner-icon="mdi-magnify"
      density="compact"
      variant="solo-filled"
      flat
      hide-details
      clearable
    />

    <label class="library-filters__label">Component type</label>
    <v-select
      v-model="componentType"
      :items="componentTypes"
      item-title="label"
      item-value="key"
      placeholder="Any component"
      density="compact"
      variant="solo-filled"
      flat
      hide-details
      clearable
    />

    <label class="library-filters__label">Content</label>
    <v-select
      v-model="content"
      :items="contentGroups"
      placeholder="All content"
      density="compact"
      variant="solo-filled"
      flat
      hide-details
      clearable
    />

    <label class="library-filters__label">Name</label>
    <v-select
      v-model="sort"
      :items="['A - Z', 'Z - A']"
      density="compact"
      variant="solo-filled"
      flat
      hide-details
    />

    <button v-if="hasFilters" class="library-filters__clear" @click="clearFilters">
      <v-icon size="18" class="mr-1">mdi-filter-remove</v-icon> Clear filters
    </button>

    <a v-for="guide in guides" :key="guide.url" :href="guide.url" target="_blank" rel="noopener" class="library-filters__guide">
      <v-icon size="18" class="mr-2">mdi-book-open-variant</v-icon>{{ guide.label }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { COMPONENT_TYPES, CONTENT_GROUPS, generalGuides, type ComponentTypeKey } from "@/data/library";

const status = defineModel<"all" | "owned" | "wishlist">("status", { default: "all" });
const search = defineModel<string | null>("search", { default: "" });
const componentType = defineModel<ComponentTypeKey | null>("componentType", { default: null });
const content = defineModel<string | null>("content", { default: null });
const sort = defineModel<string>("sort", { default: "A - Z" });

const componentTypes = COMPONENT_TYPES;
const contentGroups = CONTENT_GROUPS.map((group) => group.label);
const guides = generalGuides();

const hasFilters = computed(
  () => status.value !== "all" || !!search.value || !!componentType.value || !!content.value,
);

const clearFilters = () => {
  status.value = "all";
  search.value = "";
  componentType.value = null;
  content.value = null;
};
</script>

<style scoped>
.library-filters {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: "Poppins", sans-serif;
}
.library-filters__status {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 8px;
}
.library-filters__toggle {
  padding: 8px;
  border: 2px solid transparent;
  border-radius: 8px;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.55;
  transition: opacity 0.2s ease;
}
.library-filters__toggle.active {
  border-color: rgba(255, 255, 255, 0.85);
  opacity: 1;
}
.library-filters__toggle--owned {
  background: rgb(var(--v-theme-playbutton));
}
.library-filters__toggle--wish {
  background: rgb(var(--v-theme-accent));
}
.library-filters__label {
  margin-top: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}
.library-filters__clear {
  display: flex;
  align-items: center;
  margin-top: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.8;
}
.library-filters__guide {
  display: flex;
  align-items: center;
  margin-top: 8px;
  padding: 8px 10px;
  background: rgba(var(--v-theme-on-surface), 0.06);
  border-radius: 8px;
  color: inherit;
  font-size: 0.78rem;
  text-decoration: none;
}
.library-filters__guide:first-of-type {
  margin-top: 20px;
}
</style>
