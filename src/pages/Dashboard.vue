<template>
  <!-- Profile Section -->
  <v-container class="mt-4">
    <v-row align="center" justify="center">
      <!-- Profile Picture and Info -->
      <v-col cols="12" md="8">
        <v-card>
          <v-row no-gutters>
            <v-col cols="3">
              <v-avatar size="100">
                <v-img src="@/assets/library.png" alt="Profile" />
              </v-avatar>
            </v-col>
            <v-col cols="6">
              <v-card-title>MAGOVEIO92MAGI</v-card-title>
              <v-card-subtitle>RANKING: 5123</v-card-subtitle>
              <!-- Icons below the name -->
              <v-row no-gutters>
                <v-col cols="auto" class="mr-2">
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
  </v-container>

  <!-- Navigation Boxes (Library, Campaign, Events, Leaderboard) -->
  <v-container class="mt-4">
    <v-row>
      <v-col cols="12" md="4" lg="3">
        <v-card flat class="border">
          <v-img height="300px" class="align-end text-white text-center" src="@/assets/Corebox.png" cover />
          <v-card-actions>
            <v-row class="d-flex justify-center">
              <v-btn class="text-center">LIBRARY</v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" lg="3">
        <v-card flat class="border">
          <v-img height="300px" class="align-end text-white text-center" src="@/assets/perfil.webp" cover />
          <v-card-actions>
            <v-row class="d-flex justify-center">
              <v-btn class="text-center">CAMPAIGN</v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" lg="3">
        <v-card flat class="border">
          <v-img height="300px" class="align-end text-white text-center" src="@/assets/events.jpg" cover />
          <v-card-actions>
            <v-row class="d-flex justify-center">
              <v-btn class="text-center">EVENTS</v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" lg="3">
        <v-card flat class="border">
          <v-img height="300px" class="align-end text-white text-center" src="@/assets/leaderboard.jpg" cover />
          <v-card-actions>
            <v-row class="d-flex justify-center">
              <v-btn class="text-center">LEADERBOARD</v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Carousel Section (Campaign Progress) -->
  <v-container class="mt-4">
    <v-carousel hide-delimiters height="300px">
      <v-carousel-item v-for="i in 6" :key="i">
        <v-row>
          <v-col cols="6">
            <v-card class="mx-auto">
              <v-img src="@/assets/perfil.webp" height="200" />
              <v-card-title>Campaign 0%</v-card-title>
              <v-card-subtitle>Chronicles of Drunagor: Age of Darkness</v-card-subtitle>
              <v-card-subtitle>Door X: in battle/exploring/finished</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="mx-auto">
              <v-img src="@/assets/perfil.webp" height="200" />
              <v-card-title>Campaign 0%</v-card-title>
              <v-card-subtitle>Awakenings</v-card-subtitle>
              <v-card-subtitle>Door X: in battle/exploring/finished</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </v-container>

     <!-- Main Event Cards -->

     <v-container class="mt-4">
      <v-card-text
        class="text-h4 white--text color-white bg-black"
        color="white"
      >
        EVENTS

        <!-- Main Event Cards -->
       <!-- Main Event Cards -->
      <v-row>
        <!-- Next Section (visible on desktop, hidden on mobile) -->
        <v-col cols="12" md="6">
          <v-card class="pa-4" color="grey-darken-4" dark>
            <v-card-title class="white--text hidden-sm-and-down">Next</v-card-title>
            <!-- Container com rolagem -->
            <div style="max-height: 300px; overflow-y: auto;">
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
                          <v-img src="@/assets/perfil.webp" alt="Profile"></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col cols="6">
                        <v-list-item-title class="text-h6 white--text">
                          EVENTO DE LANÇAMENTO DRUNAGOR APP {{ i }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-subtitle-2 white--text">
                          JORGINHO ULTIMATE MEGA STORE PLUS
                        </v-list-item-subtitle>
                      </v-col>
                      <v-col cols="3" class="text-right">
                        <!-- Clique para abrir o Google Maps -->
                        <v-icon color="red" size="40" @click.stop="openGoogleMaps">mdi-map-marker</v-icon>
                        <v-list-item-subtitle class="text-subtitle-1 white--text">12/29/24</v-list-item-subtitle>
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
                          <!-- Clique para abrir o Google Maps -->
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
            <!-- Close button (X) in the top-right corner -->
            <v-card-title
              class="headline d-flex justify-space-between align-center"
            >
              EVENTO DE LANÇAMENTO DRUNAGOR APPD
              <v-btn icon @click="closeDialog">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-subtitle>
              *event description* Lorem Ipsum is simply dummy text of the
              printing and typesetting industry.
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
      </v-card-text>
    </v-container>

    <!-- My Library Section -->
    <v-container class="mt-4">
      <!-- Title for My Library -->
      <v-row>
        <v-col cols="12">
          <v-card-title class="text-h5 font-weight-bold"
            >MY LIBRARY</v-card-title
          >
        </v-col>
      </v-row>

      <!-- Buttons for Library Items -->
      <v-row>
        <v-col cols="6">
          <v-btn block color="grey darken-2" class="white--text" height="60">
            AWAKENINGS
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn block color="grey darken-2" class="white--text" height="60">
            COREBOX
          </v-btn>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="6">
          <v-btn block color="grey darken-2" class="white--text" height="60">
            APOCALYPSE
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn block color="grey darken-2" class="white--text" height="60">
            RISE OF THE UNDEAD DRAGON
          </v-btn>
        </v-col>
      </v-row>

      <!-- Manage Library Button -->
      <v-row class="mt-4">
        <v-col cols="12" class="text-right">
          <v-btn small outlined color="black"> MANAGE LIBRARY </v-btn>
        </v-col>
      </v-row>
    </v-container>

    

  <!-- Fixed Bottom Navigation for Mobile -->
  <v-bottom-navigation
    class="hidden-md-and-up fixed app color-white bg-black"
    :rounded="xs"
  >
    <v-btn @click="action1">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn @click="action2">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-btn @click="action3">
      <v-icon>mdi-plus-circle</v-icon>
    </v-btn>
    <v-btn @click="action4">
      <v-icon>mdi-heart</v-icon>
    </v-btn>
    <v-btn @click="action5">
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-bottom-navigation>

  <!-- Notification Button -->
  <v-row style="position: fixed; bottom: 20px; right: 20px; z-index: 10;">
    <v-col cols="auto">
      <v-badge color="red" content="10" overlap location="top-end">
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

</template>

<script lang="ts" setup>
import { ref } from "vue";

// Variáveis reativas
const showPopup = ref(false);
const dialog = ref(false);

// Métodos de ação para os botões da navegação
const action1 = () => {
  console.log("Home button clicked");
  // Adicione a lógica específica para essa ação
};

const action2 = () => {
  console.log("Search button clicked");
  // Adicione a lógica específica para essa ação
};

const action3 = () => {
  console.log("Add button clicked");
  // Adicione a lógica específica para essa ação
};

const action4 = () => {
  console.log("Favorites button clicked");
  // Adicione a lógica específica para essa ação
};

const action5 = () => {
  console.log("Account button clicked");
  // Adicione a lógica específica para essa ação
};

// Métodos para o diálogo e Google Maps
const openDialog = (eventId: number) => {
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const openGoogleMaps = (place: { name: string }) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`;
  window.open(url, "_blank");
};
</script>


<style>
.notification-button {
  position: relative;
}

.v-badge__badge {
  position: absolute;
  top: -5px;
  right: -5px;
}
</style>