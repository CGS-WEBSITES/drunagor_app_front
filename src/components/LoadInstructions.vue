<template>
  <!-- Progress (dots) -->
  <v-progress-linear
    :model-value="(currentStep / steps.length) * 100"
    height="4"
    color="white"
    rounded
  />

  <!-- Step content -->
  <v-window v-model="currentStep" class="mt-2 mb-9">
    <v-window-item :value="1">
      <div class="step-content">
        <h3 class="step-title">1 - Initial Setup</h3>
        <p class="step-description mb-4">
          We're glad to have you back, dear Adventurers! These instructions will
          help you restart the Campaign exactly where you left off.
        </p>
        <v-alert type="info" variant="tonal" class="mb-4 custom-alert">
          Make sure all Trays, Maps, and Doors of the Adventure are already set
          up in their respective places.
        </v-alert>
        <p class="step-description mb-2">
          Open the "Campaign Log" tab in your Chronicles of Drunagor App, check
          which Heroes are in your Party, and gather the appropriate components:
        </p>
        <v-list density="compact" class="mb-4 custom-list">
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              Model, Hero Board, Initiative card, Hero Skill cards, and Class
              Ability cards for each Hero in your Party
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-window-item>

    <!-- Step 2: Initiative Track Setup -->
    <v-window-item :value="2">
      <div class="step-content">
        <h3 class="step-title">2 - Initiative Track Setup</h3>
        <v-list density="compact" class="mb-4 custom-list">
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              If there is a record of Runes on the Initiative Track, draw the
              indicated number of Runes and place them back on the Track
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              If there are any Rune, Game State Check-Up, and/or Game Mechanics
              cards, place them in the appropriate positions on the Initiative
              Track
            </v-list-item-title>
          </v-list-item>
        </v-list>
        <v-alert type="warning" variant="tonal" class="mb-4 custom-alert">
          <strong>Card Placement Rules:</strong>
          <div class="mt-2">
            All cards go at the bottom end of the Track, in the Rune Slot,
            except for the Monster Raid Game Mechanic card, which goes on top of
            this same Slot.
          </div>
          <div class="mt-2">
            <strong>Correct order:</strong> Game Mechanics go on top of Rune
            cards, which in turn go on top of Game State Check-Up cards.
          </div>
        </v-alert>
      </div>
    </v-window-item>

    <!-- Step 3: Manage Resources -->
    <v-window-item :value="3">
      <div class="step-content">
        <h3 class="step-title">3 - Manage Resources</h3>
        <p class="step-description mb-2">
          Click the "Manage Resources" button and assign the following
          components to each Hero:
        </p>
        <v-list density="compact" class="mb-4 custom-list">
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              Number of SHIELDS, FOCUS, KI, FURY, FRUIT OF LIFE, and any other
              tokens defined as Resources
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              Which Consumable Items (if any) are in the Hero's Backpack
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              Which Equipment the Hero is wielding in each of their equipment
              slots
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-window-item>

    <!-- Step 4: Hero Skills and Class Skills -->
    <v-window-item :value="4">
      <div class="step-content">
        <h3 class="step-title">4 - Hero Skills and Class Skills</h3>
        <p class="step-description mb-2">
          Click the "Hero Skills and Class Skills" button and assign each Hero
          the Abilities they've learned in previous sessions:
        </p>
        <v-list density="compact" class="mb-4 custom-list">
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              Which Dungeon Role the Hero is fulfilling
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              Which Level 1 Skills the Hero has
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              Which Level 2 Skills the Hero has
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              Which Class Abilities the Hero has
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-window-item>

    <!-- Step 5: Adjust Hero Game State -->
    <v-window-item :value="5">
      <div class="step-content">
        <h3 class="step-title">5 - Adjust Hero Game State</h3>
        <p class="step-description mb-2">
          Adjust each Hero's Game State as recorded in the Campaign Log:
        </p>
        <v-list density="compact" class="mb-4 custom-list">
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              <strong>Available Action Cubes:</strong> Check their Initiative
              card to see their starting amount, then give them the appropriate
              Cubes based on the Hero Skills they've learned
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              <strong>Action Cubes allocation:</strong> How many Action Cubes
              are allocated to Skills or Expended. You may place all of them in
              the Expended Cube Box. Heroes resume the game with all Hero Skills
              unassigned
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              <strong>Curse and Trauma Cubes:</strong> How many Curse and Trauma
              Cubes the Hero has. Curse Cubes or Trauma Cubes can be placed in
              any Hero or Role Skill. No need to repeat those selected in the
              previous session
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              Hero's current Health
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-window-item>

    <!-- Step 6: Final Setup and Resume -->
    <v-window-item :value="6">
      <div class="step-content">
        <h3 class="step-title">6 - Final Setup and Resume</h3>
        <p class="step-description mb-2">Once all Hero information is set:</p>
        <v-list density="compact" class="mb-4 custom-list">
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              Place Heroes back on the board. Each Hero may reposition their
              Model to a space within Range 1 of the Door listed as "Next Door"
              in their Campaign Log
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              At least one Hero must be adjacent to the Next Door to open it
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              Open that Door and build its Setup
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              Return the Initiative marker to the first card on the Track
            </v-list-item-title>
          </v-list-item>
        </v-list>
        <v-alert type="success" variant="tonal" class="mt-6 custom-alert">
          <div class="alert-title">Resume the game!</div>
          <div class="mt-2">That's it! Resume the game!</div>
        </v-alert>
      </div>
    </v-window-item>
  </v-window>

  <!-- Custom Navigation Controls -->
  <div class="navigation-controls">
    <v-btn
      @click="previousStep"
      :disabled="currentStep === 1"
      variant="elevated"
      color="primary"
      class="nav-btn nav-btn-mobile"
      size="x-small"
    >
      <v-icon size="14">mdi-chevron-left</v-icon>
    </v-btn>

    <div class="step-indicator">{{ currentStep }} / {{ steps.length }}</div>

    <v-btn
      @click="nextStep"
      :disabled="currentStep === steps.length"
      variant="elevated"
      color="primary"
      class="nav-btn nav-btn-mobile"
      size="x-small"
    >
      <v-icon size="14">mdi-chevron-right</v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref, watch } from "vue";

const steps = [
  "Initial Setup",
  "Initiative Track Setup",
  "Manage Resources",
  "Hero Skills and Class Skills",
  "Adjust Hero Game State",
  "Final Setup and Resume",
];

const emit = defineEmits<{
  save: [];
  "instruction-changed": [step: number];
  close: [];
}>();

const currentStep = ref(1);

const setCurrentStep = (step: number) => {
  if (step >= 1 && step <= steps.length) {
    currentStep.value = step;
  }
};

const nextStep = () => {
  if (currentStep.value < steps.length) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

defineExpose({
  setCurrentStep,
});

const onStepChange = (value: unknown) => {
  const step = Number(value);
  if (!isNaN(step) && step >= 1 && step <= steps.length) {
    emit("instruction-changed", step);
  }
};

watch(
  currentStep,
  (newStep) => {
    emit("instruction-changed", newStep);
  },
  { immediate: true },
);
</script>

<style scoped>
.custom-stepper {
  width: 100%;
  background: transparent;
}

.step-title {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
  word-wrap: break-word;
  margin-bottom: 16px;
}

.step-description {
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;
}

.custom-list {
  width: 100%;
}

.custom-list-item {
  min-height: 36px;
  padding: 4px 0;
  align-items: flex-start;
}

.list-item-text {
  white-space: normal !important;
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
  line-height: 1.3 !important;
  font-size: 0.85rem;
  text-overflow: unset !important;
  overflow: visible !important;
}

.custom-alert {
  font-size: 0.85rem;
  line-height: 1.3;
}

.custom-alert .v-alert__content {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.alert-title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
}

.scroll-container {
  position: relative;
  overflow-y: auto;
}

.navigation-controls[data-v-3891221b] {
  position: absolute;
  bottom: 0;
  left: 15px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(var(--v-theme-surface), 0.95);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(var(--v-theme-outline), 0.12);
  margin-top: 16px;
}

.nav-btn {
  min-width: 40px !important;
  width: 40px;
  height: 40px;
  border-radius: 50% !important;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
}

.nav-btn:hover:not(:disabled) {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3) !important;
}

.nav-btn:disabled {
  opacity: 0.4 !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
}

.step-indicator {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgb(var(--v-theme-secndary));
  background: rgba(var(--v-theme-primary), 0.1);
  padding: 8px 16px;
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

@media (max-width: 960px) {
  .step-title {
    font-size: 0.9rem;
  }

  .step-description {
    font-size: 0.8rem;
  }

  .list-item-text {
    font-size: 0.8rem;
  }

  .custom-alert {
    font-size: 0.8rem;
  }

  .alert-title {
    font-size: 1rem;
  }

  .navigation-controls {
    padding: 5px 6px;
  }

  .nav-btn {
    min-width: 38px !important;
    width: 38px;
    height: 38px;
  }

  .nav-btn-mobile .v-icon {
    font-size: 18px !important;
  }
}

@media (max-width: 600px) {
  .step-title {
    font-size: 0.85rem;
    line-height: 1.3;
  }

  .step-description {
    font-size: 0.75rem;
    line-height: 1.3;
  }

  .list-item-text {
    font-size: 0.75rem !important;
    line-height: 1.2 !important;
    padding-right: 8px;
  }

  .custom-alert,
  .custom-alert .v-alert__content {
    font-size: 0.75rem !important;
    line-height: 1.2 !important;
  }

  .alert-title {
    font-size: 0.9rem;
  }

  .custom-list-item {
    min-height: 32px;
    padding: 2px 0;
  }

  .navigation-controls {
    padding: 8px 10px;
  }

  .nav-btn {
    min-width: 36px !important;
    width: 36px;
    height: 36px;
  }

  .nav-btn-mobile .v-icon {
    font-size: 16px !important;
  }

  .step-indicator {
    font-size: 0.8rem;
    padding: 4px 10px;
  }

  :deep(.v-stepper__header) {
    overflow-x: auto;
    padding-bottom: 8px;
    gap: 4px;
  }

  :deep(.v-stepper__step) {
    flex: 0 0 auto;
    min-width: 48px;
    padding: 4px 2px;
  }

  :deep(.v-stepper__label) {
    font-size: 0.65rem !important;
    line-height: 1.1 !important;
    white-space: normal !important;
    word-wrap: break-word !important;
    text-align: center;
    max-width: 60px;
  }

  :deep(.v-stepper__step .v-stepper__label) {
    text-overflow: unset !important;
    overflow: visible !important;
  }
}

@media (max-width: 480px) {
  .step-title {
    font-size: 0.8rem;
  }

  .step-description {
    font-size: 0.7rem;
  }

  .list-item-text {
    font-size: 0.7rem !important;
  }

  .custom-alert,
  .custom-alert .v-alert__content {
    font-size: 0.7rem !important;
  }

  .alert-title {
    font-size: 0.85rem;
  }

  .navigation-controls {
    padding: 6px 8px;
  }

  .nav-btn {
    min-width: 34px !important;
    width: 34px;
    height: 34px;
  }

  .nav-btn-mobile .v-icon {
    font-size: 14px !important;
  }

  .step-indicator {
    font-size: 0.75rem;
    padding: 4px 8px;
  }

  :deep(.v-stepper__label) {
    font-size: 0.6rem !important;
    max-width: 50px;
  }
}

* {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

:deep(.v-list-item-title),
:deep(.v-alert__content),
:deep(.v-stepper__label),
:deep(.v-alert ul li) {
  white-space: normal !important;
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
  text-overflow: unset !important;
  overflow: visible !important;
}

:deep(.v-alert div),
:deep(.v-alert strong) {
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>
