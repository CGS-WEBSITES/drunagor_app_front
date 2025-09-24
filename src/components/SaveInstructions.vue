<template>
  <div class="save-instructions-wrapper">
    <div class="text-center pa-4">
      <v-btn
        @click="startSaveInstructions"
        color="success"
        variant="elevated"
        size="large"
        rounded
        :loading="isStarting"
        class="save-instructions-trigger"
      >
        <v-icon start>mdi-content-save-outline</v-icon>
        Start Save Instructions
      </v-btn>
      <p class="text-caption mt-2 text-grey-400">
        Interactive guide to help you save your campaign progress
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref } from "vue";
import { useSaveCampaignTour } from "@/components/Composable/useSaveCampaignTour";

const emit = defineEmits<{
  save: [];
  "instruction-changed": [step: number];
  close: [];
  "action-click": [action: string];
}>();

const isStarting = ref(false);
const saving = ref(false);

const props = defineProps<{
  campaignId?: string;
}>();

const handleSaveClick = async () => {
  saving.value = true;
  emit("save");
  setTimeout(() => {
    saving.value = false;
  }, 5000);
};

const handleManageResourcesClick = () => {
  emit("action-click", "manage-resources");
};

const handleEquipmentSkillsClick = () => {
  emit("action-click", "equipment-skills");
};

const { startSaveTour, destroyTour, isActive } = useSaveCampaignTour({
  onSaveClick: handleSaveClick,
  onManageResourcesClick: handleManageResourcesClick,
  onEquipmentSkillsClick: handleEquipmentSkillsClick,
  campaignId: props.campaignId || "default",
});

const startSaveInstructions = async () => {
  isStarting.value = true;
  try {
    await startSaveTour();
    emit("instruction-changed", 1);
  } catch (error) {
    console.error("[SaveInstructions] Erro ao iniciar tour:", error);
  } finally {
    isStarting.value = false;
  }
};

const setCurrentStep = (step: number) => {
  emit("instruction-changed", step);
};

const resetLoading = () => {
  saving.value = false;
};

defineExpose({
  setCurrentStep,
  startSaveInstructions,
  resetLoading,
  destroyTour,
  isActive,
});
</script>

<style scoped>
.save-instructions-wrapper {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.save-instructions-trigger {
  transition: all 0.3s ease;
  min-width: 240px;
}

.save-instructions-trigger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(var(--v-theme-success), 0.4) !important;
}

.save-instructions-trigger:disabled {
  opacity: 0.6;
}

@media (max-width: 600px) {
  .save-instructions-trigger {
    min-width: 200px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .save-instructions-wrapper {
    min-height: 150px;
  }

  .save-instructions-trigger {
    min-width: 180px;
    font-size: 0.85rem;
  }
}
</style>
