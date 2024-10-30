<template>
  <v-app class="bg-grey-lighten-4">
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
            <v-img height="300px"
              class="align-end text-white text-center"
              src="@/assets/Corebox.png"
              cover
            >
            </v-img>
            <v-card-actions>
              <v-row class="d-flex justify-center">
                <v-btn class="text-center">LIBRARY </v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" lg="3">
          <v-card flat class="border">
            <v-img height="300px"
              class="align-end text-white text-center"
              src="@/assets/perfil.webp"
              cover
            >
            </v-img>
            <v-card-actions>
              <v-row class="d-flex justify-center">
                <v-btn class="text-center">CAMPAIGN </v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" lg="3">
          <v-card flat class="border">
            <v-img height="300px"
              class="align-end text-white text-center "
              src="@/assets/events.jpg"
              cover
            >
            </v-img>
            <v-card-actions>
              <v-row class="d-flex justify-center">
                <v-btn class="text-center">EVENTS </v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <v-card flat class="border">
            <v-img height="300px"
              class="align-end text-white text-center"
              src="@/assets/leaderboard.jpg"
              cover
            >
            </v-img>
            <v-card-actions>
              <v-row class="d-flex justify-center">
                <v-btn class="text-center">LEADERBOARD </v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Carousel Section (Campaign Progress) -->
    <v-container class="mt-4">
      <v-carousel hide-delimiters>
        <v-carousel-item v-for="i in 6" :key="i">
          <v-row>
            <v-col cols="6">
              <v-card class="mx-auto">
                <v-img src="@/assets/perfil.webp" height="200"></v-img>
                <v-card-title>Campaign 0%</v-card-title>
                <v-card-subtitle
                  >Chronicles of Drunagor: Age of Darkness</v-card-subtitle
                >
                <v-card-subtitle
                  >Door X: in battle/exploring/finished</v-card-subtitle
                >
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card class="mx-auto">
                <v-img src="@/assets/perfil.webp" height="200"></v-img>
                <v-card-title>Campaign 0%</v-card-title>
                <v-card-subtitle>Awakenings</v-card-subtitle>
                <v-card-subtitle
                  >Door X: in battle/exploring/finished</v-card-subtitle
                >
              </v-card>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </v-container>


 <!-- Main Event Cards -->
  
 
 
  <v-container class="mt-4">
    <v-card-text class="text-h4 white--text color-white bg-black" color="white">
      EVENTS 

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
                  v-for="(place, index) in places"
                  :key="index"
                  class="mb-4"
                  color="rgba(0,0,0,0.6)"
                  elevation="6"
                  shaped
                >
                  <v-list-item-content>
                    <v-row>
                      <v-col cols="3">
                        <v-avatar size="60">
                          <v-img :src="place.icon" alt="Profile"></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col cols="6">
                        <v-list-item-title class="text-h6 white--text">
                          {{ place.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-subtitle-2 white--text">
                          {{ place.vicinity }}
                        </v-list-item-subtitle>
                      </v-col>
                      <v-col cols="3" class="text-right">
                        <!-- Clique para abrir o Google Maps -->
                        <v-icon color="red" size="40" @click.stop="openGoogleMaps(place)">mdi-map-marker</v-icon>
                        <v-list-item-subtitle class="text-subtitle-1 white--text">Aberto agora</v-list-item-subtitle>
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
            <v-card-title class="white--text hidden-sm-and-down">Count Me In</v-card-title>
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
      </v-row>

      <!-- Dialog for Event Details -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <!-- Close button (X) in the top-right corner -->
          <v-card-title class="headline d-flex justify-space-between align-center">
            EVENTO DE LANÇAMENTO DRUNAGOR APPD
            <v-btn icon @click="closeDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-subtitle>
            *event description* Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="4">
                <v-avatar size="100">
                  <v-img src="@/assets/perfil.webp" alt="Event"></v-img>
                </v-avatar>
              </v-col>
              <v-col cols="12" sm="8">
                <v-list-item-title>JORGINHO ULTIMATE MEGA STORE PLUS</v-list-item-title>
                <v-list-item-subtitle>Engenheiro José Carlos de Morais Sarmento, 5747</v-list-item-subtitle>
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
                <v-list-item-subtitle>Reward description goes here...</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-avatar size="60">
                <v-img src="@/assets/perfil.webp"></v-img>
              </v-avatar>
              <v-list-item-content>
                <v-list-item-title>Drunagor APP Badges</v-list-item-title>
                <v-list-item-subtitle>Check-in at the event to get an exclusive badge!</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card-text>

          <v-divider></v-divider>

          <!-- Updated Button Section -->
          <v-card-actions>
            <v-row class="d-flex justify-space-between">
              <v-col>
                <v-btn block color="#a87945" class="text-uppercase white--text" @click="closeDialog">MAYBE I'LL GO</v-btn>
              </v-col>
              <v-col>
                <v-btn block color="green darken-1" class="text-uppercase white--text" @click="closeDialog">COUNT ME IN</v-btn>
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

    <v-btn
      fab
      dark
      color="black"
      class="fixed-bottom-right"
      @click="showPopup = !showPopup"
    >
      <v-icon>mdi-bell</v-icon>
      <v-badge
        color="red"
        content="10"
        overlap
        class="notification-badge"
      ></v-badge>
    </v-btn>

  
  </v-app>
  <!-- Fixed Bottom Navigation for Mobile -->
  <v-bottom-navigation class="hidden-md-and-up fixed
    app
    color-white
    bg-black"
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

  
  <!-- Footer Section -->
  <v-footer class="footer black bg-black" padless>
    <v-container fluid>
      <v-row justify="center" align="center" class="text-center">
        <v-col cols="12" sm="4">
          <v-img
            class="logocgs mx-auto"
            src="@/assets/cgs.png"
            max-width="92"
            alt="logo"
          />
        </v-col>

        <v-col cols="12" sm="4" class="info-footer text-center">
          <h3 class="white--text">Footer Infos Here</h3>
          <p class="white--text">Big name info 1</p>
          <p class="white--text">Big name info 2</p>
          <p class="white--text">Big name info 3</p>
        </v-col>

        <v-col cols="12" sm="4" class="text-center">
          <h3 class="white--text">Social medias</h3>
          <v-btn fab icon color="black" dark>
            <v-icon color="white">mdi-instagram</v-icon>
          </v-btn>
          <v-btn fab icon color="black" dark>
            <v-icon color="white">mdi-facebook</v-icon>
          </v-btn>
          <v-btn fab icon color="black" dark>
            <v-icon color="white">mdi-youtube</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>
  
   
  
    
  
  
<script>
export default {
  data() {
    return {
      showPopup: false, // Controla a exibição do popup
      dialog: false,
      places: [], // Para armazenar os lugares próximos
    };
  },
  mounted() {
    this.getUserLocation();
  },
  methods: {
    openDialog(eventId) {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    // Obter localização do usuário
    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.fetchNearbyPlaces, this.showError);
      } else {
        alert("Geolocalização não é suportada pelo navegador.");
      }
    },

    // Chama a API Places com a localização do usuário
    fetchNearbyPlaces(position) {
      console.log('Posição:', position);
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const apiKey = 'YOUR_API_KEY'; // Insira sua chave da API Google Maps aqui
      const url = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=store&key=${apiKey}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.places = data.results; // Atualiza a lista de lugares
        })
        .catch(error => console.log(error));
    },

    // Exibe erro de localização
    showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("Usuário negou o pedido de geolocalização.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Informações de localização não estão disponíveis.");
          break;
        case error.TIMEOUT:
          alert("O pedido para obter a localização do usuário expirou.");
          break;
        case error.UNKNOWN_ERROR:
          alert("Ocorreu um erro desconhecido.");
          break;
      }
    },

    // Método para abrir o Google Maps com o local clicado
    openGoogleMaps(place) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`;
      window.open(url, '_blank');
    }
  }
};
</script>

<style>
.fixed-bottom-right {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
}


</style>