<template>
  <div>
    <v-dialog v-model="removeDialog" max-width="400">
      <v-card>
        <v-card-title>Remove Players</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="player in players"
              :key="player.rl_campaigns_users_pk"
              @click="confirmPlayerRemoval(player)"
              class="cursor-pointer"
            >
              <v-list-item-avatar>
                <v-img
                  :src="
                    player.picture_hash ? `/images/${player.picture_hash}` : ''
                  "
                />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ player.user_name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="removeDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmRemoveDialog" max-width="300">
      <v-card>
        <v-card-title class="headline">Confirmation</v-card-title>
        <v-card-text>
          Do you want to delete the player
          <strong>{{ playerToRemove?.user_name }}</strong
          >?
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="confirmRemoveDialog = false">No</v-btn>
          <v-spacer />
          <v-btn
            color="success"
            :loading="removingLoading"
            :disabled="removingLoading"
            @click="removePlayer"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn
      variant="elevated"
      id="campaign-removed-player"
      rounded
      v-if="showSaveCampaignButton"
      @click="removeDialog = true"
    >
      <v-icon left class="mr-2">mdi-account-remove</v-icon>
        Remove Players
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";

interface Player {
  rl_campaigns_users_pk: number;
  user_name: string;
  picture_hash: string | null;
}

const props = defineProps<{
  campaignId: string;
  showSaveCampaignButton: boolean;
}>();

const emit = defineEmits<{
  (e: "playersRemoved"): void;
}>();

const players = ref<Player[]>([]);
const removeDialog = ref(false);
const confirmRemoveDialog = ref(false);
const playerToRemove = ref<Player | null>(null);
const removingLoading = ref(false);
const toast = useToast();

const fetchPlayers = async () => {
  try {
    const { data } = await axios.get("rl_campaigns_users/list_players", {
      params: { campaigns_fk: props.campaignId },
    });
    players.value = data.Users;
  } catch (error) {
    console.error("Failed to fetch players:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to load players",
    });
  }
};

onMounted(fetchPlayers);

const confirmPlayerRemoval = (player: Player) => {
  playerToRemove.value = player;
  confirmRemoveDialog.value = true;
};

const removePlayer = async () => {
  if (!playerToRemove.value) return;
  removingLoading.value = true;
  try {
    await axios.delete(
      `rl_campaigns_users/${playerToRemove.value.rl_campaigns_users_pk}/delete/`,
    );
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Player removed",
    });
    await fetchPlayers();
    emit("playersRemoved");
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to remove player",
    });
  } finally {
    removingLoading.value = false;
    confirmRemoveDialog.value = false;
    removeDialog.value = false;
  }
};
</script>

<style scoped>
.cursor-pointer:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>
