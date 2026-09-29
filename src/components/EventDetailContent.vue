<template>
  <!-- Event details shared by the event dialogs: info, date, store, map, rewards. -->
  <div class="event-detail-content">
    <p class="event-detail-content__info">
      <v-icon size="16" class="mr-1">mdi-sword-cross</v-icon>{{ event?.scenario }}
    </p>
    <p v-if="seasonName" class="event-detail-content__info">
      <v-icon size="16" class="mr-1">mdi-shield-sun</v-icon>{{ seasonName }}
    </p>
    <p v-if="event?.seats_number" class="event-detail-content__info">
      <v-icon size="16" class="mr-1">mdi-seat</v-icon>{{ event.seats_number }} seats
    </p>

    <div class="d-flex justify-end my-3">
      <span class="event-detail-content__scheduled">
        <strong>SCHEDULED FOR:</strong> {{ formatEventDate(event?.event_date, timezone) }}
      </span>
    </div>

    <div class="event-detail-content__store" @click="openInGoogleMaps">
      <img :src="storeImage" alt="" class="event-detail-content__store-img" />
      <div style="min-width: 0">
        <h3 class="event-detail-content__store-name">{{ event?.store_name }}</h3>
        <p class="event-detail-content__store-address">
          <v-icon size="16" color="red">mdi-map-marker</v-icon>{{ event?.address }}
        </p>
      </div>
    </div>
    <div v-if="event?.latitude" class="event-detail-content__map">
      <iframe
        :src="`https://www.google.com/maps?q=${event.latitude},${event.longitude}&z=15&output=embed`"
        title="Store location"
        loading="lazy"
        allowfullscreen
      />
    </div>

    <h3 class="event-detail-content__section">REWARDS:</h3>
    <template v-if="rewards.length">
      <div v-for="(reward, index) in rewards" :key="index" class="event-detail-content__reward">
        <v-avatar size="64">
          <v-img :src="`https://assets.drunagor.app/${reward.picture_hash}`" />
        </v-avatar>
        <div>
          <h4 class="event-detail-content__reward-name">{{ reward.name }}</h4>
          <p v-if="reward.description" class="event-detail-content__reward-text">{{ reward.description }}</p>
        </div>
      </div>
    </template>
    <p v-else class="event-detail-content__empty">No rewards linked to this event.</p>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatEventDate } from "@/utils/dateHelpers";

const props = defineProps<{ event: any; rewards?: any[]; timezone: string }>();

const rewards = computed(() => props.rewards ?? []);

const seasonName = computed(() =>
  props.event?.seasons_fk == 2 ? "Season 1" : props.event?.seasons_fk == 3 ? "Season 2" : "",
);

const storeImage = computed(() =>
  props.event?.picture_hash
    ? `https://assets.drunagor.app/${props.event.picture_hash}`
    : "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png",
);

const openInGoogleMaps = () => {
  const event = props.event;
  if (!event?.store_name || event.latitude == null || event.longitude == null) return;
  const query = `${event.store_name.split(" ").join("+")}%20${event.latitude},${event.longitude}`;
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
};
</script>

<style scoped>
.event-detail-content {
  font-family: "Poppins", sans-serif;
}
.event-detail-content__info {
  display: flex;
  align-items: center;
  margin: 0 0 2px;
  font-size: 0.85rem;
}
.event-detail-content__scheduled {
  padding: 4px 10px;
  background: #fff;
  border-radius: 6px;
  color: #000;
  font-size: 0.8rem;
}
.event-detail-content__store {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: #fff;
  border-radius: 6px 6px 0 0;
  color: #000;
  cursor: pointer;
}
.event-detail-content__store:only-of-type,
.event-detail-content__store:not(:has(+ .event-detail-content__map)) {
  border-radius: 6px;
}
.event-detail-content__store-img {
  flex: 0 0 88px;
  width: 88px;
  height: 88px;
  border-radius: 4px;
  object-fit: cover;
}
.event-detail-content__store-name {
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
}
.event-detail-content__store-address {
  display: flex;
  align-items: center;
  gap: 2px;
  margin: 0;
  font-size: 0.8rem;
}
.event-detail-content__map {
  height: 180px;
  overflow: hidden;
  border-radius: 0 0 6px 6px;
}
.event-detail-content__map iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
.event-detail-content__section {
  margin: 20px 0 8px;
  font-size: 1.05rem;
  font-weight: 700;
}
.event-detail-content__reward {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}
.event-detail-content__reward-name {
  font-size: 0.95rem;
  font-weight: 700;
}
.event-detail-content__reward-text {
  margin: 0;
  font-size: 0.8rem;
}
.event-detail-content__empty {
  font-size: 0.85rem;
  opacity: 0.7;
}
</style>
