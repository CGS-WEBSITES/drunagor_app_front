import { ref, onBeforeUnmount, computed, nextTick } from "vue";
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

  const LS_STEP = `campaign_${campaignId}_save_tour_step`;
  const LS_TS = `campaign_${campaignId}_save_tour_timestamp`;
  const LS_RESUME = `campaign_${campaignId}_save_tour_resume`;

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

  const saveProgress = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_STEP, currentStepIndex.value.toString());
      localStorage.setItem(LS_TS, Date.now().toString());
    }
  };

  const clearProgress = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LS_STEP);
      localStorage.removeItem(LS_TS);
    }
  };

  const restoreProgress = (): number | null => {
    if (typeof window === "undefined") return null;
    const stepStr = localStorage.getItem(LS_STEP);
    const tsStr = localStorage.getItem(LS_TS);
    if (!stepStr || !tsStr) return null;
    const ts = parseInt(tsStr, 10);
    if (Date.now() - ts > 30 * 60 * 1000) {
      clearProgress();
      return null;
    }
    return parseInt(stepStr, 10);
  };

  const markResume = (reason: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_RESUME, reason || "nav");
    }
  };
  const hasResume = () =>
    typeof window !== "undefined" && !!localStorage.getItem(LS_RESUME);
  const consumeResume = () => {
    if (typeof window !== "undefined") localStorage.removeItem(LS_RESUME);
  };

  const createTour = () => {
    const newTour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        scrollTo: false,
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
      attachTo: {
        element: ".shepherd-btn-manage-resources",
        on: isMobile() ? "top" : "bottom",
      },
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
          async action() {
            this.complete();
            await nextFrame();
            try {
              await onSaveClick();
            } catch (error) {
              console.error("[Tour] Erro ao salvar:", error);
            }
          },
        },
      ],
    });

    (window as any).shepherdSaveCampaign = async () => {
      try {
        newTour.complete();
        await wait(100);
        await onSaveClick();
      } catch (error) {
        console.error("[Tour] Erro ao salvar via botão:", error);
      }
    };

    newTour.on("show", async (event: any) => {
      currentStepIndex.value = newTour.steps.indexOf(event.step);
      saveProgress();
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

  const waitForElement = async (selector: string, timeout = 4000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const el = document.querySelector(selector) as HTMLElement | null;
      if (el) return el;
      await wait(100);
    }
    return null;
  };

  const startSaveTour = async () => {
    if (tour.value) {
      try {
        tour.value.complete();
      } catch {}
    }
  
    tour.value = createTour();
    isActive.value = true;
  
    const savedStep = restoreProgress();
    const resumeReason = hasResume() ? localStorage.getItem(LS_RESUME) : null;
  
    tour.value.start();
  
    if (savedStep !== null && savedStep > 0) {
      await nextTick();
      await wait(700);
  
      try {
        if (resumeReason === "manage-resources") {
          await waitForElement(".shepherd-btn-manage-resources", 5000);
          const hero = getFirstHeroRoot();
          if (hero) {
            await expandHeroPanel(hero);
            await wait(500);
          }
        } else if (resumeReason === "equipment-skills") {
          await waitForElement(".shepherd-btn-equipment-skills", 5000);
          const hero = getFirstHeroRoot();
          if (hero) {
            await expandHeroPanel(hero);
            await wait(500);
          }
        }
  
        tour.value.show(savedStep);
        await nextFrames(2);
        
        const currentStep = tour.value.getCurrentStep();
        if (currentStep) {
          currentStep.updatePosition?.();
        }
        
        if (resumeReason) {
          consumeResume();
        }
      } catch (e) {
        console.error("[Tour] Erro ao restaurar passo:", e);
        tour.value.show(0);
      }
    }
  };

  const pauseTourForNavigation = (
    reason?: "manage-resources" | "equipment-skills" | "nav",
  ) => {
    saveProgress();
    
    if (reason) {
      localStorage.setItem(LS_RESUME, reason);
    }
    
    if (tour.value) {
      try {
        tour.value.cancel();
      } catch (e) {
        console.error("[Tour] Erro ao pausar tour:", e);
      }
    }
    
    isActive.value = false;
  };

  const destroyTour = (opts?: { keepProgress?: boolean }) => {
    if (!tour.value) return;
    if (opts?.keepProgress) {
      try {
        tour.value.cancel();
      } catch {}
    } else {
      try {
        tour.value.complete();
      } catch {}
    }
    tour.value = null;
    isActive.value = false;
  };

  onBeforeUnmount(() => destroyTour({ keepProgress: true }));

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

  const hasPendingResume = () => {
    if (typeof window === "undefined") return false;

    const step = localStorage.getItem(LS_STEP);
    const timestamp = localStorage.getItem(LS_TS);
    const resume = localStorage.getItem(LS_RESUME);

    if (!step || !timestamp || !resume) return false;

    const ts = parseInt(timestamp, 10);
    if (Date.now() - ts > 30 * 60 * 1000) {
      clearProgress();
      return false;
    }

    return true;
  };

  const tryAutoResume = async () => {
    const savedStep = restoreProgress();
    
    if (savedStep === null || savedStep === 0) {
      consumeResume(); 

      return false;
    }
    
    const hasResumeFlag = hasResume();
    const hasRecentProgress = savedStep > 0;
    
    if (hasRecentProgress || hasResumeFlag) {
      try {
        await startSaveTour();
        return true;
      } catch (error) {
        console.error('[Tour] Erro ao auto-retomar:', error);
        return false;
      }
    }
    
    return false;
  };
  
  const hasPausedTour = () => {
    const step = localStorage.getItem(LS_STEP);
    const timestamp = localStorage.getItem(LS_TS);
    
    if (!step || !timestamp) return false;
    
    const stepNum = parseInt(step, 10);
    const ts = parseInt(timestamp, 10);
    
    const isRecent = Date.now() - ts < 30 * 60 * 1000;
    const isValidStep = stepNum > 0;
    
    return isRecent && isValidStep;
  };
  
  return {
    startSaveTour,
    destroyTour,
    isActive,
    currentStep: computed(() => currentStepIndex.value + 1),
    totalSteps: computed(() => tour.value?.steps.length || 0),
    pauseTourForNavigation,
    shouldResumeAfterNav: hasResume,
    consumeResumeFlag: consumeResume,
    hasPendingResume,
    tryAutoResume,
    hasPausedTour, 
  };
}
