<template>
  <div class="rguide">
    <div class="rguide__bg"></div>

    <div class="rguide__inner">
      <button class="rguide__back" title="Back" @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </button>

      <!-- Hero -->
      <header class="rguide__hero">
        <span class="rguide__kicker">Retailer guide</span>
        <h1 class="cinzel-text">Host Drunagor Nights</h1>
        <p>
          An in-store campaign: players come back night after night and the app keeps their Heroes and progress. You get the
          store and the table ready; the app guides the players through the rest.
        </p>
      </header>

      <!-- Who does what -->
      <div class="rguide__roles">
        <div class="role">
          <h3><v-icon size="20">mdi-store</v-icon> You</h3>
          <ul>
            <li>Assemble the game box <span>(once)</span></li>
            <li>Create your store and events</li>
            <li>Prepare the table before each night</li>
            <li>Give each table its QR Code or code</li>
          </ul>
        </div>
        <div class="role">
          <h3><v-icon size="20">mdi-account-group</v-icon> Your players</h3>
          <ul>
            <li>Join the table (QR Code or code)</li>
            <li>Choose and prepare their Heroes</li>
            <li>Assemble the First Setup</li>
            <li>Play, guided by the app</li>
          </ul>
        </div>
      </div>

      <!-- Steps -->
      <ol class="rguide__steps">
        <li v-for="(step, n) in steps" :key="step.title" class="rstep">
          <div class="rstep__marker">{{ n + 1 }}</div>
          <div class="rstep__card">
            <h2>{{ step.title }}</h2>
            <p v-for="(line, i) in step.text" :key="i" class="rstep__text" v-html="line"></p>
            <ul v-if="step.list" class="rstep__list">
              <li v-for="(item, i) in step.list" :key="i" v-html="item"></li>
            </ul>

            <div v-if="step.images?.length" class="rstep__shots">
              <button v-for="shot in step.images" :key="shot.src" class="rshot" @click="openLightbox(shot.src)">
                <img :src="shot.src" :alt="shot.caption" loading="lazy" />
                <span>{{ shot.caption }}</span>
              </button>
            </div>

            <div v-if="step.actions?.length" class="rstep__actions">
              <button
                v-for="action in step.actions"
                :key="action.label"
                class="raction"
                :class="{ 'raction--primary': action.primary }"
                @click="router.push(action.to)"
              >
                <v-icon size="18">{{ action.icon }}</v-icon>
                {{ action.label }}
              </button>
            </div>
          </div>
        </li>
      </ol>

      <!-- Printable versions -->
      <section class="rguide__pdfs">
        <h3>Printable versions</h3>
        <a v-for="pdf in pdfs" :key="pdf.title" :href="pdf.href" target="_blank" rel="noopener noreferrer" class="rpdf">
          <v-icon size="22">mdi-file-pdf-box</v-icon>
          <span>{{ pdf.title }}</span>
          <v-icon size="18">mdi-download</v-icon>
        </a>
      </section>

      <div class="rguide__end">
        <button class="raction raction--primary" @click="goBack">
          <v-icon size="18">{{ signedIn ? "mdi-view-dashboard" : "mdi-login" }}</v-icon>
          {{ signedIn ? "Go to my dashboard" : "Go to login" }}
        </button>
      </div>
    </div>

    <!-- Full-size screenshot -->
    <v-dialog v-model="showLightbox" max-width="460" scrollable>
      <v-card color="black" class="rguide__lightbox" rounded="xl">
        <v-btn icon="mdi-close" variant="flat" size="small" class="rguide__lightbox-close" @click="showLightbox = false" />
        <img :src="activeImage" alt="" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";
import { TABLE_ASSEMBLY_PDF } from "@/data/assembly/tableAssembly";

const router = useRouter();
const userStore = useUserStore();

const IMG = "https://assets.drunagor.app/retaitlertutorial/retailer-guide";
const shot = (file: string, caption: string) => ({ src: `${IMG}/${file}.webp`, caption });

const signedIn = computed(() => !!userStore.user?.users_pk || !!localStorage.getItem("accessToken"));
const isRetailer = computed(() => userStore.user?.roles_fk === 3);

// Back to the dashboard when signed in, to the login otherwise.
const goBack = () => router.push(signedIn.value ? "/dashboard" : "/");

type Step = {
  title: string;
  text: string[];
  list?: string[];
  images?: { src: string; caption: string }[];
  actions?: { label: string; icon: string; primary?: boolean; to: string }[];
};

const steps = computed<Step[]>(() => [
  // Only for visitors: a signed-in retailer already has an account.
  ...(isRetailer.value
    ? []
    : [
        {
          title: "Create your retailer account",
          text: [`Sign up as a <strong>retailer</strong> on the Drunagor.app. It's free and takes a minute.`],
          images: [shot("01-create-account", "Retailer sign up")],
          actions: [{ label: "Create retailer account", icon: "mdi-store-plus", primary: true, to: "/retailer-registration" }],
        },
      ]),
  {
    title: "Assemble the game box",
    text: [
      `Before your first event, sort the Core Box, the Build Your Own Dungeon add-on and the Organized Play Kit into one box ready for your nights. You only do this once.`,
    ],
    actions: [{ label: "Box assembly guide", icon: "mdi-package-variant-closed", primary: true, to: "/box-assembly-guide" }],
  },
  {
    title: "Add your store",
    text: [
      `Add the store where you host. Its name and address are what players see when they look for events near them. New stores are reviewed before they can host (up to 3 business days).`,
    ],
    images: [shot("03-stores", "My stores"), shot("04-add-store", "Add a store")],
    actions: signedIn.value ? [{ label: "Open my stores", icon: "mdi-store", to: "/profile/store-settings" }] : [],
  },
  {
    title: "Create an event",
    text: [`Each Drunagor Night is an event. Choose:`],
    list: [
      `<strong>Store</strong> – where it will be played.`,
      `<strong>Wing</strong> – the adventure the tables will play that night.`,
      `<strong>Date and time</strong>.`,
    ],
    images: [shot("06-create-event", "Create event")],
    actions: signedIn.value ? [{ label: "Open events", icon: "mdi-calendar-plus", to: "/events" }] : [],
  },
  {
    title: "Add tables and share their codes",
    text: [
      `Open the event in <strong>Manage event › Tables & players</strong> and add a table for each group. Every table has a <strong>QR Code</strong> and a short <strong>table code</strong>: print the QR Code, show it on a screen, or just say the code out loud.`,
      `Players join from <strong>Play › Join a table</strong>, by scanning the QR Code or typing the code.`,
    ],
    images: [shot("08-tables", "Tables & players"), shot("09-qr-code", "QR Code and table code"), shot("11-join-table", "What players see")],
  },
  {
    title: "Prepare the table",
    text: [
      `Before players arrive, follow <strong>Table Assembly</strong> (about 3 minutes) in Manage event, or scan the "Setup the Game Table" QR Code from the Organized Play Kit.`,
      `From there the app takes over: each player prepares their Hero, the party leader starts the game, and the app walks them through the First Setup and their first turns.`,
    ],
    images: [shot("10-table-assembly", "Table Assembly")],
    actions: [{ label: "Table assembly", icon: "mdi-table-furniture", primary: true, to: "/assembly-tutorial" }],
  },
]);

const pdfs = [
  { title: "Box Assembly Guide (PDF)", href: "https://assets.drunagor.app/retaitlertutorial/box-assembly-guide/RETAILER%20MANUAL%20-%20OP%20KIT%20preparation.pdf" },
  { title: "Table Assembly (PDF)", href: TABLE_ASSEMBLY_PDF },
];

const showLightbox = ref(false);
const activeImage = ref("");
const openLightbox = (src: string) => {
  activeImage.value = src;
  showLightbox.value = true;
};
</script>

<style scoped>
.rguide {
  position: relative;
  width: 100%;
  min-height: 100dvh;
  font-family: "Poppins", sans-serif;
}
.rguide__bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: radial-gradient(circle at 50% 0%, rgba(var(--v-theme-primary), 0.9) 0%, rgb(var(--v-theme-background)) 60%);
}
.rguide__inner {
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin: 0 auto;
  padding: calc(env(safe-area-inset-top, 0px) + 20px) 16px 48px;
}
.rguide__back {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-bottom: 8px;
  background: rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 50%;
}
.rguide__hero {
  margin-bottom: 20px;
}
.rguide__kicker {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.65;
}
.rguide__hero h1 {
  margin: 4px 0 8px;
  font-size: clamp(1.8rem, 6vw, 2.6rem);
  font-weight: 800;
  line-height: 1.1;
}
.rguide__hero p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.8;
}
.rguide__roles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 10px;
  margin-bottom: 28px;
}
.role {
  padding: 14px 16px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 14px;
}
.role h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 1rem;
}
.role ul {
  margin: 0;
  padding-left: 18px;
  font-size: 0.88rem;
  opacity: 0.85;
}
.role li {
  margin-bottom: 4px;
}
.role li span {
  opacity: 0.6;
}
/* Steps: a numbered line down the page. */
.rguide__steps {
  margin: 0;
  padding: 0;
  list-style: none;
}
.rstep {
  position: relative;
  display: flex;
  gap: 14px;
  padding-bottom: 18px;
}
.rstep::before {
  position: absolute;
  top: 36px;
  bottom: 0;
  left: 17px;
  width: 2px;
  background: rgba(var(--v-theme-on-surface), 0.12);
  content: "";
}
.rstep:last-child::before {
  display: none;
}
.rstep__marker {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 36px;
  height: 36px;
  background: rgb(var(--v-theme-terciary));
  border-radius: 50%;
  color: rgb(var(--v-theme-on-terciary));
  font-weight: 800;
}
.rstep__card {
  flex: 1;
  min-width: 0;
  padding: 14px 16px 16px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 14px;
}
.rstep__card h2 {
  margin-bottom: 6px;
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1.3;
}
.rstep__text,
.rstep__list {
  margin: 0 0 8px;
  font-size: 0.9rem;
  line-height: 1.6;
  opacity: 0.85;
}
.rstep__list {
  padding-left: 18px;
}
/* Screenshots: phone-shaped, side by side, scroll sideways when needed. */
.rstep__shots {
  display: flex;
  gap: 10px;
  margin: 12px -16px 4px;
  padding: 0 16px 6px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.rshot {
  display: flex;
  flex: 0 0 140px;
  flex-direction: column;
  gap: 6px;
  scroll-snap-align: start;
  text-align: left;
}
.rshot img {
  width: 100%;
  aspect-ratio: 390 / 844;
  object-fit: cover;
  object-position: top;
  background: #000;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 12px;
  transition: transform 0.2s ease;
}
.rshot:hover img {
  transform: translateY(-2px);
}
.rshot span {
  font-size: 0.72rem;
  font-weight: 600;
  opacity: 0.7;
}
.rstep__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.raction {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 42px;
  padding: 0 16px;
  background: rgb(var(--v-theme-secondary));
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 700;
}
.raction--primary {
  background: rgb(var(--v-theme-playbutton));
  color: rgb(var(--v-theme-on-playbutton));
}
.rguide__pdfs {
  margin-top: 12px;
}
.rguide__pdfs h3 {
  margin-bottom: 8px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  opacity: 0.7;
}
.rpdf {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  padding: 12px 14px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 12px;
  color: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
}
.rpdf span {
  flex: 1;
}
.rguide__end {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
.rguide__lightbox {
  position: relative;
}
.rguide__lightbox img {
  display: block;
  width: 100%;
  max-height: 85vh;
  object-fit: contain;
}
.rguide__lightbox-close {
  position: absolute !important;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6) !important;
}
@media (min-width: 700px) {
  .rshot {
    flex-basis: 170px;
  }
}
</style>
