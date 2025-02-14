<template>
    <v-row justify="center">
      <v-col cols="12" class="text-center" >
        <h1 class="cinzel-text font-weight-black pt-15 pb-4 justify-center text-center text-h2">
          EVENTS
        </h1>
      </v-col>
    </v-row>
 
<v-col cols="12" md="10" class="mx-auto">
    
<v-card class="pb-12" min-height="500px" color="#151515">

    <v-row no-gutters>
      <v-col  cols="12">
        <v-tabs  class="EventsTabs mb-3" v-model="activeTab" fixed-tabs align-tabs="center" color="white">
          <v-tab class="text-h5" :value="1">EVENTS</v-tab>
          <v-tab class="text-h5" :value="2">RETAILER</v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <div v-if="activeTab === 1">

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
        <v-card color="terciary" class="pt-0 event-card" @click="openDialog(event)">
          <v-row no-gutters>
            <v-col cols="4" sm="2">
              <v-img :src="event.image" class="mt-3 event-img"></v-img>
            </v-col>
            <v-col cols="8" sm="10" class="pt-2 pl-1">
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

</div>

<div v-if="activeTab === 2">


    <v-row class="CreateNew align-center bg-gray text-white">
      <v-col cols="2">
         
      </v-col>
      <v-col cols="3">
        <v-btn  variant="text" class="sort-btn"  @click="openCreateEventDialog">
            <v-icon>mdi-plus-box-outline</v-icon>          
            Create New
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn variant="text" class="sort-btn"  @click="">
          PAST
        </v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn variant="text" class="sort-btn"  @click="">
          LIVE
        </v-btn>
      </v-col>
    </v-row>


    <v-dialog v-model="createEventDialog" max-width="1280">
        <v-btn icon class="close-btn" @click="createEventDialog = false">
      <v-icon>mdi-close</v-icon>
    </v-btn>
        <v-card class="pa-6 dark-background">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="newEvent.name"
              label="EVENT NAME"
              counter="34"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <!-- Loja -->
          <v-col cols="12" md="6">
            <v-select
              v-model="newEvent.store"
              :items="stores"
              label="STORE"
              variant="outlined"
            ></v-select>
          </v-col>

          <!-- Descrição -->
          <v-col cols="12">
            <v-textarea
              v-model="newEvent.eventdesc"
              label="EVENT DESCRIPTION"
              counter="355"
              variant="outlined"
            ></v-textarea>
          </v-col>

          <!-- Assentos + Data/Hora -->
          <v-col cols="6" md="6">
            <v-select
              v-model="newEvent.seats"
              :items="[1,2,3,4]"
              label="SEATS"
              variant="outlined"
            ></v-select>
          </v-col>

          <v-col cols="6" md="2">
            <v-text-field
              v-model="newEvent.hour"
              label="HOUR"
              type="time"
              variant="outlined"
              class="hour-input"
            ></v-text-field>
          </v-col>


          <v-col cols="12" md="2" class="d-flex align-center">
            <v-text-field
              v-model="newEvent.date"
              label="DATE"
              type="date"
              variant="outlined"
              class="date-input"
            ></v-text-field>

          </v-col>


          <!-- Recompensas -->
          <v-col cols="12">
            <p class="pb-3 font-weight-bold">REWARDS</p>
<v-row>
  <v-col cols="auto" v-for="(reward, index) in availableRewards" :key="index">
    <v-avatar
      size="50"
      :class="{ 'selected-reward': selectedRewards.includes(reward), 'unselected-reward': !selectedRewards.includes(reward) }"
      @click="toggleReward(reward)"
    >
      <v-img :src="reward.image"></v-img>
    </v-avatar>
  </v-col>
</v-row>

            <v-file-input 
    label="Upload Image(recomended square images)" 
    accept="image/*" 
    @change="handleImageUpload"
    variant="outlined"
    class="pt-5"
  ></v-file-input>

  <!-- Preview da Imagem -->
  <v-img 
    v-if="newEvent.image" 
    :src="newEvent.image" 
    height="100" 
    class="mt-2 rounded"
  ></v-img>
          </v-col>

          <v-col cols="12">
            <v-btn block color="secundary" class="launch-btn" @click="addEvent">LAUNCH EVENT</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    </v-dialog>


    <v-row  class="SortBy align-center  text-white">
      <v-col cols="2">
    
      </v-col>
      <v-col cols="3">
        <v-btn variant="text">
            Sort by:
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn variant="text" class="sort-btn" :class="{ 'active': sortBy === 'date' }" @click="sortBy = 'date'">
          DATE
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
        v-for="(event, index) in userCreatedEvents"
        :key="index"
      >
        <v-card color="white" max-height="190" class="pt-0 pl-0 pb-0 event-card" @click="openEditDialog(event)">
          <v-row no-gutters>
            <v-col cols="auto" class="redbutton pt-13 pl-3">
          <v-btn color="#AB2929" icon class="delete-btn" @click.stop="deleteEvent(event.id)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
           
            <v-col cols="6" sm="8" class="pl-3 pt-2">
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
          
          <v-col cols="auto" class="editbutton pt-13 pl-3">
          <v-btn color="white" icon class="delete-btn" @click="openEditDialog(event)">
            <v-icon>mdi mdi-pencil</v-icon>
          </v-btn>
        </v-col>
          
        </v-card>
      </v-col>
      
    </v-row>
    

    <!-- v-dialog (Janela Modal) -->
    <v-dialog v-model="editEventDialog" max-width="1024">
  <v-card class="pa-6 dark-background">
    <v-card-text>
      <v-row>
        <!-- Nome do Evento -->
        <v-col cols="12" md="6">
          <v-text-field v-model="editableEvent.name" label="EVENT NAME" counter="34" variant="outlined"></v-text-field>
        </v-col>

        <!-- Loja -->
        <v-col cols="12" md="6">
          <v-select v-model="editableEvent.store" :items="stores" label="STORE" variant="outlined"></v-select>
        </v-col>

        <!-- Descrição -->
        <v-col cols="12">
          <v-textarea v-model="editableEvent.eventdesc" label="EVENT DESCRIPTION" counter="355" variant="outlined"></v-textarea>
        </v-col>

        <!-- Assentos + Data/Hora -->
        <v-col cols="6" md="6">
          <v-select v-model="editableEvent.eventseats" :items="[1,2,3,4]" label="SEATS" variant="outlined"></v-select>
        </v-col>

        <v-col cols="6" md="2">
          <v-text-field v-model="editableEvent.hour" label="HOUR" type="time" variant="outlined" class="hour-input"></v-text-field>
        </v-col>

        <v-col cols="12" md="2" class="d-flex align-center">
          <v-text-field v-model="editableEvent.date" label="DATE" type="date" variant="outlined" class="date-input"></v-text-field>
        </v-col>

        <!-- Recompensas -->
        <v-col cols="12">
          <p class="pb-3 font-weight-bold">REWARDS</p>
          <v-row>
            <v-col cols="auto" v-for="(reward, index) in availableRewards" :key="index">
              <v-avatar
                size="50"
                :class="{ 'selected-reward': editableEvent.rewards.includes(reward), 'unselected-reward': !editableEvent.rewards.includes(reward) }"
                @click="toggleEditReward(reward)"
              >
                <v-img :src="reward.image"></v-img>
              </v-avatar>
            </v-col>
          </v-row>

          <v-file-input 
            label="Upload Image (recommended square images)" 
            accept="image/*" 
            @change="handleEditImageUpload"
            variant="outlined"
            class="pt-5"
          ></v-file-input>

          <!-- Preview da Imagem -->
          <v-img v-if="editableEvent.image" :src="editableEvent.image" height="100" class="mt-2 rounded"></v-img>
        </v-col>

        <!-- Botões -->
        <v-col cols="12" class="d-flex justify-space-between">
          <v-btn color="red" @click="editEventDialog = false">Cancel</v-btn>
          <v-btn color="green" @click="saveEditedEvent">Save Changes</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</v-dialog>








</div>






</v-card>
</v-col>



</template>

<script setup>
import { ref, computed,} from "vue";
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
  if (newEvent.value.name && newEvent.value.date && newEvent.value.location) {
    // Clona o evento e adiciona à lista de eventos
    events.value.push({
      ...newEvent.value,
      rewards: [...selectedRewards.value], // Apenas os rewards selecionados são adicionados
      id: Date.now(), // Gera um ID único
      createdByUser: true, // Marca que este evento foi criado pelo usuário
    });

    // Resetando os campos do formulário
    newEvent.value = {
      name: "",
      location: "Shopping Drunagor",
      eventdesc: "",
      eventseats: 4,
      date: "",
      hour: "",
      image: "",
      rewards: [],
    };

    selectedRewards.value = []; // Limpa a seleção de rewards
  }
};

// **Função para deletar um evento**
const deleteEvent = (eventId) => {
  // Remove o evento da lista geral
  events.value = events.value.filter((event) => event.id !== eventId);
};

// **Propriedade Computada**: Retorna apenas os eventos criados pelo usuário
const userCreatedEvents = computed(() => {
  return events.value.filter((event) => event.createdByUser);
});

// Lista de rewards disponíveis para seleção
const availableRewards = ref([
  {
    name: "Reward 1",
    image:
      "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-shadowworld.png",
    description:
      "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    name: "Reward 2",
    image:
      "https://druna-assets.s3.us-east-2.amazonaws.com/Library/box-spoils.png",
    description:
      "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    name: "Reward 3",
    image:
      "https://cf.geekdo-images.com/XVHxivhSyvJtJvyeTpeIOQ__itemrep/img/4irpWCwivBZi28pSvQ4vTc69QEQ=/fit-in/246x300/filters:strip_icc()/pic7883362.png",
    description:
      "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
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
  image: "",
  rewards: [],
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


const editEventDialog = ref(false);
const editableEvent = ref({});


const openEditDialog = (event) => {
  editableEvent.value = { ...event };
  editEventDialog.value = true;
};

// Função para salvar as edições no evento
const saveEditedEvent = () => {
  const index = events.value.findIndex(e => e.id === editableEvent.value.id);
  if (index !== -1) {
    events.value[index] = { ...editableEvent.value };
  }
  editEventDialog.value = false;
};

// Alternar seleção de recompensas no modo edição
const toggleEditReward = (reward) => {
  const index = editableEvent.value.rewards.findIndex(r => r === reward);
  if (index === -1) {
    editableEvent.value.rewards.push(reward);
  } else {
    editableEvent.value.rewards.splice(index, 1);
  }
};

// Upload de imagem no modo edição
const handleEditImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      editableEvent.value.image = reader.result;
    };
    reader.readAsDataURL(file);
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

.EventsTabs {
  background: #424242;
  transform: translateY(-8px);
  position: relative;
}

.CreateNew {
  position: relative;
  transform: translateY(-8px) translateX(12px);
  background-color: #484848;
}

.SortBy {
  position: relative;
  transform: translateY(-8px) translateX(12px);
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

.dark-background {
  background-color: #121212;
  color: white;
}

.date-input {
  max-width: 190px;
}

.hour-input {
  max-width: 110px;
  margin-left: 10px;
}

.launch-btn {
  background-color: white;
  color: black;
  font-weight: bold;
}

.selected-reward {
  border: 2px solid green;
  opacity: 1;
  transition: all 0.2s ease-in-out;
}

.unselected-reward {
  filter: grayscale(100%);
  opacity: 0.5;
  transition: all 0.2s ease-in-out;
}

.check-icon {
  position: absolute;
  top: -5px;
  right: -5px;
  background: white;
  border-radius: 50%;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  color: red;
}

.redbutton{
    background: #691D1D;
    transform: translateY(px) translateX(-0px);
    width: 80px;
  height: 160px;  
}

.editbutton{
    background: gray;
    transform: translateX(10px);
    width: 80px;
  height: 160px;  
}



</style>