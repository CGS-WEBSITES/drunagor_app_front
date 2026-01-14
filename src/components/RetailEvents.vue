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

      <v-dialog v-model="turnAwayConfirmDialog.show" max-width="500" persistent>
        <v-card>
          <v-card-title class="headline">Are you sure?</v-card-title>
          <v-card-text>
            This action will turn the player away and cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="turnAwayConfirmDialog.show = false">
              Cancel
            </v-btn>
            <v-btn color="red" text @click="executeTurnAway"> Confirm </v-btn>
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
        <v-col cols="12" sm="6" class="d-flex align-center">
          <span class="ml-2">Upcoming</span>
          <v-switch
            v-model="showPast"
            hide-details
            color="secundary"
            class="mx-4"
          ></v-switch>
          <span>All</span>
        </v-col>
      </v-row>

      <div v-if="activeTab === 1">
        <div v-if="loading" class="loading-overlay">
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
                <v-img
                  v-if="getSeasonInfo(event.seasons_fk).flag"
                  :src="getSeasonInfo(event.seasons_fk).flag"
                  class="season-flag"
                />
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
                            }
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
      </div>

      <div v-if="activeTab === 2">
        <div v-if="loading" class="loading-overlay">
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
                @click="openManageDialog(event)"
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
                                }
                              )
                            }}
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
      </div>

      <v-dialog
        v-model="manageDialog"
        scroll-target="#app"
        max-width="900"
        persistent
      >
        <v-card color="surface">
          <div v-if="loadingTables" class="dialog-overlay">
            <v-progress-circular indeterminate size="80" color="primary" />
          </div>

          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h6">Manage Event</span>
            <v-btn icon variant="text" @click="manageDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-tabs
            v-model="manageTab"
            bg-color="background"
            centered
            grow
            class="mb-4"
          >
            <v-tab value="details">
              <v-icon start>mdi-information-outline</v-icon> Details
            </v-tab>
            <v-tab value="tables">
              <v-icon start>mdi-table-chair</v-icon> Tables
            </v-tab>
            <v-tab value="players">
              <v-icon start>mdi-account-group</v-icon> Players
            </v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="manageTab">
              
              <v-window-item value="details">
                <v-card-text class="pt-0">
                  <p>
                    <v-icon>mdi-seat</v-icon> Available Seats:
                    {{ selectedEvent?.seats_number }}
                  </p>
                  <p>
                    <v-icon>mdi-sword-cross</v-icon> Scenario:
                    {{ selectedEvent?.scenario }}
                  </p>
                  <p v-if="getSeasonInfo(selectedEvent?.seasons_fk).name">
                    <v-icon>mdi-shield-sun</v-icon> Season:
                    {{ getSeasonInfo(selectedEvent.seasons_fk).name }}
                  </p>
                  <p class="text-end scheduled-box">
                    Scheduled for:
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
                            ? `https://assets.drunagor.app/${selectedEvent.picture_hash}`
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

                <v-card color="primary" class="mr-4 mt-4 event-card">
                  <v-responsive
                    style="width: 100%; height: 200px"
                    aspect-ratio="16/9"
                  >
                    <iframe
                      v-if="selectedEvent?.latitude"
                      :src="
                        `https://www.google.com/maps?q=${selectedEvent.latitude},${selectedEvent.longitude}` +
                        `&z=15&output=embed`
                      "
                      frameborder="0"
                      style="border: 0; width: 100%; height: 100%"
                      allowfullscreen
                      loading="lazy"
                    />
                  </v-responsive>
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
                          :src="`https://assets.drunagor.app/${reward.picture_hash}`"
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
              </v-window-item>

              <v-window-item value="tables">
                <v-row class="mb-4">
                  <v-col
                    cols="12"
                    class="d-flex justify-space-between align-center flex-wrap"
                  >
                    <h3 class="text-h6 mb-2 mb-md-0">Event Tables</h3>
                    <div class="d-flex gap-3 flex-wrap">
                      <v-btn
                        color="primary"
                        @click="openCreateTableDialog"
                        size="default"
                      >
                        <v-icon start>mdi-plus</v-icon> Create Table
                      </v-btn>
                      <v-btn
                        color="secondary"
                        @click="openCreateMultipleTablesDialog"
                        size="default"
                      >
                        <v-icon start>mdi-table-multiple</v-icon> Create
                        Multiple Tables
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>

                <div v-if="loadingTables" class="text-center py-6">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </div>

                <v-row v-else>
                  <v-col
                    cols="12"
                    v-if="tables.length === 0"
                    class="text-center text-grey py-6"
                  >
                    No tables created yet. Create your first table!
                  </v-col>

                  <v-col
                    v-for="table in tables"
                    :key="table.event_tables_pk"
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-card
                      class="pa-4 table-card"
                      elevation="4"
                      rounded="lg"
                      @click="generateQRCode(table)"
                    >
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          class="d-flex justify-space-between align-center mb-2"
                        >
                          <v-chip
                            color="primary"
                            size="small"
                            label
                            class="font-weight-bold"
                          >
                            <v-icon start color="white" size="small">
                              mdi-table-furniture
                            </v-icon>
                            <span class="table-number-text">
                              Table {{ table.table_number }}
                            </span>
                          </v-chip>
                          <v-btn
                            icon
                            size="small"
                            color="red"
                            variant="text"
                            @click.stop="deleteTable(table.event_tables_pk)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </v-col>

                        <v-col cols="12">
                          <div
                            class="d-flex align-center justify-space-between mb-2"
                          >
                            <span class="text-caption text-grey">Players</span>
                            <v-chip
                              size="small"
                              :color="table.is_full ? 'red' : 'green'"
                              variant="flat"
                            >
                              {{ table.players_count }}/{{ table.max_players }}
                            </v-chip>
                          </div>
                          <v-progress-linear
                            :model-value="
                              (table.players_count / table.max_players) * 100
                            "
                            :color="table.is_full ? 'red' : 'green'"
                            height="8"
                            rounded
                          ></v-progress-linear>
                        </v-col>

                        <v-col cols="12" class="mt-3">
                          <div class="text-caption text-grey">
                            <v-icon size="small" class="mr-1">mdi-seat</v-icon>
                            {{ table.available_seats }} seat(s) available
                          </div>
                        </v-col>

                        <v-col cols="12" class="mt-2">
                          <v-btn
                            block
                            size="small"
                            color="white"
                            variant="tonal"
                            @click.stop="generateQRCode(table)"
                          >
                            <v-icon start size="small">mdi-qrcode</v-icon>
                            Generate QR Code
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
              </v-window-item>

              <v-window-item value="players">
                <v-row>
                  <v-col cols="12" class="d-flex align-end flex-column">
                    <p class="pb-3 font-weight-bold">
                      PLAYERS INTERESTED
                      <v-btn
                        icon
                        size="medium"
                        variant="text"
                        @click="fetchPlayersForEvent(selectedEvent.events_pk)"
                      >
                        <v-icon class="mb-1" color="white">mdi-refresh</v-icon>
                      </v-btn>
                    </p>
                  </v-col>

                  <v-col
                    cols="12"
                    v-for="player in playersByEvent"
                    :key="player.users_pk"
                    class="pa-1"
                  >
                    <v-card class="pa-1 mb-3" rounded="lg" elevation="10">
                      <v-row no-gutters>
                        <v-col cols="4" lg="1" class="d-flex">
                          <v-img
                            :src="
                              player.picture_hash
                                ? `https://assets.drunagor.app/Profile/${player.picture_hash}`
                                : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/user.png'
                            "
                            alt="Player Image"
                            max-width="90"
                            max-height="90"
                            class="rounded-lg"
                          ></v-img>
                        </v-col>
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
                                }
                              )
                            }}
                          </p>
                        </v-col>
                        <v-col cols="12" md="3" class="d-flex flex-column">
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
                              <v-icon start>mdi-flag-checkered</v-icon>Start
                              Event
                            </v-btn>
                            <v-btn
                              color="red"
                              size="x-small"
                              class="mt-2"
                              block
                              @click="confirmTurnAway(player)"
                            >
                              <v-icon start>mdi-close-circle-outline</v-icon
                              >Turn Away
                            </v-btn>
                          </template>
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
                                text-color="black"
                                class="ma-1"
                                label
                              >
                                <v-icon start>mdi-sword-cross</v-icon>Playing
                              </v-chip>
                            </v-row>
                          </template>
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
                          <template v-else>
                            <v-btn
                              color="green"
                              size="x-small"
                              class="mt-2"
                              block
                              @click="updatePlayerStatus(player, grantedStatus)"
                            >
                              <v-icon start>mdi-check-circle-outline</v-icon
                              >Grant Passage
                            </v-btn>
                            <v-btn
                              color="red"
                              size="x-small"
                              class="mt-2"
                              block
                              @click="confirmTurnAway(player)"
                            >
                              <v-icon start>mdi-close-circle-outline</v-icon
                              >Turn Away
                            </v-btn>
                          </template>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>

                  <v-col
                    cols="12"
                    class="d-flex justify-center"
                    v-if="totalPages > 1"
                  >
                    <v-pagination
                      v-model="currentPage"
                      :length="totalPages"
                    ></v-pagination>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-dialog>

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
            <p v-if="getSeasonInfo(selectedEvent?.seasons_fk).name">
              <v-icon>mdi-shield-sun</v-icon> Season:
              {{ getSeasonInfo(selectedEvent.seasons_fk).name }}
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
                      ? `https://assets.drunagor.app/${selectedEvent.picture_hash}`
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

          <v-card color="primary" class="mr-4 mt-4 event-card">
            <v-responsive
              style="width: 100%; height: 200px"
              aspect-ratio="16/9"
            >
              <iframe
                v-if="selectedEvent?.latitude"
                :src="
                  `https://www.google.com/maps?q=${selectedEvent.latitude},${selectedEvent.longitude}` +
                  `&z=15&output=embed`
                "
                frameborder="0"
                style="border: 0; width: 100%; height: 100%"
                allowfullscreen
                loading="lazy"
              />
            </v-responsive>
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
                    :src="`https://assets.drunagor.app/${reward.picture_hash}`"
                  />
                </v-avatar>
              </v-col>
              <v-col cols="9" md="10">
                <h4 class="text-subtitle-1 font-weight-bold">
                  {{ reward.name }}
                </h4>
              </v-col>
            </v-row>

            <p v-else class="text-caption">No rewards linked to this event.</p>
          </v-card-text>
          <v-row class="mt-2 ml-0"> </v-row>
        </v-card>
      </v-dialog>

      <v-dialog v-model="qrCodeDialog" max-width="500" persistent>
        <v-card color="surface">
          <div v-if="generatingQR" class="dialog-overlay">
            <v-progress-circular indeterminate size="80" color="primary" />
          </div>

          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h6">
              Table {{ selectedTable?.table_number }} QR Code
            </span>
            <v-btn icon variant="text" @click="qrCodeDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text class="text-center">
            <div v-if="qrCodeData" class="qr-code-container pa-6 mb-4">
              <qrcode-vue
                :value="qrCodeData.code"
                :size="300"
                level="H"
                render-as="canvas"
                class="mx-auto"
              />
            </div>

            <v-btn
              block
              color="secondary"
              size="large"
              class="mb-4"
              @click="showTablePlayers"
            >
              <v-icon start>mdi-account-group</v-icon>
              View Players ({{ tablePlayers.length }})
            </v-btn>

            <v-expand-transition>
              <div v-if="showPlayers">
                <v-divider class="mb-4"></v-divider>
                <h4 class="text-left mb-3">Players at this table:</h4>

                <div v-if="loadingTablePlayers" class="text-center py-4">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    size="40"
                  ></v-progress-circular>
                </div>

                <div
                  v-else-if="tablePlayers.length === 0"
                  class="text-center text-grey py-4"
                >
                  No players at this table yet.
                </div>

                <v-list v-else class="transparent">
                  <v-list-item
                    v-for="player in tablePlayers"
                    :key="player.users_pk"
                    class="mb-2 rounded-lg"
                    elevation="2"
                  >
                    <template v-slot:prepend>
                      <v-avatar size="40">
                        <v-img
                          :src="
                            player.picture_hash
                              ? `https://assets.drunagor.app/Profile/${player.picture_hash}`
                              : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/user.png'
                          "
                        ></v-img>
                      </v-avatar>
                    </template>

                    <v-list-item-title>{{ player.user_name }}</v-list-item-title>
                    <v-list-item-subtitle v-if="player.party_role">
                      {{ player.party_role }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </div>
            </v-expand-transition>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="createTableDialog" max-width="400">
        <v-card color="surface">
          <v-card-title>Create New Table</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model.number="newTable.table_number"
                  label="Table Number (optional)"
                  type="number"
                  variant="outlined"
                  hint="Leave empty to auto-generate"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.number="newTable.max_players"
                  label="Max Players"
                  type="number"
                  variant="outlined"
                  :rules="[(v) => v > 0 || 'Must be greater than 0']"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="grey"
              variant="text"
              @click="createTableDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn :loading="creatingTable" @click="createTable">Create</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="createMultipleTablesDialog" max-width="400">
        <v-card color="surface">
          <v-card-title>Create Multiple Tables</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model.number="multipleTables.quantity"
                  label="Number of Tables"
                  type="number"
                  variant="outlined"
                  :rules="[(v) => (v > 0 && v <= 50) || 'Between 1 and 50']"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.number="multipleTables.max_players"
                  label="Max Players per Table"
                  type="number"
                  variant="outlined"
                  :rules="[(v) => v > 0 || 'Must be greater than 0']"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="grey"
              variant="text"
              @click="createMultipleTablesDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn :loading="creatingTable" @click="createMultipleTables">
              Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="createEventDialog"
        max-width="1280"
        scroll-target="#app"
      >
        <v-btn icon class="close-btn" @click="createEventDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card class="pa-6 dark-background">
          <div v-if="loading" class="loading-overlay">
            <v-progress-circular indeterminate size="80" color="primary" />
          </div>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="newEvent.store"
                  :items="stores.map((store) => store.name)"
                  label="STORE"
                  variant="outlined"
                  :loading="loading"
                  no-data-text="No stores found"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newEvent.season"
                  :items="seasons"
                  item-title="name"
                  item-value="seasons_pk"
                  label="SEASON"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newEvent.scenario"
                  :items="filteredScenarios"
                  item-title="name"
                  item-value="sceneries_pk"
                  label="SCENARIO"
                  variant="outlined"
                  :disabled="!newEvent.season"
                  no-data-text="Select a season first"
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
                  @blur="newEvent.hour = validateTimeInput(newEvent.hour)"
                  @input="newEvent.hour = validateAndFormatTime($event.target.value)"
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
                            :src="`https://assets.drunagor.app/${item.raw.picture_hash}`"
                          />
                        </v-avatar>
                      </template>
                      <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
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
                          :src="`https://assets.drunagor.app/${item.raw.picture_hash}`"
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

      <v-dialog v-model="editEventDialog" scroll-target="#app" max-width="800">
        <v-card class="dark-background">
          <div v-if="loading" class="loading-overlay">
            <v-progress-circular indeterminate size="80" color="primary" />
          </div>
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
                  @blur="editableEvent.hour = validateTimeInput(editableEvent.hour)"
                  @input="editableEvent.hour = validateAndFormatTime($event.target.value)"
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
                  :key="reward.rl_events_rewards_pk"
                  class="ma-1"
                  closable
                  @click:close="removeReward(reward)"
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
              
              <v-col cols="12" class="d-flex justify-space-between">
                <v-btn color="red" @click="editEventDialog = false">Close</v-btn>
                <v-btn
                  v-if="isEditable"
                  color="green"
                  :loading="loading"
                  :disabled="loading"
                  @click="saveEditedEvent"
                >
                  Save Changes</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
  </v-col>

  <TutorialPromptDialog v-model="showTutorialPrompt" />
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, inject } from "vue";
import { useUserStore } from "@/store/UserStore";
import { useEventStore } from "@/store/EventStore";
import { useDebounceFn } from "@vueuse/core";
import { set } from "lodash-es";
import { useRouter, useRoute } from "vue-router";
import QrcodeVue from "qrcode-vue3";
import s1flag from "@/assets/s1flag.png";
import s2flag from "@/assets/s2flag.png";
import { useTutorialStore } from "@/store/TutorialStore";
import TutorialPromptDialog from "@/components/dialogs/TutorialPromptDialog.vue";

const eventStore = useEventStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const tutorialStore = useTutorialStore();
const showTutorialPrompt = ref(false);

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
const dialog = ref(false); // Info Dialog (All Events)
const manageDialog = ref(false); // Manage Dialog (My Events)
const manageTab = ref("details"); // Tab inside Manage Dialog
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
const eventsInterval = ref(null);
const playersInterval = ref(null);

const turnAwayConfirmDialog = ref({
  show: false,
  player: null,
});
const seasons = ref([]);

// Management Dialog Variables
const tables = ref([]);
const loadingTables = ref(false);
const createTableDialog = ref(false);
const createMultipleTablesDialog = ref(false);
const creatingTable = ref(false);
const newTable = ref({
  table_number: null,
  max_players: 4,
});
const multipleTables = ref({
  quantity: 4,
  max_players: 4,
});
const qrCodeDialog = ref(false);
const generatingQR = ref(false);
const selectedTable = ref(null);
const qrCodeData = ref(null);
const showPlayers = ref(false);
const tablePlayers = ref([]);
const loadingTablePlayers = ref(false);

const axios = inject("axios");
if (!axios) {
  throw new Error("Axios não foi injetado na aplicação.");
}

const getSeasonInfo = (fk) => {
  if (fk == 2) {
    return { flag: s1flag, name: "Season 1" };
  }
  if (fk == 3) {
    return { flag: s2flag, name: "Season 2" };
  }
  return { flag: null, name: "" };
};

const confirmTurnAway = (player) => {
  turnAwayConfirmDialog.value = {
    show: true,
    player: player,
  };
};

const executeTurnAway = () => {
  if (turnAwayConfirmDialog.value.player) {
    updatePlayerStatus(
      turnAwayConfirmDialog.value.player,
      turnedAwayStatus.value
    );
    turnAwayConfirmDialog.value = { show: false, player: null };
  }
};

const sortedEvents = computed(() => {
  if (sortBy.value === "date") {
    return events.value.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  return events.value;
});

const filteredScenarios = computed(() => {
  if (!newEvent.value.season) {
    return [];
  }

  if (newEvent.value.season === 2) {
    return sceneries.value.filter((s) => [2, 3, 4].includes(s.sceneries_pk));
  }
  if (newEvent.value.season === 3) {
    return sceneries.value.filter((s) => [5, 6].includes(s.sceneries_pk));
  }

  return [];
});

const selectedStoreImage = computed(() => {
  const store = stores.value.find(
    (s) => s.storename === selectedEvent.value?.store
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

const openInGoogleMaps = () => {
  const event = selectedEvent.value;

  if (!event?.store_name || event.latitude == null || event.longitude == null)
    return;

  const encodedName = event.store_name.split(" ").join("+");
  const lat = event.latitude;
  const lng = event.longitude;
  const query = `${encodedName}%20${lat},${lng}`;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  window.open(mapsUrl, "_blank");
};

// ==========================
// MANAGEMENT FUNCTIONS (Table/Players)
// ==========================

const openManageDialog = async (event) => {
  selectedEvent.value = event;
  currentPage.value = 1;
  manageTab.value = "details"; // Começa na aba de detalhes

  await Promise.all([
    fetchTablesForEvent(event.events_pk),
    fetchPlayersForEvent(event.events_pk),
    fetchStatuses(),
    fetchEventRewards(event.events_pk).then((rewards) => {
        eventRewards.value = rewards;
    }),
  ]);

  manageDialog.value = true;
};

const fetchTablesForEvent = async (eventFk) => {
  loadingTables.value = true;
  try {
    const { data } = await axios.get(`/event_tables/list/${eventFk}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    tables.value = data.tables || [];
  } catch (error) {
    console.error("Error fetching tables:", error);
    tables.value = [];
  } finally {
    loadingTables.value = false;
  }
};

const generateQRCode = async (table) => {
  selectedTable.value = table;
  generatingQR.value = true;
  qrCodeDialog.value = true;
  showPlayers.value = false;

  try {
    const { data } = await axios.post("/qr_code/generate", null, {
      params: {
        events_fk: selectedEvent.value.events_pk,
        event_tables_pk: table.event_tables_pk,
        expires_in_hours: 24,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    qrCodeData.value = data;
  } catch (error) {
    console.error("Error generating QR Code:", error);
    alert(error.response?.data?.message || "Failed to generate QR Code");
    qrCodeDialog.value = false;
  } finally {
    generatingQR.value = false;
  }
};

const showTablePlayers = async () => {
  if (!showPlayers.value) {
    await fetchTablePlayers();
  }
  showPlayers.value = !showPlayers.value;
};

const fetchTablePlayers = async () => {
  loadingTablePlayers.value = true;
  try {
    const { data } = await axios.get(
      `/rl_events_users/table_players/${selectedEvent.value.events_pk}/${selectedTable.value.event_tables_pk}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    tablePlayers.value = data.players || [];
  } catch (error) {
    console.error("Error fetching table players:", error);
    tablePlayers.value = [];
  } finally {
    loadingTablePlayers.value = false;
  }
};

const openCreateTableDialog = () => {
  newTable.value = { table_number: null, max_players: 4 };
  createTableDialog.value = true;
};

const openCreateMultipleTablesDialog = () => {
  multipleTables.value = { quantity: 4, max_players: 4 };
  createMultipleTablesDialog.value = true;
};

const createTable = async () => {
  creatingTable.value = true;
  try {
    const payload = {
      events_fk: selectedEvent.value.events_pk,
      max_players: newTable.value.max_players || 4,
      active: true,
    };

    if (newTable.value.table_number) {
      payload.table_number = newTable.value.table_number;
    }

    await axios.post("/event_tables/create", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    await fetchTablesForEvent(selectedEvent.value.events_pk);
    createTableDialog.value = false;
  } catch (error) {
    console.error("Error creating table:", error);
    alert(error.response?.data?.message || "Failed to create table");
  } finally {
    creatingTable.value = false;
  }
};

const createMultipleTables = async () => {
  creatingTable.value = true;
  try {
    const payload = {
      events_fk: selectedEvent.value.events_pk,
      quantity: multipleTables.value.quantity,
      max_players: multipleTables.value.max_players || 4,
    };

    await axios.post("/event_tables/create_multiple", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    await fetchTablesForEvent(selectedEvent.value.events_pk);
    createMultipleTablesDialog.value = false;
  } catch (error) {
    console.error("Error creating multiple tables:", error);
    alert(error.response?.data?.message || "Failed to create tables");
  } finally {
    creatingTable.value = false;
  }
};

const deleteTable = async (eventTablesPk) => {
  if (!confirm("Are you sure you want to delete this table?")) return;

  try {
    await axios.delete(`/event_tables/${eventTablesPk}/delete`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    await fetchTablesForEvent(selectedEvent.value.events_pk);
  } catch (error) {
    console.error("Error deleting table:", error);
    alert("Failed to delete table");
  }
};

// ==========================
// EDIT / INFO FUNCTIONS
// ==========================

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
    sceneries_fk: event.sceneries_fk,
    store: event.store_name,
    rewards: event.rewards || [],
  };

  eventRewards.value = [];

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
      fetchEventRewards(event.events_pk).then((rewards) => {
        eventRewards.value = rewards;
      });
      fetchPlayersForEvent(event.events_pk);
      fetchStatuses();

      clearInterval(playersInterval.value);
      playersInterval.value = setInterval(() => {
        fetchPlayersForEvent(event.events_pk);
      }, 5000);
    });
  }

  if (editable) {
    chain = chain
      .then(() =>
        axios.get("/rl_events_rewards/list_rewards", {
          params: { events_fk: event.events_pk },
        })
      )
      .then(({ data }) => {
        existingRewards.value = data.rewards || [];
        editableEvent.value.rewards_pk = existingRewards.value.map(
          (r) => r.rewards_pk
        );
      })
      .catch((err) => {
        console.error("Erro ao buscar rewards existentes:", err);
        existingRewards.value = [];
        editableEvent.value.rewards_pk = [];
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
        (s) => s.name === "Granted Passage"
      )?.event_status_pk;
      turnedAwayStatus.value = statuses.value.find(
        (s) => s.name === "Turned Away"
      )?.event_status_pk;
      JoinedtheQuest.value = statuses.value.find(
        (s) => s.name === "Joined the Quest"
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
      playersByEvent.value = response.data.players;
      totalPages.value = response.data.last_page;
    })
    .catch((error) => {
      console.error(
        "Error fetching players:",
        error.response?.data || error.message
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

      if (
        statusPk === JoinedtheQuest.value &&
        Array.isArray(eventRewards.value)
      ) {
        console.log(
          `Concedendo ${eventRewards.value.length} recompensas para o jogador ${player.user_name}`
        );
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
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            )
          )
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

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const dateRules = [
  (value) => {
    if (!value) return "The date is required.";
    const inputDate = new Date(`${value}T00:00:00`);
    if (inputDate < startOfToday) {
      return "The date cannot be in the past.";
    }
    if (inputDate > oneYearFromToday) {
      return "The date cannot be more than 1 year in the future.";
    }
    return true;
  },
];

const today = new Date();
const todayISO = today.toISOString().split("T")[0];
const oneYearFromToday = new Date();
oneYearFromToday.setFullYear(today.getFullYear() + 1);
const oneYearFromTodayISO = oneYearFromToday.toISOString().split("T")[0];

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

const fetchPlayerEvents = async (past, isPolling = false) => {
  if (!isPolling) loading.value = true;
  lastFetchPastAll.value = past;
  try {
    const { data } = await axios.get("/events/list_events/", {
      params: {
        player_fk: userStore.user.users_pk,
        past_events: past.toString(),
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const eventsData = data.events || [];
    const eventsWithRewards = await Promise.all(
      eventsData.map(async (event) => {
        try {
          const rewardsResponse = await axios.get(
            "/rl_events_rewards/list_rewards",
            {
              params: { events_fk: event.events_pk },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          const rewards = rewardsResponse.data.rewards || [];
          const formattedRewards = rewards.map((r) => ({
            ...r,
            image: `https://assets.drunagor.app/${r.picture_hash}`,
          }));
          return { ...event, rewards: formattedRewards };
        } catch (rewardError) {
          console.error(
            `Falha ao buscar recompensas para o evento ${event.events_pk}:`,
            rewardError
          );
          return { ...event, rewards: [] };
        }
      })
    );
    events.value = eventsWithRewards;
  } catch (err) {
    console.error("❌ Error fetching player events:", err);
    events.value = [];
  } finally {
    if (!isPolling) loading.value = false;
  }
};

const fetchUserCreatedEvents = async (past, isPolling = false) => {
  if (!isPolling) loading.value = true;
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

    const eventsData = data.events || [];
    const eventsWithRewards = await Promise.all(
      eventsData.map(async (event) => {
        try {
          const rewardsResponse = await axios.get(
            "/rl_events_rewards/list_rewards",
            {
              params: { events_fk: event.events_pk },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );

          const rewards = rewardsResponse.data.rewards || [];
          const formattedRewards = rewards.map((r) => ({
            ...r,
            image: `https://assets.drunagor.app/${r.picture_hash}`,
          }));

          return { ...event, rewards: formattedRewards };
        } catch (rewardError) {
          console.error(
            `Falha ao buscar recompensas para o evento ${event.events_pk}:`,
            rewardError
          );
          return { ...event, rewards: [] };
        }
      })
    );

    userCreatedEvents.value = eventsWithRewards;
  } catch (error) {
    console.error("Error fetching my events:", error);
    userCreatedEvents.value = [];
  } finally {
    if (!isPolling) loading.value = false;
  }
};

const fetchSeasons = async () => {
  try {
    const { data } = await axios.get("/seasons/search", {
      params: { active: true },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    seasons.value = data.seasons || [];
  } catch (error) {
    console.error("❌ Erro ao buscar seasons:", error);
  }
};

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
        error.response?.data || error.message
      );
    });
};

const removeReward = async (reward) => {
  try {
    const relationPk = reward.rl_events_rewards_pk;
    await axios.put(
      `/rl_events_rewards/alter/${relationPk}`,
      {
        events_fk: selectedEvent.value.events_pk,
        rewards_fk: reward.rewards_pk,
        active: false,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    existingRewards.value = existingRewards.value.filter(
      (r) => r.rl_events_rewards_pk !== relationPk
    );
    editableEvent.value.rewards_pk = editableEvent.value.rewards_pk.filter(
      (id) => id !== reward.rewards_pk
    );
  } catch (err) {
    console.error("Erro ao remover reward:", err);
    errorDialog.value = { show: true, message: "Falha ao remover reward." };
  }
};

const validateTimeInput = (timeString) => {
  if (!timeString || !timeString.includes(':')) return timeString;
  
  let [hours, minutes] = timeString.split(':');
  
  hours = parseInt(hours) || 0;
  minutes = parseInt(minutes) || 0;
  
  if (hours < 1) hours = 1;
  if (hours > 12) hours = 12;
  
  if (minutes < 0) minutes = 0;
  if (minutes > 59) minutes = 59;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const roundTimeToNearest15Minutes = (timeString) => {
  if (!timeString || !timeString.includes(':')) return timeString;
  
  const [hours, minutes] = timeString.split(':').map(Number);
  // Arredonda minutos para o múltiplo de 5 mais próximo
  const roundedMinutes = Math.round(minutes / 5) * 5;
  // Se arredondar para 60, adicionar 1 hora e zerar minutos
  if (roundedMinutes === 60) {
    const newHours = hours === 12 ? 1 : hours + 1;
    return `${String(newHours).padStart(2, '0')}:00`;
  }
  
  return `${String(hours).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}`;
};

const validateAndFormatTime = (value) => {
  if (!value) return '';
  
  // Remove tudo que não é número ou :
  let cleaned = value.replace(/[^\d:]/g, '');
  
  // Se não tem :, adiciona quando tiver 2 dígitos
  if (!cleaned.includes(':') && cleaned.length >= 2) {
    cleaned = cleaned.slice(0, 2) + ':' + cleaned.slice(2);
  }
  
  // Limita o tamanho
  if (cleaned.length > 5) {
    cleaned = cleaned.slice(0, 5);
  }
  
  // Se tem :, valida hora e minutos
  if (cleaned.includes(':')) {
    let [hours, minutes] = cleaned.split(':');
    
    // Valida horas (01-12)
    if (hours) {
      let h = parseInt(hours);
      if (h === 0) hours = '01';
      else if (h > 12) hours = '12';
      else hours = String(h).padStart(2, '0');
    }
    
    // Valida minutos (00-59)
    if (minutes !== undefined) {
      if (minutes.length > 0) {
        let m = parseInt(minutes);
        if (m > 59) minutes = '59';
        else minutes = String(m).padStart(2, '0');
      }
      cleaned = hours + ':' + minutes;
    } else {
      cleaned = hours + ':';
    }
  }
  
  return cleaned;
};

const addEvent = () => {
  loading.value = true;
  errorDialog.value.show = false;
  successDialog.value = false;

  const userId = userStore.user.users_pk;

  if (
    !newEvent.value.date ||
    !newEvent.value.hour ||
    !newEvent.value.store ||
    !newEvent.value.season ||
    !newEvent.value.scenario ||
    !userId
  ) {
    errorDialog.value = {
      show: true,
      message: "Please fill in all fields before creating the event.",
    };
    loading.value = false;
    return;
  }

  newEvent.value.hour = roundTimeToNearest15Minutes(newEvent.value.hour);

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
          newEvent.value.store.toLowerCase().trim()
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
          seats_number: 0,
          seasons_fk: newEvent.value.season,
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
        }
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
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            )
            .catch(() => null)
        )
      ).then(() => id);
    })
    .then((id) => {
      successDialog.value = true;
      createEventDialog.value = false;

      fetchUserCreatedEvents(showPast.value).catch(() => {});
      fetchPlayerEvents().catch(() => {});
      // Verificar se deve mostrar tutorial após fechar success dialog
      setTimeout(() => {
        if (tutorialStore.shouldShowInitialSetup) {
          showTutorialPrompt.value = true;
        }
      }, 500);

      newEvent.value = {
        date: "",
        hour: "",
        ampm: "AM",
        store: "",
        season: null,
        scenario: null,
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
      loading.value = false;
    })
    .finally(() => {
      loading.value = false;
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
        error.response?.data || error.message
      );
    });
};

const openCreateEventDialog = () => {
  createEventDialog.value = true;
};

const saveEditedEvent = () => {
  loading.value = true;

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
        (s) => s.name === editableEvent.value.store
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
        sceneries_fk: editableEvent.value.sceneries_fk,
        date: dateFormatted,
        stores_fk: storesFk,
      };

      return axios.put("/events/alter", payload, {
        params: { events_pk: eventPk },
      });
    })
    .then(() => {
      const before = existingRewards.value.map((r) => r.rewards_pk);
      const after = editableEvent.value.rewards_pk;

      const toAdd = after.filter((id) => !before.includes(id));
      const toRemove = before.filter((id) => !after.includes(id));

      const promises = [
        ...toAdd.map((id) =>
          axios.post(
            "/rl_events_rewards/cadastro",
            { events_fk: eventPk, rewards_fk: id, active: true },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          )
        ),
        ...toRemove.map((id) =>
          axios.post(
            "/rl_events_rewards/cadastro",
            { events_fk: eventPk, rewards_fk: id, active: false },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          )
        ),
      ];

      return Promise.all(promises);
    })
    .then(() => {
      showSuccessAlert.value = true;
      setTimeout(() => {
        editEventDialog.value = false;
        fetchUserCreatedEvents(showPast.value);
        fetchPlayerEvents(showPast.value);
      }, 1500);
    })
    .catch((error) => {
      if (error.message === "StoreNotFound") return;
      console.error("❌ Erro ao salvar edição do evento:", error);
      loading.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
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
      return response.data.rewards || [];
    })
    .catch((err) => {
      console.error("❌ Erro ao buscar rewards do evento:", err);
      return [];
    });
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

onMounted(async () => {
  if (route.query.action === "create") {
    activeTab.value = 2;
    openCreateEventDialog();
    router.replace({ query: null });
  }

  await axios
    .get("/stores/list", {
      params: { users_fk: userStore.user.users_pk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((response) => {
      stores.value = response.data.stores || [];
    })
    .catch((error) => {
      console.error(
        "❌ Erro ao buscar lojas:",
        error.response?.data || error.message
      );
    });

  fetchSeasons();
  fetchStatuses();
  fetchSceneries();
  fetchAllRewards();
  await fetchPlayerEvents(showPast.value);
  await fetchUserCreatedEvents(showPast.value);

  eventsInterval.value = setInterval(() => {
    if (activeTab.value === 1) {
      fetchPlayerEvents(showPast.value, true);
    } else {
      fetchUserCreatedEvents(showPast.value, true);
    }
  }, 5000);
});

watch(
  () => newEvent.value.season,
  (newSeasonValue) => {
    newEvent.value.scenario = null;
  }
);

onUnmounted(() => {
  clearInterval(eventsInterval.value);
  clearInterval(playersInterval.value);
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
  if (manageDialog.value && selectedEvent.value) {
    await fetchPlayersForEvent(selectedEvent.value.events_pk);
  }
});

watch(
  () => newEvent.value.store,
  (selectedStoreName) => {
    const selectedStore = stores.value.find(
      (store) => store.storename === selectedStoreName
    );
    if (selectedStore) {
      const { address, streetNumber, complement, city, state } = selectedStore;
      newEvent.value.address = `${address}, ${streetNumber}, ${complement}, ${city}, ${state}`;
    } else {
      newEvent.value.address = "";
    }
  }
);

watch(editEventDialog, (isOpen) => {
  if (!isOpen) {
    clearInterval(playersInterval.value);
    playersInterval.value = null;
  }
});
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-link {
  color: inherit;
  text-decoration: underline;
}

.map-link:hover {
  opacity: 0.8;
}

.list-container {
  min-height: 400px;
}

.event-card {
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 10px;
  margin-left: 18px;
  background-color: #292929;
}

.event-img {
  width: 110px;
  height: 110px;
  border-radius: 4px;
}

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
  background-color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: black;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.scheduled-box strong {
  font-weight: bold;
}
.season-flag {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  z-index: 2;
}

.table-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}
.table-card:hover {
  transform: translateY(-2px);
}
.qr-code-container {
  background: white;
  border-radius: 12px;
}
.table-number-text {
  color: white !important;
  font-weight: 700 !important;
  font-size: 0.875rem;
}
.player-card {
  padding: 10px !important;
}
.gap-3 {
  gap: 12px !important;
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
  position: relative;
  overflow: hidden;
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
.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(21, 21, 21, 0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
