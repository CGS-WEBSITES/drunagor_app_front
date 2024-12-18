<template>
    <v-col cols="12" class="d-flex justify-center pa-0">
      <v-container max-width="804" class="py-4">
        <v-card elevation="2" rounded="lg">
          <v-card-title
            class="d-flex justify-space-between align-center"
            @click="togglePrivacy"
          >
            <span class="text-h5 font-weight-black pl-2 pt-2 pb-2">PRIVACY</span>
            <v-icon>{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-card-title>
  
          <v-expand-transition>
            <v-card-text v-if="isExpanded">
              <v-select
                label="Profile Visibility"
                :items="profileVisibilityOptions"
                v-model="privacy.profileVisibility"
                variant="outlined"
                class="mb-0"
              ></v-select>
  

              <v-select
                label="Friend Requests"
                :items="friendRequestOptions"
                v-model="privacy.friendRequests"
                variant="outlined"
                class="mb-0"
              ></v-select>

              <v-switch
                v-for="(option, index) in switches"
                :key="index"
                v-model="privacy[option.key]"
                :label="option.label"
                inset
                class="mb-0"
                color="green"
              ></v-switch>
            </v-card-text>
          </v-expand-transition>
        </v-card>
      </v-container>
    </v-col>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref } from 'vue';
  

  const isExpanded = ref(false);
  

  const togglePrivacy = () => {
    isExpanded.value = !isExpanded.value;
  };
  

  const privacy = reactive({
    profileVisibility: 'Public',
    friendRequests: 'Allow all',
    showAccountCreationDate: true,
    showRealName: false,
    showPoints: true,
    showRank: true,
    showStatistics: false,
  });

  const profileVisibilityOptions = ['Public', 'Private', 'Friends only'];
  const friendRequestOptions = ['Allow all', 'Friends only', 'No one'];
  
  const switches = [
    { key: 'showAccountCreationDate', label: 'Show account creation date to other users' },
    { key: 'showRealName', label: 'Show real name to other users' },
    { key: 'showPoints', label: 'Show your [POINTS NAME] to other users' },
    { key: 'showRank', label: 'Show your rank to other users' },
    { key: 'showStatistics', label: 'Show your statistics to other users' },
  ];
  </script>
  