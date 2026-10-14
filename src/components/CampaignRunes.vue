<template>
  <!-- Runes counter: one big number between − and +. -->
  <div class="runes-counter" :class="{ 'runes-counter--loading': loading }">
    <button
      type="button"
      class="runes-counter__btn"
      :disabled="!isAdmin || loading || runes <= 0"
      aria-label="One rune less"
      @click="runes = Math.max(0, runes - 1)"
    >
      <v-icon>mdi-minus</v-icon>
    </button>
    <div class="runes-counter__value">
      <img :src="runeTokenIcon" alt="" class="runes-counter__icon" />
      <div>
        <strong>{{ loading ? "–" : runes }}</strong>
        <small>{{ runesLabel }}</small>
      </div>
    </div>
    <button
      type="button"
      class="runes-counter__btn"
      :disabled="!isAdmin || loading"
      aria-label="One rune more"
      @click="runes = runes + 1"
    >
      <v-icon>mdi-plus</v-icon>
    </button>
  </div>
</template>

<script setup lang="ts">
import { CampaignStore } from "@/store/CampaignStore";
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import runeTokenIcon from "@/assets/setup/rune-token.webp";

const props = defineProps<{
  campaignId: string;
}>();

const { t } = useI18n();
const campaignStore = CampaignStore();

// "Number of runes:" without the colon.
const runesLabel = computed(() => t("text.number-of-runes").replace(/:\s*$/, ""));

const isAdmin = ref(false);
const loading = ref(true);

const runes = computed({
  get() {
    return campaignStore.find(props.campaignId)?.sequentialAdventureRunes ?? 0;
  },
  set(newValue) {
    if (isAdmin.value) {
      campaignStore.updateCampaignProperty(props.campaignId, 'sequentialAdventureRunes', newValue);
    }
  },
});

const checkUserRole = async () => {
  isAdmin.value = true;
  loading.value = false;
};

onMounted(checkUserRole);
</script>

<style scoped>
.runes-counter {
  display: flex;
  align-items: center;
  gap: 10px;
}
.runes-counter__btn {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  color: #fff;
  transition: background 0.15s ease;
}
.runes-counter__btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.16);
}
.runes-counter__btn:disabled {
  opacity: 0.35;
  cursor: default;
}
.runes-counter__value {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-width: 0;
}
.runes-counter__icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.runes-counter__value > div {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.runes-counter__value strong {
  font-family: "Poppins", sans-serif;
  font-size: 2rem;
  font-weight: 800;
}
.runes-counter__value small {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.72rem;
  font-weight: 600;
}
.runes-counter--loading {
  opacity: 0.6;
}
</style>
