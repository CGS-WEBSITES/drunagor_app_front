<template>
  <!-- A hero banner built from parts: class color, class symbol, text and the cut-out portrait. -->
  <div class="hero-banner" :style="{ '--class-bg': style.bg, '--class-stroke': style.stroke }">
    <img v-if="style.icon" :src="style.icon" alt="" class="hero-banner__watermark" />
    <div class="hero-banner__text">
      <h3>{{ hero.name }}</h3>
      <p class="hero-banner__class">{{ hero.race }} | {{ heroClassLabel(hero.class) }}</p>
      <p class="hero-banner__path">Path of {{ hero.path }}</p>
      <span v-if="CONTENT_SYMBOLS[hero.content]" class="hero-banner__box">
        <img :src="CONTENT_SYMBOLS[hero.content]" alt="" />{{ CONTENT_LABELS[hero.content] }}
      </span>
    </div>
    <img :src="heroPortrait(hero)" :alt="hero.name" class="hero-banner__portrait" />
    <div class="hero-banner__slot"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { HeroData } from "@/data/repository/HeroData";
import { CONTENT_LABELS, CONTENT_SYMBOLS, classStyle, heroClassLabel, heroPortrait } from "@/data/heroMeta";

const props = defineProps<{ hero: HeroData }>();
const style = computed(() => classStyle(props.hero.class));
</script>

<style scoped>
.hero-banner {
  position: relative;
  display: flex;
  align-items: stretch;
  min-height: 118px;
  overflow: hidden;
  background: linear-gradient(100deg, var(--class-bg) 55%, color-mix(in srgb, var(--class-bg) 70%, #000) 100%);
  border-bottom: 2px solid var(--class-stroke);
  color: #fff;
  font-family: "Poppins", sans-serif;
}
.hero-banner__watermark {
  position: absolute;
  top: 50%;
  right: 110px;
  width: 170px;
  opacity: 0.1;
  transform: translateY(-50%);
  pointer-events: none;
}
.hero-banner__text {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 12px 18px;
}
.hero-banner__text h3 {
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1.1;
  text-transform: uppercase;
}
.hero-banner__class {
  margin: 4px 0 0;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
}
.hero-banner__path {
  margin: 0;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.8;
}
.hero-banner__box {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 8px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.85;
}
.hero-banner__box img {
  width: auto;
  height: 14px;
}
.hero-banner__portrait {
  position: relative;
  z-index: 1;
  align-self: flex-end;
  width: 118px;
  height: 118px;
  object-fit: contain;
  object-position: bottom;
}
/* Actions over the banner (edit, collapse). */
.hero-banner__slot {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  display: flex;
  gap: 4px;
}
</style>
