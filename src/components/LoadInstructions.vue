<template>
  <div class="load-instructions-wrapper">
    <div class="text-center pa-4">
      <v-btn
        @click="startLoadInstructions"
        color="primary"
        variant="elevated"
        size="large"
        rounded
        :loading="isStarting"
        class="load-instructions-trigger"
      >
        <v-icon start>mdi-lightbulb-on-outline</v-icon>
        Start Load Instructions
      </v-btn>
      <p class="text-caption mt-2 text-grey-400">
        Interactive guide to help you resume your campaign
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref } from "vue";
import { useLoadCampaignTour } from "@/components/Composable/useLoadCampaignTour";

const emit = defineEmits<{
  "instruction-changed": [step: number];
  close: [];
  "action-click": [action: string];
}>();

const isStarting = ref(false);

const props = defineProps<{
  campaignId?: string;
}>();

const handleManageResourcesClick = () => {
  emit("action-click", "manage-resources");
};

const handleEquipmentSkillsClick = () => {
  emit("action-click", "equipment-skills");
};

const { startLoadTour, destroyTour, isActive } = useLoadCampaignTour({
  onManageResourcesClick: handleManageResourcesClick,
  onEquipmentSkillsClick: handleEquipmentSkillsClick,
  campaignId: props.campaignId || "default",
});

const startLoadInstructions = async () => {
  isStarting.value = true;
  try {
    await startLoadTour();
    emit("instruction-changed", 1);
  } catch (error) {
    console.error("[LoadInstructions] Erro ao iniciar tour:", error);
  } finally {
    isStarting.value = false;
  }
};

const setCurrentStep = (step: number) => {
  emit("instruction-changed", step);
};

defineExpose({
  setCurrentStep,
  startLoadInstructions,
  destroyTour,
  isActive,
});
</script>

<style scoped>
.load-instructions-wrapper {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.load-instructions-trigger {
  transition: all 0.3s ease;
  min-width: 240px;
}

.load-instructions-trigger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.4) !important;
}

.load-instructions-trigger:disabled {
  opacity: 0.6;
}

@media (max-width: 600px) {
  .load-instructions-trigger {
    min-width: 200px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .load-instructions-wrapper {
    min-height: 150px;
  }

  .load-instructions-trigger {
    min-width: 180px;
    font-size: 0.85rem;
  }
}
</style>
