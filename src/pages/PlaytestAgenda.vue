<template>
  <v-container fluid class="playtest-page-wrapper bg-background text-white min-vh-100 pa-4 pa-md-8" style="max-width: 1400px; padding-top: 80px !important;">
    <!-- Top Full-Width Hero Banner (Newsletter.png) - Text placed below image, logo & chips overlaid -->
    <v-card color="surface" class="mb-8 rounded-lg overflow-hidden elevation-8 border border-secondary">
      <div class="position-relative w-100">
        <!-- Responsive image height and position="top center" prevents cropping the top details of the artwork on PC -->
        <v-img :src="newsletterBanner" :height="$vuetify.display.mobile ? '180px' : '380px'" position="top center" cover class="w-100 align-end">
          <div class="w-100 pa-4 d-flex align-center justify-space-between flex-wrap gap-2" style="background: linear-gradient(0deg, rgba(20,20,20,0.9) 0%, rgba(0,0,0,0) 100%);">
            <v-img :src="genconLogo" max-height="30" max-width="100" contain />
            <div class="d-flex align-center gap-2 flex-wrap">
              <v-chip color="warning" size="small" variant="flat" class="font-weight-bold text-black">
                GEN CON 2026
              </v-chip>
              <v-chip color="error" size="small" variant="flat" class="font-weight-bold text-white">
                EXCLUSIVE PLAYTEST
              </v-chip>
            </div>
          </div>
        </v-img>
      </div>
      
      <!-- Content below the image -->
      <div class="pa-5 pa-md-6 bg-surface">
        <h1 class="cinzel-text text-h5 text-md-h4 font-weight-black text-warning mb-2">
          Chronicles of Drunagor — Aftermath Agenda
        </h1>
        <p class="text-caption text-sm-body-2 text-grey-lighten-2 mb-0 max-w-900 leading-normal font-weight-medium">
          Welcome to the official Gen Con 2026 Playtest Agenda! Reserve your seat below for an exclusive hands-on session. Each table features 4 total slots (1 official <strong>Drunagor Master</strong> + 3 Players) plus an <strong>Infinite Standby Waiting List</strong>.
        </p>
      </div>
    </v-card>

    <!-- Date Selector Tabs using App Theme Surface color (Growable on PC, scrollable/compact on mobile) -->
    <v-card color="surface" class="pa-2 mb-8 rounded-lg border border-secondary elevation-6">
      <v-tabs
        v-model="selectedDayIndex"
        color="warning"
        align-tabs="center"
        class="cinzel-text"
        density="comfortable"
        show-arrows
        :grow="!$vuetify.display.mobile"
      >
        <v-tab
          v-for="(day, idx) in days"
          :key="idx"
          :value="idx"
          class="font-weight-bold px-4"
          style="min-width: 90px;"
        >
          <v-icon start size="small" color="warning" class="mr-2">mdi-calendar</v-icon>
          <!-- Desktop: full date. Mobile: compact date (e.g. "30 Jul") -->
          <span class="d-none d-sm-inline">{{ day.display_date }}</span>
          <span class="d-inline d-sm-none" style="font-size: 15px; font-weight: bold;">{{ getShortDate(day.date) }}</span>
        </v-tab>
      </v-tabs>
    </v-card>

    <!-- Active Day Schedule Section -->
    <div v-if="activeDay">
      <div class="d-flex justify-space-between align-center mb-6 px-2 flex-wrap gap-4">
        <h2 class="text-h5 font-weight-black cinzel-text text-warning d-flex align-center">
          <v-icon color="warning" class="mr-2">mdi-account-group</v-icon>
          Sessions for {{ activeDay.display_date }}
        </h2>
        <div class="d-flex align-center gap-3 flex-wrap">
          <!-- Admin Tools -->
          <v-btn
            v-if="isAdmin"
            color="warning"
            variant="flat"
            size="small"
            class="font-weight-bold text-black mr-2"
            @click="generatePlayersPDF"
          >
            <v-icon start size="small">mdi-file-pdf-box</v-icon>
            Export PDF / Print
          </v-btn>
          <span class="text-caption text-grey-lighten-1 font-weight-medium">
            * Select a session below to reserve your seat or join the standby list
          </span>
        </div>
      </div>

      <!-- Spacious Table Row-by-Row Layout -->
      <v-row dense class="mx-0">
        <v-col
          v-for="table in activeDay.tables"
          :key="table.id"
          cols="12"
          class="mb-6 pa-0 w-100"
        >
          <v-card
            color="surface"
            class="pa-6 rounded-lg border border-secondary elevation-8 position-relative playtest-session-card w-100"
          >
            <!-- w-100 ma-0 forces perfect symmetric card layout stretching on mobile -->
            <v-row class="w-100 ma-0">
              <!-- COLUMN 1: Session Details & Actions -->
              <v-col cols="12" md="4" class="d-flex flex-column justify-space-between border-r-md border-secondary pr-md-6 mb-6 mb-md-0 w-100">
                <div>
                  <div class="d-flex justify-space-between align-center mb-4">
                    <h3 class="text-h5 font-weight-black text-warning cinzel-text mb-0">
                      Table {{ table.table_number }}
                    </h3>
                    <v-chip color="info" size="small" variant="flat" class="font-weight-bold">
                      <v-icon start size="x-small">mdi-clock-outline</v-icon>
                      {{ table.time }}
                    </v-chip>
                  </div>

                  <v-card color="primary" class="pa-4 rounded-md mb-4 border border-secondary" flat>
                    <div class="text-subtitle-1 font-weight-bold text-warning mb-1">Drunagor Master: Aftermath Demo</div>
                    <p class="text-body-2 text-grey-lighten-3 mb-0 leading-relaxed font-weight-bold">
                      {{ table.description || 'Exclusive Aftermath demo scenario led by a Drunagor Master. Tactical combat & new mechanics preview.' }}
                    </p>
                  </v-card>

                  <!-- Stacked label format to prevent text wrapping on mobile -->
                  <div class="text-body-2 text-grey-lighten-2 mb-4 leading-normal font-weight-bold">
                    <div><strong>Capacity:</strong> 4 Seats (1 GM + 3 Players)</div>
                    <div class="text-warning mt-1 font-weight-bold"><strong>Primary Open:</strong> {{ getAvailableSlotsCount(table) }} / 3</div>
                  </div>
                </div>

                <div>
                  <!-- Running banner: shown for everyone if table has started -->
                  <v-alert
                    v-if="table.started"
                    type="error"
                    variant="flat"
                    density="comfortable"
                    class="font-weight-black text-center text-white mb-4 animate-pulse uppercase"
                    icon="mdi-fire"
                  >
                    Session In Progress / Mesa Rodando
                  </v-alert>

                  <!-- Info / Status section for players in primary seats -->
                  <div v-if="getMyBooking(table)" class="mb-4">
                    <div class="d-flex align-center gap-2 mb-2">
                      <v-icon color="success" size="small">mdi-shield-check</v-icon>
                      <span class="text-caption text-success font-weight-bold">Your reservation is confirmed!</span>
                    </div>

                    <div v-if="!getMyBooking(table).checked_in" class="pa-3 rounded border border-warning text-center bg-primary">
                      <v-icon color="warning" size="medium" class="mb-1">mdi-clock-outline</v-icon>
                      <div class="text-subtitle-2 font-weight-bold text-warning">Awaiting Admin Verification</div>
                      <div class="text-caption text-grey-lighten-1">Please check in with the Drunagor Master at your table to unlock your rewards.</div>
                    </div>
                    <div v-else class="checked-in-success-box pa-3 rounded border border-success text-center">
                      <v-icon color="success" size="large" class="mb-1">mdi-checkbox-marked-circle</v-icon>
                      <div class="text-subtitle-2 font-weight-bold text-success">Checked In & Verified</div>
                      <div class="text-caption text-grey-lighten-1 font-weight-medium">"Aftermath GenCon2026 Tester" Unlocked!</div>
                    </div>
                  </div>

                  <!-- Booking Button / Desistir button -->
                  <div v-if="table.started">
                    <!-- If started, regular users cannot register. Show stop button only for admin below -->
                  </div>
                  <div v-else>
                    <!-- Reservation buttons are hidden for admin duduflu2 -->
                    <div v-if="!isAdmin">
                      <v-btn
                        v-if="getAvailableSlotsCount(table) > 0 && !isCurrentPlayerInTable(table)"
                        block
                        color="warning"
                        size="large"
                        variant="flat"
                        class="font-weight-black text-black"
                        @click="openRegistrationModal(table, 'primary')"
                      >
                        <v-icon start>mdi-account-plus</v-icon>
                        Reserve Seat ({{ getAvailableSlotsCount(table) }} Open)
                      </v-btn>

                      <v-btn
                        v-else-if="!isCurrentPlayerInTable(table)"
                        block
                        color="warning"
                        size="large"
                        variant="outlined"
                        class="font-weight-bold text-warning"
                        @click="openRegistrationModal(table, 'waitlist')"
                      >
                        <v-icon start>mdi-account-clock</v-icon>
                        Join Standby Waitlist (Pos #${((table.waitlist || []).filter(w => w.player_name)).length + 1})
                      </v-btn>
                    </div>
                  </div>

                  <!-- Leave Table button: Styled as a flat premium error button -->
                  <v-btn
                    v-if="isCurrentPlayerInTable(table)"
                    block
                    color="error"
                    size="large"
                    variant="flat"
                    class="font-weight-black text-white mb-2"
                    height="48"
                    @click="leaveTable(table)"
                  >
                    <v-icon start>mdi-logout</v-icon>
                    Desistir da Mesa / Leave Table
                  </v-btn>

                  <!-- Admin Start / Stop Table Button -->
                  <v-btn
                    v-if="isAdmin && !table.started"
                    block
                    color="warning"
                    size="large"
                    variant="flat"
                    class="font-weight-black text-black mt-4"
                    height="48"
                    @click="startTable(table)"
                  >
                    <v-icon start>mdi-play-circle</v-icon>
                    Start Table
                  </v-btn>

                  <v-btn
                    v-if="isAdmin && table.started"
                    block
                    color="grey"
                    size="large"
                    variant="outlined"
                    class="font-weight-bold mt-4"
                    height="48"
                    @click="stopTable(table)"
                  >
                    <v-icon start>mdi-stop-circle</v-icon>
                    Stop Table / Reset
                  </v-btn>
                </div>
              </v-col>

              <!-- COLUMN 2: Confirmed Seats -->
              <v-col cols="12" md="4" class="border-r-md border-secondary px-md-6 mb-6 mb-md-0 w-100">
                <h4 class="text-subtitle-2 font-weight-bold text-grey-lighten-1 mb-3 uppercase tracking-wide">
                  Confirmed Seats (1 GM + 3 Players)
                </h4>
                <div class="slots-list w-100">
                  <div
                    v-for="slot in table.slots"
                    :key="slot.slot_number"
                    class="d-flex align-center px-4 py-3 mb-2 rounded border transition-all w-100 playtest-slot-item"
                    :class="slot.is_master ? 'border-warning bg-secondary' : (slot.checked_in ? 'border-success bg-success-dark-alpha' : 'border-secondary bg-primary')"
                    :style="slot.player_name && !slot.is_master && isAdmin ? 'cursor: pointer; min-height: 56px;' : 'min-height: 56px;'"
                    @click="openAdminUserDetail(table, slot)"
                  >
                    <!-- Prepended Icon -->
                    <div class="mr-3 d-flex align-center justify-center" style="width: 24px;">
                      <v-icon v-if="slot.is_master" color="warning" size="medium">
                        mdi-shield-crown
                      </v-icon>
                      <v-icon v-else-if="slot.checked_in" color="success" size="medium">
                        mdi-check-decagram
                      </v-icon>
                      <v-icon v-else-if="slot.player_name" color="success" size="medium">
                        mdi-account-check
                      </v-icon>
                      <v-icon color="grey" size="medium" v-else>
                        mdi-account-plus-outline
                      </v-icon>
                    </div>

                    <!-- Slot Body -->
                    <div class="flex-grow-1 min-w-0">
                      <div v-if="slot.is_master" class="d-flex align-center justify-space-between w-100">
                        <span class="font-weight-black text-warning cinzel-text text-subtitle-1">{{ slot.player_name }}</span>
                        <v-chip color="warning" size="x-small" variant="flat" class="font-weight-bold text-black ml-2">Master</v-chip>
                      </div>
                      <div v-else-if="slot.player_name" class="w-100">
                        <div class="d-flex align-center justify-space-between w-100">
                          <span class="font-weight-bold text-white text-truncate text-subtitle-1">{{ slot.player_name }}</span>
                          <v-chip v-if="slot.checked_in" color="success" size="x-small" variant="tonal" class="font-weight-bold ml-2">Checked In</v-chip>
                        </div>
                        <!-- Contact Info: strictly hidden from other players (ONLY shown to duduflu2 admin) -->
                        <div v-if="isAdmin" class="text-caption text-grey-lighten-1 text-truncate mt-0.5 font-weight-medium" style="font-size: 11px !important;">
                          {{ slot.email }} <span v-if="slot.phone">• {{ slot.phone }}</span>
                        </div>
                      </div>
                      <div v-else class="text-grey italic text-subtitle-1 font-weight-bold">
                        Vacant Seat
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- COLUMN 3: Standby Queue -->
              <v-col cols="12" md="4" class="pl-md-6 w-100">
                <div class="d-flex justify-space-between align-center mb-3">
                  <h4 class="text-subtitle-2 font-weight-bold text-warning mb-0 uppercase tracking-wide d-flex align-center">
                    <v-icon color="warning" size="small" class="mr-1">mdi-account-clock</v-icon>
                    Infinite Standby Queue
                  </h4>
                  <v-chip color="warning" size="x-small" variant="tonal" class="font-weight-bold">
                    {{ (table.waitlist || []).filter(w => w.player_name).length }} Waiting
                  </v-chip>
                </div>

                <div class="standby-list-container pr-1 w-100" style="max-height: 250px; overflow-y: auto;">
                  <div class="standby-list w-100" v-if="(table.waitlist || []).filter(w => w.player_name).length > 0">
                    <div
                      v-for="(wSlot, wIdx) in (table.waitlist || []).filter(w => w.player_name)"
                      :key="wIdx"
                      class="d-flex align-center px-3 py-2 mb-2 rounded border border-secondary bg-primary w-100"
                      :style="isAdmin ? 'cursor: pointer; min-height: 44px;' : 'min-height: 44px;'"
                      @click="openAdminUserDetail(table, wSlot)"
                    >
                      <div class="mr-2 d-flex align-center justify-center" style="width: 20px;">
                        <v-icon color="warning" size="small">
                          mdi-clock-check-outline
                        </v-icon>
                      </div>

                      <div class="flex-grow-1 min-w-0">
                        <div class="d-flex align-center justify-space-between w-100">
                          <span class="font-weight-bold text-warning text-body-2 text-truncate">#{{ wIdx + 1 }} {{ wSlot.player_name }}</span>
                          <!-- Contact Info: strictly hidden from other players (ONLY shown to duduflu2 admin) -->
                          <span v-if="isAdmin" class="text-grey-lighten-1 text-truncate ml-2 font-weight-bold" style="font-size: 10px;">({{ wSlot.email }})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Infinite Waitlist Placeholder -->
                  <div class="pa-3 rounded border border-dashed border-secondary text-center bg-primary mt-2 w-100 font-weight-bold text-grey-lighten-1 text-body-2">
                    + Infinite Standby Queue (Position #{{ (table.waitlist || []).filter(w => w.player_name).length + 1 }} Open)
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- User Profile Dialog (Admin Actions inside, with ga-3 and mb-3 margins separating buttons) -->
    <v-dialog v-model="adminUserDetailModal" max-width="400">
      <v-card color="surface" class="pa-5 rounded-lg border border-warning">
        <v-card-title class="d-flex justify-space-between align-center pa-0 cinzel-text text-h6 text-warning mb-3">
          <span>User Profile (Admin Mode)</span>
          <v-btn icon="mdi-close" variant="text" color="grey" size="small" @click="adminUserDetailModal = false" />
        </v-card-title>
        <v-divider class="mb-4" />
        <v-card-text class="pa-0 text-body-2 font-weight-bold">
          <div class="mb-2"><strong>Name:</strong> {{ selectedAdminUser?.player_name }}</div>
          <div class="mb-2"><strong>Email:</strong> {{ selectedAdminUser?.email || 'N/A' }}</div>
          <div class="mb-2"><strong>Phone:</strong> {{ selectedAdminUser?.phone || 'N/A' }}</div>
          <div class="mb-2"><strong>Status:</strong> {{ selectedAdminUser?.checked_in ? 'Checked In' : (selectedAdminUser?.is_waitlist ? 'Standby Waitlist' : 'Pending Verification') }}</div>

          <div class="mt-5 d-flex flex-column ga-3">
            <!-- Promote Standby Player (only for waitlisted players if there are vacant primary seats) -->
            <v-btn
              v-if="selectedAdminUser && selectedAdminUser.is_waitlist && getAvailableSlotsCount(targetTable!) > 0"
              color="warning"
              block
              height="40"
              class="font-weight-black text-black mb-3"
              @click="promoteStandbyPlayer(selectedAdminUser)"
            >
              <v-icon start>mdi-account-arrow-up</v-icon>
              Promote to Confirmed Seat
            </v-btn>

            <!-- Verify Check-In (only for primary confirmed seats that are unchecked) -->
            <v-btn
              v-if="selectedAdminUser && !selectedAdminUser.is_master && !selectedAdminUser.checked_in && !selectedAdminUser.is_waitlist"
              color="success"
              block
              height="40"
              class="font-weight-black text-white mb-3"
              @click="performCheckInFromModal(selectedAdminUser.playtest_bookings_pk)"
            >
              <v-icon start>mdi-check-decagram</v-icon>
              Verify Check-In & Award Badge
            </v-btn>

            <!-- Remove Player (for any player including waitlist) -->
            <v-btn
              v-if="selectedAdminUser && !selectedAdminUser.is_master"
              color="error"
              block
              height="40"
              variant="outlined"
              class="font-weight-bold"
              @click="removePlayerFromModal(selectedAdminUser)"
            >
              <v-icon start>mdi-account-remove</v-icon>
              Remove Player from Session
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Public Seat & Phone Registration Modal (Enhanced fields and buttons) -->
    <v-dialog v-model="registrationModal" max-width="500" persistent>
      <v-card color="surface" class="pa-6 rounded-lg border border-warning">
        <v-card-title class="d-flex justify-space-between align-center pa-0 cinzel-text text-h6 text-warning mb-4">
          <span>
            <v-icon color="warning" class="mr-2">mdi-ticket-confirmation</v-icon>
            {{ registrationType === 'primary' ? 'Reserve Playtest Seat' : 'Join Standby Waiting List' }}
          </span>
          <v-btn icon="mdi-close" variant="text" color="grey" size="small" @click="registrationModal = false" />
        </v-card-title>

        <v-divider class="mb-4" />

        <v-card-text class="pa-0">
          <!-- Sign in incentive card to encourage login for rewards -->
          <v-card v-if="!userStore.user?.users_pk" color="primary" class="pa-4 rounded-md mb-4 border border-warning" flat>
            <div class="d-flex align-center gap-2 mb-1">
              <v-icon color="warning" size="small">mdi-gift</v-icon>
              <span class="text-subtitle-2 font-weight-bold text-warning cinzel-text">🎁 Unlocks Exclusive Rewards!</span>
            </div>
            <p class="text-caption text-grey-lighten-2 mb-3 leading-normal font-weight-medium">
              Sign in with your Drunagor App account to claim your playtest seat and get an exclusive Profile Avatar Icon and Profile Background as a bonus when you check in!
            </p>
            <v-btn
              color="warning"
              variant="flat"
              size="small"
              block
              class="font-weight-black text-black"
              @click="router.push('/login')"
            >
              Log In / Sign Up
            </v-btn>
          </v-card>

          <!-- Linked Account Info when logged in -->
          <v-card v-else color="primary" class="pa-4 rounded-md mb-4 border border-secondary" flat>
            <div class="d-flex align-center gap-2 mb-1">
              <v-icon color="warning" size="small">mdi-account-circle</v-icon>
              <span class="text-subtitle-2 font-weight-bold text-warning cinzel-text">Linked Account: @{{ userStore.user?.username || userStore.user?.user_name }}</span>
            </div>
            <p class="text-caption text-grey-lighten-2 mb-0 leading-normal font-weight-medium">
              You are reserving using your Drunagor App account. You will automatically receive your exclusive rewards upon check-in!
            </p>
          </v-card>

          <p class="text-caption text-grey-lighten-1 mb-4 font-weight-bold">
            Please confirm your contact details below to reserve your entry for <strong>Table {{ targetTable?.table_number }}</strong>.
          </p>

          <v-form ref="formRef" @submit.prevent="confirmRegistration">
            <v-text-field
              v-model="regForm.nickname"
              label="Full Name"
              variant="outlined"
              density="compact"
              color="warning"
              class="mb-3 font-weight-bold"
              required
              hide-details="auto"
            />

            <!-- Email is disabled for logged-in accounts -->
            <v-text-field
              v-model="regForm.email"
              label="Email Address"
              type="email"
              variant="outlined"
              density="compact"
              color="warning"
              class="mb-3 font-weight-bold"
              required
              :disabled="!!userStore.user?.users_pk"
              hide-details="auto"
            />

            <v-text-field
              v-model="regForm.phone"
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              variant="outlined"
              density="compact"
              color="warning"
              class="mb-4 font-weight-bold"
              required
              hide-details="auto"
            />

            <div class="d-flex justify-end gap-3 mt-5">
              <v-btn
                color="grey-lighten-1"
                variant="outlined"
                class="font-weight-bold px-6"
                height="48"
                @click="registrationModal = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="warning"
                variant="flat"
                class="font-weight-black text-black px-6"
                height="48"
                type="submit"
                :disabled="!regForm.nickname || !regForm.email || !regForm.phone"
              >
                Confirm Booking
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";
import type { PlaytestDaySchedule, PlaytestTable, PlaytestSlot } from "@/store/EventStore";
import newsletterBanner from "@/assets/Newsletter.png";
import genconLogo from "@/assets/gencon.png";

const router = useRouter();
const userStore = useUserStore();
const axios = inject<any>("axios");

const selectedDayIndex = ref(0);
const registrationModal = ref(false);
const registrationType = ref<"primary" | "waitlist">("primary");
const targetTable = ref<PlaytestTable | null>(null);

const adminUserDetailModal = ref(false);
const selectedAdminUser = ref<PlaytestSlot | null>(null);

const regForm = ref({
  nickname: "",
  email: "",
  phone: "",
});

const defaultDays = ref<PlaytestDaySchedule[]>([
  {
    date: "2026-07-30",
    display_date: "July 30th",
    tables: [
      {
        id: "2026-07-30-t1",
        table_number: 1,
        time: "10:30 AM",
        description: "Exclusive Aftermath demo scenario led by a Drunagor Master. Tactical combat & new mechanics preview.",
        slots: [
          { slot_number: 1, player_name: "Drunagor Master", is_master: true },
          { slot_number: 2, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 3, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 4, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
        ],
        waitlist: [],
      },
      {
        id: "2026-07-30-t2",
        table_number: 2,
        time: "01:00 PM",
        description: "Exclusive Aftermath demo scenario led by a Drunagor Master. Tactical combat & new mechanics preview.",
        slots: [
          { slot_number: 1, player_name: "Drunagor Master", is_master: true },
          { slot_number: 2, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 3, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 4, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
        ],
        waitlist: [],
      },
      {
        id: "2026-07-30-t3",
        table_number: 3,
        time: "03:30 PM",
        description: "Exclusive Aftermath demo scenario led by a Drunagor Master. Tactical combat & new mechanics preview.",
        slots: [
          { slot_number: 1, player_name: "Drunagor Master", is_master: true },
          { slot_number: 2, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 3, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 4, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
        ],
        waitlist: [],
      },
    ],
  },
  {
    date: "2026-07-31",
    display_date: "July 31st",
    tables: [
      {
        id: "2026-07-31-t1",
        table_number: 1,
        time: "10:30 AM",
        description: "Exclusive Aftermath demo scenario led by a Drunagor Master. Tactical combat & new mechanics preview.",
        slots: [
          { slot_number: 1, player_name: "Drunagor Master", is_master: true },
          { slot_number: 2, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 3, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 4, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
        ],
        waitlist: [],
      },
      {
        id: "2026-07-31-t2",
        table_number: 2,
        time: "01:00 PM",
        description: "Exclusive Aftermath demo scenario led by a Drunagor Master. Tactical combat & new mechanics preview.",
        slots: [
          { slot_number: 1, player_name: "Drunagor Master", is_master: true },
          { slot_number: 2, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 3, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 4, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
        ],
        waitlist: [],
      },
      {
        id: "2026-07-31-t3",
        table_number: 3,
        time: "03:30 PM",
        description: "Exclusive Aftermath demo scenario led by a Drunagor Master. Tactical combat & new mechanics preview.",
        slots: [
          { slot_number: 1, player_name: "Drunagor Master", is_master: true },
          { slot_number: 2, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 3, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 4, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
        ],
        waitlist: [],
      },
    ],
  },
  {
    date: "2026-08-01",
    display_date: "August 1st",
    tables: [
      {
        id: "2026-08-01-t1",
        table_number: 1,
        time: "10:30 AM",
        description: "Exclusive Aftermath demo scenario led by a Drunagor Master. Tactical combat & new mechanics preview.",
        slots: [
          { slot_number: 1, player_name: "Drunagor Master", is_master: true },
          { slot_number: 2, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 3, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 4, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
        ],
        waitlist: [],
      },
      {
        id: "2026-08-01-t2",
        table_number: 2,
        time: "01:00 PM",
        description: "Exclusive Aftermath demo scenario led by a Drunagor Master. Tactical combat & new mechanics preview.",
        slots: [
          { slot_number: 1, player_name: "Drunagor Master", is_master: true },
          { slot_number: 2, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 3, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 4, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
        ],
        waitlist: [],
      },
      {
        id: "2026-08-01-t3",
        table_number: 3,
        time: "03:30 PM",
        description: "Exclusive Aftermath demo scenario led by a Drunagor Master. Tactical combat & new mechanics preview.",
        slots: [
          { slot_number: 1, player_name: "Drunagor Master", is_master: true },
          { slot_number: 2, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 3, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 4, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
        ],
        waitlist: [],
      },
    ],
  },
  {
    date: "2026-08-02",
    display_date: "August 2nd",
    tables: [
      {
        id: "2026-08-02-t1",
        table_number: 1,
        time: "10:30 AM",
        description: "Exclusive Aftermath demo scenario led by a Drunagor Master. Tactical combat & new mechanics preview.",
        slots: [
          { slot_number: 1, player_name: "Drunagor Master", is_master: true },
          { slot_number: 2, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 3, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 4, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
        ],
        waitlist: [],
      },
      {
        id: "2026-08-02-t2",
        table_number: 2,
        time: "01:00 PM",
        description: "Exclusive Aftermath demo scenario led by a Drunagor Master. Tactical combat & new mechanics preview.",
        slots: [
          { slot_number: 1, player_name: "Drunagor Master", is_master: true },
          { slot_number: 2, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 3, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
          { slot_number: 4, player_name: "", email: "", phone: "", is_master: false, checked_in: false },
        ],
        waitlist: [],
      },
    ],
  },
]);

const days = computed(() => defaultDays.value);
const activeDay = computed(() => days.value[selectedDayIndex.value]);

const getShortDate = (dateStr: string) => {
  const parts = dateStr.split("-");
  const day = parts[2];
  const month = parts[1] === "07" ? "Jul" : "Aug";
  return `${day} ${month}`;
};

const currentUserName = computed(() => {
  const user = userStore.user;
  if (!user) return "";
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user.first_name || user.username || user.user_name || "";
});

const currentUserEmail = computed(() => {
  return userStore.user?.email || "";
});

const isAdmin = computed(() => {
  const username = userStore.user?.user_name || userStore.user?.username || "";
  return username.toLowerCase() === "duduflu2";
});

const loadBookingsFromBackend = async () => {
  try {
    const res = await axios.get("/playtest/bookings");
    const backendBookings = res.data.bookings || [];

    // Reset slots to default state
    defaultDays.value.forEach((day) => {
      day.tables.forEach((table) => {
        table.started = false;
        table.slots.forEach((slot) => {
          if (!slot.is_master) {
            slot.player_name = "";
            slot.email = "";
            slot.phone = "";
            slot.users_fk = null;
            slot.checked_in = false;
            slot.playtest_bookings_pk = undefined;
            slot.is_waitlist = false;
          }
        });
        table.waitlist = [];
      });
    });

    // Overlay backend bookings
    backendBookings.forEach((b: any) => {
      const day = defaultDays.value.find((d) => d.date === b.date);
      if (day) {
        const table = day.tables.find(
          (t) => t.table_number === b.table_number && t.time === b.time_slot
        );
        if (table) {
          if (b.slot_number === 99 && b.player_name === 'SYSTEM_TABLE_STARTED') {
            table.started = true;
          } else if (b.is_waitlist) {
            if (!table.waitlist) table.waitlist = [];
            table.waitlist.push({
              playtest_bookings_pk: b.playtest_bookings_pk,
              slot_number: b.slot_number,
              player_name: b.player_name,
              email: b.email,
              phone: b.phone,
              is_master: false,
              users_fk: b.users_fk,
              checked_in: b.checked_in,
              is_waitlist: true,
            });
          } else {
            const slot = table.slots.find((s) => s.slot_number === b.slot_number);
            if (slot) {
              slot.playtest_bookings_pk = b.playtest_bookings_pk;
              slot.player_name = b.player_name;
              slot.email = b.email;
              slot.phone = b.phone;
              slot.users_fk = b.users_fk;
              slot.checked_in = b.checked_in;
              slot.is_waitlist = false;
            }
          }
        }
      }
    });
  } catch (e) {
    console.error("Failed to load playtest bookings from backend", e);
  }
};

onMounted(() => {
  loadBookingsFromBackend();
});

const isCurrentPlayerInSlot = (slot: PlaytestSlot) => {
  if (slot.is_master || !slot.player_name) return false;
  if (userStore.user?.email && slot.email === userStore.user.email) return true;
  return (
    slot.player_name === regForm.value.nickname ||
    (currentUserName.value && slot.player_name === currentUserName.value)
  );
};

const isCurrentPlayerInWaitlistSlot = (slot: PlaytestSlot) => {
  return isCurrentPlayerInSlot(slot);
};

const isCurrentPlayerInTable = (table: PlaytestTable) => {
  const inPrimary = table.slots.some((s) => isCurrentPlayerInSlot(s));
  const inWaitlist = (table.waitlist || []).some((w) => isCurrentPlayerInWaitlistSlot(w));
  return inPrimary || inWaitlist;
};

const getMyBooking = (table: PlaytestTable) => {
  return table.slots.find((s) => isCurrentPlayerInSlot(s));
};

const getAvailableSlotsCount = (table: PlaytestTable) => {
  return table.slots.filter((s) => !s.is_master && !s.player_name).length;
};

const openRegistrationModal = (table: PlaytestTable, type: "primary" | "waitlist") => {
  targetTable.value = table;
  registrationType.value = type;
  
  const user = userStore.user;
  if (user) {
    if (user.first_name && user.last_name) {
      regForm.value.nickname = `${user.first_name} ${user.last_name}`;
    } else {
      regForm.value.nickname = user.first_name || "";
    }
    regForm.value.email = user.email || "";
    regForm.value.phone = user.phone || "";
  } else {
    regForm.value.nickname = "";
    regForm.value.email = "";
    regForm.value.phone = "";
  }
  registrationModal.value = true;
};

const confirmRegistration = async () => {
  if (
    !targetTable.value ||
    !regForm.value.nickname ||
    !regForm.value.email ||
    !regForm.value.phone
  )
    return;

  const isWaitlist = registrationType.value === "waitlist";
  let slotNumber = 0;

  if (!isWaitlist) {
    const openSlot = targetTable.value.slots.find((s) => !s.is_master && !s.player_name);
    if (openSlot) {
      slotNumber = openSlot.slot_number;
    } else {
      return;
    }
  } else {
    slotNumber = (targetTable.value.waitlist || []).length + 1;
  }

  const postData = {
    users_fk: userStore.user?.users_pk ?? null,
    player_name: regForm.value.nickname,
    email: regForm.value.email,
    phone: regForm.value.phone,
    date: activeDay.value.date,
    time_slot: targetTable.value.time,
    table_number: targetTable.value.table_number,
    slot_number: slotNumber,
    is_waitlist: isWaitlist,
  };

  try {
    await axios.post("/playtest/bookings/cadastro", postData);
    await loadBookingsFromBackend();
    registrationModal.value = false;
  } catch (error: any) {
    console.error("Failed to reserve seat:", error);
    alert(error.response?.data?.message || "Failed to reserve slot.");
  }
};

const leaveTable = async (table: PlaytestTable) => {
  let email = regForm.value.email || currentUserEmail.value || userStore.user?.email;
  if (!email) {
    const slot = table.slots.find((s) => isCurrentPlayerInSlot(s));
    if (slot) email = slot.email;
  }
  if (!email && table.waitlist) {
    const wSlot = table.waitlist.find((w) => isCurrentPlayerInWaitlistSlot(w));
    if (wSlot) email = wSlot.email;
  }

  if (!email) return;

  try {
    await axios.post("/playtest/bookings/leave", {
      date: activeDay.value.date,
      time_slot: table.time,
      table_number: table.table_number,
      email: email,
    });
    await loadBookingsFromBackend();
  } catch (error) {
    console.error("Failed to leave table:", error);
  }
};

const performCheckIn = async (bookingPk?: number) => {
  if (!bookingPk) return;
  try {
    const res = await axios.post(`/playtest/bookings/${bookingPk}/checkin`);
    if (res.data.reward_awarded) {
      alert("Check-in successful! Exclusive 'Aftermath GenCon2026 Tester' achievement unlocked! You can now select your profile icon and background.");
    } else {
      alert("Check-in verified successfully!");
    }
    await loadBookingsFromBackend();
  } catch (error: any) {
    console.error("Check-in failed:", error);
    alert(error.response?.data?.message || "Check-in failed.");
  }
};

const performCheckInFromModal = async (bookingPk?: number) => {
  if (!bookingPk) return;
  await performCheckIn(bookingPk);
  adminUserDetailModal.value = false;
};

// Admin operations
const openAdminUserDetail = (table: PlaytestTable, slot: PlaytestSlot) => {
  if (isAdmin.value && !slot.is_master && slot.player_name) {
    targetTable.value = table;
    selectedAdminUser.value = slot;
    adminUserDetailModal.value = true;
  }
};

const removePlayerFromModal = async (slot: PlaytestSlot) => {
  if (!confirm(`Are you sure you want to remove player "${slot.player_name}"?`)) {
    return;
  }
  if (!targetTable.value) return;
  try {
    await axios.post("/playtest/bookings/leave", {
      date: activeDay.value.date,
      time_slot: targetTable.value.time,
      table_number: targetTable.value.table_number,
      email: slot.email,
    });
    await loadBookingsFromBackend();
    adminUserDetailModal.value = false;
  } catch (error) {
    console.error("Failed to remove player by admin:", error);
  }
};

const promoteStandbyPlayer = async (slot: PlaytestSlot) => {
  if (!targetTable.value || !slot.playtest_bookings_pk) return;

  const vacantSlot = targetTable.value.slots.find((s) => !s.is_master && !s.player_name);
  if (!vacantSlot) {
    alert("No vacant seats available at this table.");
    return;
  }

  try {
    await axios.post(`/playtest/bookings/${slot.playtest_bookings_pk}/promote`, {
      slot_number: vacantSlot.slot_number,
    });
    await loadBookingsFromBackend();
    adminUserDetailModal.value = false;
  } catch (error: any) {
    console.error("Failed to promote player:", error);
    alert(error.response?.data?.message || "Failed to promote player.");
  }
};

const startTable = async (table: PlaytestTable) => {
  if (!confirm(`Are you sure you want to start Table ${table.table_number} at ${table.time}?`)) {
    return;
  }
  try {
    await axios.post("/playtest/bookings/cadastro", {
      users_fk: null,
      player_name: "SYSTEM_TABLE_STARTED",
      email: "system@drunagor.app",
      phone: "0000000000",
      date: activeDay.value.date,
      time_slot: table.time,
      table_number: table.table_number,
      slot_number: 99,
      is_waitlist: false,
    });
    await loadBookingsFromBackend();
  } catch (error) {
    console.error("Failed to start table:", error);
  }
};

const stopTable = async (table: PlaytestTable) => {
  if (!confirm(`Are you sure you want to stop Table ${table.table_number}?`)) {
    return;
  }
  try {
    await axios.post("/playtest/bookings/leave", {
      date: activeDay.value.date,
      time_slot: table.time,
      table_number: table.table_number,
      email: "system@drunagor.app",
    });
    await loadBookingsFromBackend();
  } catch (error) {
    console.error("Failed to stop table:", error);
  }
};

const generatePlayersPDF = () => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to generate the player list PDF.");
    return;
  }

  let html = `
    <html>
      <head>
        <title>Playtest Sessions Player List - Gen Con 2026</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; color: #111111; padding: 30px; }
          h1 { color: #ffb300; text-align: center; border-bottom: 2px solid #ffb300; padding-bottom: 10px; margin-bottom: 30px; font-family: 'Cinzel', serif; }
          .day-section { margin-bottom: 40px; page-break-after: always; }
          .day-section:last-child { page-break-after: avoid; }
          .day-title { font-size: 24px; color: #ffb300; margin-bottom: 15px; border-bottom: 1px solid #ddd; font-family: 'Cinzel', serif; padding-bottom: 5px; }
          .table-card { background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; padding: 20px; }
          .table-header { display: flex; justify-content: space-between; font-weight: bold; border-bottom: 2px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; color: #333; font-size: 18px; }
          .player-list { list-style: none; padding: 0; margin: 0; }
          .player-item { padding: 10px 12px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
          .player-item:last-child { border-bottom: none; }
          .player-name { font-weight: bold; font-size: 14px; }
          .player-contact { color: #555; font-size: 12px; margin-left: 10px; font-weight: normal; }
          .status { font-weight: bold; font-size: 11px; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; }
          .status-checked-in { background-color: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; }
          .status-pending { background-color: #fff8e1; color: #f57f17; border: 1px solid #ffe082; }
          .waitlist-title { margin-top: 20px; font-size: 15px; color: #f57f17; font-weight: bold; border-bottom: 1px dashed #ccc; padding-bottom: 5px; }
        </style>
      </head>
      <body>
        <h1>Chronicles of Drunagor - Playtest Agenda Sessions</h1>
  `;

  days.value.forEach((day) => {
    html += `
      <div class="day-section">
        <div class="day-title">${day.display_date}</div>
    `;

    day.tables.forEach((table) => {
      html += `
        <div class="table-card">
          <div class="table-header">
            <span>Table ${table.table_number}</span>
            <span>Time: ${table.time}</span>
          </div>
          <div style="font-weight: bold; margin-bottom: 5px; color: #555; font-size: 13px;">Confirmed Seats:</div>
          <ul class="player-list">
      `;

      table.slots.forEach((slot) => {
        if (slot.player_name) {
          const contactInfo = slot.is_master
            ? ""
            : `<span class="player-contact">(${slot.email || ""} | ${slot.phone || ""})</span>`;
          const statusClass = slot.checked_in ? "status-checked-in" : "status-pending";
          const statusText = slot.is_master ? "Master" : slot.checked_in ? "Checked In" : "Pending";
          html += `
            <li class="player-item">
              <span class="player-name">${slot.player_name} ${contactInfo}</span>
              <span class="status ${statusClass}">${statusText}</span>
            </li>
          `;
        } else {
          html += `
            <li class="player-item" style="color: #888; font-style: italic;">
              <span>Vacant Slot</span>
              <span>-</span>
            </li>
          `;
        }
      });

      html += `</ul>`;

      const waitlist = (table.waitlist || []).filter((w) => w.player_name);
      if (waitlist.length > 0) {
        html += `
          <div class="waitlist-title">Standby Waitlist Queue:</div>
          <ul class="player-list">
        `;
        waitlist.forEach((w, wIdx) => {
          html += `
            <li class="player-item">
              <span class="player-name">#${wIdx + 1} ${w.player_name} <span class="player-contact">(${w.email || ""} | ${w.phone || ""})</span></span>
              <span class="status status-pending">Standby</span>
            </li>
          `;
        });
        html += `</ul>`;
      }

      html += `</div>`;
    });

    html += `</div>`;
  });

  html += `
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};
</script>

<style scoped>
.cinzel-text {
  font-family: "Cinzel", serif;
}
.max-w-900 {
  max-width: 900px;
}
.playtest-session-card {
  background: rgba(30, 30, 30, 0.7) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 179, 0, 0.15) !important;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.playtest-session-card:hover {
  border-color: rgba(255, 179, 0, 0.4) !important;
  box-shadow: 0 8px 24px rgba(255, 179, 0, 0.1) !important;
}
.border-r-md {
  @media (min-width: 960px) {
    border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
  }
}
.bg-success-dark-alpha {
  background-color: rgba(76, 175, 80, 0.08) !important;
}
.checked-in-success-box {
  background-color: rgba(76, 175, 80, 0.1) !important;
  border-color: #4caf50 !important;
}
.animate-pulse {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}
.cursor-pointer {
  cursor: pointer;
}
.playtest-page-wrapper {
  font-family: 'Roboto', 'Inter', sans-serif;
}
/* Enforce thicker weight for all descriptive text inside playtest wrapper to resolve the thin font look */
.playtest-page-wrapper :deep(p),
.playtest-page-wrapper :deep(span:not(.cinzel-text)),
.playtest-page-wrapper :deep(div:not(.cinzel-text)) {
  font-weight: 500 !important;
}
.playtest-page-wrapper :deep(.font-weight-bold),
.playtest-page-wrapper :deep(strong) {
  font-weight: 700 !important;
}
.playtest-page-wrapper :deep(.font-weight-black) {
  font-weight: 900 !important;
}
.playtest-slot-item {
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.playtest-slot-item:hover {
  border-color: rgba(255, 179, 0, 0.3) !important;
  transform: translateX(4px);
}
</style>
