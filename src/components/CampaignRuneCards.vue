<template>
  <v-card class="pa-0" variant="flat" color="transparent">
    <div class="text-caption px-0 pb-1 text-grey-lighten-1 text-center font-weight-medium">
      Rune, Game Mechanics & State Cards
    </div>
    
    <div class="pa-0">
      <div v-if="!loading">
        <v-row dense justify="center" class="ma-0">
          <v-col v-for="slot in 3" :key="slot" cols="4" class="pa-1">
            <div class="position-relative" v-if="selectedRuneCardIds[slot - 1]">
              <v-responsive aspect-ratio="0.66">
                <v-card
                  @click="isAdmin ? viewOrChangeCard(slot - 1) : null"
                  class="mx-auto fill-height rounded-lg border-thin"
                  hover
                  variant="flat"
                  color="transparent"
                >
                  <v-img 
                    :src="getCardImageById(selectedRuneCardIds[slot - 1])" 
                    cover 
                    alt="Selected Rune Card"
                    class="fill-height rounded-lg"
                  ></v-img>
                </v-card>
              </v-responsive>
              <v-btn
                v-if="isAdmin"
                icon
                size="x-small"
                color="red-darken-2"
                class="remove-card-btn"
                elevation="4"
                @click.stop="removeCardByIndex(slot - 1)"
                style="position: absolute; bottom: 4px; right: 4px; z-index: 2; width: 24px; height: 24px;"
              >
                <v-icon size="14">mdi-close</v-icon>
              </v-btn>
            </div>
            
            <v-responsive v-else aspect-ratio="0.66">
               <v-card
                @click="isAdmin ? openAddCardModal(slot - 1) : null"
                style="border: 2px dashed rgba(255,255,255,0.3); background-color: rgba(255,255,255,0.05);"
                class="d-flex justify-center align-center fill-height rounded-lg"
                :hover="isSlotEnabled(slot - 1)"
                :disabled="!isSlotEnabled(slot - 1)"
              >
                <v-icon v-if="isSlotEnabled(slot - 1)" size="large" color="grey-lighten-1">mdi-plus</v-icon>
                <v-icon v-else size="large" color="grey-darken-2">mdi-lock-outline</v-icon>
              </v-card>
            </v-responsive>
          </v-col>
        </v-row>
      </div>

      <div v-else class="text-center py-4">
         <v-progress-circular indeterminate color="white" size="24"></v-progress-circular>
      </div>
    </div>
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
  campaignType: string;
}>();

const { t } = useI18n();
const userStore = useUserStore();
const campaignStore = CampaignStore();

const isAdmin = ref(false);
const loading = ref(true);
const isModalVisible = ref(false);
const editingSlotIndex = ref<number | null>(null);

const allRuneCards = ref<RuneCard[]>([]); 

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
  isAdmin.value = true;
  loading.value = false;
};

onMounted(() => {
  checkUserRole();

  const baseUrl = 'https://assets.drunagor.app/CampaignTracker/';
  const isSeason2 = props.campaignType === 'underkeep2';
  
  const folder = isSeason2 ? 'Runes&GM2' : 'Runes&GM';
  const cardCount = isSeason2 ? 44 : 16;

  allRuneCards.value = Array.from({ length: cardCount }, (_, i) => ({
    id: i + 1,
    image: `${baseUrl}${folder}/rune-${i + 1}.jpg`
  }));
});
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

