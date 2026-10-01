<template>
  <div class="equip">
    <div class="sheet-title-row">
      <h3 class="sheet-title">Equipment</h3>
    </div>
    <div class="equip__filters">
      <v-switch
        v-model="filterProficiencies"
        color="#2e9e3a"
        density="compact"
        hide-details
        inset
        label="Only usable"
        class="equip__filter ios-switch"
      >
        <template #thumb="{ model }">
          <v-icon v-if="model.value" size="12" color="#2e9e3a">mdi-check</v-icon>
        </template>
      </v-switch>
      <v-switch
        v-if="sources?.length"
        v-model="allBoxes"
        color="#2e9e3a"
        density="compact"
        hide-details
        inset
        label="All boxes"
        class="equip__filter ios-switch"
      >
        <template #thumb="{ model }">
          <v-icon v-if="model.value" size="12" color="#2e9e3a">mdi-check</v-icon>
        </template>
      </v-switch>
    </div>

    <!-- Every slot: pick, swap (click the item) or remove. -->
    <div v-for="slot in slots" :key="slot.key" class="equip__slot" :class="{ 'equip__slot--bags': slot.key === 'bagOneId' }">
      <span class="equip__label"><SlotIcon :type="slot.iconType" :size="18" class="mr-2" />{{ slot.label }}</span>

      <div v-if="state.equipment[slot.key] && picking !== slot.key" class="item-line">
        <div class="item-row">
          <button class="item-row__text item-row__swap" :title="`Change ${slot.label.toLowerCase()}`" @click="picking = slot.key">
            <strong>{{ itemName(state.equipment[slot.key]) }}</strong>
            <small>{{ rowSub(state.equipment[slot.key]) }}</small>
          </button>
          <v-icon size="16" class="item-row__pencil">mdi-pencil</v-icon>
          <ItemSourceMarks :item-id="state.equipment[slot.key]" symbols />
          <button class="item-row__btn item-row__btn--stash" title="Move to the stash" aria-label="Move to the stash" @click="stashSlot(slot.key)">
            <SlotIcon type="Stash" :size="18" />
          </button>
        </div>
        <button class="item-row__icon" title="Remove" @click="state.equipment[slot.key] = ''">
          <v-icon size="20">mdi-delete</v-icon>
        </button>
      </div>

      <button v-else-if="picking !== slot.key" class="item-empty" @click="picking = slot.key">
        <v-icon size="18">mdi-plus</v-icon>Choose {{ slot.label.toLowerCase() }}
      </button>

      <!-- Picking: the current item (if any) is pre-selected; Esc or clicking away cancels. -->
      <v-autocomplete
        v-else
        :model-value="state.equipment[slot.key] || null"
        :items="optionsFor(slot)"
        item-title="name"
        item-value="id"
        :placeholder="`Search ${slot.label.toLowerCase()}`"
        variant="solo"
        density="compact"
        flat
        hide-details
        class="equip__select"
        prepend-inner-icon="mdi-magnify"
        autofocus
        menu
        @update:model-value="(id: string | null) => { if (id) state.equipment[slot.key] = id; picking = null; }"
        @update:menu="(open: boolean) => !open && picking === slot.key && (picking = null)"
      >
        <template #item="{ props: itemProps, item }">
          <v-list-item v-bind="itemProps" :title="undefined">
            <div class="d-flex align-center ga-2">
              <div class="flex-grow-1">
                <div class="text-body-2 font-weight-bold">{{ item.raw.name }}</div>
                <div class="text-caption opacity-70">{{ item.raw.sub }}</div>
              </div>
              <ItemSourceMarks :item-id="item.raw.id" symbols />
            </div>
          </v-list-item>
        </template>
      </v-autocomplete>
    </div>


    <!-- Stash -->
    <h3 class="sheet-title equip__stash-title">Stash</h3>
    <v-autocomplete
      :model-value="null"
      :items="stashOptions"
      item-title="name"
      item-value="id"
      placeholder="Add an item to the stash"
      variant="solo"
      density="compact"
      flat
      hide-details
      class="equip__select mb-2"
      prepend-inner-icon="mdi-magnify"
      @update:model-value="(id: string | null) => id && state.stashedCardIds.push(id)"
    >
      <template #item="{ props: itemProps, item }">
        <v-list-item v-bind="itemProps" :title="undefined">
          <div class="d-flex align-center ga-2">
            <div class="flex-grow-1">
              <div class="text-body-2 font-weight-bold">{{ item.raw.name }}</div>
              <div class="text-caption opacity-70">{{ item.raw.sub }}</div>
            </div>
            <ItemSourceMarks :item-id="item.raw.id" symbols />
          </div>
        </v-list-item>
      </template>
    </v-autocomplete>
    <p class="equip__hint">Stashed items can't be used during a scenario.</p>

    <div v-for="(id, index) in state.stashedCardIds" :key="`${id}-${index}`" class="item-line">
      <div class="item-row">
        <div class="item-row__text">
          <strong>{{ itemName(id) }}</strong>
          <small>{{ rowSub(id) }}</small>
        </div>
        <ItemSourceMarks :item-id="id" symbols />
        <button class="item-row__btn item-row__btn--equip" title="Equip" aria-label="Equip" @click="equipFromStash(index)">
          <v-icon size="20">mdi-arrow-up-bold</v-icon>
        </button>
      </div>
      <button class="item-row__icon" title="Remove from the stash" @click="state.stashedCardIds.splice(index, 1)">
        <v-icon size="20">mdi-delete</v-icon>
      </button>
    </div>
    <p v-if="!state.stashedCardIds.length" class="equip__empty">The stash is empty.</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { sortBy } from "lodash-es";
import type { Hero, HeroEquipment } from "@/store/Hero";
import type { HeroData } from "@/data/repository/HeroData";
import { heroCanUse } from "@/data/repository/HeroData";
import type { ItemData } from "@/data/repository/ItemData";
import type { ItemType } from "@/data/type/ItemType";
import { allItemsRepository } from "@/data/repository/AllItemsRepository";
import ItemSourceMarks from "@/components/hero-sheet/ItemSourceMarks.vue";
import SlotIcon from "@/components/hero-sheet/SlotIcon.vue";
import type { ItemSource } from "@/data/heroMeta";

// sources: in a campaign, the boxes whose items it can pick by default.
const props = defineProps<{ state: Hero; hero: HeroData; sources?: ItemSource[] }>();
const { t } = useI18n();

type SlotKey = keyof HeroEquipment;
interface Slot {
  key: SlotKey;
  label: string;
  iconType: string;
  type: ItemType | null;
}

const slots: Slot[] = [
  { key: "weaponId", label: "Weapon", iconType: "Weapon", type: "Weapon" },
  { key: "offHandId", label: "Off hand", iconType: "Off Hand", type: "Off Hand" },
  { key: "armorId", label: "Armor", iconType: "Armor", type: "Armor" },
  { key: "trinketId", label: "Trinket", iconType: "Trinket", type: "Trinket" },
  // Bag slots hold consumables: potions, scrolls, gems, tools…
  { key: "bagOneId", label: "Bag 1", iconType: "Consumable", type: "Consumable" },
  { key: "bagTwoId", label: "Bag 2", iconType: "Consumable", type: "Consumable" },
];


const filterProficiencies = ref(true);

// Slot being filled right now (its search is open).
const picking = ref<SlotKey | null>(null);

const itemName = (id: string) => {
  const item = allItemsRepository.find(id);
  return item ? t(item.translation_key) : id;
};

// In a row the slot says what it is: just the kinds (Heavy | Light…).
const rowSub = (id: string) => {
  const item: any = allItemsRepository.find(id);
  if (!item) return "";
  const kinds = item.weaponTypes ?? item.offHandTypes ?? item.armorTypes ?? (item.consumableType ? [item.consumableType] : []);
  return kinds.length ? kinds.join(" | ") : item.itemType;
};

const itemSub = (id: string) => {
  const item: any = allItemsRepository.find(id);
  if (!item) return "";
  const kinds = item.weaponTypes ?? item.offHandTypes ?? item.armorTypes ?? (item.consumableType ? [item.consumableType] : []);
  return [item.itemType, ...(kinds.length ? [kinds.join(" | ")] : [])].join(" · ");
};


// In a campaign, only its own boxes unless "All boxes" is on.
const allBoxes = ref(false);
const inSources = (item: ItemData) =>
  !props.sources?.length || allBoxes.value || allItemsRepository.sourcesOf(item.id).some((source) => props.sources!.includes(source));

const toOption = (item: ItemData) => ({ id: item.id, name: t(item.translation_key), sub: itemSub(item.id) });

const optionsFor = (slot: Slot) => {
  const items = slot.type ? allItemsRepository.findByType(slot.type, null) : allItemsRepository.findAll();
  const usable = items
    .filter(inSources)
    .filter((item) => !slot.type || !filterProficiencies.value || heroCanUse(props.hero, item));
  return sortBy(usable.map(toOption), ["name"]);
};

const stashOptions = computed(() => sortBy(allItemsRepository.findAll().filter(inSources).map(toOption), ["name"]));

function stashSlot(key: SlotKey) {
  const id = props.state.equipment[key];
  if (!id) return;
  props.state.stashedCardIds.push(id);
  props.state.equipment[key] = "";
}

// Equip goes to the item's own slot, swapping what was there into the stash.
// Consumables take the first free bag slot.
function equipFromStash(index: number) {
  const id = props.state.stashedCardIds[index];
  const type = allItemsRepository.find(id)?.itemType;
  const bags: SlotKey[] = ["bagOneId", "bagTwoId"];
  const typed = type === "Consumable" ? undefined : slots.find((slot) => slot.type && slot.type === type);
  const target: SlotKey = typed ? typed.key : bags.find((key) => !props.state.equipment[key]) ?? "bagOneId";
  const previous = props.state.equipment[target];
  props.state.stashedCardIds.splice(index, 1);
  if (previous) props.state.stashedCardIds.push(previous);
  props.state.equipment[target] = id;
}
</script>

<style scoped>
/* Filters on their own line, under the title. */
.equip__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  margin: -6px 0 12px;
}
.equip__filter {
  flex: 0 0 auto;
}
.equip__filter :deep(.v-label) {
  font-size: 0.75rem;
  opacity: 0.8;
}
.item-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 46px;
  padding: 0 12px;
  border: 1px dashed rgba(255, 255, 255, 0.22);
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.7;
  transition: border-color 0.15s ease, opacity 0.15s ease;
}
.item-empty:hover {
  border-color: rgb(var(--v-theme-accent));
  opacity: 1;
}
/* Clicking the item swaps it. */
.item-row__swap {
  align-self: stretch;
  justify-content: center;
  text-align: left;
  cursor: pointer;
}
.item-row__pencil {
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.item-row:hover .item-row__pencil {
  opacity: 0.6;
}
.equip__add {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}
.equip__add-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border: 1px dashed rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.8;
  transition: border-color 0.15s ease, opacity 0.15s ease;
}
.equip__add-btn:hover {
  border-color: rgb(var(--v-theme-accent));
  opacity: 1;
}
.equip__slot {
  margin-bottom: 10px;
}
.equip__slot--gap {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.equip__label {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
}
.equip__select {
  min-width: 0;
}
.equip__select :deep(.v-field) {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  font-size: 0.85rem;
}
.equip__hint,
.equip__empty {
  margin: 0 0 8px;
  font-size: 0.75rem;
  opacity: 0.55;
}
.equip__stash-title {
  margin: 24px 0 10px;
}
.equip__slot--bags {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}
/* A row plus its trash button, outside the row. */
.item-line {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}
.item-row {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;
  min-width: 0;
  min-height: 46px;
  overflow: hidden;
  padding-left: 12px;
  background: rgb(var(--v-theme-secondary));
  border-radius: 6px;
}
.item-row__type {
  display: flex;
  flex: 0 0 26px;
  align-items: center;
  justify-content: center;
}
.item-row__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}
.item-row__text strong {
  overflow: hidden;
  font-size: 0.85rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item-row__text small {
  overflow: hidden;
  font-size: 0.7rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.65;
}
/* Stash / Equip sit flush at the end of the row. */
.item-row__btn {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  width: 44px;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  transition: filter 0.15s ease;
}
.item-row__btn:hover {
  filter: brightness(1.15);
}
.item-row__btn--stash {
  background: rgb(var(--v-theme-accent));
}
.item-row__btn--equip {
  background: #4f9a4b;
}
.item-row__icon {
  flex-shrink: 0;
  padding: 4px;
  border-radius: 4px;
  opacity: 0.7;
}
.item-row__icon:hover {
  opacity: 1;
}
/* Switches: grey track, white knob; green with a check when on. */
.ios-switch :deep(.v-switch__track) {
  height: 26px;
  min-width: 46px;
  background: #bdbdbd;
  border: 2px solid rgba(0, 0, 0, 0.15);
  opacity: 1;
}
.ios-switch :deep(.v-selection-control--dirty .v-switch__track) {
  background: #2e9e3a;
}
.ios-switch :deep(.v-switch__thumb) {
  width: 22px;
  height: 22px;
  background: #fff;
  color: #2e9e3a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  transform: none;
}
</style>
