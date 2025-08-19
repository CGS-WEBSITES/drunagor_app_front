<template>
  <div class="page-background d-flex align-center justify-center pl-lg-16">
      <v-sheet
        class="pa-4"
        border
        rounded="lg"
        width="100%"
        max-width="1100"
        color="secundary"
      >
        <h2 class="font-weight-bold text-h4 text-center mb-4">Community Forge <span class="mdi mdi-anvil"></span></h2>

        <v-list bg-color="transparent">
          <v-list-item
            v-for="app in applications"
            :key="app.title"
            :href="app.url"
            target="_blank"
            rel="noopener noreferrer"
            class="mb-3 list-item-padding"
            border
            rounded="lg"
          >
            <template #prepend>
              <v-avatar size="48">
                <v-img
                  v-if="app.imageSrc"
                  :src="app.imageSrc"
                  :alt="`${app.title} logo`"
                  cover
                ></v-img>
                <v-icon v-else icon="mdi-tools" size="32"></v-icon>
              </v-avatar>
            </template>

            <v-list-item-title class="text-h6 ml-2">{{ app.title }}</v-list-item-title>

            <v-list-item-subtitle class="d-md-none mt-2 ml-2">
              <div class="d-flex align-center flex-wrap ga-2">
                <v-chip
                  v-if="app.discord"
                  color="#5865F2"
                  variant="flat"
                  size="small"
                  @click.prevent.stop="copyToClipboard(app.discord)"
                >
                  <template #prepend>
                    <v-avatar class="mr-1" size="16">
                      <v-img src="https://cdn.simpleicons.org/discord/fff"></v-img>
                    </v-avatar>
                  </template>
                  {{ app.discord }}
                </v-chip>
                <v-chip
                  v-if="app.github"
                  color="grey-darken-3"
                  prepend-icon="mdi-github"
                  variant="flat"
                  size="small"
                  @click.prevent.stop="openLink(`https://github.com/${app.github}`)"
                >
                  {{ app.github }}
                </v-chip>
                <v-chip
                  v-if="app.bgg"
                  :color="bggChip.color"
                  variant="flat"
                  size="small"
                  @click.prevent.stop="openLink(`https://boardgamegeek.com/user/${app.bgg}`)"
                >
                  <template #prepend>
                    <v-avatar class="mr-1" size="16">
                       <v-img :src="bggChip.iconUrl"></v-img>
                    </v-avatar>
                  </template>
                  {{ app.bgg }}
                </v-chip>
              </div>
            </v-list-item-subtitle>
            
            <template #append>
              <div class="d-none d-md-flex align-center ga-3">
                <v-chip
                  v-if="app.discord"
                  color="#5865F2"
                  variant="flat"
                  size="large"
                  @click.prevent.stop="copyToClipboard(app.discord)"
                  style="cursor: pointer;"
                >
                  <template #prepend>
                    <v-avatar class="mr-2" size="24">
                      <v-img src="https://cdn.simpleicons.org/discord/fff"></v-img>
                    </v-avatar>
                  </template>
                  {{ app.discord }}
                </v-chip>
                <v-chip
                  v-if="app.github"
                  color="grey-darken-3"
                  prepend-icon="mdi-github"
                  variant="flat"
                  size="large"
                  @click.prevent.stop="openLink(`https://github.com/${app.github}`)"
                  style="cursor: pointer;"
                >
                  {{ app.github }}
                </v-chip>
                <v-chip
                  v-if="app.bgg"
                  :color="bggChip.color"
                  variant="flat"
                  size="large"
                  @click.prevent.stop="openLink(`https://boardgamegeek.com/user/${app.bgg}`)"
                  style="cursor: pointer;"
                >
                  <template #prepend>
                    <v-avatar class="mr-2" size="24">
                      <v-img :src="bggChip.iconUrl"></v-img>
                    </v-avatar>
                  </template>
                  {{ app.bgg }}
                </v-chip>
              </div>
            </template>

          </v-list-item>
        </v-list>
      </v-sheet>

    <v-snackbar
      v-model="snackbar.show"
      :timeout="2000"
      :color="snackbar.color"
      location="bottom right"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const applications = ref([
  {
    imageSrc: 'https://druna-assets.s3.us-east-2.amazonaws.com/community-forge/logo.png',
    title: 'Drunagor Turn Tracker',
    url: 'https://jcarlosorte.github.io/drunagor-turn-tracker/',
    discord: 'darkfidodido',
    github: 'jcarlosorte',
    bgg: 'DaRkFiDo'
  },
  {
    imageSrc: null,
    title: 'Valkrad Initiative',
    url: 'https://valkrad.com/initiative/',
    discord: 'xeh1045',
    github: 'xehnlp',
    bgg: 'xehkrad'
  },
]);

const bggChip = {
  color: '#443f64',
  iconUrl: 'https://druna-assets.s3.us-east-2.amazonaws.com/community-forge/bgg.png'
};

const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
});

/**
 * Copies text to the clipboard and shows a notification.
 * @param {string} text - The text to copy.
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    snackbar.text = 'ID copied!';
    snackbar.color = 'success';
    snackbar.show = true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    snackbar.text = 'Failed to copy ID.';
    snackbar.color = 'error';
    snackbar.show = true;
  }
}

/**
 * Opens a link in a new tab.
 * @param {string} url - The URL to open.
 */
function openLink(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
</script>

<style scoped>
.page-background {
  background-color: #121212;
  min-height: 100vh;
}

.v-list-item {
  transition: all 0.2s ease-in-out;
}

.list-item-padding {
  padding-top: 16px !important;
  padding-bottom: 16px !important;
}

.v-list-item:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.04);
  transform: translateY(-2px);
  border-color: rgba(var(--v-theme-primary), 0.5) !important;
}
</style>