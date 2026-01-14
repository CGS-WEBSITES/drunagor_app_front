import { defineStore } from 'pinia';

interface TutorialPreferences {
  initialSetupTutorial: boolean; 
  startHereTutorial: boolean;    
}

interface TutorialState {
  preferences: TutorialPreferences;
}

const DEFAULT_PREFERENCES: TutorialPreferences = {
  initialSetupTutorial: false,
  startHereTutorial: false, 
};

export const useTutorialStore = defineStore('tutorial', {
  state: (): TutorialState => ({
    preferences: { ...DEFAULT_PREFERENCES }
  }),

  getters: {
    shouldShowInitialSetup: (state): boolean => !state.preferences.initialSetupTutorial,
    shouldShowStartHere: (state): boolean => !state.preferences.startHereTutorial,
  },

  actions: {
    loadPreferences(): void {
      const stored = localStorage.getItem('tutorial_preferences');
      
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Partial<TutorialPreferences>;
          
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
      localStorage.setItem('tutorial_preferences', JSON.stringify(this.preferences));
    },

    setInitialSetupPreference(value: boolean): void {
      this.preferences.initialSetupTutorial = value;
      this.savePreferences();
    },

    // Nova action para o Start Here
    setStartHerePreference(value: boolean): void {
      this.preferences.startHereTutorial = value;
      this.savePreferences();
    },

    resetPreferences(): void {
      this.preferences = { ...DEFAULT_PREFERENCES };
      this.savePreferences();
    }
  }
});