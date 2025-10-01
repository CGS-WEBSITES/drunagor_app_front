<template>
  <div>
    <v-row v-if="players.length > 0" dense>
      <v-col
        v-for="item in players"
        :key="item.rl_campaigns_users_pk"
        cols="12"
      >
        <v-card
          class="pa-1"
          style="position: relative"
          rounded="lg"
          elevation="6"
          height="82px"
        >
          <div
            class="background-overlay"
            :style="{
              backgroundImage: item.background_hash
                ? `url(https://assets.drunagor.app/Profile/${item.background_hash})`
                : 'url(https://assets.drunagor.app/Profile/profile-bg-warriors-transparent.png)',
            }"
          ></div>

          <v-btn
            v-if="
              props.showRemoveButton && item.role_name !== 'Drunagor Master'
            "
            icon
            size="x-small"
            color="red"
            variant="tonal"
            class="remove-player-btn"
            @click.stop="removePlayer(item)"
          >
            <v-icon>mdi-close</v-icon>
            <v-tooltip activator="parent" location="start"
              >Remove Player</v-tooltip
            >
          </v-btn>

          <v-row
            align="center"
            no-gutters
            class="fill-height cursor-pointer"
            style="position: relative; z-index: 1"
            @click="navigateToUser(item.users_fk)"
          >
            <v-col
              cols="4"
              sm="2"
              class="d-flex justify-center align-center"
            >
              <v-img
                :src="item.image"
                alt="Player Image"
                width="70"
                height="77"
                class="rounded-lg"
              ></v-img>
            </v-col>

            <v-col cols="8" sm="9" class="pl-2">
              <div class="d-flex align-center">
                <v-icon
                  v-if="item.role_name === 'Drunagor Master'"
                  size="small"
                  color="amber"
                  class="mr-1"
                >
                  mdi-crown
                </v-icon>
                <p class="font-weight-bold text-body-1 text-truncate">
                  {{ item.user_name }}
                </p>
              </div>

              <div class="text-caption text-grey-lighten-1">
                {{ item.role_name }}
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <div v-else class="text-center pa-4 text-grey">
      <p>No other players found in this campaign.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const props = defineProps<{
  campaignId: string;
  showRemoveButton?: boolean;
}>();

const emit = defineEmits<{
  (e: "player-removed"): void;
}>();

const router = useRouter();
const players = ref<any[]>([]);
const intervalId = ref<any>(null);

const navigateToUser = (userId: number) => {
  if (!userId) return;
  const encodedId = btoa(userId.toString());
  router.push({ name: "User", params: { id: encodedId } });
};

const fetchPlayers = async () => {
  if (!props.campaignId) return;
  try {
    const response = await axios.get("/rl_campaigns_users/list_players", {
      params: { campaigns_fk: props.campaignId },
    });

    const playerData = response.data.Users || [];

    players.value = playerData.map((player: any) => ({
      ...player,
      image: player.picture_hash
        ? `https://assets.drunagor.app/Profile/${player.picture_hash}`
        : "https://assets.drunagor.app/Profile/user.png",
    }));
  } catch (error) {
    console.error("Error fetching campaign players:", error);
    players.value = [];
  }
};

const removePlayer = async (player: any) => {
  if (!confirm(`Are you sure you want to remove ${player.user_name}?`)) return;
  try {
    await axios.delete(
      `/rl_campaigns_users/delete/${player.rl_campaigns_users_pk}`,
    );
    emit("player-removed");
    await fetchPlayers();
  } catch (error) {
    console.error("Error removing player:", error);
  }
};

onMounted(() => {
  fetchPlayers();
  intervalId.value = setInterval(fetchPlayers, 5000);
});

onBeforeUnmount(() => {
  clearInterval(intervalId.value);
});

defineExpose({
  fetchPlayers,
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.background-overlay {
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  z-index: 0;
  filter: brightness(0.8);
}

.remove-player-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 2;
}
</style>