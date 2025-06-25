<template>
  <v-tooltip location="left">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        class="download-fab"
        style="opacity: 0.6"
        icon
        color="primary"
        size="large"
        elevation="8"
        :href="pdfUrl"
        target="_blank"
        download="Drunagor_Nights_Season_1.pdf"
      >
        <v-icon size="large">mdi-file-download-outline</v-icon>
      </v-btn>
    </template>
    <span> Download Season 1 Drunagor Nights Book</span>
  </v-tooltip>

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
      <v-dialog v-model="errorDialog.show" max-width="400">
        <v-card>
          <v-card-title class="headline">Error</v-card-title>
          <v-card-text>{{ errorDialog.message }}</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              @click="
                () => {
                  errorDialog.show = false;
                  createEventDialog = false;
                }
              "
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="successDialog" max-width="400">
        <v-card>
          <v-card-title class="headline">Success</v-card-title>
          <v-card-text>Event created successfully!</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="successDialog = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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

      <v-row class="mb-4" align="center">
        <v-col cols="12" sm="6">
          <v-checkbox
            v-model="showPast"
            label="Past events"
            hide-details
            color="primary"
          />
        </v-col>
      </v-row>

      <div v-if="activeTab === 1">
        <div v-if="loading" class="d-flex justify-center my-8">
          <v-progress-circular indeterminate size="80" color="primary" />
        </div>
        <div v-else class="list-container">
          <v-row v-if="events.length > 0">
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
          <v-row v-else>
            <v-col class="text-center">
              No events match the selected filters.
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
                <v-icon>mdi-seat</v-icon> Available Seats:
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
            <v-card color="primary" min-height="130px" class="mr-4 event-card" @click="openInGoogleMaps()">
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
          <v-progress-circular indeterminate size="80" color="primary" />
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
            <!-- <v-col cols="4">
              <v-btn variant="text" class="sort-btn" @click="">PAST</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn variant="text" class="sort-btn" @click="">LIVE</v-btn>
            </v-col> -->
          </v-row>
          <v-row v-if="userCreatedEvents.length === 0">
            <v-col class="text-center">
              No events match the selected filters.
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col
              v-for="(event, index) in userCreatedEvents"
              :key="event.events_pk"
              class="py-2 pl-1 pr-1"
              cols="12"
              md="6"
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
                <v-col cols="6" md="4">
                  <v-text-field
                    v-model="newEvent.hour"
                    label="TIME"
                    variant="outlined"
                    placeholder="HH:MM"
                    maxlength="5"
                    v-mask="'##:##'"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" md="4">
                  <v-select
                    v-model="newEvent.ampm"
                    :items="['AM', 'PM']"
                    label="AM/PM"
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4" class="d-flex align-center">
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
            <v-alert v-if="showSuccessAlert" type="success" class="mb-4" dense>
              Event changed successfully
            </v-alert>
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
                    v-model="editableEvent.sceneries_fk"
                    :items="sceneries"
                    item-title="name"
                    item-value="sceneries_pk"
                    label="SCENARIO"
                    variant="outlined"
                    :key="sceneries.length"
                    clearable
                  ></v-select>
                </v-col>
                <v-col cols="12" v-if="isEditable">
                  <v-select
                    v-model="editableEvent.store"
                    :items="stores.map((store) => store.name)"
                    label="STORE"
                    variant="outlined"
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
                  md="6"
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
                <div v-if="existingRewards.length" class="mt-4">
                  <p class="pb-2 font-weight-bold">Current Rewards:</p>
                  <v-chip
                    v-for="reward in existingRewards"
                    :key="reward.rewards_pk"
                    class="ma-1"
                    label
                  >
                    {{ reward.name }}
                  </v-chip>
                </div>
                <v-col cols="12" v-if="isEditable">
                  <p class="pb-3 font-weight-bold">REWARDS</p>
                  <v-autocomplete
                    v-model="editableEvent.rewards_pk"
                    :items="allRewards"
                    item-title="name"
                    item-value="rewards_pk"
                    label="Select Rewards"
                    multiple
                    chips
                    clearable
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
                          <v-icon>mdi-seat</v-icon> Available Seats:
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
                        @click="openInGoogleMaps()"
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
                    <p class="pb-3 font-weight-bold">
                      PLAYERS INTERESTED
                      <v-btn
                        icon
                        size="medium"
                        variant="text"
                        @click="refreshInterestedPlayers(selectedEvent)"
                      >
                        <v-icon class="mb-1" color="white">mdi-refresh</v-icon>
                      </v-btn>
                    </p>
                  </v-col>
                  <v-row>
                    <v-col
                      cols="12"
                      v-for="(player, index) in playersByEvent"
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
                                Turn Away
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
                                Grant Passage
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
                                Turn Away
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
import { useDebounceFn } from "@vueuse/core";
import { set } from "lodash-es";

const eventStore = useEventStore();
const userStore = useUserStore();

const assets = inject("assets");
const isEditable = ref(false);
const availableRewards = ref([]);
const players = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const statuses = ref([]);
const grantedStatus = ref(null);
const turnedAwayStatus = ref(null);
const JoinedtheQuest = ref(null);
const playersByEvent = ref({});
const selectedRewards = ref([]);
const dialog = ref(false);
const selectedEvent = ref(null);
const activeTab = ref(1);
const sortBy = ref("date");
const events = ref([]);
const sceneries = ref([]);
const userCreatedEvents = ref([]);
const createEventDialog = ref(false);
const newEvent = ref({});
const stores = ref([]);
const editEventDialog = ref(false);
const editableEvent = ref({ rewards_pk: [] });
const showSuccessAlert = ref(false);
const existingRewards = ref([]);
const allRewards = ref([]);
const eventRewards = ref([]);
const sharedLink = ref("");
const showDialog = ref(false);
const showAlert = ref(false);
const showPast = ref(false);
const loading = ref(false);
const timer = ref();
const lastFetchPastAll = ref(false);
const lastFetchPastMine = ref(false);
const errorDialog = ref({
  show: false,
  message: "",
});
const successDialog = ref(false);

const axios = inject("axios");
if (!axios) {
  throw new Error("Axios não foi injetado na aplicação.");
}

const sortedEvents = computed(() => {
  if (sortBy.value === "date") {
    return events.value.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  return events.value;
});

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
    stores.value.find((s) => s.name === selectedEvent.value?.store_name) || {}
  );
});

const currentShowPast = computed({
  get() {
    return activeTab.value === 1 ? showPast.value : showPast.value;
  },
  set(val) {
    if (activeTab.value === 1) showPast.value = val;
    else showPast.value = val;
  },
});

const openInGoogleMaps = () => {
  const { name, latitude, longitude } = selectedStore.value;
  console.log(
    "Opening Google Maps for:",
    name,
    latitude,
    longitude,
  );
  if (!name || latitude == null || longitude == null) return "#";

  const encodedName = name.split(" ").join("+");
  console.log("Encoded Name:", encodedName);

  const query = `${encodedName}%20${latitude},${longitude}`;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  window.open(mapsUrl, "_blank");
};

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

const openEditDialog = (event, editable = false) => {
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
    sceneries_fk: null,
    store: event.store_name,
    rewards: event.rewards || [],
  };

  selectedEvent.value = event;
  isEditable.value = editable;
  editEventDialog.value = true;

  let chain = Promise.resolve();

  if (!sceneries.value.length) {
    chain = chain.then(() => fetchSceneries());
  }

  chain = chain.then(() => {
    const found = sceneries.value.find((s) => s.name === event.scenario);
    editableEvent.value.sceneries_fk = found ? found.sceneries_pk : null;
  });

  if (!editable) {
    chain = chain.then(() => {
      fetchPlayersForEvent(event.events_pk);
      fetchStatuses();
    });
  }

  if (editable) {
    chain = chain
      .then(() =>
        axios.get("/rl_events_rewards/list_rewards", {
          params: { events_fk: event.events_pk },
        }),
      )
      .then(({ data }) => {
        existingRewards.value = data.rewards || [];
      })
      .catch((err) => {
        console.error("Erro ao buscar rewards existentes:", err);
        existingRewards.value = [];
      });
  }

  chain = chain
    .then(() => fetchAllRewards())
    .catch((err) => {
      console.error("Erro ao buscar all rewards:", err);
    });

  return chain;
};

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

const fetchPlayersForEvent = (eventFk) => {
  axios
    .get("/rl_events_users/list_players", {
      params: {
        events_fk: eventFk,
        limit: 5,
        offset: currentPage.value,
      },
    })
    .then((response) => {
      console.log(response.data);
      playersByEvent.value = response.data.players;
      totalPages.value = response.data.last_page;
    })
    .catch((error) => {
      console.error(
        "Error fetching players:",
        error.response?.data || error.message,
      );
      playersByEvent.value = [];
    });
};

const updatePlayerStatus = (player, statusPk) => {
  const eventFk = selectedEvent.value?.events_pk;

  const payload = {
    users_fk: player.users_pk,
    events_fk: eventFk,
    status: statusPk,
    active: true,
  };

  return axios
    .post("/rl_events_users/cadastro", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then(({ data }) => {
      player.event_status = data.event_status || player.event_status;
      fetchPlayersForEvent(eventFk);

      if (statusPk === "JoinedtheQuest" && Array.isArray(eventRewards.value)) {
        return Promise.all(
          eventRewards.value.map((reward) =>
            axios.post(
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
            ),
          ),
        );
      }
    })
    .catch((error) => {
      console.error("Error updating player status:", {
        request: error.config?.data,
        response: error.response?.data,
        message: error.message,
      });
    });
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
  console.log(newEvent.hour);
  let raw = event.target.value.replace(/\D/g, "");
  raw = raw.slice(0, 4);

  if (raw.length == 3) {
    let hh = raw.slice(0, 1);
    let mm = raw.slice(1, 3);
  } else if (raw.length == 4)
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

const toggleReward = (reward) => {
  if (selectedRewards.value.includes(reward)) {
    selectedRewards.value = selectedRewards.value.filter((r) => r !== reward);
  } else {
    selectedRewards.value.push(reward);
  }
};

const openDialog = (event) => {
  selectedEvent.value = event;
  dialog.value = true;
  fetchPlayersForEvent(event.events_pk);

  axios
    .get("/rl_events_rewards/list_rewards", {
      params: { events_fk: event.events_pk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((res) => {
      eventRewards.value = res.data.rewards || [];
    })
    .catch(() => {
      eventRewards.value = [];
    });
};

const joinEvent = () => {
  alert(`You have joined the event: ${selectedEvent.value.name}`);
  dialog.value = false;
};

const fetchPlayerEvents = (past) => {
  loading.value = true;
  lastFetchPastAll.value = past;
  axios
    .get("/events/list_events/", {
      params: {
        player_fk: userStore.user.users_pk,
        past_events: past.toString(),
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then(({ data }) => {
      events.value = data.events || [];
    })
    .catch((err) => {
      console.error("❌ Error fetching player events:", err);
      events.value = [];
    })
    .finally(() => {
      loading.value = false;
    });
};

const fetchUserCreatedEvents = async (past) => {
  loading.value = true;
  lastFetchPastMine.value = past;

  try {
    const params = {
      retailer_fk: userStore.user.users_pk,
      active: "true",
      past_events: past.toString(),
      limit: 30,
      offset: 0,
    };
    const { data } = await axios.get("/events/my_events/retailer", {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    userCreatedEvents.value = data.events || [];
    console.log("Fetched user created events:", userCreatedEvents.value);
  } catch (error) {
    console.error("Error fetching my events:", error);
    userCreatedEvents.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchMyEventsDebounced = useDebounceFn(() => {
  fetchUserCreatedEvents();
}, 100);

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

const addEvent = () => {
  // reset dialogs
  errorDialog.value.show = false;
  successDialog.value = false;

  const userId = userStore.user.users_pk;
  if (
    !newEvent.value.date ||
    !newEvent.value.hour ||
    !newEvent.value.store ||
    !newEvent.value.seats ||
    !newEvent.value.scenario ||
    !userId
  ) {
    errorDialog.value = {
      show: true,
      message: "Please fill in all fields before creating the event.",
    };
    return;
  }

  axios
    .get("/stores/list", {
      params: { users_fk: userId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then(({ data }) => {
      const allStores = data.stores || [];
      const found = allStores.find(
        (s) =>
          s.name?.toLowerCase().trim() ===
          newEvent.value.store.toLowerCase().trim(),
      );

      if (!found) {
        errorDialog.value = { show: true, message: "Store not found." };
        return Promise.reject("StoreNotFound");
      }
      if (!found.active) {
        errorDialog.value = { show: true, message: "This store is inactive." };
        return Promise.reject("StoreInactive");
      }
      if (!found.verified) {
        errorDialog.value = {
          show: true,
          message: "Unverified stores cannot create events.",
        };
        return Promise.reject("StoreUnverified");
      }
      if (!found.verified) {
        errorDialog.value = {
          show: true,
          message: "Unverified stores cannot create events.",
        };
        return Promise.reject();
      }

      return found.stores_pk;
    })
    .then((storesFk) => {
      const [h, m] = newEvent.value.hour.split(":").map(Number);
      const ampm = newEvent.value.ampm || "AM";
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const date = `${newEvent.value.date}; ${hh}:${mm} ${ampm}`;

      return axios.post(
        "/events/cadastro",
        {
          seats_number: newEvent.value.seats,
          seasons_fk: 2,
          sceneries_fk: newEvent.value.scenario,
          date,
          stores_fk: storesFk,
          users_fk: userId,
          active: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
    })
    .then(({ data }) => {
      const id = data.event?.events_pk;
      if (!id) {
        errorDialog.value = {
          show: true,
          message: "Error creating event. Please try again.",
        };
        return Promise.reject("EventCreationFailed");
      }
      return Promise.all(
        selectedRewards.value.map((r) =>
          axios
            .post(
              "/rl_events_rewards/cadastro",
              {
                events_fk: id,
                rewards_fk: r.rewards_pk,
                active: true,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
              },
            )
            .catch(() => null),
        ),
      ).then(() => id);
    })
    .then((id) => {
      successDialog.value = true;
      createEventDialog.value = false;

      fetchUserCreatedEvents(showPast.value).catch(() => {});
      fetchPlayerEvents().catch(() => {});

      newEvent.value = {
        date: "",
        hour: "",
        ampm: "AM",
        store: "",
        seats: "",
        scenario: "",
      };
      selectedRewards.value = [];
    })
    .catch((err) => {
      if (
        [
          "StoreNotFound",
          "StoreInactive",
          "StoreUnverified",
          "EventCreationFailed",
        ].includes(err)
      )
        return;
      console.error("Unexpected error:", err);
    });
};

const deleteEvent = (events_pk) => {
  axios
    .delete(`/events/${events_pk}/delete/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then(() => {
      fetchUserCreatedEvents(showPast.value);
      fetchPlayerEvents(showPast.value);
    })
    .catch((error) => {
      console.error(
        "❌ Erro ao excluir o evento:",
        error.response?.data || error.message,
      );
    });
};

const createEvent = () => {
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

const saveEditedEvent = () => {
  const eventPk = editableEvent.value.events_pk;
  if (!eventPk) {
    console.error("❌ Evento sem events_pk definido");
    return;
  }

  axios
    .get("/stores/list", {
      params: { users_fk: userStore.user.users_pk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((response) => {
      const allStores = response.data.stores || [];
      const foundStore = allStores.find(
        (s) => s.name === editableEvent.value.store,
      );
      if (!foundStore) {
        console.error(`❌ Store "${editableEvent.value.store}" não encontrada`);
        throw new Error("StoreNotFound");
      }
      return foundStore.stores_pk;
    })
    .then((storesFk) => {
      const seasonsFk = editableEvent.value.seasons_fk ?? 2;
      const hour = (editableEvent.value.hour || "12:00").trim();
      const ampm = editableEvent.value.ampm || "PM";
      const dateFormatted = `${editableEvent.value.date}; ${hour} ${ampm}`;

      const payload = {
        events_pk: eventPk,
        seats_number: editableEvent.value.seats_number,
        seasons_fk: seasonsFk,
        date: dateFormatted,
        stores_fk: storesFk,
      };

      return axios.put("/events/alter", payload, {
        params: { events_pk: eventPk },
      });
    })
    .then(() => {
      showSuccessAlert.value = true;
      setTimeout(() => {
        showSuccessAlert.value = false;
        editEventDialog.value = false;
        window.location.reload();
      }, 1500);
    })
    .catch((error) => {
      if (error.message === "StoreNotFound") return;
      console.error("❌ Erro ao salvar edição do evento:", error);
    });
};

const toggleEditReward = (reward) => {
  const eventId = editableEvent.value.events_pk;
  const alreadySelected = editableEvent.value.rewards.some(
    (r) => r.rewards_pk === reward.rewards_pk,
  );

  const payload = {
    events_fk: eventId,
    rewards_fk: reward.rewards_pk,
    active: !alreadySelected,
  };

  axios
    .post("/rl_events_rewards/cadastro", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then(() => {
      if (alreadySelected) {
        editableEvent.value.rewards = editableEvent.value.rewards.filter(
          (r) => r.rewards_pk !== reward.rewards_pk,
        );
      } else {
        editableEvent.value.rewards.push(reward);
      }
    })
    .catch((error) => {
      console.error(
        "❌ Erro ao atualizar rewards:",
        error.response?.data || error.message,
      );
    });
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

const fetchAllRewards = () => {
  axios
    .get("/rewards/search", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((res) => {
      allRewards.value = res.data.rewards || [];
    })
    .catch((err) => {
      console.error("❌ Erro ao buscar todos os rewards:", err);
    });
};

const fetchEventRewards = (eventId) => {
  return axios
    .get("/rl_events_rewards/list_rewards", {
      params: { events_fk: eventId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((response) => {
      const relations = response.data.rewards || [];
      return Promise.all(
        relations.map((rel) =>
          axios
            .get(`/rewards/${rel.rewards_pk}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            })
            .then((rewardRes) => rewardRes.data)
            .catch(() => null),
        ),
      ).then((fullRewards) => {
        return fullRewards.filter(Boolean);
      });
    })
    .catch((err) => {
      console.error("❌ Erro ao buscar rewards do evento:", err);
      return [];
    });
};

const handleShareEvent = (eventId) => {
  const shareLink = generateShareEventLink(eventId);
  if (shareLink) {
    sharedLink.value = shareLink; // supondo que sharedLink seja uma ref()
    showCard.value = true; // e que showCard controle exibir o card
  }
};

const shareEvent = (eventId) => {
  Promise.resolve(eventId)
    .then((id) => {
      if (!id) {
        throw new Error("ID do evento não encontrado!");
      }
      const encodedId = btoa(id.toString());
      sharedLink.value = `${window.location.origin}/event/${encodedId}`;
      showDialog.value = true;
    })
    .catch((error) => {
      console.error("Erro ao gerar link:", error);
    });
};

const copyLink = (link) => {
  navigator.clipboard
    .writeText(link)
    .then(() => {
      showDialog.value = false;
      showAlert.value = true;
    })
    .catch((error) => {
      console.error("Erro ao copiar o link:", error);
    });
};

const refreshInterestedPlayers = async (event) => {
  if (!event || !event.events_pk) {
    console.error("Refresh failed: Event data is missing.");
    return;
  }

  try {
    selectedEvent.value = event;

    await fetchPlayersForEvent(event.events_pk);
    fetchStatuses();
    await fetchAllRewards();
    const rewardsFromRelation = await fetchEventRewards(event.events_pk);
    eventRewards.value = rewardsFromRelation;
    if (editableEvent.value) {
      editableEvent.value.rewards = availableRewards.value.filter((ar) =>
        rewardsFromRelation.some((rr) => rr.rewards_pk === ar.rewards_pk),
      );
    }
  } catch (error) {
    console.error("An error occurred while refreshing event data:", error);
  }
};

onMounted(() => {
  openInGoogleMaps();
  axios
    .get("/stores/list", {
      params: { users_fk: userStore.user.users_pk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((response) => {
      stores.value = response.data.stores || [];
      console.log("Stores fetched successfully:", stores.value);
    })
    .catch((error) => {
      console.error(
        "❌ Erro ao buscar lojas:",
        error.response?.data || error.message,
      );
    });

  stores.value = JSON.parse(localStorage.getItem("stores") || "[]");

  fetchStatuses();
  fetchSceneries();
  fetchAllRewards();
  fetchPlayerEvents(showPast.value);
  fetchUserCreatedEvents(showPast.value);
});

watch(showPast, async (novo) => {
  if (activeTab.value == 1) {
    await fetchPlayerEvents(novo);
  } else {
    await fetchUserCreatedEvents(novo);
  }
});

watch(activeTab, async (novo) => {
  if (novo == 1) {
    await fetchPlayerEvents(showPast.value);
  } else {
    await fetchUserCreatedEvents(showPast.value);
  }
});

watch(currentPage, async () => {
  await fetchPlayersForEvent(selectedEvent.events_pk);
});

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

const pdfUrl = computed(() => {
  const baseUrl =
    assets && typeof assets.value !== "undefined" ? assets.value : assets;
  if (!baseUrl) {
    return "#";
  }
  return `${baseUrl}/book/test.pdf`;
});
</script>

<style scoped>
.map-link {
  color: inherit;
  text-decoration: underline;
}

.map-link:hover {
  opacity: 0.8;
}

.list-container {
  min-height: 400px;
  /* adjust as needed to prevent shrinking */
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

.download-fab {
  position: fixed;
  z-index: 1000;
  bottom: 24px;
  right: 24px;
}
@media (max-width: 960px) {
  .download-fab {
    position: absolute;
    top: 16px;
    right: 16px;
    bottom: auto;
  }
}
</style>
