<template>
  <v-main>
    <v-row class="d-none d-md-flex justify-center align-center ml-16">
      <v-col cols="12" sm="10" md="8" class="px-6">
        <v-row no-gutters>
          <v-col cols="4">
            <v-avatar size="236" rounded="0" class="avatar-overlay">
              <v-img
                :src="
                  user.picture_hash
                    ? assets + '/Profile/' + user.picture_hash
                    : assets + '/Profile/user.png'
                "
                alt="Profile"
                style="
                  border: 0.5px solid black;
                  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                  background-color: black;
                "
              />
            </v-avatar>

            <v-card-title class="user_name text-h3">{{
              user.user_name
            }}</v-card-title>
            <v-card-title class="retail_name">(Retailer)</v-card-title>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="d-md-none justify-center align-center ml-0">
      <v-card
        color="background"
        class="card-overlay full-screen-card"
        :image="assets + '/Profile/profile-bg-warriors-transparent.png'"
        flat
      >
        <v-card
          color="primary"
          height="136"
          class="card-overlay1 full-screen-card"
          flat
        ></v-card>
      </v-card>
      <v-col cols="12">
        <v-row no-gutters>
          <v-col cols="8" class="avatar-mobile">
            <v-avatar size="140" rounded="0">
              <v-img
                :src="
                  user.picture_hash
                    ? assets + '/Profile/' + user.picture_hash
                    : assets + '/Profile/user.png'
                "
                alt="Profile"
                style="
                  border: 3.5px solid black;
                  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                  background-color: black;
                "
              />
            </v-avatar>
            <v-card-title class="user_name2 text-h5"
              >{{ user.user_name }} (retailer)</v-card-title
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="mt-4 d-none d-md-flex justify-center align-center ma-0 w-100">
      <v-col cols="12" sm="12" md="8" class="px-6">
        <v-card color="primary" height="116px" class="move_topo pt-12"></v-card>
        <v-card color="background" class="move_topo pt-12">
          <v-row class="mt-2 d-flex justify-center align-center ma-0 w-100">
            <v-col cols="12" sm="12" md="12" class="ml-5 pt-12">
              <v-carousel
                :height="isMobile ? '400px' : 'auto'"
                hide-delimiters
                v-if="isMobile"
              >
                <v-carousel-item
                  v-for="(item, index) in carouselItems"
                  :key="index"
                >
                  <v-row no-gutters class="justify-center">
                    <v-col cols="12">
                      <v-card
                        :style="{ height: isMobile ? '400px' : 'auto' }"
                        class="mx-auto"
                        :disabled="index > 0 ? true : false"
                        @click="router.push(item.route)"
                      >
                        <v-img
                          style="background-color: rgb(0, 0, 0)"
                          :src="item.img"
                          height="500"
                          cover
                          :gradient="
                            index > 0
                              ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)'
                              : false
                          "
                        />
                        <v-card-actions>
                          <v-row class="d-flex justify-center">
                            <v-btn class="text-center">{{ item.label }}</v-btn>
                          </v-row>
                        </v-card-actions>
                        <div
                          v-if="index > 0"
                          style="
                            height: 0px;
                            width: 100%;
                            position: relative;
                            left: 0;
                            bottom: 200px;
                          "
                          class="text-center"
                        >
                          <coming-soon></coming-soon>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-carousel-item>
              </v-carousel>

              <v-row v-else align="center" justify="center">
                <v-col
                  cols="12"
                  md="4"
                  lg="3"
                  v-for="(item, index) in carouselItems"
                  :key="index"
                >
                  <v-hover v-slot="{ isHovering, props }">
                    <v-card
                      color="primary"
                      :class="{ 'on-hover': isHovering }"
                      :elevation="isHovering ? 12 : 2"
                      v-bind="props"
                      :disabled="index > 3 ? true : false"
                      @click="router.push(item.route)"
                    >
                      <v-img
                        :src="item.img"
                        height
                        with
                        cover
                        :gradient="
                          index > 3
                            ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)'
                            : false
                        "
                      />
                    </v-card>
                  </v-hover>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row class="justify-center pb-6 px-0 pl-5 mt-6">
  <v-col cols="12">
    <RetailerDashboardEvents />
  </v-col>
</v-row>

          <v-row no-gutters class="justify-center pb-6 px-6">
            <v-col cols="12" md="12" lg="12">
              <v-card
                @click="router.push({ name: 'CommunityBuilds' })"
                flat
                style="cursor: pointer"
              >
                <v-img
                  src="https://assets.drunagor.app/Dashboard/btn-CB-desk.png"
                />
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="move_topo2 d-md-none justify-center align-center">
      <v-col cols="12" sm="12" md="12" class="px-0">
        <v-row
          class="d-sm justify-center align-center ma-0 w-100"
          justify="center"
        >
          <v-col cols="6" v-for="(item, index) in carouselItems" :key="index">
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                :class="{ 'on-hover': isHovering }"
                :elevation="isHovering ? 12 : 2"
                v-bind="props"
                :disabled="index > 3 ? true : false"
                @click="router.push(item.route)"
              >
                <v-img
                  :src="item.img"
                  height
                  with
                  cover
                  :gradient="
                    index > 3 ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)' : false
                  "
                />
              </v-card>
            </v-hover>
          </v-col>
        </v-row>

              <v-row class="justify-center pb-6 ml-1 mt-">
  <v-col cols="12">
    <RetailerDashboardEvents />
  </v-col>
</v-row>

        <v-row no-gutters class="justify-center pb-6 px-3">
          <v-col cols="12">
            <v-card
              @click="router.push({ name: 'CommunityBuilds' })"
              flat
              style="cursor: pointer"
            >
              <v-img
                src="https://assets.drunagor.app/Dashboard/btn-CB-mobile.png"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-main>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, inject, onBeforeMount } from "vue";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "vue-router";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { HeroStore } from "@/store/HeroStore";
import { Campaign } from "@/store/Campaign";
import { Hero } from "@/store/Hero";
import { HeroEquipment } from "@/store/Hero";
import axios from "axios";

function importCampaign(token: string) {
  const data = JSON.parse(atob(token));
  let campaign: Campaign;

  if ("campaignData" in data) {
    campaign = data.campaignData;
  } else {
    console.log("Not importing campaign data");
    return;
  }

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

onBeforeMount(async () => {
  campaignStore.reset();
  heroStore.reset();

  await axios
    .get("/rl_campaigns_users/search", {
      params: { users_fk: user.users_pk },
    })
    .then((res) => {
      res.data.campaigns.forEach((element) => {
        importCampaign(element.tracker_hash);
      });

      loading.value = false;
    });
});

const campaignStore = CampaignStore();

const campaignList = computed(() => {
  return campaignStore.findAll();
});

const heroStore = HeroStore();

const router = useRouter();

const user = useUserStore().user;

const display = ref(useDisplay());

const assets = inject<string>("assets");

const campFig = (campName: string) => {
  console.log(campName);
  switch (campName) {
    case "apocalypse":
      return assets + "/Dashboard/img-campaigncore.png";
    case "core":
      return "400";
    case "core":
      return "500";
    case "core":
      return "500";
    case "core":
      return "600";
    case "core":
      return "700";
  }
};

// Dados do carrossel
const carouselItems = ref([
  {
    img: "https://assets.drunagor.app/Dashboard/btn-faq-1.0.png",
    label: "FAQ",
    route: { name: "FAQ" },
  },
  {
    img: "https://assets.drunagor.app/Dashboard/btn-skus-2.0.png",
    label: "SKUS MANAGER",
    route: { name: "Library" },
  },
  {
    img: "https://assets.drunagor.app/Dashboard/btn-events-2.0.png",
    label: "EVENTS",
    route: { name: "Events" },
  },
  {
    img: "https://assets.drunagor.app/Dashboard/btn-profile-2.0.png",
    label: "PROFILE",
    route: { name: "PerfilHome" },
  },
]);

const libraryItems = ref([
  {
    name: "COREBOX",
    image: new URL(assets + "/Dashboard/btn-corebox.png", import.meta.url).href,
  },
  {
    name: "DESERT OF HELLSCAR",
    image: new URL(assets + "/Dashboard/btn-hellscar.png", import.meta.url)
      .href,
  },
  {
    name: "APOCALYPSE",
    image: new URL(assets + "/Dashboard/btn-apoc.png", import.meta.url).href,
  },
  {
    name: "AWAKENINGS",
    image: new URL(assets + "/Dashboard/btn-awakenings.png", import.meta.url)
      .href,
  },
]);

// Variáveis reativas
const showPopup = ref(false);
const dialog = ref(false);
// Configurações de evento para rolagem
onMounted(() => {});

// Verificação de mobile
const isMobile = computed(() => {
  console.log(display.value.mdAndUp);
  return !display.value.mdAndUp;
});

const closeDialog = () => {
  dialog.value = false;
};

const openGoogleMaps = (place: { name: string }) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    place.name,
  )}`;
  window.open(url, "_blank");
};

const heroDataRepository = new HeroDataRepository();

function findHeroes(campaignId: string): HeroData[] {
  const heroes: HeroData[] = [];
  heroStore.findAllInCampaign(campaignId).forEach((hero) => {
    heroes.push(heroDataRepository.find(hero.heroId) ?? ({} as HeroData));
  });

  return heroes;
}
</script>

<style>
.v-badge__badge {
  position: absolute;
  top: -5px;
  right: -5px;
  color: rgb(266, green, blue);
}

.avatar-overlay {
  position: relative;
  transform: translateY(-22px);
  z-index: 2;
}

.avatar-mobile {
  position: relative;
  transform: translateY(-130px);

  z-index: 3;
}

.card-overlay {
  position: relative;
  transform: translateY(-6px);
  z-index: 3;
}

.card-overlay1 {
  position: relative;
  transform: translateY(96px);
  z-index: 2;
}

.user_name {
  position: relative;
  transform: translateY(-185px) translateX(234px);
  z-index: 2;
}

.retail_name {
  position: relative;
  transform: translateY(-200px) translateX(234px);
  z-index: 2;
}

.user_name2 {
  position: relative;
  transform: translateY(-85px) translateX(130px);
  z-index: 2;
}

.move_topo {
  position: relative;
  transform: translateY(-330px);
}

.move_topo2 {
  position: relative;
  transform: translateY(-180px) translateX(12px);
}

.full-screen-card {
  width: 100vw;
  height: 24vh;
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

.library-item {
  width: 100%;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: left;
  padding-left: 16px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  overflow: hidden;
}

.library-item2 {
  transform: translateY(-195px);
  width: 100%;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: left;
  padding-left: 16px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  overflow: hidden;
}

.librarytext {
  transform: translateY(-195px);
}

.library-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
}
</style>
