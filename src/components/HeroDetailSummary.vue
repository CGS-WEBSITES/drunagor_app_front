<template>
  <v-sheet
    rounded="lg"
    border
    class="pa-4"
    style="background-color: #1f2937"
    width="100%"
  >
    <div class="mb-2">
      <div class="text-overline">Class Abilities</div>
      <v-divider class="my-1"></v-divider>
      <div class="d-flex flex-wrap  pa-1" style="gap: 8px">
        <v-chip v-if="classAbilityCount === 0" variant="text" size="small">No abilities unlocked</v-chip>
        <v-chip
          v-for="n in classAbilityCount"
          :key="n"
          variant="elevated"
          color="amber-darken-2"
          size="large"
        >
          <v-icon icon="mdi-star-circle"></v-icon>
        </v-chip>
      </div>
    </div>

    <div class="mb-2">
      <div class="text-overline">Equipment</div>
      <v-divider class="my-1"></v-divider>
      <div v-if="equippedItems.length === 0" class="text-center text-caption pa-2">
        No items equipped.
      </div>
      <v-row v-else dense>
        <v-col
          v-for="item in equippedItems"
          :key="item.id"
          cols="6"
          md="6"
        >
          <v-list-item class="px-0">
            <template #prepend>
              <v-icon :icon="item.icon || 'mdi-shield-sun-outline'" class="mr-3"></v-icon>
            </template>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.slot }}</v-list-item-subtitle>
          </v-list-item>
        </v-col>
      </v-row>
    </div>

    <div class="mb-2">
      <div class="text-overline">Skills</div>
      <v-divider class="my-1"></v-divider>
      <div v-if="learnedSkills.length === 0" class="text-center text-caption pa-2">
        No skills learned.
      </div>
      <v-row v-else class="py-3 ml-0">
        <v-col
          v-for="skill in learnedSkills"
          :key="skill.id"
          cols="12"
          sm="6"
          md="6"
          lg="3"
          class="d-flex justify-center align-center pa-2"
        >
          <v-tooltip :text="skill.name" location="top">
            <template #activator="{ props }">
              <v-img
                v-bind="props"
                :src="skill.image"
                :alt="skill.name"
                class="rounded-lg"
                cover
              >
              </v-img>
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
    </div>

    <div>
      <div class="text-overline">Stash</div>
      <v-divider class="my-1"></v-divider>
      <div v-if="stashedItems.length === 0" class="text-center text-caption pa-2">
        Stash is empty.
      </div>
      <v-list v-else lines="one" bg-color="transparent" density="compact">
        <v-list-item v-for="item in stashedItems" :key="item.id" class="px-0">
          <template #prepend>
            <v-icon :icon="item.icon || 'mdi-treasure-chest-outline'" class="mr-3"></v-icon>
          </template>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { HeroStore } from "@/store/HeroStore";
import { CampaignStore } from "@/store/CampaignStore";
import { CoreItemDataRepository } from "@/data/repository/campaign/core/CoreItemDataRepository";
import { UnderKeepItemDataRepository } from "@/data/repository/campaign/underkeep/UnderKeepItemDataRepository";
import { underkeepSkillCards } from "@/data/repository/campaign/underkeep/underkeepSkillData";

const props = defineProps<{
  campaignId: string;
  heroId: string;
}>();

const heroStore = HeroStore();
const campaignStore = CampaignStore();
const campaign = campaignStore.find(props.campaignId);

const itemRepository = campaign?.campaign === 'underkeep'
  ? new UnderKeepItemDataRepository()
  : new CoreItemDataRepository();

const campaignHero = heroStore.findInCampaign(props.heroId, props.campaignId);

function formatIdToName(id: string): string {
  if (!id) return '';
  return id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const slotNameMap: { [key: string]: string } = {
  weaponId: 'Weapon',
  offHandId: 'Off-Hand',
  armorId: 'Armor',
  trinketId: 'Trinket',
  bagOneId: 'Bag Slot 1',
  bagTwoId: 'Bag Slot 2'
};

const classAbilityCount = computed(() => campaignHero?.classAbilityCount ?? 0);

const equippedItems = computed(() => {
  if (!campaignHero?.equipment) return [];
  
  const items = [];
  const orderedSlots = Object.keys(slotNameMap);

  for (const key of orderedSlots) {
    if (Object.prototype.hasOwnProperty.call(campaignHero.equipment, key)) {
      const itemId = campaignHero.equipment[key];
      if (itemId) {
        const itemData = itemRepository.find(itemId);
        const displayName = itemData?.name || formatIdToName(itemId);
        const slotName = slotNameMap[key] || key;
        items.push({ ...itemData, id: itemId, name: displayName, slot: slotName });
      }
    }
  }
  return items;
});

const stashedItems = computed(() => {
  if (!campaignHero?.stashedCardIds) return [];
  
  return campaignHero.stashedCardIds.map(itemId => {
    const itemData = itemRepository.find(itemId);
    const displayName = itemData?.name || formatIdToName(itemId);
    return { ...itemData, id: itemId, name: displayName };
  }).filter(item => item);
});

const learnedSkills = computed(() => {
  if (!campaignHero?.skillIds) return [];

  return campaignHero.skillIds.map(skillId => {
    return underkeepSkillCards.find(card => card.id === skillId);
  }).filter(skill => skill);
});
</script>