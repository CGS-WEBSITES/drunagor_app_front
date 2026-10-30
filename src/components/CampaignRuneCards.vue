<template>
  <!-- Up to 3 cards on the Initiative Track: the ones in play, then one slot to add. -->
  <div v-if="!loading" class="rune-cards">
    <button
      v-for="(cardId, index) in selectedRuneCardIds"
      :key="cardId"
      type="button"
      class="rune-cards__card"
      @click="openViewer(index)"
    >
      <img :src="getCardImageById(cardId)" alt="Rune card" />
    </button>
    <button
      v-if="isAdmin && selectedRuneCardIds.length < MAX_CARDS"
      type="button"
      class="rune-cards__add"
      @click="openAddCardModal(selectedRuneCardIds.length)"
    >
      <v-icon size="28">mdi-plus</v-icon>
      <span>Add card</span>
    </button>
  </div>
  <div v-else class="text-center py-4">
    <v-progress-circular indeterminate color="white" size="24"></v-progress-circular>
  </div>

  <!-- A card in play, read at full size. -->
  <v-dialog v-model="viewer.visible" max-width="420">
    <v-card v-if="viewer.index !== null" class="rune-viewer rounded-xl">
      <img :src="getCardImageById(selectedRuneCardIds[viewer.index])" alt="Rune card" class="rune-viewer__img" />
      <div class="rune-viewer__actions">
        <v-btn v-if="isAdmin" variant="text" color="error" prepend-icon="mdi-delete-outline" class="text-none" @click="removeFromViewer">Remove</v-btn>
        <v-spacer />
        <v-btn v-if="isAdmin" variant="tonal" prepend-icon="mdi-swap-horizontal" class="text-none" @click="changeFromViewer">Change</v-btn>
        <v-btn variant="flat" color="playbutton" class="text-none font-weight-bold" @click="viewer.visible = false">Close</v-btn>
      </div>
    </v-card>
  </v-dialog>

  <!-- Card picker. -->
  <v-dialog v-model="isModalVisible" max-width="760" scrollable>
    <v-card class="rune-picker rounded-xl">
      <div class="rune-picker__head">
        <strong>Choose a card</strong>
        <v-btn icon="mdi-close" variant="text" @click="isModalVisible = false"></v-btn>
      </div>
      <v-card-text class="rune-picker__grid">
        <button
          v-for="card in availableCardsForModal"
          :key="card.id"
          type="button"
          class="rune-picker__card"
          @click="selectCard(card.id)"
        >
          <img :src="card.image" alt="Rune card" loading="lazy" />
        </button>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { CampaignStore } from "@/store/CampaignStore";

interface RuneCard {
  id: number;
  image: string;
}

const props = defineProps<{
  campaignId: string;
  campaignType: string;
}>();

const campaignStore = CampaignStore();

const MAX_CARDS = 3;
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

const viewer = ref<{ visible: boolean; index: number | null }>({ visible: false, index: null });
const openViewer = (index: number) => {
  viewer.value = { visible: true, index };
};
const changeFromViewer = () => {
  const index = viewer.value.index;
  viewer.value.visible = false;
  if (index !== null) viewOrChangeCard(index);
};
const removeFromViewer = () => {
  const index = viewer.value.index;
  viewer.value.visible = false;
  if (index !== null) removeCardByIndex(index);
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
.rune-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.rune-cards__card,
.rune-cards__add {
  aspect-ratio: 0.66;
  border-radius: 10px;
  overflow: hidden;
}
.rune-cards__card {
  padding: 0;
  background: #000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  transition: transform 0.15s ease;
}
.rune-cards__card:hover {
  transform: translateY(-2px);
}
.rune-cards__card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.rune-cards__add {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.04);
  border: 2px dashed rgba(255, 255, 255, 0.22);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  font-weight: 700;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.rune-cards__add:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.4);
}
.rune-viewer {
  background: rgb(var(--v-theme-surface)) !important;
}
.rune-viewer__img {
  display: block;
  width: 100%;
  height: auto;
}
.rune-viewer__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
}
.rune-picker {
  background: rgb(var(--v-theme-surface)) !important;
}
.rune-picker__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 8px 10px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 1rem;
}
.rune-picker__grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
  padding: 14px !important;
}
.rune-picker__card {
  display: block;
  padding: 0;
  overflow: hidden;
  background: #000;
  border: 2px solid transparent;
  border-radius: 10px;
  transition: border-color 0.15s ease;
}
.rune-picker__card:hover {
  border-color: rgb(var(--v-theme-accent));
}
.rune-picker__card img {
  display: block;
  width: 100%;
  aspect-ratio: 0.66;
  object-fit: cover;
}
</style>
