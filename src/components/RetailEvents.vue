<template>
    <v-row justify="center">
      <v-col cols="12" class="text-center" >
        <h1 class="cinzel-text font-weight-black pt-15 pb-4 justify-center text-center text-h2">
          EVENTS
        </h1>
      </v-col>
    </v-row>
 
<v-col cols="12">
    
<v-card   class="mb-10">

    <v-row class="align-center mb-4">
      <v-col cols="12">
        <v-tabs v-model="activeTab" color="grey-darken-4">
          <v-tab value="events">EVENTS</v-tab>
          <v-tab value="retailer">RETAILER</v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <!-- Sort Section -->
    <v-row class="align-center bg-black text-white pa-2 rounded">
      <v-col cols="3">
        <v-icon>mdi-close</v-icon> Sort by:
      </v-col>
      <v-col cols="3">
        <v-btn variant="text" class="sort-btn" :class="{ 'active': sortBy === 'date' }" @click="sortBy = 'date'">
          DATE
        </v-btn>
      </v-col>
      <v-col cols="3">
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

    <!-- Events List -->
    <v-row class="mt-4">
      <v-col cols="12" v-for="(event, index) in sortedEvents" :key="index">
        <v-card class="event-card">
          <v-row no-gutters>
            <!-- Image Placeholder -->
            <v-col cols="2">
              <v-img src="https://via.placeholder.com/100" class="event-img"></v-img>
            </v-col>
            <!-- Event Details -->
            <v-col cols="8" class="pa-2">
              <h3 color="black" class="text-subtitle-1 font-weight-bold">{{ event.name }}</h3>
              <p class="text-caption">{{ event.location }}</p>
              <p class="text-caption">Rewards: 
                <v-icon v-for="n in 4" :key="n" size="18">mdi-star</v-icon>
              </p>
            </v-col>
            <!-- Location & Date -->
            <v-col cols="2" class="text-right pa-2">
              <v-icon color="red">mdi-map-marker</v-icon>
              <p class="text-caption">{{ event.date }}</p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

</v-card>
</v-col>


</template>

<script setup>
import { ref, computed } from "vue";

const activeTab = ref("events");
const sortBy = ref("date");

// Sample Events Data
const events = ref([
  {
    name: "EVENTO DE LANÇAMENTO DRUNAGOR APP",
    location: "JORGINHO ULTIMATE MEGA STORE PLUS PLUS, Engenheiro José Carlos de Morais Sarmento, 5747",
    date: "12/29/24"
  },
  {
    name: "EVENTO DE LANÇAMENTO DRUNAGOR APP",
    location: "JORGINHO ULTIMATE MEGA STORE PLUS PLUS, Engenheiro José Carlos de Morais Sarmento, 5747",
    date: "12/29/24"
  },
  {
    name: "EVENTO DE LANÇAMENTO DRUNAGOR APP",
    location: "JORGINHO ULTIMATE MEGA STORE PLUS PLUS, Engenheiro José Carlos de Morais Sarmento, 5747",
    date: "12/29/24"
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
  background-color: black;
}

/* Event Image */
.event-img {
  width: 100px;
  height: 100px;
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
</style>



<style>
.cinzel-text {
  font-family: "Cinzel", serif;
}

</style>