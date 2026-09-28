<template>
  <div class="box-card" role="button" tabindex="0" @click="emit('open')" @keydown.enter="emit('open')">
    <div class="box-card__cover" :style="{ backgroundColor: boxColor }">
      <img :src="product.image" alt="" />
    </div>
    <div class="box-card__info" :style="{ backgroundImage: `url(${product.cardbg})` }">
      <div class="box-card__text">
        <h3>{{ product.name }}</h3>
        <span>Game content box</span>
      </div>

      <div v-if="matches.length" class="box-card__matches">
        <span v-for="match in matches.slice(0, 3)" :key="match.type + match.name" :title="match.type">
          {{ match.name }}
        </span>
        <span v-if="matches.length > 3">+{{ matches.length - 3 }}</span>
      </div>

      <div class="box-card__status">
        <v-icon v-if="product.owned" size="18" color="playbutton" title="Owned">mdi-check-circle</v-icon>
        <v-icon v-if="product.wish" size="18" color="accent" title="In wishlist">mdi-star</v-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { LibraryProduct } from "@/components/Library/LibraryBoxDetail.vue";

const props = defineProps<{ product: LibraryProduct; matches: { type: string; name: string }[] }>();
const emit = defineEmits<{ (e: "open"): void }>();

// Some SKU colors come from the API without the leading '#'.
const boxColor = computed(() =>
  /^[0-9a-f]{6}$/i.test(props.product.color) ? `#${props.product.color}` : props.product.color,
);
</script>

<style scoped>
.box-card {
  display: flex;
  height: 150px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.box-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
}
.box-card__cover {
  display: flex;
  flex: 0 0 38%;
  align-items: center;
  justify-content: center;
  padding: 8px;
}
.box-card__cover img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.box-card__info {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding: 12px 14px;
  background-size: cover;
  background-position: center;
  color: #fff;
}
.box-card__info::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.35) 100%);
}
.box-card__text,
.box-card__matches,
.box-card__status {
  position: relative;
}
.box-card__text h3 {
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.15;
  text-transform: uppercase;
}
.box-card__text span {
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.85;
}
.box-card__matches {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: auto;
}
.box-card__matches span {
  padding: 1px 8px;
  background: rgba(var(--v-theme-accent), 0.85);
  border-radius: 999px;
  color: #000;
  font-size: 0.68rem;
  font-weight: 700;
}
.box-card__status {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 4px;
}
</style>
