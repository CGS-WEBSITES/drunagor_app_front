<template>
  <v-card class="pa-2" color="primary">
    <v-card-title class="text-h6 pb-">
      Select Rune, Game Mechanics and Game State Cards
    </v-card-title>
    
    <v-card-text>
      <div v-if="!loading">
        <v-row dense justify="center">
          <v-col v-for="slot in 3" :key="slot" cols="4">
            <div class="position-relative" v-if="selectedRuneCardIds[slot - 1]">
              <v-card
                @click="isAdmin ? viewOrChangeCard(slot - 1) : null"
                class="mx-auto"
                hover
              >
                <v-img 
                  :src="getCardImageById(selectedRuneCardIds[slot - 1])" 
                  cover 
                  alt="Selected Rune Card"
                  aspect-ratio="0.75"
                ></v-img>
              </v-card>
              <v-btn
                v-if="isAdmin"
                icon
                size="x-small"
                color="red-darken-2"
                class="remove-card-btn"
                elevation="4"
                @click.stop="removeCardByIndex(slot - 1)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
            
            <v-responsive v-else aspect-ratio="0.75">
               <v-card
                @click="isAdmin ? openAddCardModal(slot - 1) : null"
                style="border: 2px dashed grey"
                class="d-flex justify-center align-center fill-height"
                :hover="isSlotEnabled(slot - 1)"
                :disabled="!isSlotEnabled(slot - 1)"
              >
                <v-icon v-if="isSlotEnabled(slot - 1)" size="x-large" color="grey">mdi-plus</v-icon>
                <v-icon v-else size="x-large" color="grey-darken-2">mdi-lock-outline</v-icon>
              </v-card>
            </v-responsive>
          </v-col>
        </v-row>
      </div>

      <div v-else>
         <v-progress-linear indeterminate color="white"></v-progress-linear>
      </div>
    </v-card-text>
  </v-card>

  <v-dialog v-model="isModalVisible" max-width="90vw" scrollable>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ t('label.select-card') }}</span>
        <v-btn v-if="editingSlotIndex !== null && selectedRuneCardIds[editingSlotIndex]" icon="mdi-delete-outline" variant="text" color="error" @click="removeCardFromModal"></v-btn>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col
            v-for="card in availableCardsForModal"
            :key="card.id"
            cols="6" sm="4" md="3" lg="2"
          >
            <v-card @click="selectCard(card.id)" hover>
              <v-img :src="card.image" aspect-ratio="0.65" alt="Rune Card"></v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import { CampaignStore } from "@/store/CampaignStore";
import { useUserStore } from "@/store/UserStore";

interface RuneCard {
  id: number;
  image: string;
}

const props = defineProps<{
  campaignId: string;
}>();

const { t } = useI18n();
const userStore = useUserStore();
const campaignStore = CampaignStore();

const isAdmin = ref(false);
const loading = ref(true);
const isModalVisible = ref(false);
const editingSlotIndex = ref<number | null>(null);

const allRuneCards = ref<RuneCard[]>(
  Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    image: `https://assets.drunagor.app/CampaignTracker/Runes%26GM/rune-${i + 1}.jpg`
  }))
);

const selectedRuneCardIds = computed({
  get() {
    return campaignStore.find(props.campaignId)?.runeCardIds ?? [];
  },
  set(newValue: number[]) {
    if (isAdmin.value) {
      const sortedValue = newValue.filter(id => id !== null && id !== undefined);
      campaignStore.updateCampaignProperty(props.campaignId, 'runeCardIds', sortedValue);
    }
  },
});

const availableCardsForModal = computed(() => {
  return allRuneCards.value.filter(card => !selectedRuneCardIds.value.includes(card.id));
});

const isSlotEnabled = (slotIndex: number): boolean => {
  if (!isAdmin.value) return false;
  if (slotIndex === 0) return true;
  return selectedRuneCardIds.value[slotIndex - 1] != null;
};

const getCardImageById = (cardId: number): string => {
  return allRuneCards.value.find(c => c.id === cardId)?.image ?? '';
};

const openAddCardModal = (slotIndex: number) => {
  if (!isSlotEnabled(slotIndex)) return;
  editingSlotIndex.value = slotIndex;
  isModalVisible.value = true;
};

const viewOrChangeCard = (slotIndex: number) => {
    editingSlotIndex.value = slotIndex;
    isModalVisible.value = true;
}

const selectCard = (cardId: number) => {
  if (editingSlotIndex.value === null) return;
  
  const newSelection = [...selectedRuneCardIds.value];
  newSelection[editingSlotIndex.value] = cardId;
  
  selectedRuneCardIds.value = newSelection;
  isModalVisible.value = false;
  editingSlotIndex.value = null;
};

const removeCardFromModal = () => {
  if (editingSlotIndex.value === null) return;
  removeCardByIndex(editingSlotIndex.value);
  isModalVisible.value = false;
  editingSlotIndex.value = null;
};

const removeCardByIndex = (index: number) => {
  if (index < 0 || index >= selectedRuneCardIds.value.length) return;
  
  const newSelection = [...selectedRuneCardIds.value];
  newSelection.splice(index, 1);
  
  selectedRuneCardIds.value = newSelection;
};


const checkUserRole = async () => {
  try {
    const response = await axios.get("rl_campaigns_users/search", {
      params: { 
        users_fk: userStore.user?.users_pk, 
        campaigns_fk: props.campaignId 
      },
    });
    isAdmin.value = response.data.campaigns[0]?.party_role === "Admin";
  } catch (error) {
    console.error("CampaignRuneCards - Error fetching user role:", error);
    isAdmin.value = false;
  } finally {
    loading.value = false;
  }
};

onMounted(checkUserRole);
</script>

<style scoped>
.v-card--disabled {
  background-color: rgba(60, 60, 60, 0.5);
  cursor: not-allowed;
  border-color: grey;
}

.remove-card-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  z-index: 2;
}
</style>

