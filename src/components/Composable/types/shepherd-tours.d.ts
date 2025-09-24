import { Ref, ComputedRef } from "vue";
import { Tour, Step } from "shepherd.js";

export interface BaseTourOptions {
  campaignId: string;
  onManageResourcesClick?: () => void;
  onEquipmentSkillsClick?: () => void;
}

export interface SaveTourOptions extends BaseTourOptions {
  onSaveClick: () => Promise<void>;
}

export interface LoadTourOptions extends BaseTourOptions {}

export interface BaseTourComposable {
  isActive: Ref<boolean>;
  currentStep: ComputedRef<number>;
  totalSteps: ComputedRef<number>;
  destroyTour: (options?: { keepProgress?: boolean }) => void;
  pauseTourForNavigation: (reason?: TourNavigationReason) => void;
  shouldResumeAfterNav: () => boolean;
  consumeResumeFlag: () => void;
}

export interface SaveTourComposable extends BaseTourComposable {
  startSaveTour: () => Promise<void>;
}

export interface LoadTourComposable extends BaseTourComposable {
  startLoadTour: () => Promise<void>;
}

export type TourNavigationReason =
  | "manage-resources"
  | "equipment-skills"
  | "nav";
export type TourType = "save" | "load";
export type TourStepId = string;

export interface TourStepConfig {
  id: TourStepId;
  title: string;
  text: string;
  attachTo?: {
    element: string;
    on: AttachPosition;
  };
  buttons: TourButton[];
  beforeShowPromise?: () => Promise<void>;
  when?: {
    show?: () => void;
    hide?: () => void;
  };
}

export type AttachPosition =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "right"
  | "right-start"
  | "right-end"
  | "left"
  | "left-start"
  | "left-end";

export interface TourButton {
  text: string;
  classes: string;
  action: () => void;
}

export type ButtonType = "back" | "next" | "cancel" | "complete" | "skip";

export interface ButtonConfig {
  text: string;
  classes: string;
}

export type ButtonConfigMap = Record<ButtonType, ButtonConfig>;

export interface StorageKeys {
  STEP: string;
  TIMESTAMP: string;
  RESUME: string;
  NAV_STATE: string;
}

export interface ProgressManager {
  save: (stepIndex: number) => void;
  clear: () => void;
  restore: () => number | null;
  markResume: (reason: string) => void;
  hasResume: () => boolean;
  consumeResume: () => void;
}

export interface TourConfig {
  TRANSITION_WAIT: number;
  FRAME_WAIT: number;
  RESTORE_WAIT: number;
  PROGRESS_TIMEOUT: number;
  MOBILE_BREAKPOINT: number;
  DEFAULT_SCROLL_OFFSET: number;
  HERO_SCROLL_OFFSET: number;
  TRANSITION_TIMEOUT: number;
  getStorageKeys: (campaignId: string, type: TourType) => StorageKeys;
  BUTTON_TYPES: Record<ButtonType, string>;
}

export interface TourSelectors {
  CAMPAIGN_CONTENT: string;
  HEROES_LIST: string;
  HERO_ACTIONS: string;
  SPEED_DIAL: string;
  CAMPAIGN_NAME: string;
  SELECT_DOOR: string;
  RUNES: string;
  RUNE_CARDS: string;
  HERO_ROOT: string;
  MANAGE_RESOURCES_BTN: string;
  EQUIPMENT_SKILLS_BTN: string;
  EXPANSION_TITLE: string;
  EXPANSION_CONTENT: string;
  HIGHLIGHT: string;
}

export interface TourUtils {
  wait: (ms: number) => Promise<void>;
  nextFrame: () => Promise<void>;
  nextFrames: (n?: number) => Promise<void>;
  isMobile: () => boolean;
  scrollIntoViewWithOffset: (
    el: HTMLElement,
    topOffset?: number,
  ) => Promise<void>;
  waitForTransitionEnd: (
    el: HTMLElement | null,
    timeout?: number,
  ) => Promise<void>;
  getButtonConfig: () => ButtonConfigMap;
  findFirstHeroRoot: () => HTMLElement | null;
  expandHeroPanel: (heroRoot: HTMLElement) => Promise<void>;
}

export interface ShepherdTourOptions {
  useModalOverlay: boolean;
  defaultStepOptions: {
    cancelIcon: { enabled: boolean };
    scrollTo: boolean;
    modalOverlayOpeningRadius: number;
    modalOverlayOpeningPadding: number;
    popperOptions: {
      strategy: "fixed" | "absolute";
      modifiers: Array<{
        name: string;
        options: Record<string, any>;
      }>;
    };
  };
}

export interface TourState {
  tour: Ref<Tour | null>;
  currentStepIndex: Ref<number>;
  isActive: Ref<boolean>;
}

export interface TourLifecycle {
  create: () => Tour;
  start: () => Promise<void>;
  pause: (reason?: TourNavigationReason) => void;
  resume: () => Promise<void>;
  destroy: (options?: { keepProgress?: boolean }) => void;
}

export interface TourEventHandlers {
  onStepShow?: (event: any) => Promise<void>;
  onStepHide?: (event: any) => void;
  onTourCancel?: () => void;
  onTourComplete?: () => void;
  onScrollUpdate?: () => void;
}

export interface InstructionComponentProps {
  campaignId?: string;
}

export interface InstructionComponentEmits {
  "instruction-changed": [step: number];
  "action-click": [action: string];
  close: [];
  save?: [];
}

export interface InstructionComponentExposed {
  setCurrentStep: (step: number) => void;
  startInstructions?: () => Promise<void>;
  destroyTour?: (options?: { keepProgress?: boolean }) => void;
  resetLoading?: () => void;
  isActive?: Ref<boolean>;
}

declare global {
  interface Window {
    shepherdSaveCampaign?: () => Promise<void>;
    shepherdManageResources?: () => void;
    shepherdEquipmentSkills?: () => void;
    shepherdLoadManageResources?: () => void;
    shepherdLoadEquipmentSkills?: () => void;
  }
}

export interface Campaign {
  campaign: string;
  isSequentialAdventure?: boolean;
  sequentialAdventureRunes?: number;
}

export interface Hero {
  heroId: string;
  name?: string;
  class?: string;
  level?: number;
  images?: {
    avatar?: string;
    background?: string;
    trackerInfo?: string;
  };
}

export interface CampaignPlayer {
  rl_campaigns_users_pk: number;
  user_name: string;
  role_name: string;
  party_roles_fk: number;
  users_fk: number;
}

export interface NavigationState {
  timestamp: number;
  returnFromNavigation: boolean;
  currentTab?: string;
}

export interface AlertConfig {
  icon: string;
  title: string;
  text: string;
  type: "success" | "info" | "warning" | "error";
  duration?: number;
}

export interface TourError extends Error {
  tourType: TourType;
  step?: string;
  campaignId?: string;
}

export type { Tour, Step } from "shepherd.js";
