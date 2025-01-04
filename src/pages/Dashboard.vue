<template>
  <!-- Profile Section -->
   <v-main>
    <v-row class="mt-4 d-flex justify-center align-center ma-0 w-100">
      <v-col cols="12" sm="10" md="8" class="px-6">
      <v-card>
        <v-row no-gutters>
          <v-col cols="3">
            <v-avatar size="100">
              <v-img src="@/assets/libraryy.png" alt="Profile" />
            </v-avatar>
          </v-col>
          <v-col cols="9">
           
    <!-- Exibe o username -->
    <v-card-title>{{ appStore.getUsername() }}</v-card-title>
    

            <v-card-subtitle>RANKING: 5123</v-card-subtitle>
            <!-- Icons below the name -->
            <v-row no-gutters>
              <v-col cols="auto" class="mr-2 pl-3">
                <v-icon>mdi-shield</v-icon>
              </v-col>
              <v-col cols="auto" class="mr-2">
                <v-icon>mdi-sword</v-icon>
              </v-col>
              <v-col cols="auto" class="mr-2">
                <v-icon>mdi-book</v-icon>
              </v-col>
              <v-col cols="auto">
                <v-icon>mdi-map</v-icon>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>

  <!-- Navigation Drawer -->
  

<!-- Navigation Boxes Section -->
<v-row class="mt-2 d-flex justify-center align-center ma-0 w-100">
  <v-col cols="12" sm="10" md="8" class="px-6">
    <!-- Primeiro Carrossel para dispositivos móveis -->
    <v-carousel :height="isMobile ? '400px' : 'auto'" hide-delimiters v-if="isMobile">
      <v-carousel-item v-for="(item, index) in carouselItems" :key="index">
        <v-card :style="{ height: isMobile ? '400px' : 'auto' }" class="mx-auto">
          <v-img :src="item.img" height="300" cover />
          <v-card-actions>
            <v-row class="d-flex justify-center">
              <v-btn class="text-center">{{ item.label }}</v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-carousel-item>
    </v-carousel>

    <v-row v-else align="center" justify="center">
      <v-col cols="12" md="4" lg="3" v-for="(item, index) in carouselItems" :key="index">
        <v-card class="border">
          <v-img :src="item.img" height="300" cover />
          <v-card-actions>
            <v-row class="d-flex justify-center">
              <v-btn class="text-center">{{ item.label }}</v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</v-row>

<!-- Carousel Section -->
<v-row
  v-if="isMobile"
  class="mt-4 d-flex justify-center align-center ma-0 w-100"
>
  <v-col cols="12" sm="10" md="9" class="px-8">
    <!-- Segundo Carrossel -->
    <v-carousel :height="isMobile ? '400px' : 'auto'" hide-delimiters>
      <v-carousel-item v-for="i in 6" :key="`mobile-${i}`">
        <v-card :style="{ height: isMobile ? '400px' : 'auto' }" class="mx-auto">
          <v-img src="@/assets/campaign.jpg" height="300" cover />
          <v-card-title>Campaign 0%</v-card-title>
          <v-card-subtitle>Chronicles of Drunagor: Age of Darkness</v-card-subtitle>
          <v-card-subtitle>Door X: in battle/exploring/finished</v-card-subtitle>
        </v-card>
      </v-carousel-item>
    </v-carousel>
  </v-col>
</v-row>

<v-row
  v-else
  class="mt-4 d-flex justify-center align-center w-100"
  no-gutters
>
  <v-col cols="12" sm="10" md="8" class="px-5 mb-0">
    <v-carousel hide-delimiters>
      <v-carousel-item v-for="i in 3" :key="`desktop-${i}`">
        <v-row>
          <v-col cols="6">
            <v-card class="mx-auto">
              <v-img src="@/assets/campaign.jpg" height="200" cover />
              <v-card-title>Campaign 0%</v-card-title>
              <v-card-subtitle>Chronicles of Drunagor: Age of Darkness</v-card-subtitle>
              <v-card-subtitle>Door X: in battle/exploring/finished</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="mx-auto">
              <v-img src="@/assets/campaign.jpg" height="200" cover />
              <v-card-title>Campaign 0%</v-card-title>
              <v-card-subtitle>Awakenings</v-card-subtitle>
              <v-card-subtitle>Door X: in battle/exploring/finished</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </v-col>
</v-row>




  <!-- Main Event Cards Section -->
  <v-row class="mt-4 d-flex justify-center align-center ma-0 w-100 " >
    <v-col cols="12" sm="10" md="8" class="px-2 bg-black rounded">
      <v-card-text
        class="text-h4 white--text color-white bg-black "
        color="white"
      >
        EVENTS
      </v-card-text>

      <!-- Main Event Cards -->
      <v-row class="mt-4 d-flex justify-center align-center ma-0 w-100" >
        <!-- Next Section (visible on desktop, hidden on mobile) -->
        <v-col cols="12" md="6">
          <v-card class="pa-4" color="grey-darken-4" dark>
            <v-card-title class="white--text hidden-sm-and-down"
              >Next</v-card-title
            >
            <!-- Container com rolagem -->
            <div style="max-height: 300px; overflow-y: auto">
              <v-list>
                <v-list-item
                  v-for="i in 10"
                  :key="i"
                  class="mb-4"
                  color="rgba(0,0,0,0.6)"
                  elevation="6"
                  shaped
                  @click="openDialog(i)"
                >
                  <v-list-item-content>
                    <v-row>
                      <v-col cols="3">
                        <v-avatar size="60">
                          <v-img
                            src="@/assets/perfil.webp"
                            alt="Profile"
                          ></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col cols="6">
                        <v-list-item-title class="text-h6 white--text">
                          EVENTO DE LANÇAMENTO DRUNAGOR APP {{ i }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                          class="text-subtitle-2 white--text"
                        >
                          JORGINHO ULTIMATE MEGA STORE PLUS
                        </v-list-item-subtitle>
                      </v-col>
                      <v-col cols="3" class="text-right">
                        <v-icon
                          color="red"
                          size="40"
                          @click.stop="openGoogleMaps"
                          >mdi-map-marker</v-icon
                        >
                        <v-list-item-subtitle
                          class="text-subtitle-1 white--text"
                          >12/29/24</v-list-item-subtitle
                        >
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </v-card>
        </v-col>

        <!-- Count Me In Section (visible on desktop, hidden on mobile) -->
        <v-col cols="12" md="6">
          <v-card class="pa-4 hidden-sm-and-down" color="grey-darken-4" dark>
            <v-card-title class="white--text hidden-sm-and-down"
              >Count Me In</v-card-title
            >
            <div style="max-height: 300px; overflow-y: auto">
              <v-list>
                <v-list-item
                  v-for="i in 10"
                  :key="i"
                  class="mb-4"
                  color="rgba(0,0,0,0.6)"
                  elevation="6"
                  shaped
                  @click="openDialog(i)"
                >
                  <v-list-item-content>
                    <v-row>
                      <v-col cols="3">
                        <v-avatar size="60">
                          <v-img
                            src="@/assets/perfil.webp"
                            alt="Profile"
                          ></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col cols="6">
                        <v-list-item-title class="text-h6 white--text">
                          EVENTO DE LANÇAMENTO DRUNAGOR APP {{ i }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                          class="text-subtitle-2 white--text"
                        >
                          JORGINHO ULTIMATE MEGA STORE PLUS
                        </v-list-item-subtitle>
                      </v-col>
                      <v-col cols="3" class="text-right">
                        <v-icon
                          color="red"
                          size="40"
                          @click.stop="openGoogleMaps"
                          >mdi-map-marker</v-icon
                        >
                        <v-list-item-subtitle
                          class="text-subtitle-1 white--text"
                          >12/29/24</v-list-item-subtitle
                        >
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Dialog for Event Details -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title
            class="headline d-flex justify-space-between align-center"
            style="padding-right: 16px"
          >
            <span>EVENTO DE LANÇAMENTO DRUNAGOR APPD</span>
            <v-btn
              icon
              @click="closeDialog"
              style="position: absolute; top: 8px; right: 8px"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-subtitle>
            *event description* Lorem Ipsum is simply dummy text of the printing
            and typesetting industry.
          </v-card-subtitle>

          <v-card-text>
            <v-row>
              <v-col cols="12" sm="4">
                <v-avatar size="100">
                  <v-img src="@/assets/perfil.webp" alt="Event"></v-img>
                </v-avatar>
              </v-col>
              <v-col cols="12" sm="8">
                <v-list-item-title
                  >JORGINHO ULTIMATE MEGA STORE PLUS</v-list-item-title
                >
                <v-list-item-subtitle
                  >Engenheiro José Carlos de Morais Sarmento,
                  5747</v-list-item-subtitle
                >
                <v-row>
                  <v-col cols="auto">
                    <v-icon>mdi-shield</v-icon>
                    <v-icon>mdi-sword</v-icon>
                    <v-icon>mdi-book</v-icon>
                    <v-icon>mdi-map</v-icon>
                  </v-col>
                  <v-col class="d-flex justify-end">
                    <v-icon>mdi-facebook</v-icon>
                    <v-icon>mdi-instagram</v-icon>
                    <v-icon>mdi-twitter</v-icon>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-card-subtitle class="mt-4">REWARDS:</v-card-subtitle>
            <v-list-item>
              <v-avatar size="60">
                <v-img src="@/assets/perfil.webp"></v-img>
              </v-avatar>
              <v-list-item-content>
                <v-list-item-title>Reward Name</v-list-item-title>
                <v-list-item-subtitle
                  >Reward description goes here...</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-avatar size="60">
                <v-img src="@/assets/perfil.webp"></v-img>
              </v-avatar>
              <v-list-item-content>
                <v-list-item-title>Drunagor APP Badges</v-list-item-title>
                <v-list-item-subtitle
                  >Check-in at the event to get an exclusive
                  badge!</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-card-text>

          <v-divider></v-divider>

          <!-- Updated Button Section -->
          <v-card-actions>
            <v-row class="d-flex justify-space-between">
              <v-col>
                <v-btn
                  block
                  color="#a87945"
                  class="text-uppercase white--text"
                  @click="closeDialog"
                  >MAYBE I'LL GO</v-btn
                >
              </v-col>
              <v-col>
                <v-btn
                  block
                  color="green darken-1"
                  class="text-uppercase white--text"
                  @click="closeDialog"
                  >COUNT ME IN</v-btn
                >
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>

  <!-- My Library Section -->

  <!-- Title for My Library -->
  <v-row class="mt-4 d-flex justify-center align-center ma-0 w-100" >
    <v-col cols="12" sm="10" md="8" class="px-6">
    <v-card-title class="text-h5 font-weight-bold">MY LIBRARY</v-card-title>
  </v-col>
</v-row>


<v-row class="mt-4 justify-center ma-0">
  <v-col cols="12" sm="10" md="8">
    <v-row justify="center" align="center">
      <v-col cols="12" md="6" class="d-flex justify-center">
        <v-btn color="grey darken-2" class="white--text w-100 mb-4" height="60">
          AWAKENINGS
        </v-btn>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-center">
        <v-btn color="grey darken-2" class="white--text w-100 mb-4" height="60">
          COREBOX
        </v-btn>
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-col cols="12" md="6" class="d-flex justify-center">
        <v-btn color="grey darken-2" class="white--text w-100 mb-4" height="60">
          APOCALYPSE
        </v-btn>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-center">
        <v-btn color="grey darken-2" class="white--text w-100 mb-4" height="60">
          RISE OF THE UNDEAD DRAGON
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</v-row>

<!-- Manage Library Button -->
<v-row class="mt-4">
  <v-col cols="12" class="text-right">
    <v-btn small outlined color="black"> MANAGE LIBRARY </v-btn>
  </v-col>
</v-row>


 





  <!-- Notification Button -->
  <v-row class="position-fixed bottom-0 right-0 mb-16 mr-6">
    <v-col cols="auto">
      <v-badge color="red" content="10" overlap>
        <v-btn fab dark color="black" @click="showPopup = !showPopup">
          <v-icon>mdi-bell</v-icon>
        </v-btn>
      </v-badge>
    </v-col>
  </v-row>

  <!-- Notification Dialog -->
  <v-dialog v-model="showPopup" max-width="600px">
    <v-card>
      <v-card-title>Notificações</v-card-title>
      <v-card-text>
        <!-- Conteúdo do diálogo -->
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="showPopup = false">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-main>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAppStore } from "@/store/app";


const appStore = useAppStore();


// Controle de visibilidade do menu de navegação inferior
const bottomNavVisible = ref(true);

// Função de controle de rolagem para mostrar/ocultar o menu de navegação inferior
function handleScroll() {
  bottomNavVisible.value = window.scrollY <= 100; // Ajuste conforme necessário
}

// Configurações de evento para rolagem
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  isMobile.value = window.innerWidth <= 600;
  window.addEventListener("resize", () => {
    isMobile.value = window.innerWidth <= 600;
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

// Verificação de mobile
const isMobile = ref(false);

// Dados do carrossel
const carouselItems = ref([
  {
    img: new URL("@/assets/Corebox.png", import.meta.url).href,
    label: "LIBRARY",
  },
  {
    img: new URL("@/assets/perfil.webp", import.meta.url).href,
    label: "CAMPAIGN",
  },
  {
    img: new URL("@/assets/events.jpg", import.meta.url).href,
    label: "EVENTS",
  },
  {
    img: new URL("@/assets/leaderboard.jpg", import.meta.url).href,
    label: "LEADERBOARD",
  },
]);

// Variáveis reativas
const showPopup = ref(false);
const dialog = ref(false);
const drawer = ref(false); // Controle do drawer lateral

// Itens do menu de navegação
const menuItems = ref([
  { title: "Dashboard", icon: "mdi-view-dashboard" },
  { title: "Campaign", icon: "mdi-flag" },
  { title: "Library", icon: "mdi-book" },
  { title: "Profile", icon: "mdi-account" },
  { title: "Events", icon: "mdi-calendar" },
]);


const closeDialog = () => {
  dialog.value = false;
};

const openGoogleMaps = (place: { name: string }) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    place.name
  )}`;
  window.open(url, "_blank");
};
</script>






<style>


.v-badge__badge {
  position: absolute;
  top: -5px;
  right: -5px;
}
</style>