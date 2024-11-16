<script setup lang="ts">
import { ref } from "vue";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["campPhase"]);
const { t } = useI18n();

const visible = ref(false);
const campaignStore = CampaignStore();
const heroStore = HeroStore();

function openModal() {
  visible.value = true;
}
function closeModal() {
  visible.value = false;
}

const props = defineProps<{
  campaignId: string;
}>();

function campPhase() {
  const campaign = campaignStore.find(props.campaignId);
  campaign.statusIds = [];
  campaign.isSequentialAdventure = false;
  campaign.sequentialAdventureRunes = 0;

  heroStore.findAllInCampaign(props.campaignId).forEach((hero) => {
    hero.statusIds = [];
    hero.sequentialAdventureState = null;
  });
  closeModal();
  emit("campPhase");
}
</script>

<template>
  <v-btn variant="outlined" id="camp-phase" @click="openModal">
    {{ t("label.camp-phase") }}
  </v-btn>
  <v-dialog v-model="visible" modal>
    <v-card>
      <v-card-title class="text-center">
        {{ t("label.camp-phase") }}
      </v-card-title>
    </v-card>

    <v-card-text>
      <span>{{ t("text.reset-state") }}</span>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-action>
      <v-btn variant="outlined" @click="campPhase">{{ t("label.yes") }}</v-btn>
      <v-btn variant="outlined" @click="closeModal">{{ t("label.no") }}</v-btn>
    </v-card-action>
  </v-dialog>
</template>

<style scoped></style>
