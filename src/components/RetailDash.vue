<template>
  <v-col
    cols="12"
    md="6"
    class="mx-auto pa-0 elevation-8 rounded-lg"
    style="
      height: 90vh;
      max-height: 850px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    "
  >
    <v-row no-gutters class="justify-center align-center ml-0 flex-grow-0">
      <v-card
        color="background"
        class="card-overlay full-screen-card"
        :image="assets + '/Profile/profile-bg-warriors-transparent.png'"
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
                border: 2px solid white;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
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

          <v-col class="ml-4">
            <div
              class="pa-3 rounded-lg"
              style="
                background-color: rgba(50, 50, 50, 0.7);
                backdrop-filter: blur(5px);
                cursor: pointer;
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
      <v-container fluid class="pa-4">
        <DashboardEvents />
      </v-container>
    </div>

    <v-app-bar
      location="bottom"
      :elevation="2"
      height="96"
      class="px-2 flex-grow-0"
    >
      <v-btn stacked variant="text" @click="goToLibrary" class="h-100">
        <v-icon>mdi-bookshelf</v-icon>
        <span>Library</span>
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

      <v-btn stacked variant="text" @click="goToEvents" class="h-100">
        <v-icon>mdi-calendar</v-icon>
        <span>Events</span>
      </v-btn>
    </v-app-bar>
  </v-col>
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
    loading.value = false;
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
/* Estilos do seu código antigo + novos ajustes */
.v-badge__badge {
  position: absolute;
  top: -5px;
  right: -5px;
  color: rgb(266, green, blue);
}

/* O bloco que flutua (avatar + nome) */
.avatar-mobile {
  position: relative;
  /* Puxa o bloco 110px para cima */
  transform: translateY(-110px);
  z-index: 3;
}

.card-overlay {
  position: relative;
  transform: translateY(-6px);
  z-index: 3;
}

.card-overlay1 {
  position: relative;
  transform: translateY(64px); /* 200px - 136px */
  z-index: 2;
}

/* Puxa o conteúdo para cima (mesmo valor do avatar-mobile)
  para que ele deslize por baixo 
*/
.move_topo2 {
  position: relative;
  transform: translateY(-110px);
  z-index: 1;
}

/* O card de background do header */
.full-screen-card {
  width: 100%;
  height: 200px; /* Altura fixa para o background */
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

body {
  font-family: "Poppins", sans-serif !important;
}

/* A classe .user_name2 foi removida */
</style>