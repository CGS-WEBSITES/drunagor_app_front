<template>
  <v-row justify="center">
    <v-col cols="12" class="text-center">
      <h1
        class="cinzel-text font-weight-black pt-15 pb-4 justify-center text-center text-h2"
      >
        EVENTS
      </h1>
    </v-col>
  </v-row>

  <v-col cols="12" md="10" class="mx-auto">
    <v-card class="pb-12" min-height="500px" color="#151515">
      <v-row no-gutters>
        <v-col cols="12">
          <v-tabs
            class="EventsTabs mb-3"
            v-model="activeTab"
            fixed-tabs
            align-tabs="center"
            color="white"
          >
            <v-tab class="text-h5" :value="1">ALL EVENTS</v-tab>
            <v-tab class="text-h5" :value="2">MY EVENTS</v-tab>
          </v-tabs>
        </v-col>
      </v-row>

      <div v-if="activeTab === 1">
        <v-row>
          <v-col
            class="py-2 pl-1 pr-1"
            cols="12"
            md="6"
            v-for="(event, index) in sortedEvents"
            :key="index"
          >
            <v-card
              color="terciary"
              class="pt-0 event-card"
              @click="openDialog(event)"
            >
              <v-row no-gutters>
                <v-col cols="4" sm="2">
                  <div
                    class="text-center ml-3"
                    style="width: 70px; color: black"
                  >
                    <p class="pt-3 text-caption font-weight-bold">
                      {{
                        new Date(event.event_date)
                          .toLocaleDateString("en-US", {
                            month: "short",
                          })
                          .toUpperCase()
                      }}
                    </p>
                    <p
                      color="primary"
                      class="cinzel-text text-h3 font-weight-bold"
                    >
                      {{ String(event.event_date).split('T')[0].split('-')[2] }}
                    </p>
                    <p class="text-caption font-weight-bold">
                      {{ new Date(event.event_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) }}
                    </p>
                  </div>
                </v-col>
                <v-col cols="8" sm="10" class="pt-2">
                  <h3 class="pb-1">
                    <v-icon class="pr-1" size="small" color="black"
                      >mdi-chess-rook</v-icon
                    >
                    {{ event.store_name }}
                  </h3>
                  <p class="text-caption text-truncate">
                    <v-icon color="red">mdi-map-marker</v-icon>
                    {{ event.address }}
                  </p>
                  <p class="text-caption">
                    <v-icon color="red">mdi-sword-cross</v-icon> Scenario:
                    {{ event.scenario }}
                  </p>
                  <p
                    class="text-caption ml-3"
                    v-if="event.rewards && event.rewards.length"
                  >
                    <v-row class="d-flex align-center rewards-container">
                      <v-icon class="mr-1" color="red">mdi-star-circle</v-icon>
                      Rewards:
                      <v-col
                        cols="auto"
                        v-for="(reward, index) in event.rewards"
                        :key="index"
                      >
                        <v-img
                          :src="reward.image"
                          height="20"
                          width="20"
                          contain
                          class="reward-icon"
                        ></v-img>
                      </v-col>
                    </v-row>
                  </p>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- Diálogo para visualização do evento -->
        <v-dialog v-model="dialog" max-width="600">
          <v-card color="surface">
            <v-card-actions class="d-flex justify-left">
              <v-btn color="red" @click="dialog = false">X</v-btn>
            </v-card-actions>
            <v-card-title class="ml-2 font-weight-bold">
              {{ selectedStore?.store_name }}
            </v-card-title>
            <v-card-text>
              <!-- <p>
                <strong>Description:</strong> {{ selectedEvent?.eventdesc }}
              </p> -->
              <br />
              <p>Disponible Seats: {{ selectedEvent?.seats_number }}</p>
              <br />
              <p class="text-end scheduled-box">
                Sheduled for: {{
                  new Date(selectedEvent?.event_date).toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })
                }}
              </p>
            </v-card-text>
            <v-card color="primary" min-height="130px" class="mr-4 event-card">
              <v-row no-gutters>
                <v-col cols="3" lg="3">
                  <v-img
                    :src="selectedEvent?.picture_hash 
                      ? `https://druna-assets.s3.us-east-2.amazonaws.com/${selectedEvent.picture_hash}` 
                      : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'"
                    class="event-img"
                  />
                </v-col>
                <v-col cols="9" class="pa-2">
                  <h3 class="text-subtitle-1 font-weight-bold">
                    {{ selectedEvent?.store_name }}
                  </h3>
                  <p class="text-caption">
                    <v-icon color="red">mdi-map-marker</v-icon>
                    {{ selectedEvent?.address }},
                  </p>
                </v-col>
                <v-col cols="2" class="text-right pa-0"></v-col>
              </v-row>
            </v-card>
            <v-card-text>
              <h3 class="text-h6 font-weight-bold">REWARDS:</h3>
              <v-row
                v-for="(reward, index) in selectedEvent?.rewards"
                :key="index"
                class="align-center my-2"
              >
                <v-col cols="3" md="2">
                  <v-avatar size="60">
                    <v-img :src="reward.image"></v-img>
                  </v-avatar>
                </v-col>
                <v-col cols="9" md="10">
                  <h4 class="text-subtitle-1 font-weight-bold">
                    {{ reward.name }}
                  </h4>
                  <p class="text-body-2">{{ reward.description }}</p>
                </v-col>
              </v-row>
            </v-card-text>
            <v-row class="mt-2 ml-0">
              <v-col cols="6" class="pa-0">
                <v-btn
                  block
                  color="#907041"
                  class="rounded-0"
                  @click="joinEvent"
                  >Maybe I’ll Go</v-btn
                >
              </v-col>
              <v-col cols="6" class="pa-0">
                <v-btn
                  block
                  color="#539041"
                  class="rounded-0"
                  @click="joinEvent"
                  >Count me in</v-btn
                >
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
      </div>

      <div v-if="activeTab === 2">
        <v-row class="CreateNew align-center bg-gray text-white">
          <v-col cols="2"></v-col>
          <v-col cols="3">
            <v-btn
              variant="text"
              class="sort-btn"
              @click="openCreateEventDialog"
            >
              <v-icon>mdi-plus-box-outline</v-icon>
              Create New
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-btn variant="text" class="sort-btn" @click="">PAST</v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn variant="text" class="sort-btn" @click="">LIVE</v-btn>
          </v-col>
        </v-row>
        <v-dialog v-model="createEventDialog" max-width="1280">
          <v-btn icon class="close-btn" @click="createEventDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-card class="pa-6 dark-background">
            <v-card-text>
              <v-row>
                <v-col cols="12" md="12">
                  <v-select
                    v-model="newEvent.store"
                    :items="stores.map(store => store.name)"
                    label="STORE"
                    variant="outlined"
                  />
                </v-col>
                <!-- Descrição -->
                <!-- <v-col cols="12">
                  <v-textarea v-model="newEvent.eventdesc" label="EVENT DESCRIPTION" counter="355"
                    variant="outlined"></v-textarea>
                </v-col> -->
                <!-- Assentos + Data/Hora -->
                <v-col cols="12" md="6">
                  <v-select
                    v-model="newEvent.seats"
                    :items="[1, 2, 3, 4]"
                    label="SEATS"
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="6" md="6">
                  <v-select
                    v-model="newEvent.scenario"
                    :items="sceneries"
                    item-title="name"
                    item-value="sceneries_pk"
                    label="SCENARIO"
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model="newEvent.hour"
                    label="TIME"
                    variant="outlined"
                    placeholder="HH:MM"
                    maxlength="5"
                    @input="handleTimeInput"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" md="2">
                  <v-select
                    v-model="newEvent.ampm"
                    :items="['AM', 'PM']"
                    label="AM/PM"
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="2" class="d-flex align-center">
                  <v-text-field
                    v-model="newEvent.date"
                    label="DATE"
                    type="date"
                    variant="outlined"
                    class="date-input"
                    :min="today"
                    :max="oneYearFromTodayISO"
                    :rules="dateRules"
                  ></v-text-field>
                </v-col>
                <!-- Recompensas -->
                <v-col cols="12">
                  <p class="pb-3 font-weight-bold">REWARDS</p>
                  <v-row>
                    <v-row
                      :class="{
                        'selected-reward': selectedRewards.includes(reward),
                        'unselected-reward': !selectedRewards.includes(reward),
                      }"
                      @click="isEditable && toggleEditReward(reward)"
                      cols="auto"
                      v-for="(reward, index) in availableRewards"
                      :key="index"
                    >
                      <v-avatar class="ml-4 mt-4" size="70">
                        <v-img :src="reward.image"></v-img>
                      </v-avatar>
                      <p class="text-body-1 pt-10 pl-2">{{ reward.name }}</p>
                      <p class="text-body-1 pt-10 pl-2">
                        {{ reward.description }}
                      </p>
                    </v-row>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-btn
                    block
                    color="secundary"
                    class="launch-btn mt-12"
                    @click="addEvent"
                    >LAUNCH EVENT</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-row>
          <v-col
            class="py-2 pl-1 pr-1"
            cols="12"
            md="6"
            v-for="(event, index) in userCreatedEvents"
            :key="index"
          >
            <v-card
              color="white"
              max-height="120"
              class="pt-0 pl-0 pb-0 event-card"
              @click="openEditDialog(event)"
            >
              <v-row no-gutters>
                <v-col cols="auto" class="redbutton pt-13 pl-3">
                  <v-btn
                    color="#AB2929"
                    icon
                    class="delete-btn"
                    @click.stop="deleteEvent(event.events_pk)"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="8" class="pt-6 pr-3">
                  <v-row no-gutters>
                    <v-col cols="4" sm="2">
                      <div
                        class="text-center ml-2 pr-3"
                        style="width: 74px; color: black"
                      >
                        <p class="pt-3 text-caption font-weight-bold">
                          {{
                            new Date(event.event_date)
                            .toLocaleDateString("en-US", {
                              month: "short",
                            })
                            .toUpperCase()
                          }}
                        </p>
                        <p
                          color="primary"
                          class="cinzel-text text-h3 font-weight-bold"
                        >
                          {{
                            String(event.event_date).split("T")[0].split("-")[2]
                          }}
                        </p>
                        <p class="text-caption font-weight-bold">
                          {{ new Date(event.event_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) }}
                          <!-- {{ event.ampm }} -->
                        </p>
                      </div>
                    </v-col>

                    <v-col cols="8" sm="10" class="pt-2 pl-2">
                      <h3 class="pb-1">
                        <v-icon class="pr-1" size="small" color="black"
                          >mdi-chess-rook</v-icon
                        >
                        {{ event.store_name }}
                      </h3>

                      <p class="text-caption text-truncate">
                        <v-icon color="red">mdi-map-marker</v-icon>
                        {{ event.address }}
                      </p>

                      <p class="text-caption" v-if="event.scenario">
                        <v-icon color="red">mdi-sword-cross</v-icon>
                        Scenario: {{ event.scenario?.name }}
                      </p>

                      <p
                        class="text-caption ml-3"
                        v-if="event.rewards && event.rewards.length"
                      >
                        <v-row class="d-flex align-center rewards-container">
                          <v-icon class="mr-1" color="red"
                            >mdi-star-circle</v-icon
                          >
                          Rewards:
                          <v-col
                            cols="auto"
                            v-for="(reward, index) in event.rewards"
                            :key="index"
                          >
                            <v-img
                              :src="reward.image"
                              height="20"
                              width="20"
                              contain
                              class="reward-icon"
                            ></v-img>
                          </v-col>
                        </v-row>
                      </p>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-col cols="auto" class="editbutton pt-13 pl-3">
                <v-btn
                  color="white"
                  icon
                  class="delete-btn"
                  @click.stop="openEditDialog(event, true)"
                >
                  <v-icon>mdi mdi-pencil</v-icon>
                </v-btn>
              </v-col>
            </v-card>
          </v-col>
        </v-row>
        <!-- Diálogo de Edição / Visualização com lista de Players Interested -->
        <v-dialog v-model="editEventDialog" scroll-target="#app">
          <v-card class="pa-6 dark-background">
            <v-card-text>
              <v-row>
                <v-col cols="6" md="6" v-if="isEditable">
                  <v-select
                    v-model="editableEvent.seats_number"
                    :items="[1, 2, 3, 4]"
                    label="SEATS"
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="6" md="6" v-if="isEditable">
                  <v-select
                    v-model="editableEvent.sceneries"
                    :items="sceneries"
                    item-text="name"
                    item-value="sceneries_pk"
                    label="SCENARIO"
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="6" md="3" v-if="isEditable">
                  <v-text-field
                    v-model="editableEvent.time"
                    label="TIME"
                    variant="outlined"
                    placeholder="HH:MM"
                    maxlength="5"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" md="2" v-if="isEditable">
                  <v-select
                    v-model="editableEvent.ampm"
                    :items="['AM', 'PM']"
                    label="AM/PM"
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="2" class="d-flex align-center" v-if="isEditable">
                  <v-text-field
                    v-model="editableEvent.date"
                    label="DATE"
                    type="date"
                    variant="outlined"
                    class="date-input"
                    :min="today"
                    :max="oneYearFromTodayISO"
                    :rules="dateRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" v-if="isEditable">
                  <p class="pb-3 font-weight-bold">REWARDS</p>
                  <v-row>
                    <v-col
                      cols="auto"
                      v-for="(reward, index) in availableRewards"
                      :key="index"
                    >
                      <v-avatar
                        size="50"
                        :class="{
                          'selected-reward': editableEvent.rewards?.includes(reward) ?? false,
                          'unselected-reward': !(editableEvent.rewards?.includes(reward) ?? false)
                        }"
                        @click="toggleEditReward(reward)"
                      >
                        <v-img :src="reward.image"></v-img>
                      </v-avatar>
                    </v-col>
                  </v-row>
                </v-col>
                <!-- Se não estiver em modo edição, exibe a lista de Players Interested -->
                <v-col cols="12" v-if="!isEditable">
                  <p class="pb-3 font-weight-bold">PLAYERS INTERESTED</p>
                  <v-row>
                    <v-col
                      cols="12"
                      v-for="(player, index) in paginatedPlayers"
                      :key="player.users_pk"
                      class="pa-"
                    >
                      <v-card
                        class="pa-1 mb-3"
                        rounded="lg"
                        elevation="10" >
                      
                        <v-row no-gutters> <!-- remove espaço interno entre colunas -->
                          <!-- Imagem do jogador -->
                        <v-col
                            cols="4"
                            lg="1"
                            class="d-flex"
                          >
                            <v-img
                              :src="player.picture_hash
                                ? `https://druna-assets.s3.us-east-2.amazonaws.com/Profile/${player.picture_hash}`
                                : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/user.png'"
                              alt="Player Image"
                              max-width="90"
                              max-height="90"
                              class="rounded-lg"
                            ></v-img>
                          </v-col>

                          <!-- Informações -->
                          <v-col cols="8" class=" pl-3 d-flex flex-column justify-center">
                            <p class="font-weight-bold text-truncate">
                              {{ player.user_name }}
                            </p>
                            <p class="text-caption">
                              Status: {{ player.event_status }}
                            </p>
                            <p v-if="player.status_date" class="text-caption grey--text">
                              Received: {{ new Date(player.status_date).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }) }}
                            </p>
                          </v-col>

                          <!-- Botões -->
                          <v-col
                            cols="12" md="3"
                            class="d-flex align-center justify-end flex-column"
                          >
                            <v-btn
                              color="green"
                              size="x-small"
                              class="mt-2"
                              block
                              @click="updatePlayerStatus(player, grantedStatus)"
                            >
                              Granted Passage
                            </v-btn>
                            <v-btn
                              color="red"
                              size="x-small"
                              block
                              class="mt-2"
                              @click="updatePlayerStatus(player, turnedAwayStatus)"
                            >
                              Turned Away
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                    <v-col cols="12" class="d-flex justify-center">
                      <v-pagination
                        v-model="currentPage"
                        :length="totalPages"
                      ></v-pagination>
                    </v-col>
                  </v-row>
                </v-col>
                <!-- Botões -->
                <v-col cols="12" class="d-flex justify-space-between">
                  <v-btn color="red" @click="editEventDialog = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    v-if="isEditable"
                    color="green"
                    @click="saveEditedEvent"
                    >Save Changes</v-btn
                  >
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
import { ref, computed, watch, onMounted, inject } from "vue";
import { useUserStore } from "@/store/UserStore";
import { useEventStore } from "@/store/EventStore";

const axios = inject("axios");
if (!axios) {
  throw new Error("Axios não foi injetado na aplicação.");
}

const eventStore = useEventStore();

const isEditable = ref(false);

const openEditDialog = (event, editable = false) => {
  const eventDate = new Date(event.event_date);
  const hours24 = eventDate.getHours();
  const minutes = String(eventDate.getMinutes()).padStart(2, '0');

  const hours12 = hours24 % 12 || 12; 
  const ampm = hours24 >= 12 ? 'PM' : 'AM';

  editableEvent.value = {
    date: event.event_date.split('T')[0], 
    time: `${String(hours12).padStart(2, '0')}:${minutes}`, 
    ampm,
    seats_number: event.seats_number,
    sceneries: event.event_scenario,
    rewards: event.rewards || [], 
  };

  selectedEvent.value = event;
  isEditable.value = editable;
  editEventDialog.value = true;

  if (!editable) {
    fetchPlayersForEvent(event.events_pk);
    fetchStatuses();
  }
};

const players = ref([]);
const currentPage = ref(1);
const pageSize = 5;
const totalPages = computed(() => Math.ceil(players.value.length / pageSize));

const paginatedPlayers = computed(() => {
  const eventFk = selectedEvent.value?.events_pk ? Number(selectedEvent.value.events_pk) : null;
  const allPlayers = eventFk && playersByEvent.value[eventFk]
    ? playersByEvent.value[eventFk]
    : [];
  const start = (currentPage.value - 1) * pageSize;
  
  return allPlayers.slice(start, start + pageSize);
});

const statuses = ref([]);

const grantedStatus = ref(null);
const turnedAwayStatus = ref(null);

const fetchStatuses = () => {
  axios
    .get("/event_status/search")
    .then((response) => {
      statuses.value = response.data.event_status;

      grantedStatus.value = statuses.value.find(
        (s) => s.name === "Granted Passage",
      )?.event_status_pk;
      turnedAwayStatus.value = statuses.value.find(
        (s) => s.name === "Turned Away",
      )?.event_status_pk;
      console.log("Status:", statuses.value);
    })
    .catch((error) => {
      console.error("Erro ao buscar status:", error);
    });
};

const playersByEvent = ref({});

const fetchPlayersForEvent = async (eventFk) => {
  try {
    const response = await axios.get("/rl_events_users/list_players", {
      params: { events_fk: eventFk },
    });
    // Converte eventFk para número para manter consistência:
    const key = Number(eventFk);
    playersByEvent.value[key] = response.data.players ?? [];
    console.log(`Players for event ${key}:`, playersByEvent.value[key]);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      playersByEvent.value[Number(eventFk)] = [];
      console.warn(`No players found for event ${eventFk}`);
    } else {
      console.error(
        `Erro ao buscar jogadores para o evento ${eventFk}:`,
        error.response?.data || error.message
      );
      playersByEvent.value[Number(eventFk)] = [];
    }
  }
};

onMounted(() => {
  const usersPk = localStorage.getItem("app_user");
  const appUser = usersPk ? JSON.parse(usersPk).users_pk : null;

  fetchStatuses();
  stores.value = JSON.parse(localStorage.getItem("stores") || "[]");
});

const updatePlayerStatus = async (player, statusPk) => {
  try {
    const userData = JSON.parse(localStorage.getItem("app_user"));
    const eventFk = selectedEvent.value?.events_pk;

    if (!userData?.users_pk || !eventFk) {
      console.error("Missing required user or event data");
      return;
    }

    const response = await axios.put("/rl_events_users/alter", {}, {
      params: {
        events_pk: eventFk,
        users_fk: userData.users_pk,
        events_fk: eventFk,
        status: statusPk,
        active: true,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    console.log("Status updated successfully:", response.data);
    player.event_status = statusPk;
    fetchPlayersForEvent(eventFk); 

  } catch (error) {
    console.error("Error updating player status:", {
      request: error.config?.data,
      response: error.response?.data,
      message: error.message
    });
  }
};

const dateRules = [
  (value) => {
    if (!value) return "Date is required.";

    const inputDate = new Date(value);
    if (inputDate < today) return "Date cannot be in the past.";

    if (inputDate > oneYearFromToday)
      return "Date cannot be more than 1 year from today.";

    return true;
  },
];

const today = new Date();
const todayISO = today.toISOString().split("T")[0];

const oneYearFromToday = new Date();
oneYearFromToday.setFullYear(today.getFullYear() + 1);
const oneYearFromTodayISO = oneYearFromToday.toISOString().split("T")[0];

const handleTimeInput = (event) => {
  let raw = event.target.value.replace(/\D/g, "");
  raw = raw.slice(0, 4);
  let hh = raw.slice(0, 2);
  let mm = raw.slice(2, 4);
  
  if (hh.length === 2) {
    let h = parseInt(hh);
    if (h < 1) hh = "01";
    else if (h > 12) hh = "12";
    else hh = h.toString().padStart(2, "0");
  }

  if (mm.length === 2) {
    let m = parseInt(mm);
    if (m > 59) mm = "59";
    else mm = m.toString().padStart(2, "0");
  }

  if (mm) {
    newEvent.value.hour = `${hh}:${mm}`;
  } else {
    newEvent.value.hour = hh;
  }
};

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

const openDialog = (event) => {
  selectedEvent.value = event;
  dialog.value = true;
};

const joinEvent = () => {
  alert(`You have joined the event: ${selectedEvent.value.name}`);
  dialog.value = false;
};

const selectedStoreImage = computed(() => {
  const store = stores.value.find(
    (s) => s.storename === selectedEvent.value?.store,
  );
  return store?.picture_hash
    ? `http://druna-user-pic.s3-website.us-east-2.amazonaws.com/${store.picture_hash}`
    : "https://via.placeholder.com/150";
});

const selectedStore = computed(() => {
  return (
    stores.value.find((s) => s.store_name === selectedEvent.value?.store) || {}
  );
});

// Sample Events Data
const activeTab = ref("events");
const sortBy = ref("date");
const events = ref([]);

const fetchPlayerEvents = async () => {
  try {
    const player_fk = userStore.user?.users_pk;

    if (!player_fk) {
      console.error("❌ Erro: player_fk (users_pk) não definido.");
      return;
    }

    const response = await axios.get("/events/my_events/player", {
      params: { player_fk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    events.value = response.data.events || [];
  } catch (error) {
    console.error(
      "❌ Erro ao buscar eventos do jogador:",
      error.response?.data || error.message,
    );
  }
};

const sortedEvents = computed(() => {
  if (sortBy.value === "date") {
    return events.value.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  return events.value;
});

onMounted(() => {
  fetchPlayerEvents();
});

const sceneries = ref([]);

const fetchSceneries = async () => {
  await axios.get('/sceneries/search', {
    params: { active: true },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  }).then((response) => {
    sceneries.value = response.data.sceneries || [];
    console.log("✅ Cenários carregados:", sceneries.value);
  }).catch((error) => {
    console.error("❌ Erro ao buscar cenários:", error.response?.data || error.message);
  })
};

onMounted(async () => {
  await fetchSceneries();
});

const addEvent = async () => {
  const userStore = useUserStore();
  const userId = userStore.user?.users_pk;

  if (
    !newEvent.value.date ||
    !newEvent.value.hour ||
    !newEvent.value.store ||
    !newEvent.value.seats ||
    !newEvent.value.scenario ||
    !userId
  ) {
    console.error("❌ Dados insuficientes para criar o evento.");
    return;
  }

  let selectedStore = null;
  let storesFk = null;

  try {
    const response = await axios.get("/stores/list", {
      params: {
        users_fk: userId,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const allStores = response.data.stores || [];
    const selectedStore = stores.value.find(
      (store) =>
        store.name?.toLowerCase().trim() ===
        newEvent.value.store?.toLowerCase().trim(),
    );
    if (!selectedStore) {
      console.error("❌ Store não encontrada na API.");
      return;
    }

    storesFk = selectedStore.stores_pk;
  } catch (error) {
    console.error(
      "❌ Erro ao buscar stores na API:",
      error.response?.data || error.message,
    );
    return;
  }

  try {
    const formattedDate = new Date(
      `${newEvent.value.date}T${newEvent.value.hour}`,
    );
    const dateString = formattedDate.toLocaleDateString("en-CA"); // YYYY-MM-DD
    const timeString = formattedDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const eventDateFormatted = `${dateString}; ${timeString}`;

    const payload = {
      seats_number: newEvent.value.seats,
      seasons_fk: 2,
      sceneries_fk: newEvent.value.scenario,
      date: eventDateFormatted,
      stores_fk: storesFk,
      users_fk: userId,
      active: true,
    };

    const response = await axios.post("/events/cadastro", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    console.log("✅ Evento criado:", response.data);

    // Reseta o formulário e fecha o diálogo
    selectedRewards.value = [];
    createEventDialog.value = false;
    await fetchUserCreatedEvents();

    userCreatedEvents.value.push({
      ...newEvent.value,
      rewards: [...selectedRewards.value],
      id: Date.now(),
      createdByUser: true,
    });

    // Opcional: Atualizar lista local de eventos
    events.value.push({
      ...newEvent.value,
      rewards: [...selectedRewards.value],
      id: Date.now(),
      createdByUser: true,
    });
  } catch (error) {
    console.error(
      "❌ Erro ao cadastrar evento:",
      error.response?.data || error.message,
    );
  }
};

const deleteEvent = async (events_pk) => {
  try {
    await axios.delete(`/events/${events_pk}/delete/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });


    await fetchUserCreatedEvents();
    await fetchPlayerEvents();
  } catch (error) {
    console.error("❌ Erro ao excluir o evento:", error.response?.data || error.message);
  }
};

const userStore = useUserStore();

const userCreatedEvents = ref([]);

const fetchUserCreatedEvents = async () => {
  try {
    const retailer_fk = userStore.user?.users_pk;

    if (!retailer_fk) {
      console.error("❌ Erro: retailer_fk (users_pk) não definido.");
      return;
    }

    const response = await axios.get("/events/my_events/retailer", {
      params: { retailer_fk, active: true },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    userCreatedEvents.value = response.data.events || [];
    console.log("Eventos criados pelo usuário:", userCreatedEvents.value);
  } catch (error) {
    console.error(
      "❌ Erro ao buscar eventos criados pelo usuário:",
      error.response?.data || error.message,
    );
  }
};

onMounted(fetchUserCreatedEvents);

const availableRewards = ref([
  {
    name: "Vorn Armor",
    image:
      "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/vorn.png",
    description:
      "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    name: "Jaheen Shield",
    image:
      "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/jaheen.png",
    description:
      "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    name: "Lorelai Kiss",
    image:
      "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/lorelai.png",
    description:
      "REWARD DESCRIPTION Lorem Ipsum is simply dummy text of the printing and typesetting industrsy.",
  },
]);

const createEventDialog = ref(false);
const newEvent = ref({});

const stores = ref([]);

watch(
  () => newEvent.value.store,
  (selectedStoreName) => {
    const selectedStore = stores.value.find(
      (store) => store.storename === selectedStoreName,
    );
    if (selectedStore) {
      const { address, streetNumber, complement, city, state } = selectedStore;
      newEvent.value.address = `${address}, ${streetNumber}, ${complement}, ${city}, ${state}`;
    } else {
      newEvent.value.address = "";
    }
  },
);

onMounted(async () => {
  try {
    const response = await axios.get("/stores/list", {
      params: { users_fk: userStore.user?.users_pk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    stores.value = response.data.stores || [];

    console.log("✅ Lojas carregadas:", stores.value);
  } catch (error) {
    console.error(
      "❌ Erro ao buscar lojas:",
      error.response?.data || error.message,
    );
  }
});

const createEvent = () => {
  console.log("Event Created:", newEvent.value);
  createEventDialog.value = false;
};

const openCreateEventDialog = () => {
  createEventDialog.value = true;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    newEvent.value.image = URL.createObjectURL(file);
  }
};

const editEventDialog = ref(false);
const editableEvent = ref({ rewards: [] });

const saveEditedEvent = async () => {
  try {
    const payload = {
      seats_number: editableEvent.value.seats_number,
      sceneries_fk: editableEvent.value.sceneries, 
      event_date: `${editableEvent.value.date}T${editableEvent.value.time}`,
    };

    const eventPk = editableEvent.value.events_pk;
    console.log("Event PK:", eventPk);
    if (!eventPk) {
      console.error("Evento sem events_pk definido");
      return;
    }

    const response = await axios.put(
      "/events/alter",
      payload,
      {
        params: {
          events_pk: eventPk
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    console.log("Evento alterado com sucesso:", response.data);

    // Atualiza o evento na lista local, se necessário
    const index = events.value.findIndex((e) => e.events_pk === eventPk);
    if (index !== -1) {
      events.value[index] = { ...editableEvent.value };
    }
    editEventDialog.value = false;
  } catch (error) {
    console.error("Erro ao alterar o evento:", error.response?.data || error.message);
  }
};

const toggleEditReward = (reward) => {
  const index = editableEvent.value.rewards.findIndex((r) => r === reward);
  if (index === -1) {
    editableEvent.value.rewards.push(reward);
  } else {
    editableEvent.value.rewards.splice(index, 1);
  }
};

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
  display: inline-block;
  /* Faz o fundo se ajustar ao tamanho do conteúdo */
  background-color: white;
  /* Fundo branco */
  padding: 6px 12px;
  /* Espaçamento interno */
  border-radius: 20px;
  /* Bordas arredondadas */
  font-size: 14px;
  /* Tamanho do texto */
  font-weight: 500;
  /* Peso do texto */
  color: black;
  /* Cor do texto */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* Sombra leve para destacar */
}

.scheduled-box strong {
  font-weight: bold;
  /* Deixa "SCHEDULED FOR:" em negrito */
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

.redbutton {
  background: #691d1d;
  transform: translateY(px) translateX(-0px);
  width: 80px;
  height: 160px;
}

.editbutton {
  background: gray;
  transform: translateX(10px);
  width: 80px;
  height: 160px;
}
</style>