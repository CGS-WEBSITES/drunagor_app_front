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
        <div v-if="loading" class="d-flex justify-center my-8">
          <v-progress-circular indeterminate size="48" color="primary" />
        </div>
        <div v-else class="list-container">
          <v-row class="mb-4" align="center">
            <v-col cols="12" sm="6">
              <v-checkbox
                v-model="showPastEvents"
                label="Past events"
                hide-details
                color="primary"
              />
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
                        {{
                          String(event.event_date).split("T")[0].split("-")[2]
                        }}
                      </p>
                      <p class="text-caption font-weight-bold">
                        {{
                          new Date(event.event_date).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            },
                          )
                        }}
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
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Diálogo para visualização do evento -->
        <v-dialog v-model="dialog" max-width="600" min-height="410">
          <v-card color="surface">
            <v-card-actions class="d-flex justify-left">
              <v-btn color="red" @click="dialog = false">X</v-btn>
            </v-card-actions>
            <v-card-text>
              <p>
                <v-icon>mdi-seat</v-icon> Disponible Seats:
                {{ selectedEvent?.seats_number }}
              </p>
              <p>
                <v-icon>mdi-sword-cross</v-icon> Scenario:
                {{ selectedEvent?.scenario }}
              </p>
              <p class="text-end scheduled-box">
                Sheduled for:
                {{
                  new Date(selectedEvent?.event_date).toLocaleString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                }}
              </p>
            </v-card-text>
            <v-card color="primary" min-height="130px" class="mr-4 event-card">
              <v-row no-gutters>
                <v-col cols="3" lg="3">
                  <v-img
                    :src="
                      selectedEvent?.picture_hash
                        ? `https://druna-assets.s3.us-east-2.amazonaws.com/${selectedEvent.picture_hash}`
                        : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'
                    "
                    class="event-img"
                  />
                </v-col>
                <v-col cols="9" class="pa-2">
                  <h3 class="text-subtitle-1 font-weight-bold">
                    {{ selectedEvent?.store_name }}
                  </h3>
                  <p class="text-caption">
                    <v-icon color="red">mdi-map-marker</v-icon>
                    {{ selectedEvent?.address }}
                  </p>
                </v-col>
                <v-col cols="2" class="text-right pa-0"></v-col>
              </v-row>
            </v-card>
            <v-card-text>
              <h3 class="text-h6 font-weight-bold">REWARDS:</h3>

              <v-row
                v-if="eventRewards.length"
                v-for="(reward, index) in eventRewards"
                :key="index"
                class="align-center my-2"
              >
                <v-col cols="3" md="2">
                  <v-avatar size="60">
                    <v-img
                      :src="`https://druna-assets.s3.us-east-2.amazonaws.com/${reward.picture_hash}`"
                    />
                  </v-avatar>
                </v-col>
                <v-col cols="9" md="10">
                  <h4 class="text-subtitle-1 font-weight-bold">
                    {{ reward.name }}
                  </h4>
                </v-col>
              </v-row>

              <p v-else class="text-caption">
                No rewards linked to this event.
              </p>
            </v-card-text>
            <v-row class="mt-2 ml-0"> </v-row>
          </v-card>
        </v-dialog>
      </div>

      <div v-if="activeTab === 2">
        <div v-if="loading" class="d-flex justify-center my-8">
          <v-progress-circular indeterminate size="48" color="primary" />
        </div>
        <div v-else class="list-container">
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
          <v-row class="mb-4" align="center">
            <v-col cols="12" sm="6">
              <v-checkbox
                v-model="showPastMyEvents"
                label="Past events"
                hide-details
                color="primary"
              />
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
                              String(event.event_date)
                                .split("T")[0]
                                .split("-")[2]
                            }}
                          </p>
                          <p class="text-caption font-weight-bold">
                            {{
                              new Date(event.event_date).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                },
                              )
                            }}
                            <!-- {{ event.ampm }} -->
                          </p>
                        </div>
                      </v-col>

                      <v-col cols="8" sm="10" class="pt-2 pl-5">
                        <h3 class="pb-1 text-truncate">
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
                          Scenario: {{ event.scenario }}
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
        </div>
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
                    :items="stores.map((store) => store.name)"
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
                  <v-autocomplete
                    v-model="selectedRewards"
                    :items="allRewards"
                    item-title="name"
                    item-value="rewards_pk"
                    label="Select Rewards"
                    multiple
                    return-object
                  >
                    <template #item="{ item, props }">
                      <v-list-item v-bind="props">
                        <template #prepend>
                          <v-avatar size="32">
                            <v-img
                              :src="`https://druna-assets.s3.us-east-2.amazonaws.com/${item.raw.picture_hash}`"
                            />
                          </v-avatar>
                        </template>
                        <v-list-item-title>{{
                          item.raw.name
                        }}</v-list-item-title>
                      </v-list-item>
                    </template>
                    <template #selection="{ item, index }">
                      <v-chip
                        size="small"
                        class="ma-1"
                        closable
                        @click:close="selectedRewards.splice(index, 1)"
                      >
                        <v-avatar start size="24">
                          <v-img
                            :src="`https://druna-assets.s3.us-east-2.amazonaws.com/${item.raw.picture_hash}`"
                          />
                        </v-avatar>
                        {{ item.raw.name }}
                      </v-chip>
                    </template>
                  </v-autocomplete>
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
        <!-- Diálogo de Edição / Visualização com lista de Players Interested -->
        <v-dialog
          v-model="editEventDialog"
          scroll-target="#app"
          max-width="800"
        >
          <v-card class="dark-background">
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
                    item-title="name"
                    item-value="sceneries_pk"
                    label="SCENARIO"
                    variant="outlined"
                    :key="sceneries.length"
                  ></v-select>
                </v-col>
                <v-col cols="6" md="3" v-if="isEditable">
                  <v-text-field
                    v-model="editableEvent.hour"
                    label="TIME"
                    variant="outlined"
                    placeholder="HH:MM"
                    maxlength="5"
                    @blur="validateTime"
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
                <v-col
                  cols="12"
                  md="2"
                  class="d-flex align-center"
                  v-if="isEditable"
                >
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
                  <v-autocomplete
                    v-model="editableEvent.rewards"
                    :items="availableRewards"
                    item-title="name"
                    item-value="rewards_pk"
                    label="Select Rewards"
                    multiple
                    chips
                    return-object="{false}"
                  ></v-autocomplete>
                </v-col>
                <!-- Se não estiver em modo edição, exibe a lista de Players Interested -->
                <v-col
                  cols="12"
                  class="d-flex align-end flex-column"
                  v-if="!isEditable"
                >
                  <v-col class="d-flex align-center flex-column">
                    <v-card color="surface" class="ml-5">
                      <v-card-text>
                        <p>
                          <v-icon>mdi-seat</v-icon> Disponible Seats:
                          {{ selectedEvent?.seats_number }}
                        </p>
                        <p>
                          <v-icon>mdi-sword-cross</v-icon> Scenario:
                          {{ selectedEvent?.scenario }}
                        </p>
                        <p class="text-end scheduled-box">
                          Sheduled for:
                          {{
                            new Date(selectedEvent?.event_date).toLocaleString(
                              "en-US",
                              {
                                month: "2-digit",
                                day: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              },
                            )
                          }}
                        </p>
                      </v-card-text>
                      <v-card
                        color="primary"
                        min-height="130px"
                        class="mr-4 event-card"
                      >
                        <v-row no-gutters>
                          <v-col cols="3" lg="3">
                            <v-img
                              :src="
                                selectedEvent?.picture_hash
                                  ? `https://druna-assets.s3.us-east-2.amazonaws.com/${selectedEvent.picture_hash}`
                                  : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'
                              "
                              class="event-img"
                            />
                          </v-col>
                          <v-col cols="9" class="pa-2">
                            <h3 class="text-subtitle-1 font-weight-bold">
                              {{ selectedEvent?.store_name }}
                            </h3>
                            <p class="text-caption">
                              <v-icon color="red">mdi-map-marker</v-icon>
                              {{ selectedEvent?.address }}
                            </p>
                          </v-col>
                          <v-col cols="2" class="text-right pa-0"></v-col>
                        </v-row>
                      </v-card>
                      <v-card-text>
                        <h3 class="text-h6 font-weight-bold mb-1">REWARDS:</h3>

                        <v-row
                          v-if="eventRewards.length"
                          v-for="(reward, index) in eventRewards"
                          :key="index"
                          class="align-center"
                        >
                          <v-col cols="3" md="2">
                            <v-avatar>
                              <v-img
                                :src="`https://druna-assets.s3.us-east-2.amazonaws.com/${reward.picture_hash}`"
                              />
                            </v-avatar>
                          </v-col>
                          <v-col cols="9" md="10">
                            <h4 class="text-subtitle-1 font-weight-bold">
                              {{ reward.name }}
                            </h4>
                          </v-col>
                        </v-row>

                        <p v-else class="text-caption">
                          No rewards linked to this event.
                        </p>
                      </v-card-text>
                      <br />
                      <v-btn
                        block
                        color="blue"
                        size="small"
                        variant="flat"
                        class="mt-2"
                        @click="shareEvent(selectedEvent?.events_pk)"
                      >
                        <v-icon start>mdi-share-variant</v-icon>
                        Share Event
                      </v-btn>

                      <v-dialog v-model="showDialog" width="400">
                        <v-card>
                          <v-card-title class="text-h6"
                            >Share Event</v-card-title
                          >
                          <v-card-text>
                            <v-text-field
                              v-model="sharedLink"
                              label="Event Link"
                              readonly
                              density="compact"
                              hide-details
                            ></v-text-field>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="success"
                              size="small"
                              @click="copyLink(sharedLink)"
                            >
                              Copy Link
                            </v-btn>
                            <v-btn
                              color="grey"
                              size="small"
                              @click="showDialog = false"
                            >
                              Close
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-card>
                  </v-col>
                  <v-col>
                    <p class="pb-3 font-weight-bold">PLAYERS INTERESTED</p>
                  </v-col>
                  <v-row>
                    <v-col
                      cols="12"
                      v-for="(player, index) in paginatedPlayers"
                      :key="player.users_pk"
                      class="pa-1"
                    >
                      <v-card class="pa-1 mb-3" rounded="lg" elevation="10">
                        <v-row no-gutters>
                          <!-- remove espaço interno entre colunas -->
                          <!-- Imagem do jogador -->
                          <v-col cols="4" lg="1" class="d-flex">
                            <v-img
                              :src="
                                player.picture_hash
                                  ? `https://druna-assets.s3.us-east-2.amazonaws.com/Profile/${player.picture_hash}`
                                  : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/user.png'
                              "
                              alt="Player Image"
                              max-width="90"
                              max-height="90"
                              class="rounded-lg"
                            ></v-img>
                          </v-col>

                          <!-- Informações -->
                          <v-col
                            cols="8"
                            class="pl-3 d-flex flex-column justify-center"
                          >
                            <p class="font-weight-bold text-truncate">
                              {{ player.user_name }}
                            </p>
                            <p class="text-caption">
                              Status: {{ player.event_status }}
                            </p>
                            <p
                              v-if="player.status_date"
                              class="text-caption grey--text"
                            >
                              Received:
                              {{
                                new Date(player.status_date).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )
                              }}
                            </p>
                          </v-col>

                          <!-- Botões -->
                          <v-col cols="12" md="3" class="d-flex flex-column">
                            <!-- Ícone de Granted Passage, centralizado -->
                            <template
                              v-if="player.event_status === 'Granted Passage'"
                            >
                              <v-btn
                                color="deep-purple"
                                size="x-small"
                                class="mt-2 mt-md-0 pa-0"
                                block
                                @click="
                                  updatePlayerStatus(player, JoinedtheQuest)
                                "
                              >
                                <v-icon start>mdi-flag-checkered</v-icon>
                                Start Event
                              </v-btn>

                              <v-btn
                                color="red"
                                size="x-small"
                                class="mt-2"
                                block
                                @click="
                                  updatePlayerStatus(player, turnedAwayStatus)
                                "
                              >
                                <v-icon start>mdi-close-circle-outline</v-icon>
                                Turned Away
                              </v-btn>
                            </template>

                            <!-- Se o jogador está participando ativamente -->
                            <template
                              v-else-if="
                                player.event_status === 'Joined the Quest'
                              "
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align="center"
                                justify="center"
                              >
                                <v-chip
                                  color="yellow"
                                  text-color="white"
                                  class="ma-1"
                                  label
                                >
                                  <v-icon left>mdi-sword-cross</v-icon>
                                  Playing
                                </v-chip>
                              </v-row>
                            </template>

                            <!-- Ícone de Turned Away, centralizado -->
                            <template
                              v-else-if="player.event_status === 'Turned Away'"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align="center"
                                justify="center"
                              >
                                <v-btn icon disabled class="ma-0 pa-0">
                                  <v-icon color="red" size="24"
                                    >mdi-close-circle</v-icon
                                  >
                                </v-btn>
                              </v-row>
                            </template>

                            <!-- Botões de ação originais, alinhados um abaixo do outro -->
                            <template v-else>
                              <v-btn
                                color="green"
                                size="x-small"
                                class="mt-2"
                                block
                                @click="
                                  updatePlayerStatus(player, grantedStatus)
                                "
                              >
                                <v-icon start>mdi-check-circle-outline</v-icon>
                                Granted Passage
                              </v-btn>
                              <v-btn
                                color="red"
                                size="x-small"
                                class="mt-2"
                                block
                                @click="
                                  updatePlayerStatus(player, turnedAwayStatus)
                                "
                              >
                                <v-icon start>mdi-close-circle-outline</v-icon>
                                Turned Away
                              </v-btn>
                            </template>
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
                    >Close</v-btn
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

const validateTime = () => {
  const value = editableEvent.value.hour;
  if (!value || value.length !== 5 || !value.includes(":")) return;
  let [hh, mm] = value.split(":");
  hh = parseInt(hh);
  mm = parseInt(mm);
  if (isNaN(hh) || hh < 1) hh = 1;
  if (hh > 12) hh = 12;
  if (isNaN(mm)) mm = 0;
  if (mm > 59) mm = 59;
  editableEvent.value.hour = `${hh.toString().padStart(2, "0")}:${mm
    .toString()
    .padStart(2, "0")}`;
};

const availableRewards = ref([]);

const openEditDialog = async (event, editable = false) => {
  const [datePart, timePart] = event.event_date.split("T");
  const [hoursStr, minutesStr] = timePart.split(":");
  const hours24 = parseInt(hoursStr, 10);
  const minutes = minutesStr;
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? "PM" : "AM";

  editableEvent.value = {
    events_pk: event.events_pk,
    date: datePart,
    hour: `${String(hours12).padStart(2, "0")}:${minutes}`,
    ampm,
    seats_number: event.seats_number,
    sceneries: event.scenario,
    rewards: [], // será preenchido depois
  };

  selectedEvent.value = event;
  isEditable.value = editable;
  editEventDialog.value = true;

  if (!editable) {
    fetchPlayersForEvent(event.events_pk);
    fetchStatuses();
  }

  // 🔄 Carrega e sincroniza rewards
  await fetchAllRewards();
  eventRewards.value = await fetchEventRewards(event.events_pk);

  editableEvent.value.rewards = availableRewards.value.filter((ar) =>
    rewardsFromRelation.some((rr) => rr.rewards_pk === ar.rewards_pk),
  );

  console.log("🟢 Rewards sincronizados:", editableEvent.value.rewards);
};

const players = ref([]);
const currentPage = ref(1);
const pageSize = 5;
const totalPages = computed(() => Math.ceil(players.value.length / pageSize));

const paginatedPlayers = computed(() => {
  const eventFk = selectedEvent.value?.events_pk
    ? Number(selectedEvent.value.events_pk)
    : null;
  const allPlayers =
    eventFk && playersByEvent.value[eventFk]
      ? playersByEvent.value[eventFk]
      : [];
  const start = (currentPage.value - 1) * pageSize;

  return allPlayers.slice(start, start + pageSize);
});

const statuses = ref([]);

const grantedStatus = ref(null);
const turnedAwayStatus = ref(null);
const JoinedtheQuest = ref(null);

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
      JoinedtheQuest.value = statuses.value.find(
        (s) => s.name === "Joined the Quest",
      )?.event_status_pk;
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
    const key = Number(eventFk);
    playersByEvent.value[key] = response.data.players ?? [];
  } catch (error) {
    if (error.response && error.response.status === 404) {
      playersByEvent.value[Number(eventFk)] = [];
    } else {
      console.error(
        `Erro ao buscar jogadores para o evento ${eventFk}:`,
        error.response?.data || error.message,
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

    const payload = {
      users_fk: player.users_pk,
      events_fk: eventFk,
      status: statusPk,
      active: true,
    };

    const response = await axios.post("/rl_events_users/cadastro", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    player.event_status = response.data.event_status || player.event_status;
    fetchPlayersForEvent(eventFk);

    // ✅ Usa o eventRewards aqui
    if (statusPk === "JoinedtheQuest" && Array.isArray(eventRewards.value)) {
      for (const reward of eventRewards.value) {
        await axios.post(
          "/rl_users_rewards/cadastro",
          {
            users_fk: player.users_pk,
            rewards_fk: reward.rewards_pk,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
      }
    }
  } catch (error) {
    console.error("Error updating player status:", {
      request: error.config?.data,
      response: error.response?.data,
      message: error.message,
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

const openDialog = async (event) => {
  selectedEvent.value = event;
  dialog.value = true;

  try {
    const rewardsRes = await axios.get("/rl_events_rewards/list_rewards", {
      params: { events_fk: event.events_pk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    eventRewards.value = rewardsRes.data.rewards || [];
    console.log("🎁 Rewards para evento", event.events_pk, eventRewards.value);
  } catch (err) {
    console.error("❌ Erro ao buscar rewards:", err);
    eventRewards.value = [];
  }
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

const showPastEvents = ref(false)

const fetchPlayerEvents = async () => {
  try {
    const player_fk = userStore.user?.users_pk;

    if (!player_fk) {
      console.error("❌ Erro: player_fk (users_pk) não definido.");
      return;
    }

    // Buscar eventos do jogador
    const response = await axios.get("/events/list_events/", {
      params: { 
        player_fk,
        past_events: showPastEvents.value.toString(),
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    events.value = response.data.events || [];
    console.log("📦 Eventos carregados:", events.value);
  } catch (error) {
    console.error(
      "❌ Erro ao buscar eventos do jogador:",
      error.response?.data || error.message,
    );
  }
};

watch(showPastEvents, () => {
  if (activeTab.value === 1) {
    fetchPlayerEvents()
  }
})

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
  await axios
    .get("/sceneries/search", {
      params: { active: true },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((response) => {
      sceneries.value = [...response.data.sceneries];
    })
    .catch((error) => {
      console.error(
        "❌ Erro ao buscar cenários:",
        error.response?.data || error.message,
      );
    });
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
    let [hours, minutes] = newEvent.value.hour.split(":").map(Number);
    let ampm = newEvent.value.ampm || "AM";
    const hour12 = String(hours).padStart(2, "0");
    const minute = String(minutes).padStart(2, "0");
    const eventDateFormatted = `${newEvent.value.date}; ${hour12}:${minute} ${ampm}`;

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

    const newEventId = response.data?.event?.events_pk;

    if (!newEventId) {
      console.error("❌ Não foi possível extrair o ID do novo evento.");
      return;
    }

    // ✅ Adiciona rewards ao evento
    for (const reward of selectedRewards.value) {
      try {
        await axios.post(
          "/rl_events_rewards/cadastro",
          {
            events_fk: newEventId,
            rewards_fk: reward.rewards_pk,
            active: true,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
      } catch (err) {
        console.error("❌ Erro ao associar reward ao evento:", err);
      }
    }

    createEventDialog.value = false;
    await fetchUserCreatedEvents();
  } catch (error) {
    console.error(
      "❌ Erro ao cadastrar evento ou associar rewards:",
      error.response?.data || error.message,
    );
  }

  newEvent.value = {
    date: "",
    hour: "",
    ampm: "AM",
    store: "",
    seats: "",
    scenario: "",
  };

  selectedRewards.value = [];

  createEventDialog.value = false;
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
    console.error(
      "❌ Erro ao excluir o evento:",
      error.response?.data || error.message,
    );
  }
};

const userStore = useUserStore();

const userCreatedEvents = ref([]);

const showPastMyEvents = ref(false)

const fetchUserCreatedEvents = async () => {
  try {
    const retailer_fk = userStore.user?.users_pk;

    if (!retailer_fk) {
      console.error("❌ Erro: retailer_fk (users_pk) não definido.");
      return;
    }

    const response = await axios.get("/events/my_events/retailer", {
      params: { 
        retailer_fk, 
        active: true,
        past_events: showPastMyEvents.value.toString(),
        limit: 30,
        offset: 0
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    userCreatedEvents.value = response.data.events || [];
  } catch (error) {
    console.error(
      "❌ Erro ao buscar eventos criados pelo usuário:",
      error.response?.data || error.message,
    );
  }
};

watch(showPastMyEvents, () => {
  if (activeTab.value === 2) {
    fetchUserCreatedEvents()
  }
})

onMounted(fetchUserCreatedEvents);

const loading = ref(false);

async function loadList() {
  loading.value = true;
  if (activeTab.value === 1) {
    await fetchPlayerEvents();
  } else {
    await fetchUserCreatedEvents();
  }
  loading.value = false;
}

watch(activeTab, async (newTab, oldTab) => {
  showPastEvents.value   = false
  showPastMyEvents.value = false

  loading.value = true
  if (newTab === 1) {
    await fetchPlayerEvents()
  } else {
    await fetchUserCreatedEvents()
  }
  loading.value = false
}, { immediate: true })

watch(activeTab, loadList, { immediate: true })

onMounted(loadList);

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
    const eventPk = editableEvent.value.events_pk;
    if (!eventPk) {
      console.error("❌ Evento sem events_pk definido");
      return;
    }

    // Formata a data e hora
    const hourValue = editableEvent.value.hour?.trim() || "12:00";
    const ampmValue = editableEvent.value.ampm?.trim() || "PM";
    const eventDateFormatted = `${editableEvent.value.date}; ${hourValue} ${ampmValue}`;

    // Atualiza os dados do evento
    const payload = {
      seats_number: editableEvent.value.seats_number,
      sceneries_fk: editableEvent.value.sceneries_fk,
      date: eventDateFormatted,
    };

    await axios.put("/events/alter", payload, {
      params: { events_pk: eventPk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    // 🔄 Pega os rewards já salvos na relação para este evento
    const existingRelationsRes = await axios.get(
      "/rl_events_rewards/list_rewards",
      {
        params: { events_fk: eventPk },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );

    const currentRelations = existingRelationsRes.data.rewards || [];
    const currentIds = currentRelations.map((r) => r.rewards_pk);
    const updatedIds = editableEvent.value.rewards.map((r) => r.rewards_pk);

    // ➕ Adicionar novos rewards
    const toAdd = updatedIds.filter((id) => !currentIds.includes(id));
    for (const rewards_fk of toAdd) {
      console.log("🔼 Tentando adicionar reward:", {
        events_fk: eventPk,
        rewards_fk,
      });
      try {
        await axios.post(
          "/rl_events_rewards/cadastro",
          {
            events_fk: eventPk,
            rewards_fk,
            active: true,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
        console.log("✅ Reward adicionado com sucesso:", rewards_fk);
      } catch (err) {
        console.error(
          "❌ Erro ao adicionar reward:",
          rewards_fk,
          err.response?.data || err.message,
        );
      }
    }

    // ❌ Remover (inativar) os desmarcados
    const toRemove = currentIds.filter((id) => !updatedIds.includes(id));
    for (const rewards_fk of toRemove) {
      try {
        await axios.post(
          "/rl_events_rewards/cadastro",
          {
            events_fk: eventPk,
            rewards_fk,
            active: false,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
        console.log("🗑️ Reward inativado com sucesso:", rewards_fk);
      } catch (err) {
        console.error(
          "❌ Erro ao inativar reward:",
          rewards_fk,
          err.response?.data || err.message,
        );
      }
    }

    // Atualiza localmente
    const index = events.value.findIndex((e) => e.events_pk === eventPk);
    if (index !== -1) {
      events.value[index] = { ...editableEvent.value };
    }

    editEventDialog.value = false;
    await fetchUserCreatedEvents();
  } catch (error) {
    console.error(
      "Erro ao alterar o evento:",
      error.response?.data || error.message,
    );
  }
};

const toggleEditReward = async (reward) => {
  const eventId = editableEvent.value.events_pk;
  const alreadySelected = editableEvent.value.rewards.some(
    (r) => r.rewards_pk === reward.rewards_pk,
  );

  try {
    if (alreadySelected) {
      await axios.post(
        "/rl_events_rewards/cadastro",
        {
          events_fk: eventId,
          rewards_fk: reward.rewards_pk,
          active: false,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      editableEvent.value.rewards = editableEvent.value.rewards.filter(
        (r) => r.rewards_pk !== reward.rewards_pk,
      );
    } else {
      await axios.post(
        "/rl_events_rewards/cadastro",
        {
          events_fk: eventId,
          rewards_fk: reward.rewards_pk,
          active: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      editableEvent.value.rewards.push(reward);
    }

    console.log("✅ Rewards atualizados:", editableEvent.value.rewards);
  } catch (error) {
    console.error(
      "❌ Erro ao atualizar rewards:",
      error.response?.data || error.message,
    );
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

const allRewards = ref([]);

const fetchAllRewards = async () => {
  try {
    const res = await axios.get("/rewards/search", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    allRewards.value = res.data.rewards || [];
  } catch (err) {
    console.error("❌ Erro ao buscar todos os rewards:", err);
  }
};

const eventRewards = ref([]);

const fetchEventRewards = async (eventId) => {
  try {
    const response = await axios.get("/rl_events_rewards/list_rewards", {
      params: { events_fk: eventId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const relations = response.data.rewards || [];

    const fullRewards = await Promise.all(
      relations.map(async (rel) => {
        try {
          const rewardRes = await axios.get(`/rewards/${rel.rewards_pk}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
          return rewardRes.data;
        } catch (err) {
          return null;
        }
      }),
    );

    return fullRewards.filter(Boolean); // 🔁 Aqui retorna a lista válida
  } catch (err) {
    console.error("❌ Erro ao buscar rewards do evento:", err);
    return [];
  }
};

const handleShareEvent = (eventId) => {
  const shareLink = generateShareEventLink(eventId);
  if (shareLink) {
    sharedLink.value = shareLink; // supondo que sharedLink seja uma ref()
    showCard.value = true; // e que showCard controle exibir o card
  }
};

const sharedLink = ref("");
const showDialog = ref(false);
const showAlert = ref(false);

const shareEvent = (eventId) => {
  try {
    if (!eventId) throw new Error("ID do evento não encontrado!");

    const encodedId = btoa(eventId.toString());
    console.log("ID codificado:", encodedId);

    sharedLink.value = `${window.location.origin}/event/${encodedId}`;
    showDialog.value = true; // Abre o popup
  } catch (error) {
    console.error("Erro ao gerar link:", error);
  }
};

const copyLink = async (link) => {
  try {
    await navigator.clipboard.writeText(link);
    showDialog.value = false; // Fecha o popup
    showAlert.value = true; // Mostra o alerta
  } catch (error) {
    console.error("Erro ao copiar o link:", error);
  }
};

onMounted(() => {
  fetchAllRewards();
});
</script>

<style scoped>
.list-container {
  min-height: 400px; /* adjust as needed to prevent shrinking */
}
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
