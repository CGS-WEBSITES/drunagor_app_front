<template>
  <v-progress-linear
    :model-value="(currentStep / steps.length) * 100"
    height="4"
    color="white"
    rounded
  />

  <v-window v-model="currentStep" class="mt-2 mb-9">
    <v-window-item :value="1">
      <div class="step-content">
        <h3 class="step-title">1 - Save Conditions</h3>
        <p class="step-description mb-4">
          You're done with this game session and it's time to save your Party's
          progress. To do so, ensure that:
        </p>
        <v-list density="compact" class="mb-4 custom-list">
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              No Monsters are alive
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              The Initiative marker is on the End of the Round Game State
              Check-Up card, at the end of the Initiative Track
            </v-list-item-title>
          </v-list-item>
        </v-list>
        <v-alert type="info" variant="tonal" class="mb-4 custom-alert">
          If both conditions are met, you can save your Party's progress by
          first adjusting the board
        </v-alert>
      </div>
    </v-window-item>

    <v-window-item :value="2">
      <div class="step-content">
        <h3 class="step-title">2 - Adjusting the Board</h3>
        <v-list density="compact" class="mb-4 custom-list">
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              Remove any Chests and Interaction tokens (if any) left on the
              board. They are lost forever.
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              Return any Runes that are on the board (if any) to the Initiative
              Track. Stacks left behind cannot be recovered.
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-window-item>

    <v-window-item :value="3">
      <div class="step-content">
        <h3 class="step-title">3 - Game State Information</h3>
        <p class="step-description mb-2">
          Next, open the "Campaign Log" tab in your Chronicles of Drunagor App
          and record the following Game State information:
        </p>
        <v-list density="compact" class="mb-4 custom-list">
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              Record which Adventure will be played in the next session. If this
              one hasn't been completed yet, it remains the same. Otherwise, it
              will be the next one.
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              Record which Door will be opened next by the Party in that
              Adventure. If you're finishing an Adventure now, select the "First
              Setup" of the next Adventure.
            </v-list-item-title>
          </v-list-item>
        </v-list>
        <v-alert type="warning" variant="tonal" class="mb-4 custom-alert">
          These two steps should only be followed if you haven't completed the
          current Adventure and are saving the game between rooms. Otherwise,
          you may skip them.
        </v-alert>
        <v-list density="compact" class="mb-4 custom-list">
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              Record the number of Runes on the Initiative Track. You don't need
              to specify their color, only the total number.
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="custom-list-item">
            <v-list-item-title class="list-item-text">
              Record which Rune, Game State Check-Up, and Game Mechanics cards
              are on the Initiative Track.
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-window-item>

    <v-window-item :value="4">
      <div class="step-content">
        <h3 class="step-title">4 - Hero Information</h3>
        <p class="step-description mb-2">
          Then, record the following Hero information. The Party Leader must
          fill out the fields for each Hero in the Party. Only the total number
          is important:
        </p>
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-list density="compact" class="custom-list">
              <v-list-item class="custom-list-item">
                <v-list-item-title class="list-item-text">
                  Hero's current Health
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="custom-list-item">
                <v-list-item-title class="list-item-text">
                  Number of Curse Cubes the Hero has
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="custom-list-item">
                <v-list-item-title class="list-item-text">
                  Number of Trauma Cubes the Hero has
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="6">
            <v-list density="compact" class="custom-list">
              <v-list-item class="custom-list-item">
                <v-list-item-title class="list-item-text">
                  Number of Available Action Cubes the Hero has
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="custom-list-item">
                <v-list-item-title class="list-item-text">
                  Number of Action Cubes allocated to Skills or Expended
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="custom-list-item">
                <v-list-item-title class="list-item-text">
                  Which Dungeon Role the Hero is playing
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </div>
    </v-window-item>

    <v-window-item :value="5">
      <div class="step-content">
        <h3 class="step-title">5 - Resources & Equipment</h3>
        <p class="step-description mb-2">
          Continue by clicking the 
          <span 
            class="action-link" 
            @click="handleActionClick('manage-resources')"
            @keydown.enter="handleActionClick('manage-resources')"
            tabindex="0"
          >
            "Manage Resources"
          </span> 
          button to register the Resource tokens and Equipment each Hero has:
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

    <v-window-item :value="6">
      <div class="step-content">
        <h3 class="step-title">6 - Skills & Abilities</h3>
        <p class="step-description mb-2">
          Finally, also register the Hero Skills and Class Skills of each Hero by clicking the 
          <span 
            class="action-link" 
            @click="handleActionClick('equipment-skills')"
            @keydown.enter="handleActionClick('equipment-skills')"
            tabindex="0"
          >
            "Equipment & Skills"
          </span> 
          button. These fields only indicate the cards that were chosen:
        </p>
        <v-list density="compact" class="mb-4 custom-list">
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

    <v-window-item :value="7">
      <div class="step-content">
        <h3 class="step-title">7 - Save Changes</h3>
        <p class="step-description mb-4">
          Once all information for all Heroes is filled in, click "Save
          Changes" and you're done! All the relevant information for your
          Campaign has been recorded.
        </p>
        <v-alert type="success" variant="tonal" class="mt-6 custom-alert">
          <strong>Final Step:</strong> When all information is complete, click
          "Save Campaign"!
          <div class="mt-2">Until next time, dear Adventurer!</div>
        </v-alert>
        <div class="d-flex justify-end mt-4">
          <v-btn
            @click="handleSaveClick"
            class="save-btn"
            rounded
            color="primary"
            variant="elevated"
            :loading="saving"
          >
            <v-icon start>mdi-content-save</v-icon>
            Save Campaign
          </v-btn>
        </div>
      </div>
    </v-window-item>
  </v-window>

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
  "Save Conditions",
  "Adjusting the Board",
  "Game State Information",
  "Hero Information",
  "Resources & Equipment",
  "Skills & Abilities",
  "Save Changes",
];

const emit = defineEmits<{
  save: [];
  "instruction-changed": [step: number];
  close: [];
  "action-click": [action: string];
}>();

const currentStep = ref(1);
const saving = ref(false);

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

const handleSaveClick = () => {
  saving.value = true;
  emit("save");

  setTimeout(() => {
    saving.value = false;
  }, 5000);
};

const handleActionClick = (action: string) => {
  emit("action-click", action);
};

defineExpose({
  setCurrentStep,
  resetLoading: () => {
    saving.value = false;
  },
});

watch(
  currentStep,
  (newStep) => {
    emit("instruction-changed", newStep);
  },
  { immediate: true }
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

.navigation-controls {
  position: absolute;
  bottom: 0;
  left: 25px;
  right: 35px;
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

.action-link {
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  padding: 2px 4px;
  display: inline-block;
  background: rgba(var(--v-theme-primary), 0.1);
}

.action-link:hover {
  background: rgba(var(--v-theme-primary), 0.2);
  text-decoration: underline;
  transform: translateY(-1px);
}

.action-link:focus {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.action-link:active {
  transform: translateY(0);
  background: rgba(var(--v-theme-primary), 0.3);
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
}

* {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

:deep(.v-list-item-title),
:deep(.v-alert__content),
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