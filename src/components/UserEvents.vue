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
      </v-col>
    </v-row>


    <v-row class="black-bar SortBy align-center text-white">
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
        class="py-2 pl-1 pr-1"
        cols="12"
        md="6"
        v-for="(event, index) in sortedEvents"
        :key="index"
      >
        <v-card color="white" class="pt-0 event-card" @click="openDialog(event)">
          <v-row no-gutters>
            <v-col cols="4" sm="2">
              <v-img :src="event.image" class="mt-3 event-img"></v-img>
            </v-col>
            <v-col cols="8" sm="10" class="pt-2 pl-2">
              <h3 class="">{{ event.name }}</h3>
              <p class="text-caption text-truncate"> <v-icon color="red">mdi-map-marker</v-icon> {{ event.location }}</p>
              <p class="text-caption">
                Rewards: 
                <v-row class="d-flex align-center rewards-container">
                    <v-col cols="auto" v-for="(reward, index) in event.rewards" :key="index">
  <v-img :src="reward.image" height="30" width="30" contain class="reward-icon"></v-img>
</v-col>
</v-row>
              <p class=" text-right text-caption">{{ event.date }}</p>
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- v-dialog (Janela Modal) -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card color="surface">
        <v-card-actions class="d-flex justify-left">
          <v-btn color="red" @click="dialog = false">X</v-btn>
        </v-card-actions>
        <v-card-title class="ml-2 font-weight-bold">
          {{ selectedEvent?.name }}
        </v-card-title>

        <v-card-text >
            <p><strong>Description:</strong> {{ selectedEvent?.eventdesc }}</p>
            <br>
            <p> Disponible Seats: {{ selectedEvent?.eventseats }} </p>
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




        <v-row class="mt-2 ml-0">
  <v-col cols="6" class="pa-0">
    <v-btn block color="#907041" class="rounded-0" @click="joinEvent">Maybe I’ll Go</v-btn>
  </v-col>
  <v-col cols="6" class="pa-0">
    <v-btn block color="#539041" class="rounded-0" @click="joinEvent">Count me in</v-btn>
  </v-col>
</v-row> 

      </v-card>
    </v-dialog>

</v-card>
</v-col>



</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/store/UserStore";

const user = computed(() => useUserStore().user);





const selectedRewards = ref([]);

const toggleReward = (reward) => {
  if (selectedRewards.value.includes(reward)) {
    selectedRewards.value = selectedRewards.value.filter((r) => r !== reward);
  } else {
    selectedRewards.value.push(reward);
  }
};


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
    name: "WORK IN PROGRESS - VISUAL PREVIEW",
    location:
      "Your Store location",
    date: "02/20/25",
    hour: "12:00",
    image:
      "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
    eventdesc:
      "This is a work in progress. Only the visual elements have been added. The functional elements will still be implemented. ",
    shopdesc: "YOUR STORE DESCRIPTION",
    eventseats: "4",
    shopname: "YOUR STORE NAME",
    shopimage:
      "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
    rewards: [
      {
        name: "MEGA DUNGEON Badges",
        description:
          "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
      },
      {
        name: "Drunagor APP Badges",
        description:
          "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-luccanor.png",
      },
      {
        name: " Event Reward",
        description:
          "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png",
      },
      {
        name: "Drunagor APP Badges",
        description:
          "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-apoc.png",
      },
    ],
  },
  {
    name: "EN PROCESO - VISTA PREVIA VISUAL",
    location:
      "Your Store location",
    date: "02/20/25",
    hour: "12:00",
    image:
      "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
    eventdesc:
      "This is a work in progress. Only the visual elements have been added. The functional elements will still be implemented. ",
    shopdesc: "YOUR STORE DESCRIPTION",
    eventseats: "4",
    shopname: "YOUR STORE NAME",
    shopimage:
      "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
    rewards: [
      {
        name: "MEGA DUNGEON Badges",
        description:
          "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
      },
      {
        name: "Drunagor APP Badges",
        description:
          "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-luccanor.png",
      },
      {
        name: " Event Reward",
        description:
          "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png",
      },
      {
        name: "Drunagor APP Badges",
        description:
          "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-apoc.png",
      },
    ],
  },
  {
    name: "IN ARBEIT - VISUELLE VORSCHAU",
    location:
      "Your Store location",
    date: "02/20/25",
    hour: "12:00",
    image:
      "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
    eventdesc:
      "This is a work in progress. Only the visual elements have been added. The functional elements will still be implemented. ",
    shopdesc: "YOUR STORE DESCRIPTION",
    eventseats: "4",
    shopname: "YOUR STORE NAME",
    shopimage:
      "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
    rewards: [
      {
        name: "MEGA DUNGEON Badges",
        description:
          "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
      },
      {
        name: "Drunagor APP Badges",
        description:
          "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-luccanor.png",
      },
      {
        name: " Event Reward",
        description:
          "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png",
      },
      {
        name: "Drunagor APP Badges",
        description:
          "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-apoc.png",
      },
    ],
  },
  {
    name: "EN COURS - APERÇU VISUEL",
    location:
      "Your Store location",
    date: "02/20/25",
    hour: "12:00",
    image:
      "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
    eventdesc:
      "This is a work in progress. Only the visual elements have been added. The functional elements will still be implemented. ",
    shopdesc: "YOUR STORE DESCRIPTION",
    eventseats: "4",
    shopname: "YOUR STORE NAME",
    shopimage:
      "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
    rewards: [
      {
        name: "MEGA DUNGEON Badges",
        description:
          "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
      },
      {
        name: "Drunagor APP Badges",
        description:
          "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-luccanor.png",
      },
      {
        name: " Event Reward",
        description:
          "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png",
      },
      {
        name: "Drunagor APP Badges",
        description:
          "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-apoc.png",
      },
    ],
  },
  {
    name: "IN LAVORAZIONE - ANTEPRIMA VISIVA",
    location:
      "Your Store location",
    date: "02/20/25",
    hour: "12:00",
    image:
      "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
    eventdesc:
      "This is a work in progress. Only the visual elements have been added. The functional elements will still be implemented. ",
    shopdesc: "YOUR STORE DESCRIPTION",
    eventseats: "4",
    shopname: "YOUR STORE NAME",
    shopimage:
      "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
    rewards: [
      {
        name: "MEGA DUNGEON Badges",
        description:
          "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
      },
      {
        name: "Drunagor APP Badges",
        description:
          "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-luccanor.png",
      },
      {
        name: " Event Reward",
        description:
          "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png",
      },
      {
        name: "Drunagor APP Badges",
        description:
          "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-apoc.png",
      },
    ],
  },
  {
    name: "قيد العمل - معاينة بصرية",
    location:
      "Your Store location",
    date: "02/20/25",
    hour: "12:00",
    image:
      "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
    eventdesc:
      "This is a work in progress. Only the visual elements have been added. The functional elements will still be implemented. ",
    shopdesc: "YOUR STORE DESCRIPTION",
    eventseats: "4",
    shopname: "YOUR STORE NAME",
    shopimage:
      "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
    rewards: [
      {
        name: "MEGA DUNGEON Badges",
        description:
          "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
      },
      {
        name: "Drunagor APP Badges",
        description:
          "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-luccanor.png",
      },
      {
        name: " Event Reward",
        description:
          "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png",
      },
      {
        name: "Drunagor APP Badges",
        description:
          "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-apoc.png",
      },
    ],
  },
  {
    name: "正在进行 - 视觉预览",
    location:
      "Your Store location",
    date: "02/20/25",
    hour: "12:00",
    image:
      "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
    eventdesc:
      "This is a work in progress. Only the visual elements have been added. The functional elements will still be implemented. ",
    shopdesc: "YOUR STORE DESCRIPTION",
    eventseats: "4",
    shopname: "YOUR STORE NAME",
    shopimage:
      "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
    rewards: [
      {
        name: "MEGA DUNGEON Badges",
        description:
          "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
      },
      {
        name: "Drunagor APP Badges",
        description:
          "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-luccanor.png",
      },
      {
        name: " Event Reward",
        description:
          "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png",
      },
      {
        name: "Drunagor APP Badges",
        description:
          "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-apoc.png",
      },
    ],
  },
  {
    name: "進行中 - ビジュアルプレビュー",
    location:
      "Your Store location",
    date: "02/20/25",
    hour: "12:00",
    image:
      "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
    eventdesc:
      "This is a work in progress. Only the visual elements have been added. The functional elements will still be implemented. ",
    shopdesc: "YOUR STORE DESCRIPTION",
    eventseats: "4",
    shopname: "YOUR STORE NAME",
    shopimage:
      "https://www.turolgames.com/129805-thickbox_default/chronicles-of-drunagor-age-of-darkness-spanish.jpg",
    rewards: [
      {
        name: "MEGA DUNGEON Badges",
        description:
          "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
      },
      {
        name: "Drunagor APP Badges",
        description:
          "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-luccanor.png",
      },
      {
        name: " Event Reward",
        description:
          "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-corebox.png",
      },
      {
        name: "Drunagor APP Badges",
        description:
          "Check-in in event and get an exclusive event badge to show in your profile. (Only official events drop exclusive event badges)",
        image:
          "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-apoc.png",
      },
    ],
  },
  
]);

// Sorting Logic
const sortedEvents = computed(() => {
  if (sortBy.value === "date") {
    return events.value.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  return events.value;
});

// Função para adicionar um evento na lista
const addEvent = () => {
  events.value.push({
    ...newEvent.value,
    rewards: [...selectedRewards.value], // Apenas os rewards selecionados são adicionados
  });

  // Reseta os campos do formulário
  newEvent.value = {
    name: "",
    store: "Shopping Drunagor",
    shopimage: `${assets}/Profile/user.png`,
    eventdesc: "",
    eventseats: 4,
    date: "",
    hour: "",
    image: "",
    rewards: [],
  };

  // Fecha o diálogo
  createEventDialog.value = false;
};


// Lista de rewards disponíveis para seleção
const availableRewards = ref([
  { name: "Reward 1", image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-shadowworld.png", description:
  "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.", },
  { name: "Reward 2", image: "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",description:
  "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.", },
  { name: "Reward 3", image: "https://cf.geekdo-images.com/XVHxivhSyvJtJvyeTpeIOQ__itemrep/img/4irpWCwivBZi28pSvQ4vTc69QEQ=/fit-in/246x300/filters:strip_icc()/pic7883362.png",description:
  "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.", },
]);



// Estado para controlar a visibilidade do diálogo
const createEventDialog = ref(false);
const newEvent = ref({
  name: "",
  location: "Shopping Drunagor",
  eventdesc: "",
  eventseats: 4,
  date: "",
  hour: "",
  image:"",
  rewards: [ ],
});

const stores = ["Shopping Drunagor"];

const createEvent = () => {
  console.log("Event Created:", newEvent.value);
  createEventDialog.value = false;
};


const openCreateEventDialog = () => {
  createEventDialog.value = true;
};


// Função para lidar com o upload da imagem
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    newEvent.value.image = URL.createObjectURL(file); // Converte para URL temporária
  }
};

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
    transform: translateY(-8px);
    position: relative;
    


}

.CreateNew{
    position: relative;
    transform: translateY(-8px) translateX(12px);
    background-color: #484848;

}

.SortBy{
    position: relative;
    transform: translateY(-9px) translateX(12px);
    background-color: #292929;

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

.rewards-container {
  gap: -40px;
}


</style>