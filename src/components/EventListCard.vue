<template>
  <div class="event-list-card" role="button" tabindex="0" @click="emit('open')" @keydown.enter="emit('open')">
    <img v-if="seasonFlag" :src="seasonFlag" alt="" class="event-list-card__flag" />

    <div class="event-list-card__date">
      <span class="event-list-card__month">{{ extractMonth(event.event_date, timezone) }}</span>
      <span class="event-list-card__day cinzel-text">{{ extractDay(event.event_date, timezone) }}</span>
      <span class="event-list-card__time">{{ extractTime(event.event_date, timezone) }}</span>
    </div>

    <div class="event-list-card__info">
      <h3 class="event-list-card__name text-truncate">
        <v-icon size="16" color="black" class="mr-1">mdi-chess-rook</v-icon>{{ event.store_name }}
      </h3>
      <p class="event-list-card__line text-truncate">
        <v-icon size="16" color="red" class="mr-1">mdi-map-marker</v-icon>{{ event.address }}
      </p>
      <p class="event-list-card__line text-truncate">
        <v-icon size="16" color="red" class="mr-1">mdi-sword-cross</v-icon>{{ event.scenario }}
      </p>
      <p v-if="event.rewards?.length" class="event-list-card__line">
        <v-icon size="16" color="red" class="mr-1">mdi-star-circle</v-icon>Rewards:
        <img
          v-for="(reward, i) in event.rewards"
          :key="i"
          :src="reward.image"
          alt=""
          class="event-list-card__reward"
        />
      </p>
    </div>

    <div v-if="$slots.status" class="event-list-card__status">
      <slot name="status" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import s1flag from "@/assets/s1flag.png";
import s2flag from "@/assets/s2flag.png";
import { extractDay, extractMonth, extractTime } from "@/utils/dateHelpers";

const props = defineProps<{ event: any; timezone: string }>();
const emit = defineEmits<{ (e: "open"): void }>();

const seasonFlag = computed(() => {
  if (props.event.seasons_fk == 2) return s1flag;
  if (props.event.seasons_fk == 3) return s2flag;
  return null;
});
</script>

<style scoped>
.event-list-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
  min-height: 104px;
  padding: 8px 56px 8px 8px;
  background: #fff;
  color: #000;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.event-list-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
}
.event-list-card__flag {
  position: absolute;
  top: 0;
  right: 8px;
  width: 34px;
  height: auto;
}
.event-list-card__date {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 64px;
  line-height: 1.1;
}
.event-list-card__month,
.event-list-card__time {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}
.event-list-card__day {
  font-size: 2.3rem;
  font-weight: 700;
}
.event-list-card__info {
  min-width: 0;
  flex: 1;
}
.event-list-card__name {
  font-family: "Poppins", sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 2px;
}
.event-list-card__line {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  margin: 0;
}
.event-list-card__reward {
  width: 18px;
  height: 18px;
  margin-left: 4px;
  object-fit: contain;
}
.event-list-card__status {
  position: absolute;
  right: 12px;
  bottom: 8px;
}
</style>
