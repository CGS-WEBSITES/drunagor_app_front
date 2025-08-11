<template>
  <v-container>

    <v-row justify="center" class="mt-0">
      <v-col cols="auto">
        <v-btn color="secundary" @click="isDialogOpen = true">
          Select Rune and Game Mechanics Cards
        </v-btn>
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-col cols="5" sm="4" md="3">
        <v-card
          :variant="detailedSelectedCards[0] ? 'elevated' : 'tonal'"
          class="d-flex align-center justify-center card-slot"
          min-height="200"
        >
          <v-img
            v-if="detailedSelectedCards[0]"
            :src="getImageUrl(detailedSelectedCards[0].id)"
            aspect-ratio="0.7"
            cover
            class="rounded-lg"
          />
          <div v-else class="text-center text-grey">
            <v-icon size="large">mdi-cards-outline</v-icon>
            <div class="text-caption mt-2">Slot 1</div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="5" sm="4" md="3">
        <v-card
          :variant="detailedSelectedCards[1] ? 'elevated' : 'tonal'"
          class="d-flex align-center justify-center card-slot"
          min-height="200"
        >
          <v-img
            v-if="detailedSelectedCards[1]"
            :src="getImageUrl(detailedSelectedCards[1].id)"
            aspect-ratio="0.7"
            cover
            class="rounded-lg"
          />
          <div v-else class="text-center text-grey">
            <v-icon size="large">mdi-cards-outline</v-icon>
            <div class="text-caption mt-2">Slot 2</div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="isDialogOpen" max-width="900px" scrollable>
    <v-card>
      <v-card-title class="text-h5">
        Select up to 2 Cards
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-row>
          <v-col
            v-for="card in allCards"
            :key="card.id"
            cols="6"
            sm="4"
            md="3"
          >
            <v-card
              @click="toggleDraftSelection(card.id)"
              class="gallery-card"
              :class="{ 'selected-card': isDraftSelected(card.id) }"
              :disabled="!isDraftSelected(card.id) && draftSelectedIds.length >= 2"
              variant="flat"
            >
              <v-img :src="getImageUrl(card.id)" aspect-ratio="0.7" cover>
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate />
                  </div>
                </template>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="isDialogOpen = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from "vue";
import { CampaignStore } from "@/store/CampaignStore";

const assets = "https://druna-assets.s3.us-east-2.amazonaws.com";

const props = defineProps<{
  campaignId: string;
  onSave: () => Promise<void>;
}>();

const isDialogOpen = ref(false);
const draftSelectedIds = ref<number[]>([]);

const campaignStore = CampaignStore();
const campaign = computed(() => campaignStore.find(props.campaignId));

const allCards = [
  { id: 1, title: "RECALL ACTIONS" }, { id: 2, title: "FOLDING DOORS" }, { id: 3, title: "INTERACTIONS" }, { id: 4, title: "HAIL TO HIS MAJESTY" }, { id: 5, "title": "AGE OF DARKNESS" }, { id: 6, title: "INTO THE UNDERKEEP" }, { id: 7, title: "END OF THE ROUND" }, { id: 8, title: "THE BARRICADE" }, { id: 9, title: "GROWING DARKNESS - SIDE A" }, { id: 10, title: "GROWING DARKNESS - SIDE B" }, { id: 11, title: "DARKNESS HUNTING - SIDE A" }, { id: 12, title: "DARKNESS HUNTING - SIDE B" }, { id: 13, title: "DRAINAGE (OPEN)" }, { id: 14, title: "DRAINAGE (CLOSED)" }, { id: 15, title: "MONSTER RAID - SIDE A" }, { id: 16, title: "MONSTER RAID - SIDE B" },
];

watch(isDialogOpen, (isOpen) => {
  if (isOpen) {
    draftSelectedIds.value = campaign.value ? [...campaign.value.runeCardIds] : [];
  } else {
    if (campaign.value) {
      campaign.value.runeCardIds.length = 0;
      campaign.value.runeCardIds.push(...draftSelectedIds.value);

      nextTick(() => {
        props.onSave();
      });
    }
  }
});

const getImageUrl = (id: number) => {
  return assets + `/CampaignTracker/Runes%26GM/rune-${id}.jpg`;
};

const isDraftSelected = (cardId: number) => {
  return draftSelectedIds.value.includes(cardId);
};

const toggleDraftSelection = (cardId: number) => {
  const isCurrentlySelected = isDraftSelected(cardId);
  if (isCurrentlySelected) {
    draftSelectedIds.value = draftSelectedIds.value.filter(id => id !== cardId);
  } else if (draftSelectedIds.value.length < 2) {
    draftSelectedIds.value.push(cardId);
  }
};

const detailedSelectedCards = computed(() => {
  if (!campaign.value) return [];
  return campaign.value.runeCardIds
    .map(id => allCards.find(card => card.id === id))
    .filter((card): card is NonNullable<typeof card> => card !== undefined);
});
</script>

<style scoped>
.gallery-card {
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.2s ease-in-out;
  opacity: 0.7;
}
.gallery-card:hover {
  opacity: 1;
  transform: scale(1.05);
}
.gallery-card.selected-card {
  border-color: #1E88E5;
  opacity: 1;
  transform: scale(1.05);
}
.gallery-card[disabled] {
  cursor: not-allowed;
  opacity: 0.3;
}
.card-slot {
  transition: all 0.2s ease-in-out;
}
</style>