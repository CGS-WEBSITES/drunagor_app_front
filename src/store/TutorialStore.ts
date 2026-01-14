import { defineStore } from 'pinia';

interface TutorialPreferences {
  initialSetupTutorial: boolean; // false = mostrar, true = não mostrar mais
}

interface TutorialState {
  preferences: TutorialPreferences;
}

const DEFAULT_PREFERENCES: TutorialPreferences = {
  initialSetupTutorial: false,
};

export const useTutorialStore = defineStore('tutorial', {
  state: (): TutorialState => ({
    preferences: { ...DEFAULT_PREFERENCES }
  }),

  getters: {
    shouldShowInitialSetup: (state): boolean => !state.preferences.initialSetupTutorial,
  },

  actions: {
    loadPreferences(): void {
      const stored = localStorage.getItem('tutorial_preferences');
      
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as TutorialPreferences;
          
          this.preferences = {
            ...DEFAULT_PREFERENCES,
            ...parsed
          };
        } catch (error) {
          console.error('Error loading tutorial preferences:', error);
          this.preferences = { ...DEFAULT_PREFERENCES };
        }
      } else {
        this.preferences = { ...DEFAULT_PREFERENCES };
      }
      
      this.savePreferences();
    },

    savePreferences(): void {
      const preferencesToSave: TutorialPreferences = {
        ...DEFAULT_PREFERENCES,
        ...this.preferences
      };
      
      localStorage.setItem('tutorial_preferences', JSON.stringify(preferencesToSave));
    },

    setInitialSetupPreference(value: boolean): void {
      this.preferences.initialSetupTutorial = value;
      this.savePreferences();
    },

    resetPreferences(): void {
      this.preferences = { ...DEFAULT_PREFERENCES };
      this.savePreferences();
    }
  }
});