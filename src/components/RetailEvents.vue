<template>
    <v-row justify="center">
      <v-col cols="12" class="text-center" >
        <h1 class="cinzel-text font-weight-black pt-15 pb-4 justify-center text-center text-h2">
          EVENTS
        </h1>
      </v-col>
    </v-row>
 
<v-col cols="12" md="10" class="mx-auto">
    
<v-card class="pb-12" color="#151515">

    <v-row no-gutters>
      <v-col cols="12">
        <v-tabs class="EventsTabs" v-model="activeTab" fixed-tabs align-tabs="center" color="white">
          <v-tab class="text-h5" value="events">EVENTS</v-tab>
          <v-tab class="text-h5" value="retailer">RETAILER</v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-row class="black-bar SortBy align-center bg-black text-white">
      <v-col cols="2">
         Sort by:
      </v-col>
      <v-col cols="3">
        <v-btn variant="text" class="sort-btn" :class="{ 'active': sortBy === 'date' }" @click="sortBy = 'date'">
          DATE
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn variant="text" class="sort-btn" :class="{ 'active': sortBy === 'location' }" @click="sortBy = 'location'">
          LOCATION
        </v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn variant="text" class="sort-btn" :class="{ 'active': sortBy === 'store' }" @click="sortBy = 'store'">
          STORE
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        class="py-3 px-0"
        cols="12"
        md="6"
        v-for="(event, index) in sortedEvents"
        :key="index"
      >
        <v-card color="white" class="pt-0 event-card" @click="openDialog(event)">
          <v-row no-gutters>
            <v-col cols="2" lg="2">
              <v-img :src="event.image" class="mt-3 event-img"></v-img>
            </v-col>
            <v-col cols="8" class="pa-2">
              <h3 class="text-subtitle-1 font-weight-bold">{{ event.name }}</h3>
              <p class="text-caption text-truncate">{{ event.location }}</p>
              <p class="text-caption">
                Rewards:
                <v-icon v-for="n in 4" :key="n" size="18">mdi-star</v-icon>
              </p>
            </v-col>
            <v-col cols="2" class="text-right pa-0">
              <v-icon color="red">mdi-map-marker</v-icon>
              <p class="text-caption">{{ event.date }}</p>
              <p class="text-caption">{{ event.hour }}</p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- v-dialog (Janela Modal) -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card color="surface">
        <v-card-actions class="d-flex justify-left">
          <v-btn color="red" @click="dialog = false">X</v-btn>
        </v-card-actions>
        <v-card-title class="tfont-weight-bold">
          {{ selectedEvent?.name }}
        </v-card-title>

        <v-card-text >
            <p><strong>Description:</strong> {{ selectedEvent?.eventdesc }}</p>
            <br>
            <p class="text-end scheduled-box"> Sheduled for: {{ selectedEvent?.date }} {{ selectedEvent?.hour }}</p>
        </v-card-text>

        <v-card color="primary" min-height="130px" class="mr-4 event-card">
          <v-row no-gutters>
            <v-col cols="3" lg="3">
              <v-img :src="selectedEvent?.shopimage" class=" event-img"></v-img>
            </v-col>
            <v-col cols="9" class="pa-2">
              <h3 class="text-subtitle-1 font-weight-bold">{{ selectedEvent?.shopname }}</h3>
              
              <p class="text-caption"> <v-icon color="red">mdi-map-marker</v-icon> {{ selectedEvent?.location }}</p>
              <p class="text-caption">
                <v-icon v-for="n in 4" :key="n" size="18">mdi-star</v-icon>
              </p>
            </v-col>
            <v-col cols="2" class="text-right pa-0">
            </v-col>
          </v-row>
        </v-card>

        <v-card-text>
          <h3 class="text-h6 font-weight-bold">REWARDS:</h3>
          <v-row v-for="(reward, index) in selectedEvent?.rewards" :key="index" class="align-center my-2">
            <v-col cols="3" md="2">
              <v-avatar size="60">
                <v-img :src="reward.image"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="9" md="10">
              <h4 class="text-subtitle-1 font-weight-bold">{{ reward.name }}</h4>
              <p class="text-body-2">{{ reward.description }}</p>
            </v-col>
          </v-row>
        </v-card-text>




        <v-card-actions class="d-flex justify-space-between">
          <v-btn color="green"  @click="joinEvent">Count me int</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


</v-card>
</v-col>


</template>

<script setup>
import { ref, computed } from "vue";


const dialog = ref(false);
const selectedEvent = ref(null);

// Função para abrir o diálogo e definir o evento selecionado
const openDialog = (event) => {
  selectedEvent.value = event;
  dialog.value = true;
};

// Simula a função de "Entrar no Evento"
const joinEvent = () => {
  alert(`You have joined the event: ${selectedEvent.value.name}`);
  dialog.value = false;
};


const activeTab = ref("events");
const sortBy = ref("date");

// Sample Events Data
const events = ref([
{
    name: "EVENTO DE LANÇAMENTO DRUNAGOR APP",
    location: "JORGINHO ULTIMATE MEGA STORE PLUS PLUS, Engenheiro José Carlos de Morais Sarmento, 5747",
    date: "12/29/24",
    hour: "12:00",
    image:"https://cf.geekdo-images.com/XVHxivhSyvJtJvyeTpeIOQ__itemrep/img/4irpWCwivBZi28pSvQ4vTc69QEQ=/fit-in/246x300/filters:strip_icc()/pic7883362.png",
    eventdesc:"Evento maneiro pra mostrar o druna app p tropa,Evento maneiro pra mostrar o druna app p tropaEvento maneiro pra mostrar o druna app para tropaEvento maneiro pra mostrar o druna app p tropaEvento maneiro pra mostrar o druna app p trop.",
    shopdesc:"É UMA LOJA MT ENGRAÇADA N TINHA TETO N TINHA NADA",
    shopname:"Brunão Boladão Store",
    shopimage:"https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-luccanor.png",
    rewards: [
      {
        name: "Reward Name Cabe um nome bem grande",
        description:
          "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-shadowworld.png",
      },
      {
        name: "Drunagor APP Badges",
        description:
          "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
        image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
      },
    ],
  },
  {
    name: "EVENTO DE LANÇAMENTO DRUNAGOR APP",
    location: "JORGINHO ULTIMATE MEGA STORE PLUS PLUS, Engenheiro José Carlos de Morais Sarmento, 5747",
    date: "12/29/24",
    hour: "12:00",
    image:"https://cf.geekdo-images.com/XVHxivhSyvJtJvyeTpeIOQ__itemrep/img/4irpWCwivBZi28pSvQ4vTc69QEQ=/fit-in/246x300/filters:strip_icc()/pic7883362.png",
    shopdesc:"É UMA LOJA MT ENGRAÇADA N TINHA TETO N TINHA NADA",
    shopname:"Brunão Boladão Store"
  },
  {
    name: "EVENTO DE LANÇAMENTO DRUNAGOR APP",
    location: "JORGINHO ULTIMATE MEGA STORE PLUS PLUS, Engenheiro José Carlos de Morais Sarmento, 5747",
    date: "12/29/24",
    hour: "12:00",
    image:"https://cf.geekdo-images.com/XVHxivhSyvJtJvyeTpeIOQ__itemrep/img/4irpWCwivBZi28pSvQ4vTc69QEQ=/fit-in/246x300/filters:strip_icc()/pic7883362.png",
    shopdesc:"É UMA LOJA MT ENGRAÇADA N TINHA TETO N TINHA NADA",
    shopname:"Brunão Boladão Store"
  },
  {
    name: "EVENTO DE LANÇAMENTO DRUNAGOR APP",
    location: "JORGINHO ULTIMATE MEGA STORE PLUS PLUS, Engenheiro José Carlos de Morais Sarmento, 5747",
    date: "12/29/24",
    hour: "12:00",
    image:"https://cf.geekdo-images.com/XVHxivhSyvJtJvyeTpeIOQ__itemrep/img/4irpWCwivBZi28pSvQ4vTc69QEQ=/fit-in/246x300/filters:strip_icc()/pic7883362.png",
    shopdesc:"É UMA LOJA MT ENGRAÇADA N TINHA TETO N TINHA NADA",
    shopname:"Brunão Boladão Store"
  },
  {
    name: "EVENTO DE LANÇAMENTO DRUNAGOR APP",
    location: "JORGINHO ULTIMATE MEGA STORE PLUS PLUS, Engenheiro José Carlos de Morais Sarmento, 5747",
    date: "12/29/24",
    hour: "12:00",
    image:"https://cf.geekdo-images.com/XVHxivhSyvJtJvyeTpeIOQ__itemrep/img/4irpWCwivBZi28pSvQ4vTc69QEQ=/fit-in/246x300/filters:strip_icc()/pic7883362.png",
    shopdesc:"É UMA LOJA MT ENGRAÇADA N TINHA TETO N TINHA NADA",
    shopname:"Brunão Boladão Store"
  },
  {
    name: "EVENTO DE LANÇAMENTO DRUNAGOR APP",
    location: "JORGINHO ULTIMATE MEGA STORE PLUS PLUS, Engenheiro José Carlos de Morais Sarmento, 5747",
    date: "12/29/24",
    hour: "12:00",
    image:"https://cf.geekdo-images.com/XVHxivhSyvJtJvyeTpeIOQ__itemrep/img/4irpWCwivBZi28pSvQ4vTc69QEQ=/fit-in/246x300/filters:strip_icc()/pic7883362.png",
    shopdesc:"É UMA LOJA MT ENGRAÇADA N TINHA TETO N TINHA NADA",
    shopname:"Brunão Boladão Store"
  },
  {
    name: "EVENTO DE LANÇAMENTO DRUNAGOR APP",
    location: "JORGINHO ULTIMATE MEGA STORE PLUS PLUS, Engenheiro José Carlos de Morais Sarmento, 5747",
    date: "12/29/24",
    hour: "12:00",
    image:"https://cf.geekdo-images.com/XVHxivhSyvJtJvyeTpeIOQ__itemrep/img/4irpWCwivBZi28pSvQ4vTc69QEQ=/fit-in/246x300/filters:strip_icc()/pic7883362.png",
    shopdesc:"É UMA LOJA MT ENGRAÇADA N TINHA TETO N TINHA NADA",
    shopname:"Brunão Boladão Store"
  },
  {
    name: "EVENTO DE LANÇAMENTO DRUNAGOR APP",
    location: "JORGINHO ULTIMATE MEGA STORE PLUS PLUS, Engenheiro José Carlos de Morais Sarmento, 5747",
    date: "12/29/24",
    hour: "12:00",
    image:"https://cf.geekdo-images.com/XVHxivhSyvJtJvyeTpeIOQ__itemrep/img/4irpWCwivBZi28pSvQ4vTc69QEQ=/fit-in/246x300/filters:strip_icc()/pic7883362.png",
    shopdesc:"É UMA LOJA MT ENGRAÇADA N TINHA TETO N TINHA NADA",
    shopname:"Brunão Boladão Store"
  }
]);

// Sorting Logic
const sortedEvents = computed(() => {
  if (sortBy.value === "date") {
    return events.value.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  return events.value;
});
</script>

<style scoped>
/* Event Card */
.event-card {
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 10px;
  margin-left: 18px;
  background-color: #292929;
}

/* Event Image */
.event-img {
  width: 110px;
  height: 110px;
  border-radius: 4px;
}

/* Sort Buttons */
.sort-btn {
  font-weight: bold;
  text-transform: uppercase;
  color: white;
}

.sort-btn.active {
  text-decoration: underline;
}

.scheduled-box {
  display: inline-block; /* Faz o fundo se ajustar ao tamanho do conteúdo */
  background-color: white; /* Fundo branco */
  padding: 6px 12px; /* Espaçamento interno */
  border-radius: 20px; /* Bordas arredondadas */
  font-size: 14px; /* Tamanho do texto */
  font-weight: 500; /* Peso do texto */
  color: black; /* Cor do texto */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra leve para destacar */
}
.scheduled-box strong {
  font-weight: bold; /* Deixa "SCHEDULED FOR:" em negrito */
}




</style>



<style>
.cinzel-text {
  font-family: "Cinzel", serif;
}

.EventsTabs{
    background: #424242;

}

.SortBy{
    background: #424242;
    position: relative;
    transform: translateY(-12px) translateX(12px);

}
.event-card {
  cursor: pointer;
  transition: 0.2s ease-in-out;
}
.event-card:hover {
  transform: scale(1.02);
}
.event-dialog-img {
  border-radius: 8px;
}


</style>