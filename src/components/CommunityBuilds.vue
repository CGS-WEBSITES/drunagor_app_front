<template>
  <!-- The app pads a page root, so pad an inner wrapper (like the Library). -->
  <div>
    <div class="forge-page">
      <h1 class="forge-page__title cinzel-text">COMMUNITY FORGE</h1>
      <p class="forge-page__sub">Tools made by the community for Chronicles of Drunagor.</p>

      <div class="forge-grid">
        <a v-for="app in applications" :key="app.title" :href="app.url" target="_blank" rel="noopener noreferrer" class="forge-card">
          <div class="forge-card__head">
            <v-avatar size="56" class="forge-card__logo">
              <v-img v-if="app.imageSrc" :src="app.imageSrc" :alt="`${app.title} logo`" cover />
              <v-icon v-else icon="mdi-tools" size="30" />
            </v-avatar>
            <div class="forge-card__name">
              <h2>{{ app.title }}</h2>
              <span><v-icon size="14">mdi-open-in-new</v-icon> Open tool</span>
            </div>
          </div>

          <div class="forge-card__links">
            <button v-if="app.discord" class="forge-link forge-link--discord" title="Copy Discord name" @click.prevent.stop="copyToClipboard(app.discord)">
              <img src="https://cdn.simpleicons.org/discord/fff" alt="" />{{ app.discord }}
            </button>
            <button v-if="app.github" class="forge-link forge-link--github" @click.prevent.stop="openLink(`https://github.com/${app.github}`)">
              <v-icon size="16">mdi-github</v-icon>{{ app.github }}
            </button>
            <button v-if="app.bgg" class="forge-link forge-link--bgg" @click.prevent.stop="openLink(`https://boardgamegeek.com/user/${app.bgg}`)">
              <img :src="bggChip.iconUrl" alt="" />{{ app.bgg }}
            </button>
          </div>
        </a>
      </div>
    </div>

    <v-snackbar v-model="snackbar.show" :timeout="2000" :color="snackbar.color" location="bottom right">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const applications = ref([
  {
    imageSrc: 'https://assets.drunagor.app/community-forge/logo.png',
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
  iconUrl: 'https://assets.drunagor.app/community-forge/bgg.png'
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
/* Same width and title as the Library. */
.forge-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 76px 16px 48px;
  font-family: "Poppins", sans-serif;
  color: rgb(var(--v-theme-on-surface));
}
.forge-page__title {
  font-family: "Cinzel", serif;
  font-size: 3.5rem;
  font-weight: 900;
  text-align: center;
}
.forge-page__sub {
  margin: 0 0 24px;
  text-align: center;
  opacity: 0.7;
}
.forge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}
.forge-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
  background: rgb(var(--v-theme-primary));
  border-radius: 12px;
  color: inherit;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.forge-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  transform: translateY(-2px);
}
.forge-card__head {
  display: flex;
  align-items: center;
  gap: 14px;
}
.forge-card__logo {
  background: rgb(var(--v-theme-secondary));
}
.forge-card__name h2 {
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1.2;
}
.forge-card__name span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: rgb(var(--v-theme-accent));
  font-size: 0.78rem;
  font-weight: 600;
}
.forge-card__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.forge-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  transition: filter 0.15s ease;
}
.forge-link:hover {
  filter: brightness(1.15);
}
.forge-link img {
  width: 16px;
  height: 16px;
}
.forge-link--discord {
  background: #5865f2;
}
.forge-link--github {
  background: rgb(var(--v-theme-secondary));
}
.forge-link--bgg {
  background: #443f64;
}
@media (max-width: 959px) {
  .forge-page {
    padding: 76px 12px 32px;
  }
  .forge-page__title {
    font-size: 2.4rem;
  }
  .forge-grid {
    grid-template-columns: 1fr;
  }
}
</style>
