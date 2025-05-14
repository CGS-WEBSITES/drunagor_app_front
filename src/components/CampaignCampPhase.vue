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
  <v-btn variant="elevated" id="camp-phase" class="px-6 my-2" rounded @click="openModal">
    <v-icon start>mdi-campfire</v-icon>
    {{ t("label.camp-phase") }}
  </v-btn>
  <v-dialog v-model="visible" modal>
    <v-card>
      <v-card-title class="text-center">
        {{ t("label.camp-phase") }}
      </v-card-title>
      <v-card-text>
        <span>{{ t("text.reset-state") }}</span>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-action>
        <v-row no-gutters>
          <v-col cols="12" class="d-flex flex-row justify-center">
            <v-btn variant="text" @click="campPhase" width="100%">{{
              t("label.yes")
            }}</v-btn>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col cols="12" class="d-flex flex-row justify-center">
            <v-btn
              variant="text"
              @click="closeModal"
              width="100%"
              color="red-accent-2"
              >{{ t("label.no") }}</v-btn
            >
          </v-col>
        </v-row>
      </v-card-action>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
