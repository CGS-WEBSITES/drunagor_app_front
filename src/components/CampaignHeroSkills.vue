<template>
  <v-row no-gutters class="justify-space-around">
    <v-col cols="12" md="2" lg="2" class="skill">
      <h3>{{ t("label.dungeon-role") }}</h3>
      <v-checkbox
        v-for="level in 2"
        :key="'dungeon-role-' + level"
        v-model="selectedSkills"
        :value="'dungeon-role-' + level"
        :label="getSkillLabel('dungeon-role-' + level, level)"
        @update:modelValue="onSkillSelect('dungeon-role-' + level)"
      ></v-checkbox>
    </v-col>
  </v-row>
  <v-divider class="my-4"></v-divider>

  <template v-if="!useNewSkillSystem">
    <v-row no-gutters class="justify-space-around">
      <v-col cols="12" md="2" lg="2" v-for="skill in generalSkills" :key="skill.id" class="skill">
        <h3>{{ t(skill.translationKey) }}</h3>
        <v-checkbox
          v-for="level in 2"
          :key="skill.name + '-' + level"
          v-model="selectedSkills"
          :value="skill.id + '-' + level"
          :label="`${t('label.level')} ${level}`"
        ></v-checkbox>
      </v-col>
    </v-row>
  </template>

  <template v-else>
    <v-row no-gutters class="justify-space-around">
      <v-col v-for="(skillType, index) in skillTypes" :key="skillType" class="text-center" cols="12" md="6">
        <div class="d-flex align-center justify-center mb-2" style="gap: 8px">
          <h3 class="text-capitalize">{{ t("label." + skillType) }}</h3>
          <v-icon size="small" :color="skillTypeColors[skillType]">mdi-cube</v-icon>
        </div>
        
        <v-card
          v-if="getSelectedSkillCard(skillType)"
          @click="openViewSkillModal(getSelectedSkillCard(skillType)!)"
          class="mx-auto"
          width="300"
          height="188"
          hover
        >
          <v-img :src="getSelectedSkillCard(skillType)!.image" cover alt="Skill"></v-img>
        </v-card>
        
        <v-card
          v-else
          @click="openAddSkillModal(skillType)"
          style="border: 2px dashed grey"
          class="d-flex justify-center align-center mx-auto"
          width="300"
          height="188"
          hover
        >
          <v-icon size="x-large" color="grey">mdi-plus</v-icon>
        </v-card>

        <v-divider class="my-6" v-if="index < skillTypes.length - 0"></v-divider>
      </v-col>
    </v-row>
  </template>

  <v-dialog v-model="isCubeColorModalVisible" max-width="400">
    <v-card>
      <v-card-title>{{ t("text.select-action-cube-color") }}</v-card-title>
      <v-card-text>
        <v-list density="compact">
          <v-list-item v-for="color in cubeColors" :key="color" @click="setSelectedCubeColor(color)">
            <v-list-item-title class="d-flex align-center" style="gap: 16px">
              <span>{{ t("label." + color.toLowerCase()) }}</span>
              <CubeIcon :class="'h-5 w-5 ' + color.toLowerCase()" />
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="isAddSkillModalVisible" max-width="700">
    <v-card>
      <v-card-title class="text-capitalize">{{ t('Select Skill') }}: {{ t('label.' + currentSkillType) }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col v-for="card in availableSkillsForModal" :key="card.id" cols="12">
            <v-card @click="selectSkill(card)" hover>
              <v-img :src="card.image" height="240" alt="Skill Card"></v-img>
              <v-card-title class="text-subtitle-1">{{ card.name }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="isViewSkillModalVisible" max-width="500">
    <v-card v-if="skillToView">
      <v-card-title>{{ skillToView.name }}</v-card-title>
      <v-card-text>
        <v-img :src="skillToView.image" alt="Skill Card Detail"></v-img>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="elevated" @click="deleteSkill">{{ t('Delete') }}</v-btn>
        <v-btn @click="isViewSkillModalVisible = false">{{ t('Close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { HeroStore } from "@/store/HeroStore";
import { CubeIcon } from "@heroicons/vue/24/solid";
import { useI18n } from "vue-i18n";
import type { Campaign } from "@/campaign";
import type { HeroData } from "@/data/repository/HeroData";
import {
  underkeepSkillCards,
  findSkillsFor,
  type SkillCard,
} from "@/data/repository/campaign/underkeep/underkeepSkillData.ts";

const props = defineProps<{
  heroId: string;
  campaignId: string;
  campaign: Campaign;
  hero: HeroData;
}>();
const { t } = useI18n();
const heroStore = HeroStore();
const campaignHero = heroStore.findInCampaign(props.heroId, props.campaignId);

const useNewSkillSystem = computed(() => {
  const isUnderkeep = props.campaign.campaign === "underkeep";
  const specialHeroes = ["elros", "vorn", "lorelai", "maya", "jaheen"];
  const isSpecialHero = specialHeroes.includes(props.heroId);
  return isUnderkeep && isSpecialHero;
});

const generalSkills = [
  { id: "melee", name: "Melee", translationKey: "label.melee" },
  { id: "ranged", name: "Ranged", translationKey: "label.ranged" },
  { id: "agility", name: "Agility", translationKey: "label.agility" },
  { id: "wisdom", name: "Wisdom", translationKey: "label.wisdom" },
];
const selectedSkills = ref<string[]>([]);
if (!campaignHero.skillIds) campaignHero.skillIds = [];
selectedSkills.value = [...campaignHero.skillIds];

watch(selectedSkills, (newSkills) => {
  heroStore.findInCampaign(props.heroId, props.campaignId).skillIds = newSkills;
});

const isCubeColorModalVisible = ref(false);
const selectedSkillId = ref("");
const cubeColors: Array<string> = ["Yellow", "Red", "Green", "Blue"];

if (typeof campaignHero.dungeonRoleSkillCubeColors === "undefined") {
  campaignHero.dungeonRoleSkillCubeColors = { rankOne: null, rankTwo: null };
}

function getSkillLabel(skillId: string, level: number): string {
  if (!skillId.startsWith("dungeon-role")) return `${t("label.level")} ${level}`;
  const selectedCubes = campaignHero.dungeonRoleSkillCubeColors;
  const selectedCube = level === 1 ? selectedCubes.rankOne : selectedCubes.rankTwo;
  return selectedCube
    ? `${t("label.level")} ${level} (${t("label." + selectedCube.toLowerCase())})`
    : `${t("label.level")} ${level}`;
}

function onSkillSelect(skillId: string) {
  if (!skillId.startsWith("dungeon-role")) return;
  const wasSelected = selectedSkills.value.includes(skillId);
  if (wasSelected) {
    selectedSkillId.value = skillId;
    isCubeColorModalVisible.value = true;
  } else {
    clearCubeColor(skillId);
  }
}

function clearCubeColor(skillId: string) {
  if (skillId === "dungeon-role-1") campaignHero.dungeonRoleSkillCubeColors.rankOne = null;
  else if (skillId === "dungeon-role-2") campaignHero.dungeonRoleSkillCubeColors.rankTwo = null;
}

function setSelectedCubeColor(color: string) {
  if (selectedSkillId.value === "dungeon-role-1") campaignHero.dungeonRoleSkillCubeColors.rankOne = color;
  else if (selectedSkillId.value === "dungeon-role-2") campaignHero.dungeonRoleSkillCubeColors.rankTwo = color;
  isCubeColorModalVisible.value = false;
}

const skillTypes: Array<'melee' | 'ranged' | 'agility' | 'wisdom'> = ['melee', 'ranged', 'agility', 'wisdom'];
const isAddSkillModalVisible = ref(false);
const isViewSkillModalVisible = ref(false);
const currentSkillType = ref<'melee' | 'ranged' | 'agility' | 'wisdom'>('melee');
const skillToView = ref<SkillCard | null>(null);

const skillTypeColors: { [key: string]: string } = {
  melee: 'yellow',
  ranged: 'red',
  agility: 'green',
  wisdom: 'blue',
};

function getSelectedSkillCard(skillType: string): SkillCard | undefined {
  const foundSkillId = selectedSkills.value.find(id => id.includes(`-${skillType}-`));
  if (!foundSkillId) return undefined;
  return underkeepSkillCards.find(card => card.id === foundSkillId);
}

const availableSkillsForModal = computed(() => {
  return findSkillsFor(props.heroId, currentSkillType.value);
});

function openAddSkillModal(skillType: 'melee' | 'ranged' | 'agility' | 'wisdom') {
  currentSkillType.value = skillType;
  isAddSkillModalVisible.value = true;
}

function openViewSkillModal(card: SkillCard) {
  skillToView.value = card;
  isViewSkillModalVisible.value = true;
}

function selectSkill(cardToSelect: SkillCard) {
  const otherSkills = selectedSkills.value.filter(id => !id.includes(`-${cardToSelect.skillType}-`));
  selectedSkills.value = [...otherSkills, cardToSelect.id];
  isAddSkillModalVisible.value = false;
}

function deleteSkill() {
  if (!skillToView.value) return;
  const skillIdToDelete = skillToView.value.id;
  selectedSkills.value = selectedSkills.value.filter(id => id !== skillIdToDelete);
  isViewSkillModalVisible.value = false;
  skillToView.value = null;
}
</script>

<style scoped>
/* Cores para os ícones de cubo */
.yellow { color: #ffeb3b; }
.red { color: #f44336; }
.green { color: #4caf50; }
.blue { color: #2196f3; }

.skill h3 {
  text-transform: capitalize;
}
</style>