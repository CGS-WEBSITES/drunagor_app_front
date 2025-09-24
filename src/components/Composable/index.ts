export { useSaveCampaignTour } from "./useSaveCampaignTour";
export { useLoadCampaignTour } from "./useLoadCampaignTour";

export const TOUR_CONFIG = {
  TRANSITION_WAIT: 240,
  FRAME_WAIT: 2,
  RESTORE_WAIT: 700,
  PROGRESS_TIMEOUT: 30 * 60 * 1000,

  getStorageKeys: (campaignId: string, type: "save" | "load") => ({
    STEP: `campaign_${campaignId}_${type}_tour_step`,
    TIMESTAMP: `campaign_${campaignId}_${type}_tour_timestamp`,
    RESUME: `campaign_${campaignId}_${type}_tour_resume`,
    NAV_STATE: `campaign_${campaignId}_navigation_state`,
  }),

  BUTTON_TYPES: {
    back: "shepherd-button-secondary",
    next: "shepherd-button-primary",
    cancel: "shepherd-button-cancel",
    complete: "shepherd-button-complete",
    skip: "shepherd-button-skip",
  },

  MOBILE_BREAKPOINT: 600,

  DEFAULT_SCROLL_OFFSET: 190,
  HERO_SCROLL_OFFSET: 200,
  TRANSITION_TIMEOUT: 500,
};

export const TOUR_SELECTORS = {
  CAMPAIGN_CONTENT: ".campaign-content",
  HEROES_LIST: ".shepherd-heroes-list",
  HERO_ACTIONS: ".shepherd-hero-actions",
  SPEED_DIAL: ".speed-dial-activator",

  CAMPAIGN_NAME: ".shepherd-campaign-name",
  SELECT_DOOR: ".shepherd-select-door",
  RUNES: ".shepherd-runes",
  RUNE_CARDS: ".shepherd-rune-cards",

  HERO_ROOT:
    '[class*="shepherd-hero-"], .v-expansion-panels .v-expansion-panel',
  MANAGE_RESOURCES_BTN: ".shepherd-btn-manage-resources",
  EQUIPMENT_SKILLS_BTN: ".shepherd-btn-equipment-skills",

  EXPANSION_TITLE: ".v-expansion-panel-title, .v-expansion-panel__header",
  EXPANSION_CONTENT:
    ".v-expansion-panel-text__wrapper, .v-expansion-panel-text, .v-expansion-panel-content",

  HIGHLIGHT: "shepherd-highlight",
};

export const TOUR_UTILS = {
  wait: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),

  nextFrame: () =>
    new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),

  nextFrames: async (n = 2) => {
    for (let i = 0; i < n; i++) {
      await TOUR_UTILS.nextFrame();
    }
  },

  isMobile: () =>
    typeof window !== "undefined"
      ? window.innerWidth < TOUR_CONFIG.MOBILE_BREAKPOINT
      : false,

  scrollIntoViewWithOffset: async (
    el: HTMLElement,
    topOffset = TOUR_CONFIG.DEFAULT_SCROLL_OFFSET,
  ) => {
    const rect = el.getBoundingClientRect();
    const top = window.scrollY + rect.top - topOffset;
    window.scrollTo({ top, behavior: "smooth" });
    await TOUR_UTILS.wait(TOUR_CONFIG.TRANSITION_WAIT);
    await TOUR_UTILS.nextFrames(2);
  },

  waitForTransitionEnd: async (
    el: HTMLElement | null,
    timeout = TOUR_CONFIG.TRANSITION_TIMEOUT,
  ) => {
    if (!el) {
      await TOUR_UTILS.wait(180);
      return;
    }

    let resolved = false;
    let resolve!: () => void;
    const promise = new Promise<void>((r) => (resolve = r));

    const onEnd = () => {
      if (resolved) return;
      resolved = true;
      el.removeEventListener("transitionend", onEnd);
      resolve();
    };

    el.addEventListener("transitionend", onEnd, { once: true });
    setTimeout(onEnd, timeout);

    await promise;
    await TOUR_UTILS.nextFrames(2);
  },

  getButtonConfig: () => {
    const isMobile = TOUR_UTILS.isMobile();
    return {
      back: {
        text: isMobile ? "←" : "Back",
        classes: isMobile
          ? "shepherd-button-back-mobile"
          : TOUR_CONFIG.BUTTON_TYPES.back,
      },
      next: {
        text: isMobile ? "→" : "Next",
        classes: TOUR_CONFIG.BUTTON_TYPES.next,
      },
      cancel: {
        text: isMobile ? "✕" : "Exit",
        classes: TOUR_CONFIG.BUTTON_TYPES.cancel,
      },
      complete: {
        text: isMobile ? "✓" : "Complete",
        classes: TOUR_CONFIG.BUTTON_TYPES.complete,
      },
    };
  },

  findFirstHeroRoot: (): HTMLElement | null => {
    const list = document.querySelector(TOUR_SELECTORS.HEROES_LIST);
    if (!list) return null;
    return list.querySelector(TOUR_SELECTORS.HERO_ROOT) as HTMLElement | null;
  },

  expandHeroPanel: async (heroRoot: HTMLElement) => {
    const title = heroRoot.querySelector(
      TOUR_SELECTORS.EXPANSION_TITLE,
    ) as HTMLElement;
    const content = heroRoot.querySelector(
      TOUR_SELECTORS.EXPANSION_CONTENT,
    ) as HTMLElement;

    const isOpen =
      (!!content && content.clientHeight > 0) ||
      (title && title.getAttribute("aria-expanded") === "true");

    if (!isOpen && title) {
      title.click();
      await TOUR_UTILS.waitForTransitionEnd(content, 600);
    } else {
      await TOUR_UTILS.nextFrames(2);
    }
  },
};

export const SHEPHERD_DEFAULT_CONFIG = {
  useModalOverlay: true,
  defaultStepOptions: {
    cancelIcon: { enabled: true },
    scrollTo: false,
    modalOverlayOpeningRadius: 8,
    modalOverlayOpeningPadding: 4,
    popperOptions: {
      strategy: "fixed" as const,
      modifiers: [
        {
          name: "preventOverflow",
          options: {
            boundary: "viewport" as const,
            padding: 12,
          },
        },
        {
          name: "flip",
          options: {
            fallbackPlacements: ["bottom", "top", "right", "left"],
          },
        },
      ],
    },
  },
};

export const createCommonStepActions = (tour: any, buttons: any) => ({
  back: () => tour.back(),
  next: () => tour.next(),
  cancel: () => tour.cancel(),
  complete: () => tour.complete(),
  skip: () => tour.next(),
});

export const createProgressManager = (
  campaignId: string,
  type: "save" | "load",
) => {
  const keys = TOUR_CONFIG.getStorageKeys(campaignId, type);

  return {
    save: (stepIndex: number) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(keys.STEP, stepIndex.toString());
        localStorage.setItem(keys.TIMESTAMP, Date.now().toString());
      }
    },

    clear: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem(keys.STEP);
        localStorage.removeItem(keys.TIMESTAMP);
      }
    },

    restore: (): number | null => {
      if (typeof window === "undefined") return null;

      const stepStr = localStorage.getItem(keys.STEP);
      const tsStr = localStorage.getItem(keys.TIMESTAMP);

      if (!stepStr || !tsStr) return null;

      const timestamp = parseInt(tsStr, 10);
      if (Date.now() - timestamp > TOUR_CONFIG.PROGRESS_TIMEOUT) {
        localStorage.removeItem(keys.STEP);
        localStorage.removeItem(keys.TIMESTAMP);
        return null;
      }

      return parseInt(stepStr, 10);
    },

    markResume: (reason: string) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(keys.RESUME, reason || "nav");
      }
    },

    hasResume: () =>
      typeof window !== "undefined" && !!localStorage.getItem(keys.RESUME),

    consumeResume: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem(keys.RESUME);
      }
    },
  };
};

export interface TourOptions {
  campaignId: string;
  onManageResourcesClick?: () => void;
  onEquipmentSkillsClick?: () => void;
}

export interface SaveTourOptions extends TourOptions {
  onSaveClick: () => Promise<void>;
}

export interface LoadTourOptions extends TourOptions {}

export type TourType = "save" | "load";
export type TourStep = {
  id: string;
  title: string;
  text: string;
  attachTo?: { element: string; on: string };
  buttons: Array<{
    text: string;
    classes: string;
    action: () => void;
  }>;
  beforeShowPromise?: () => Promise<void>;
  when?: {
    show?: () => void;
    hide?: () => void;
  };
};
