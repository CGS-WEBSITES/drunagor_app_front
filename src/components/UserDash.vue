<template>
  <v-main
    style="
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    "
  >
    <v-row no-gutters class="justify-center align-center ml-0 flex-grow-0">
      <v-card
        color="background"
        class="card-overlay full-screen-card"
        :image="
          user.background_hash
            ? assets + '/Profile/' + user.background_hash
            : assets + '/Profile/profile-bg-warriors-transparent.png'
        "
        flat
      >
        <v-card
          color="transparent"
          height="136"
          class="card-overlay1 full-screen-card"
          flat
        ></v-card>
      </v-card>

      <v-col cols="12" class="avatar-mobile pa-0">
        <v-row no-gutters align="end" class="pa-4">
          <v-col cols="auto">
            <v-avatar
              size="100"
              rounded="lg"
              style="
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                cursor: pointer;
                position: relative;
                z-index: 5;
              "
              @click="goToProfile"
            >
              <v-img
                :src="
                  user.picture_hash
                    ? assets + '/Profile/' + user.picture_hash
                    : assets + '/Profile/user.png'
                "
                alt="Profile"
              />
            </v-avatar>
          </v-col>

          <v-col class="ml-n4">
            <div
              class="pa-3 rounded-lg"
              style="
                background-color: rgba(50, 50, 50, 0.7);
                backdrop-filter: blur(5px);
                cursor: pointer;
                padding-left: 32px !important;
                position: relative;
                z-index: 4;
              "
              @click="goToProfile"
            >
              <h5
                class="text-h6 font-weight-bold text-white"
                style="line-height: 1.25rem"
              >
                {{ user.user_name }}
              </h5>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <div
      class="flex-grow-1 move_topo2"
      style="overflow-y: auto; background-color: rgb(var(--v-theme-background))"
    >
      <v-container style="max-width: 500px; padding: 0 16px">
        <DashboardEvents />
      </v-container>
    </div>

    <div class="pa-4 flex-grow-0">
      <v-container style="max-width: 500px; padding: 0">
        <v-toolbar height="96" rounded="lg" class="px-2">
          <v-btn
            icon
            variant="text"
            @click="goToLibrary"
            class="h-100"
            size="large"
          >
            <v-icon>mdi-bookshelf</v-icon>
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
            color="#118D8E"
            variant="flat"
            @click="goToCampaigns"
            size="x-large"
            rounded="lg"
            class="font-weight-bold"
            style="width: 50%; max-width: 220px"
          >
            <v-icon left class="mr-1">mdi-sword-cross</v-icon>
            Play
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
            icon
            variant="text"
            @click="goToEvents"
            class="h-100"
            size="large"
          >
            <v-icon>mdi-calendar</v-icon>
          </v-btn>
        </v-toolbar>
      </v-container>
    </div>
  </v-main>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, inject, onBeforeMount } from "vue";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "vue-router";
import { CampaignStore } from "@/store/CampaignStore";
import {
  HeroDataRepository,
  type HeroData,
} from "@/data/repository/HeroDataRepository";
import { HeroStore } from "@/store/HeroStore";
import { Campaign } from "@/store/Campaign";
import { Hero } from "@/store/Hero";
import { HeroEquipment } from "@/store/Hero";
import axios from "axios";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
// Importe seu componente de DashboardEvents se ele for usado localmente
// import DashboardEvents from '@/components/DashboardEvents.vue';

const router = useRouter();
const userStore = useUserStore();
const user = userStore.user;
const campaignStore = CampaignStore();
const heroStore = HeroStore();
const assets = inject<string>("assets");
const heroDataRepository = new HeroDataRepository();

const loading = ref(true);
const loadingErrors = ref<{ id: number; text: string; visible: boolean }[]>([]);

// --- Funções de Navegação (sem alteração) ---
const goToProfile = () => {
  router.push({ name: "PerfilHome" });
};

const goToLibrary = () => {
  router.push({ name: "Library" });
};

const goToCampaigns = () => {
  router.push({ name: "Campaign Overview" }); // Rota "Play" (Campanhas)
};

const goToEvents = () => {
  router.push({ name: "Events" });
};

// --- Lógica de Negócio (sem alteração) ---
const campaignList = computed(() => {
  return campaignStore.findAll();
});

function getBoxName(boxId: number): string {
  switch (boxId) {
    case 22:
      return "Corebox";
    case 23:
      return "Apocalypse";
    case 34:
      return "Awakenings";
    case 38:
      return "Underkeep Drunagor Nights";
    case 39:
      return "Underkeep Drunagor Nights Season 2";
    default:
      return `Unknown Box (ID: ${boxId})`;
  }
}

function addLoadingError(message: string) {
  const newError = { id: Date.now(), text: message, visible: true };
  loadingErrors.value.push(newError);
  setTimeout(() => {
    removeErrorById(newError.id);
  }, 10000);
}

function removeErrorById(id: number) {
  loadingErrors.value = loadingErrors.value.filter((e) => e.id !== id);
}

function importCampaign(token: string) {
  let data;
  try {
    data = JSON.parse(atob(token));
  } catch (error) {
    throw new Error("Invalid data format (not a valid Base64 or JSON string).");
  }

  if (!("campaignData" in data) || !("heroes" in data)) {
    throw new Error("Incomplete campaign data structure.");
  }

  const campaign: Campaign = data.campaignData;
  campaignStore.add(campaign);

  const heroes = data.heroes as Hero[];
  heroes.forEach((h) => {
    h.campaignId = campaign.campaignId;
    if (typeof h.equipment === "undefined") {
      h.equipment = new HeroEquipment();
    }
    if (typeof h.sequentialAdventureState === "undefined") {
      h.sequentialAdventureState = null;
    }
    heroStore.add(h);
  });
}

function findHeroes(campaignId: string): HeroData[] {
  return heroStore
    .findAllInCampaign(campaignId)
    .map((h) => heroDataRepository.find(h.heroId))
    .filter((h): h is HeroData => !!h);
}

onBeforeMount(async () => {
  campaignStore.reset();
  heroStore.reset();
  loadingErrors.value = [];
  loading.value = true;

  if (!user) {
    loading.fals
e = false;
    return;
  }

  try {
    const res = await axios.get("/rl_campaigns_users/search", {
      params: { users_fk: user.users_pk },
    });

    res.data.campaigns.forEach((element: any) => {
      try {
        importCampaign(element.tracker_hash);
      } catch (e: any) {
        console.error(
          `Failed to import campaign ID: ${element.campaigns_pk}`,
          e,
        );
        const partyName = element.party_name || "Unnamed Campaign";
        const boxName = getBoxName(element.box);
        const errorMessage = `Could not load the campaign "${partyName}" from the "${boxName}". The data seems to be corrupted. Please contact support if the issue persists.`;
        addLoadingError(errorMessage);
      }
    });
  } catch (apiError) {
    console.error("Failed to fetch campaigns from API", apiError);
    addLoadingError(
      "An error occurred while fetching your campaigns. Please try again later.",
    );
  } finally {
    loading.value = false;
  }
});
</script>

<style>
/* CSS do Cabeçalho (Ajustado para o novo 'translateY') */
.avatar-mobile {
  position: relative;
  transform: translateY(-70px);
  z-index: 3;
}

.card-overlay {
  position: relative;
  transform: translateY(-6px);
  z-index: 3;
}

.card-overlay1 {
  position: relative;
  transform: translateY(34px); /* 170px - 136px */
  z-index: 2;
}

.move_topo2 {
  position: relative;
  transform: translateY(-70px);
  z-index: 1;
}

.full-screen-card {
  width: 100%;
  height: 170px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* Outros Estilos */
.v-badge__badge {
  position: absolute;
  top: -5px;
  right: -5px;
  color: rgb(266, green, blue);
}

body {
  font-family: "Poppins", sans-serif !important;
}
</style>