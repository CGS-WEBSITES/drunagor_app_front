import { ref, onBeforeUnmount, computed } from "vue";
import Shepherd from "shepherd.js";

interface UseSaveCampaignTourOptions {
  onSaveClick: () => Promise<void>;
  onManageResourcesClick: () => void;
  onEquipmentSkillsClick: () => void;
  campaignId: string;
}

export function useSaveCampaignTour({
  onSaveClick,
  onManageResourcesClick,
  onEquipmentSkillsClick,
  campaignId,
}: UseSaveCampaignTourOptions) {
  const tour = ref<any | null>(null);
  const currentStepIndex = ref(0);
  const isActive = ref(false);

  /* ========= timing & DOM helpers ========= */
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const nextFrame = () =>
    new Promise<void>((r) => requestAnimationFrame(() => r()));
  const nextFrames = async (n = 2) => {
    for (let i = 0; i < n; i++) await nextFrame();
  };

  const isMobile = () =>
    typeof window !== "undefined" ? window.innerWidth < 600 : false;

  const scrollIntoViewWithOffset = async (el: HTMLElement, topOffset = 190) => {
    const rect = el.getBoundingClientRect();
    const top = window.scrollY + rect.top - topOffset;
    window.scrollTo({ top, behavior: "smooth" });
    await wait(240);
    await nextFrames(2);
  };

  const waitForTransitionEnd = async (
    el: HTMLElement | null,
    timeout = 500,
  ) => {
    if (!el) {
      await wait(180);
      return;
    }
    let resolved = false;
    let resolve!: () => void;
    const p = new Promise<void>((r) => (resolve = r));
    const onEnd = () => {
      if (resolved) return;
      resolved = true;
      el.removeEventListener("transitionend", onEnd);
      resolve();
    };
    el.addEventListener("transitionend", onEnd, { once: true });
    setTimeout(onEnd, timeout);
    await p;
    await nextFrames(2);
  };

  const getFirstHeroRoot = (): HTMLElement | null => {
    const list = document.querySelector(".shepherd-heroes-list");
    if (!list) return null;
    return list.querySelector(
      '[class*="shepherd-hero-"], .v-expansion-panels .v-expansion-panel',
    ) as HTMLElement | null;
  };

  const expandHeroPanel = async (heroRoot: HTMLElement) => {
    const title =
      (heroRoot.querySelector(".v-expansion-panel-title") as HTMLElement) ||
      (heroRoot.querySelector(".v-expansion-panel__header") as HTMLElement);

    const content =
      (heroRoot.querySelector(
        ".v-expansion-panel-text__wrapper",
      ) as HTMLElement) ||
      (heroRoot.querySelector(".v-expansion-panel-text") as HTMLElement) ||
      (heroRoot.querySelector(".v-expansion-panel-content") as HTMLElement);

    const isOpen =
      (!!content && content.clientHeight > 0) ||
      (title && title.getAttribute("aria-expanded") === "true");

    if (!isOpen && title) {
      title.click();
      await waitForTransitionEnd(content, 600);
    } else {
      await nextFrames(2);
    }
  };

  /* ========= footer buttons ========= */
  const getButtonConfig = () => ({
    back: {
      text: isMobile() ? "←" : "Back",
      classes: isMobile()
        ? "shepherd-button-back-mobile"
        : "shepherd-button-secondary",
    },
    next: {
      text: isMobile() ? "→" : "Next",
      classes: "shepherd-button-primary",
    },
    cancel: {
      text: isMobile() ? "✕" : "Exit",
      classes: "shepherd-button-cancel",
    },
    complete: {
      text: isMobile() ? "✓" : "Complete",
      classes: "shepherd-button-complete",
    },
  });

  /* ========= tour ========= */
  const createTour = () => {
    const newTour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        scrollTo: false, // a gente controla o scroll
        modalOverlayOpeningRadius: 8,
        modalOverlayOpeningPadding: 4,
        popperOptions: {
          strategy: "fixed",
          modifiers: [
            {
              name: "preventOverflow",
              options: { boundary: "viewport", padding: 12 },
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
    });

    const buttons = getButtonConfig();

    /* 1) Save Conditions */
    newTour.addStep({
      id: "save-conditions",
      title: "1 - Save Conditions",
      text: `
        <div class="shepherd-text-content">
          <p>You're done with this game session and it's time to save your Party's progress. Ensure that:</p>
          <ul class="shepherd-checklist">
            <li>✓ No Monsters are alive</li>
            <li>✓ The Initiative marker is on the End of the Round Game State Check-Up card</li>
          </ul>
          <div class="shepherd-info"><strong>ℹ️ Note:</strong> If both conditions are met, you can save your progress.</div>
        </div>
      `,
      attachTo: { element: ".speed-dial-activator", on: "left-start" },
      buttons: [
        {
          text: buttons.cancel.text,
          classes: buttons.cancel.classes,
          action() {
            this.cancel();
          },
        },
        {
          text: buttons.next.text,
          classes: buttons.next.classes,
          action() {
            this.next();
          },
        },
      ],
    });

    /* 2) Board */
    newTour.addStep({
      id: "adjusting-board",
      title: "2 - Adjusting the Board",
      text: `
        <div class="shepherd-text-content">
          <p>Before saving, adjust the board:</p>
          <ul class="shepherd-checklist">
            <li>📦 Remove any Chests and Interaction tokens (they are lost forever)</li>
            <li>🔮 Return any Runes on the board to the Initiative Track</li>
          </ul>
        </div>
      `,
      attachTo: {
        element: ".campaign-content",
        on: isMobile() ? "bottom" : "top",
      },
      buttons: [
        {
          text: buttons.back.text,
          classes: buttons.back.classes,
          action() {
            this.back();
          },
        },
        {
          text: buttons.cancel.text,
          classes: buttons.cancel.classes,
          action() {
            this.cancel();
          },
        },
        {
          text: buttons.next.text,
          classes: buttons.next.classes,
          action() {
            this.next();
          },
        },
      ],
    });

    /* 3) Game State */
    newTour.addStep({
      id: "game-state-info",
      title: "3 - Game State Information",
      text: `
        <div class="shepherd-text-content">
          <p>Record the Game State information:</p>
          <ul class="shepherd-checklist">
            <li>📝 Record which Adventure will be played next</li>
            <li>🚪 Select which Door will be opened next</li>
          </ul>
        </div>
      `,
      attachTo: {
        element: ".shepherd-campaign-name",
        on: isMobile() ? "bottom" : "right",
      },
      buttons: [
        {
          text: buttons.back.text,
          classes: buttons.back.classes,
          action() {
            this.back();
          },
        },
        {
          text: buttons.cancel.text,
          classes: buttons.cancel.classes,
          action() {
            this.cancel();
          },
        },
        {
          text: buttons.next.text,
          classes: buttons.next.classes,
          action() {
            this.next();
          },
        },
      ],
      when: {
        show() {
          const el = document.querySelector(".shepherd-select-door");
          if (el) el.classList.add("shepherd-highlight");
        },
        hide() {
          const el = document.querySelector(".shepherd-select-door");
          if (el) el.classList.remove("shepherd-highlight");
        },
      },
    });

    /* 4) Runes (se houver) */
    if (
      typeof document !== "undefined" &&
      document.querySelector(".shepherd-runes")
    ) {
      newTour.addStep({
        id: "runes-info",
        title: "4 - Runes & Cards",
        text: `
          <div class="shepherd-text-content">
            <p>If you're saving between rooms:</p>
            <ul class="shepherd-checklist">
              <li>🔮 Record the number of Runes on the Initiative Track</li>
              <li>🎴 Record which Rune, Game State, and Mechanics cards are on track</li>
            </ul>
          </div>
        `,
        attachTo: {
          element: ".shepherd-runes",
          on: isMobile() ? "bottom" : "right",
        },
        buttons: [
          {
            text: buttons.back.text,
            classes: buttons.back.classes,
            action() {
              this.back();
            },
          },
          {
            text: buttons.cancel.text,
            classes: buttons.cancel.classes,
            action() {
              this.cancel();
            },
          },
          {
            text: buttons.next.text,
            classes: buttons.next.classes,
            action() {
              this.next();
            },
          },
        ],
      });
    }

    /* 5) Hero actions */
    newTour.addStep({
      id: "hero-management",
      title: "5 - Hero Information",
      text: `
        <div class="shepherd-text-content">
          <p>Manage your heroes:</p>
          <ul class="shepherd-checklist">
            <li>➕ Add heroes to your campaign if needed</li>
            <li>📤 Import heroes from other campaigns</li>
            <li>❌ Remove heroes if necessary</li>
          </ul>
        </div>
      `,
      attachTo: {
        element: ".shepherd-hero-actions",
        on: isMobile() ? "top" : "bottom",
      },
      buttons: [
        {
          text: buttons.back.text,
          classes: buttons.back.classes,
          action() {
            this.back();
          },
        },
        {
          text: buttons.cancel.text,
          classes: buttons.cancel.classes,
          action() {
            this.cancel();
          },
        },
        {
          text: buttons.next.text,
          classes: buttons.next.classes,
          action() {
            this.next();
          },
        },
      ],
      when: {
        show() {
          const el = document.querySelector(".shepherd-hero-actions");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        },
      },
    });

    /* 6) Hero status */
    newTour.addStep({
      id: "hero-stats",
      title: "6 - Hero Status",
      text: `
        <div class="shepherd-text-content">
          <p>For each hero, record:</p>
          <div class="shepherd-grid">
            <div>
              <strong>Health & Status:</strong>
              <ul>
                <li>❤️ Current Health</li>
                <li>💀 Curse Cubes</li>
                <li>🩹 Trauma Cubes</li>
              </ul>
            </div>
            <div>
              <strong>Actions & Role:</strong>
              <ul>
                <li>⚡ Available Action Cubes</li>
                <li>🎯 Allocated Action Cubes</li>
                <li>🎭 Dungeon Role</li>
              </ul>
            </div>
          </div>
        </div>
      `,
      attachTo: {
        element: ".shepherd-heroes-list",
        on: isMobile() ? "top" : "bottom",
      },
      buttons: [
        {
          text: buttons.back.text,
          classes: buttons.back.classes,
          action() {
            this.back();
          },
        },
        {
          text: buttons.cancel.text,
          classes: buttons.cancel.classes,
          action() {
            this.cancel();
          },
        },
        {
          text: buttons.next.text,
          classes: buttons.next.classes,
          action() {
            this.next();
          },
        },
      ],
      when: {
        show() {
          const el = document.querySelector(".shepherd-heroes-list");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.add("shepherd-highlight");
          }
        },
        hide() {
          const el = document.querySelector(".shepherd-heroes-list");
          if (el) el.classList.remove("shepherd-highlight");
        },
      },
    });

    /* 7) Manage Resources — com beforeShowPromise */
    newTour.addStep({
      id: "resources-equipment",
      title: "7 - Resources & Equipment",
      text: `
        <div class="shepherd-text-content">
          <p>Click "Manage Resources" for each hero to register:</p>
          <ul class="shepherd-checklist">
            <li>🛡️ SHIELDS, FOCUS, KI, FURY tokens</li>
            <li>🍎 FRUIT OF LIFE and other resources</li>
            <li>🎒 Consumable Items in Backpack</li>
            <li>⚔️ Equipped items in each slot</li>
          </ul>
        </div>
      `,
      // Aponta DIRETO para o botão (tem classe no seu CampaignLog)
      attachTo: {
        element: ".shepherd-btn-manage-resources",
        on: isMobile() ? "top" : "bottom",
      },
      // Garante que o botão esteja visível/medível ANTES do step aparecer
      beforeShowPromise: async () => {
        const hero = getFirstHeroRoot();
        if (!hero) return;
        await scrollIntoViewWithOffset(hero, 200);
        await expandHeroPanel(hero);
        const btn = hero.querySelector(
          ".shepherd-btn-manage-resources",
        ) as HTMLElement | null;
        if (btn) await scrollIntoViewWithOffset(btn, 200);
        await nextFrames(2);
      },
      buttons: [
        {
          text: buttons.back.text,
          classes: buttons.back.classes,
          action() {
            this.back();
          },
        },
        {
          text: buttons.cancel.text,
          classes: buttons.cancel.classes,
          action() {
            this.cancel();
          },
        },
        {
          text: "Skip",
          classes: "shepherd-button-skip",
          action() {
            this.next();
          },
        },
        {
          text: buttons.next.text,
          classes: buttons.next.classes,
          action() {
            this.next();
          },
        },
      ],
    });

    /* 8) Equipment & Skills — com beforeShowPromise */
    newTour.addStep({
      id: "skills-abilities",
      title: "8 - Skills & Abilities",
      text: `
        <div class="shepherd-text-content">
          <p>Click "Equipment & Skills" to register:</p>
          <ul class="shepherd-checklist">
            <li>⚡ Level 1 Skills</li>
            <li>💫 Level 2 Skills</li>
            <li>🌟 Class Abilities</li>
          </ul>
        </div>
      `,
      attachTo: {
        element: ".shepherd-btn-equipment-skills",
        on: isMobile() ? "top" : "bottom",
      },
      beforeShowPromise: async () => {
        const hero = getFirstHeroRoot();
        if (!hero) return;
        await scrollIntoViewWithOffset(hero, 200);
        await expandHeroPanel(hero);
        const btn = hero.querySelector(
          ".shepherd-btn-equipment-skills",
        ) as HTMLElement | null;
        if (btn) await scrollIntoViewWithOffset(btn, 200);
        await nextFrames(2);
      },
      buttons: [
        {
          text: buttons.back.text,
          classes: buttons.back.classes,
          action() {
            this.back();
          },
        },
        {
          text: buttons.cancel.text,
          classes: buttons.cancel.classes,
          action() {
            this.cancel();
          },
        },
        {
          text: "Skip",
          classes: "shepherd-button-skip",
          action() {
            this.next();
          },
        },
        {
          text: buttons.next.text,
          classes: buttons.next.classes,
          action() {
            this.next();
          },
        },
      ],
    });

    /* 9) Final Save */
    newTour.addStep({
      id: "final-save",
      title: "9 - Save Campaign",
      text: `
        <div class="shepherd-text-content">
          <div class="shepherd-success">
            <h3>🎉 Ready to Save!</h3>
            <p>All information has been filled. Click the button below to save your campaign progress.</p>
          </div>
          <div class="shepherd-warning"><strong>⚠️ Important:</strong> Make sure all hero information is complete before saving.</div>
          <div class="shepherd-action">
            <button class="shepherd-save-button" onclick="window.shepherdSaveCampaign()">💾 Save Campaign Now</button>
          </div>
          <p class="shepherd-footer">Until next time, dear Adventurer! ⚔️</p>
        </div>
      `,
      attachTo: { element: ".speed-dial-activator", on: "left-start" },
      buttons: [
        {
          text: buttons.back.text,
          classes: buttons.back.classes,
          action() {
            this.back();
          },
        },
        {
          text: buttons.complete.text,
          classes: buttons.complete.classes,
          action() {
            this.complete();
            onSaveClick();
          },
        },
      ],
    });

    /* eventos extras para estabilidade */
    newTour.on("show", async (event: any) => {
      currentStepIndex.value = newTour.steps.indexOf(event.step);
      await nextFrames(2);
      try {
        event.step.tour?.updateStepPosition?.();
      } catch {}
    });

    const onScroll = () => {
      try {
        newTour.getCurrentStep()?.tour?.updateStepPosition?.();
      } catch {}
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    newTour.on("cancel", () => window.removeEventListener("scroll", onScroll));
    newTour.on("complete", () =>
      window.removeEventListener("scroll", onScroll),
    );

    /* fallbacks globais (se alguém clicar nos botões inline antigos) */
    (window as any).shepherdManageResources = () => {
      onManageResourcesClick();
    };
    (window as any).shepherdEquipmentSkills = () => {
      onEquipmentSkillsClick();
    };
    (window as any).shepherdSaveCampaign = () => {
      newTour.complete();
      onSaveClick();
    };

    /* persistência */
    newTour.on("cancel", () => {
      isActive.value = false;
      saveProgress();
    });
    newTour.on("complete", () => {
      isActive.value = false;
      clearProgress();
    });

    return newTour;
  };

  /* ========= persistência & lifecycle ========= */
  const saveProgress = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `campaign_${campaignId}_save_tour_step`,
        currentStepIndex.value.toString(),
      );
      localStorage.setItem(
        `campaign_${campaignId}_save_tour_timestamp`,
        Date.now().toString(),
      );
    }
  };

  const clearProgress = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`campaign_${campaignId}_save_tour_step`);
      localStorage.removeItem(`campaign_${campaignId}_save_tour_timestamp`);
    }
  };

  const restoreProgress = (): number | null => {
    if (typeof window === "undefined") return null;
    const stepStr = localStorage.getItem(
      `campaign_${campaignId}_save_tour_step`,
    );
    const tsStr = localStorage.getItem(
      `campaign_${campaignId}_save_tour_timestamp`,
    );
    if (!stepStr || !tsStr) return null;
    const ts = parseInt(tsStr, 10);
    if (Date.now() - ts > 30 * 60 * 1000) {
      clearProgress();
      return null;
    }
    return parseInt(stepStr, 10);
  };

  const startSaveTour = () => {
    if (tour.value) {
      try {
        tour.value.complete();
      } catch {}
    }
    tour.value = createTour();
    isActive.value = true;

    const savedStep = restoreProgress();
    tour.value.start();
    if (savedStep !== null && savedStep > 0) {
      try {
        tour.value.show(savedStep);
      } catch {}
    }
  };

  const destroyTour = () => {
    if (tour.value) {
      try {
        tour.value.complete();
      } catch {}
      tour.value = null;
      isActive.value = false;
    }
  };

  onBeforeUnmount(() => destroyTour());

  const handleResize = () => {
    if (tour.value && isActive.value) {
      const currentStep = tour.value.getCurrentStep?.();
      const stepIndex = currentStep ? tour.value.steps.indexOf(currentStep) : 0;
      tour.value.cancel();
      tour.value = createTour();
      tour.value.start();
      try {
        tour.value.show(stepIndex);
      } catch {}
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("resize", handleResize);
    onBeforeUnmount(() => window.removeEventListener("resize", handleResize));
  }

  return {
    startSaveTour,
    destroyTour,
    isActive,
    currentStep: computed(() => currentStepIndex.value + 1),
    totalSteps: computed(() => tour.value?.steps.length || 0),
  };
}
