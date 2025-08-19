<template>
  <span :data-testid="'campaign-log-status-' + heroId">
    <template v-if="isAdmin && !loading">
      <v-select
        v-model="statusIds"
        clearable
        chips
        :label="$t('text.add-or-remove-status')"
        :hint="$t('text.status-info')"
        :items="statuses"
        item-title="name"
        item-value="id"
        multiple
        variant="outlined"
      ></v-select>
    </template>

    <template v-else-if="!loading">
      <v-text-field
        :model-value="statusDisplayText"
        :label="$t('text.add-or-remove-status')"
        variant="outlined"
        readonly
        persistent-hint
        class="mb-4"
        :disabled="!isAdmin"
      ></v-text-field>
    </template>

    <template v-else>
      <v-text-field
        :label="$t('text.add-or-remove-status')"
        variant="outlined"
        loading
        readonly
        class="mb-4"
        :disabled="!isAdmin"
      ></v-text-field>
    </template>

    <v-sheet
      v-if="statusIds.length > 0"
      rounded
      border="md"
      class="mb-6 pa-6 text-white"
      style="background-color: #1f2937 !important"
    >
      <ul>
        <li
          class="py-1"
          v-for="status in findStatuses(statusIds)"
          :key="status.id"
        >
          {{ status.name }}
          <div class="px-4 font-italic" v-if="status.effect">
            {{ status.effect }}
          </div>
        </li>
      </ul>
    </v-sheet>
  </span>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import type { Status } from "@/data/repository/campaign/Status";
import { HeroStore } from "@/store/HeroStore";
import { useUserStore } from "@/store/UserStore";
import type { StatusRepository } from "@/data/repository/campaign/StatusRepository";
import { useI18n } from "vue-i18n";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import axios from "axios";

const props = defineProps<{
  heroId: string;
  campaignId: string;
  repository: StatusRepository;
}>();

const heroStore = HeroStore();
const userStore = useUserStore();
const configurationStore = ConfigurationStore();
const { t } = useI18n();

const statusIds = ref([] as string[]);
const isAdmin = ref(false);
const loading = ref(true);

props.repository.load(configurationStore.enabledLanguage);

const statuses = props.repository.findAll();

statusIds.value =
  heroStore.findInCampaign(props.heroId, props.campaignId).statusIds ?? [];

const statusDisplayText = computed(() => {
  if (statusIds.value.length === 0) {
    return t('text.no-status', 'No status applied');
  }
  
  const activeStatuses = findStatuses(statusIds.value);
  return activeStatuses.map(status => status.name).join(', ');
});

const checkUserRole = async () => {
  try {
    const response = await axios.get("rl_campaigns_users/search", {
      params: { 
        users_fk: userStore.user?.users_pk, 
        campaigns_fk: props.campaignId 
      },
    });
    isAdmin.value = response.data.campaigns[0]?.party_role === "Admin";    
  } catch (error) {
    console.error("CampaignLogStatus - Error fetching user role:", error);
    isAdmin.value = false;
  } finally {
    loading.value = false;
  }
};

function findStatuses(statusIds: string[]): Status[] {
  const statuses: Status[] = [];
  statusIds.forEach((statusId) => {
    let status = props.repository.find(statusId);
    if (status) {
      statuses.push(status);
    }
  });

  return statuses;
}

watch(statusIds, (newStatusIds) => {
  if (isAdmin.value) {
    heroStore.findInCampaign(props.heroId, props.campaignId).statusIds = newStatusIds;
  } else {
    console.log('CampaignLogStatus - Cannot update - not admin');
  }
});

onMounted(async () => {
  await checkUserRole();
});
</script>

<style scoped></style>