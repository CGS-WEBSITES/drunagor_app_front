<template>
  <v-card color="primary" rounded="lg" elevation="0" class="py-2">
    <h3 class="text-h6 mb-3">Players</h3>

    <v-row v-if="players.length > 0" dense>
      <v-col
        v-for="item in players"
        :key="item.rl_campaigns_users_pk"
        cols="12"
        sm="12"
      >
        <v-card
          class="pa-1 cursor-pointer"
          style="position: relative"
          rounded="lg"
          elevation="6"
          height="82px"
          @click="navigateToUser(item.users_fk)"
        >
          <div
            class="background-overlay"
            :style="{
              backgroundImage: item.background_hash
                ? `url(https://druna-assets.s3.us-east-2.amazonaws.com/Profile/${item.background_hash})`
                : 'url(https://druna-assets.s3.us-east-2.amazonaws.com/Profile/profile-bg-warriors-transparent.png)',
            }"
          ></div>

          <v-row
            align="center"
            no-gutters
            class="fill-height"
            style="position: relative; z-index: 1"
          >
            <v-col cols="4" sm="2" class="d-flex justify-center align-center">
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

              <div class="text-caption text-grey-lighten-1"> {{ item.role_name }}
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <div v-else class="text-center pa-4 text-grey">
      <p>No other players found in this campaign.</p>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const props = defineProps<{
  campaignId: string;
}>();

const router = useRouter();
const players = ref<any[]>([]);

const navigateToUser = (userId: number) => {
  // Lembrete: a navegação depende do 'users_fk' ser retornado pela API.
  if (!userId) return;
  const encodedId = btoa(userId.toString());
  router.push({ name: "User", params: { id: encodedId } });
};

const fetchPlayers = async () => {
  if (!props.campaignId) return;
  try {
    const response = await axios.get("/rl_campaigns_users/list_players", {
      params: { campaigns_fk: props.campaignId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const playerData = response.data.Users || [];

    players.value = playerData.map((player: any) => ({
      ...player,
      image: player.picture_hash
        ? `https://druna-assets.s3.us-east-2.amazonaws.com/Profile/${player.picture_hash}`
        : "https://druna-assets.s3.us-east-2.amazonaws.com/Profile/user.png",
    }));
  } catch (error) {
    console.error("Error fetching campaign players:", error);
    players.value = [];
  }
};

onMounted(fetchPlayers);
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
</style>