<template>
  <div class="equipment-display pa-4">
    <div class="text-subtitle-2 mb-2">{{ t("label.equipment") }}</div>
    <v-row dense>
      <v-col cols="6" sm="4">
        <div class="equipment-item">
          <v-icon size="small" color="orange-darken-2">mdi-sword</v-icon>
          <span class="equipment-label">{{ t("label.weapon") }}</span>
          <span class="equipment-value">{{
            getItemName(equipment?.weaponId)
          }}</span>
        </div>
      </v-col>

      <v-col cols="6" sm="4">
        <div class="equipment-item">
          <v-icon size="small" color="blue-darken-2"
            >mdi-shield-half-full</v-icon
          >
          <span class="equipment-label">{{ t("label.off-hand") }}</span>
          <span class="equipment-value">{{
            getItemName(equipment?.offHandId)
          }}</span>
        </div>
      </v-col>

      <v-col cols="6" sm="4">
        <div class="equipment-item">
          <v-icon size="small" color="grey-lighten-1">mdi-tshirt-crew</v-icon>
          <span class="equipment-label">{{ t("label.armor") }}</span>
          <span class="equipment-value">{{
            getItemName(equipment?.armorId)
          }}</span>
        </div>
      </v-col>

      <v-col cols="6" sm="4">
        <div class="equipment-item">
          <v-icon size="small" color="purple-lighten-2">mdi-ring</v-icon>
          <span class="equipment-label">{{ t("label.trinket") }}</span>
          <span class="equipment-value">{{
            getItemName(equipment?.trinketId)
          }}</span>
        </div>
      </v-col>

      <v-col cols="6" sm="4">
        <div class="equipment-item">
          <v-icon size="small" color="brown-lighten-1">mdi-bag-personal</v-icon>
          <span class="equipment-label">{{ t("label.bag-slot") }} 1</span>
          <span class="equipment-value">{{
            getItemName(equipment?.bagOneId)
          }}</span>
        </div>
      </v-col>

      <v-col cols="6" sm="4">
        <div class="equipment-item">
          <v-icon size="small" color="brown-lighten-1">mdi-bag-personal</v-icon>
          <span class="equipment-label">{{ t("label.bag-slot") }} 2</span>
          <span class="equipment-value">{{
            getItemName(equipment?.bagTwoId)
          }}</span>
        </div>
      </v-col>
    </v-row>

    <v-divider class="my-3"></v-divider>
    <div class="text-subtitle-2 mb-2">{{ t("label.skills") }}</div>
    <v-row dense>
      <v-col cols="12">
        <div class="skills-container">
          <v-chip
            v-for="skillId in skillIds"
            :key="skillId"
            size="small"
            class="ma-1"
            :color="getSkillColor(skillId)"
            variant="elevated"
          >
            {{ getSkillName(skillId) }}
          </v-chip>
          <span
            v-if="!skillIds || skillIds.length === 0"
            class="text-grey text-caption"
          >
            {{ t("No skills selected") || "No skills selected" }}
          </span>
        </div>
      </v-col>
    </v-row>

    <v-divider class="my-3"></v-divider>
    <div class="text-subtitle-2 mb-2">
      {{ t("label.class-abilities", "Class Abilities") }}
    </div>
    <v-row dense>
      <v-col cols="12">
        <div class="d-flex flex-wrap align-center" style="gap: 4px">
          <v-icon
            v-for="n in 8"
            :key="n"
            :icon="
              n <= classAbilityCount ? 'mdi-star-circle' : 'mdi-circle-outline'
            "
            :color="n <= classAbilityCount ? 'amber-darken-2' : 'grey-darken-1'"
            size="small"
          />
        </div>
      </v-col>
    </v-row>

    <v-divider
      v-if="stashedCardIds && stashedCardIds.length > 0"
      class="my-3"
    ></v-divider>
    <div v-if="stashedCardIds && stashedCardIds.length > 0">
      <div class="text-subtitle-2 mb-2">{{ t("label.stash") }}</div>
      <v-row dense>
        <v-col cols="12">
          <div class="stash-container">
            <v-chip
              v-for="cardId in stashedCardIds"
              :key="cardId"
              size="small"
              class="ma-1"
              variant="tonal"
            >
              {{ getItemName(cardId) }}
            </v-chip>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { usePlayableHeroStore } from "@/store/PlayableHeroStore";
import { CoreItemDataRepository } from "@/data/repository/campaign/core/CoreItemDataRepository";
import type { HeroData } from "@/data/repository/HeroData";

const props = defineProps<{
  playableHeroesPk: number;
  heroStaticData: HeroData | null;
}>();

const { t } = useI18n();
const playableHeroStore = usePlayableHeroStore();
const itemRepository = new CoreItemDataRepository();

const heroView = computed(() =>
  playableHeroStore.findByPk(props.playableHeroesPk),
);
const equipment = computed(() => heroView.value?.state?.equipment);
const skillIds = computed(() => heroView.value?.state?.skillIds || []);
const classAbilityCount = computed(
  () => heroView.value?.state?.classAbilityCount || 0,
);
const stashedCardIds = computed(
  () => heroView.value?.state?.stashedCardIds || [],
);

function getItemName(itemId: string | undefined | null): string {
  if (!itemId) return "—";
  const item = itemRepository.find(itemId);
  return item?.name || itemId;
}

function getSkillName(skillId: string): string {
  const skillMap: Record<string, string> = {
    "melee-1": "Melee I",
    "melee-2": "Melee II",
    "ranged-1": "Ranged I",
    "ranged-2": "Ranged II",
    "agility-1": "Agility I",
    "agility-2": "Agility II",
    "wisdom-1": "Wisdom I",
    "wisdom-2": "Wisdom II",
    "dungeon-role-yellow": "Dungeon Role (Yellow)",
    "dungeon-role-red": "Dungeon Role (Red)",
    "dungeon-role-green": "Dungeon Role (Green)",
    "dungeon-role-blue": "Dungeon Role (Blue)",
  };
  return skillMap[skillId] || skillId;
}

function getSkillColor(skillId: string): string {
  if (skillId.includes("melee") || skillId.includes("yellow"))
    return "yellow-darken-2";
  if (skillId.includes("ranged") || skillId.includes("red"))
    return "red-darken-2";
  if (skillId.includes("agility") || skillId.includes("green"))
    return "green-darken-2";
  if (skillId.includes("wisdom") || skillId.includes("blue"))
    return "blue-darken-2";
  return "grey";
}
</script>

<style scoped>
.equipment-display {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.equipment-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  min-height: 80px;
}

.equipment-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
  text-align: center;
}

.equipment-value {
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-top: 2px;
  word-break: break-word;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.stash-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.text-grey {
  color: rgba(255, 255, 255, 0.5);
}
</style>
