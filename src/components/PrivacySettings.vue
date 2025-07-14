<template>
  <v-col cols="12" class="d-flex justify-center pa-0">
    <v-container max-width="804" class="py-4">
      <v-card color="primary" elevation="2" rounded="lg">
        <v-card-title
          class="d-flex justify-space-between align-center"
          @click="togglePrivacy"
        >
          <span
            class="text-h5 font-weight-black pl-2 pt-2 pb-2 text-wrap text-uppercase"
            >The Chronicles of Drunagor Community is coming soon!</span
          >
          <v-icon>{{
            isExpanded ? "mdi-chevron-up" : "mdi-chevron-down"
          }}</v-icon>
        </v-card-title>

        <v-expand-transition>
          <v-card-text v-if="isExpanded">
            <v-row no-gutters>
              <v-cols cols></v-cols>
            </v-row>
            <p>
              Step into the world of Chronicles of Drunagor and take your RPG
              experience to the next level! Connect with fellow adventurers
              through the friends feature and create your legendary party. Build
              your profile to show off your hero's journey and stand out as a
              true champion of Drunagor.
            </p>

            <p>
              Unlock epic achievements and collect badges as you conquer
              dungeons and face the darkness. Share your proudest moments by
              marking your favorite campaign, and track your heroic deeds with
              detailed player stats.
            </p>

            <p>
              This is more than just a game—it's your story, your legacy. Join
              us and let the Chronicles of Drunagor community celebrate your
              adventures!
            </p>
          </v-card-text>
        </v-expand-transition>
      </v-card>
    </v-container>
  </v-col>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";

const isExpanded = ref(false);

const profileVisibilityOptions = ["Public", "Private", "Friends only"];
const friendRequestOptions = ["Allow all", "Friends only", "No one"];

const switches = [
  {
    key: "showAccountCreationDate",
    label: "Show account creation date to other users",
  },
  { key: "showRealName", label: "Show real name to other users" },
  { key: "showPoints", label: "Show your [POINTS NAME] to other users" },
  { key: "showRank", label: "Show your rank to other users" },
  { key: "showStatistics", label: "Show your statistics to other users" },
];

const privacy = reactive({
  profileVisibility: "Public",
  friendRequests: "Allow all",
  showAccountCreationDate: true,
  showRealName: false,
  showPoints: true,
  showRank: true,
  showStatistics: false,
});

const togglePrivacy = () => {
  isExpanded.value = !isExpanded.value;
};
</script>
