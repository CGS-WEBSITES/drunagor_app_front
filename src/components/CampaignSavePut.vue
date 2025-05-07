<script setup lang="ts">
import { ref } from 'vue';
import { CampaignStore } from '@/store/CampaignStore';
import { HeroStore } from '@/store/HeroStore';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import { useRoute } from 'vue-router';

const props = defineProps<{ campaignId: string }>();
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const token = ref('');
const { t } = useI18n();
const route = useRoute();

async function saveCampaign() {
  // gera o token
  const campaignCopy = JSON.parse(JSON.stringify(campaignStore.find(props.campaignId)));
  campaignCopy.campaignId = '';
  const heroes = heroStore.findAllInCampaign(props.campaignId);
  const data = {
    campaignData: campaignCopy,
    heroes: heroes.map(h => {
      const clone = JSON.parse(JSON.stringify(h));
      clone.campaignId = '';
      return clone;
    }),
  };
  token.value = btoa(JSON.stringify(data));

  // pega o ID da URL e converte para number
  const { id } = route.params as { id: string };
  const campaigns_pk = Number(id);

  try {
    await axios.put('/campaigns/alter', {
      campaigns_pk,
      tracker_hash: token.value,
    });
    alert(t('label.success')); // ou: alert('Campanha salva com sucesso');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    alert(t('label.error') || msg);
  }
}
</script>

<template>
  <v-btn variant="elevated" id="campaign-export" rounded @click="saveCampaign">
    {{ t('label.save-campaign-put') }}
  </v-btn>
</template>
