<script setup lang="ts">
import { ref, toRef, watch, computed } from "vue";

type MonsterColor = "white" | "gray" | "black" | "commander";

const props = defineProps<{
  title: string;
  background: string;
  frontImage: string;
  subTitle?: string;
  backImage?: string;
}>();

const currentImage = ref("");
const frontImage = toRef(props, "frontImage");
currentImage.value = frontImage.value;

const showHelp = ref(false);
const helpOverlayImage = new URL('@/assets/monster/big/help.webp', import.meta.url).href;

watch(frontImage, async (newImage: string) => {
  currentImage.value = newImage;
});

const monsterColorMap: Record<string, MonsterColor> = {
  "hellish flayer": "gray",
  "abomination": "black",
  "skeleton archer": "white",
  "faceless conjurer": "gray",
  "skeleton knight": "white",
  "shadow witch": "white",
  "shadow knight": "black",
  "executioner": "gray",
  "rotten flesh": "gray",
  "shadow vampire": "gray",
  "shadow cultist": "white",
  "corrupted farmer": "white",
  "shadow pain": "white",
  "shadow guardian": "gray",
  "gremlin horde": "white",
  "nagian hunter": "white",
  "gorgoness witch": "white",
  "grim doctor": "white",
  "gorgon hexer": "gray",
  "night stalker": "gray",
  "fell asteris": "gray",
  "hellspawn brute": "gray",
  "wurm offspring": "gray",
  "lady claw": "gray",
  "death messenger": "gray",
  "scout of darkness": "white",
  "bone reaper": "gray",
  "shadow mistress": "white",
  "wallking horror": "white",
  "ravager": "white",
  "corrupted worm": "gray",
  "hunter": "commander",
  "archon": "commander",
  "bane": "commander",
  "thern": "commander",
  "horde": "commander",
  "demon lord": "commander",
  "hexer": "commander",
  "spawn": "commander",
  "ox": "commander",
  "flinch": "commander",
  "twin": "commander",
  "doctor": "commander",
  "fallen sisters": "commander",
  "witch": "commander",
  "wermuggdir": "commander",
  "walking horror": "white"
};

const resolvedColor = computed<MonsterColor>(() => {
  const key = props.title?.toLowerCase().trim();
  return monsterColorMap[key] || "black";
});

const subtitleColor = computed(() => {
  switch (resolvedColor.value) {
    case "white":
    case "gray":
      return "black";
    case "commander":
      return "transparent";
    case "black":
    default:
      return "white";
  }
});

const showSubtitle = computed(() => resolvedColor.value !== "commander");
</script>

<template>
  <v-container max-width="666" class="d-flex justify-center">
    <v-card-text class="pa-0" style="position: relative;">
      <v-img :src="currentImage" width="100%" style="border-radius: 12px;">
        <!-- Overlay Trigger -->
        <v-btn
          icon
          size="x-small"
          style="position: absolute; top: 12px; right: 12px; z-index: 3;"
          @click="showHelp = true"
        >
          <v-icon color="white">mdi-help-circle</v-icon>
        </v-btn>

        <!-- XS -->
        <div
          v-if="showSubtitle"
          class="d-sm-none"
          :style="{
            position: 'absolute',
            top: '24px',
            left: '60px',
            color: subtitleColor,
            WebkitTextStroke: '0.4px white',
            padding: '6px',
            borderRadius: '6px',
            fontSize: '1.15rem',
            fontWeight: '600',
            zIndex: 2,
          }"
        >
          {{ props.subTitle }}
        </div>

        <!-- SM -->
        <div
          v-if="showSubtitle"
          class="d-none d-sm-flex d-md-none"
          :style="{
            position: 'absolute',
            top: '44px',
            left: '102px',
            color: subtitleColor,
            WebkitTextStroke: '0.3px white',
            padding: '8px',
            borderRadius: '6px',
            fontSize: '1.45rem',
            fontWeight: '800',
            zIndex: 2,
          }"
        >
          {{ props.subTitle }}
        </div>

        <!-- MD+ -->
        <div
          v-if="showSubtitle"
          class="d-none d-md-flex"
          :style="{
            position: 'absolute',
            top: 'clamp(42px, 21vw, 24px)',
            left: 'clamp(98px, 21vw, 24px)',
            color: subtitleColor,
            WebkitTextStroke: '0.4px white',
            padding: 'clamp(4px, 1vw, 12px)',
            borderRadius: '6px',
            fontSize: 'clamp(1.4rem, 1.5vw, 1rem)',
            fontWeight: '800',
            zIndex: 2,
          }"
        >
          {{ props.subTitle }}
        </div>

        <!-- OVERLAY HELP IMAGE -->
        <div
          v-if="showHelp"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 4;"
          class="d-flex align-center justify-center"
        >
          <v-img :src="helpOverlayImage" width="90%" />

          <v-btn
            icon
            size="small"
            color="white"
            style="position: absolute; top: 8px; right: 8px;"
            @click="showHelp = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-img>
    </v-card-text>
  </v-container>
</template>

<style scoped>
.border-silver {
  border-width: 1px;
  border-style: solid;
  border-image: linear-gradient(to bottom, #d4d4d8, #111827) 1;
}

.top-border-silver {
  border-top: 2px solid #1f2937;
}
</style>
