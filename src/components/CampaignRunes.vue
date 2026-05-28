<template>
  <v-number-input
    v-if="isAdmin && !loading"
    :reverse="false"
    controlVariant="split"
    :label="t('text.number-of-runes')"
    :hideInput="false"
    :inset="false"
    variant="outlined"
    id="runes"
    :min="0"
    v-model="runes"
  ></v-number-input>

  <v-text-field
    v-else-if="!loading"
    :model-value="runes"
    :label="t('text.number-of-runes')"
    variant="outlined"
    readonly
    persistent-hint
    :disabled="!isAdmin"
  ></v-text-field>

  <v-text-field
    v-else
    :label="t('text.number-of-runes')"
    variant="outlined"
    loading
    readonly
    :disabled="!isAdmin"
  ></v-text-field>
</template>

<script setup lang="ts">
import { CampaignStore } from "@/store/CampaignStore";
import { useUserStore } from "@/store/UserStore";
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";

const props = defineProps<{
  campaignId: string;
}>();

const { t } = useI18n();
const userStore = useUserStore();
const campaignStore = CampaignStore();

const isAdmin = ref(false);
const loading = ref(true);

const runes = computed({
  get() {
    return campaignStore.find(props.campaignId)?.sequentialAdventureRunes ?? 0;
  },
  set(newValue) {
    if (isAdmin.value) {
      campaignStore.updateCampaignProperty(props.campaignId, 'sequentialAdventureRunes', newValue);
    }
  },
});

const checkUserRole = async () => {
  isAdmin.value = true;
  loading.value = false;
};

onMounted(checkUserRole);
</script>