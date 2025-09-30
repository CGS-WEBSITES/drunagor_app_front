import { ref, onBeforeUnmount, computed, nextTick } from "vue";
import Shepherd from "shepherd.js";

interface UseLoadCampaignTourOptions {
  onManageResourcesClick: () => void;
  onEquipmentSkillsClick: () => void;
  campaignId: string;
}

export function useLoadCampaignTour({
  onManageResourcesClick,
  onEquipmentSkillsClick,
  campaignId,
}: UseLoadCampaignTourOptions) {
  const tour = ref<any | null>(null);
  const currentStepIndex = ref(0);
  const isActive = ref(false);

  const LS_STEP = `campaign_${campaignId}_load_tour_step`;
  const LS_TS = `campaign_${campaignId}_load_tour_timestamp`;
  const LS_RESUME = `campaign_${campaignId}_load_tour_resume`;

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
      id: "initial-setup",
      title: "1 - Initial Setup",
      text: `
        <div class="shepherd-text-content">
          <p>We're glad to have you back, dear Adventurers! These instructions will help you restart the Campaign exactly where you left off.</p>
          <div class="shepherd-info"><strong>ℹ️ Setup Required:</strong> Make sure all Trays, Maps, and Doors of the Adventure are already set up in their respective places.</div>
          <p>Open the "Campaign Log" tab in your Chronicles of Drunagor App, check which Heroes are in your Party, and gather the appropriate components:</p>
          <ul class="shepherd-checklist">
            <li>📋 Model, Hero Board, Initiative card, Hero Skill cards, and Class Ability cards for each Hero in your Party</li>
          </ul>
        </div>
      `,
      attachTo: {
        element: ".campaign-content",
        on: isMobile() ? "bottom" : "top",
      },
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
      id: "initiative-track",
      title: "2 - Initiative Track Setup",
      text: `
        <div class="shepherd-text-content">
          <p>Set up the Initiative Track based on your saved game state:</p>
          <ul class="shepherd-checklist">
            <li>🔮 If there is a record of Runes on the Initiative Track, draw the indicated number and place them back on the Track</li>
            <li>🎴 If there are any Rune, Game State Check-Up, and/or Game Mechanics cards, place them in the appropriate positions</li>
          </ul>
          <div class="shepherd-warning">
            <strong>⚠️ Card Placement Rules:</strong>
            <p class="mt-2">All cards go at the bottom end of the Track, in the Rune Slot, except for the Monster Raid Game Mechanic card, which goes on top of this same Slot.</p>
            <p class="mt-2"><strong>Correct order:</strong> Game Mechanics go on top of Rune cards, which in turn go on top of Game State Check-Up cards.</p>
          </div>
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
      when: {
        show() {
          const el = document.querySelector(".shepherd-runes");
          if (el) el.classList.add("shepherd-highlight");
        },
        hide() {
          const el = document.querySelector(".shepherd-runes");
          if (el) el.classList.remove("shepherd-highlight");
        },
      },
    });

    newTour.addStep({
      id: "resources-equipment",
      title: "3 - Manage Resources",
      text: `
        <div class="shepherd-text-content">
          <p>Click "Manage Resources" and assign the following components to each Hero:</p>
          <ul class="shepherd-checklist">
            <li>🛡️ Number of SHIELDS, FOCUS, KI, FURY, FRUIT OF LIFE, and any other tokens defined as Resources</li>
            <li>🎒 Which Consumable Items (if any) are in the Hero's Backpack</li>
            <li>⚔️ Which Equipment the Hero is wielding in each of their equipment slots</li>
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
      title: "4 - Hero Skills and Class Skills",
      text: `
        <div class="shepherd-text-content">
          <p>Click "Equipment & Skills" and assign each Hero the Abilities they've learned in previous sessions:</p>
          <ul class="shepherd-checklist">
            <li>🎭 Which Dungeon Role the Hero is fulfilling</li>
            <li>⚡ Which Level 1 Skills the Hero has</li>
            <li>💫 Which Level 2 Skills the Hero has</li>
            <li>🌟 Which Class Abilities the Hero has</li>
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
      id: "hero-game-state",
      title: "5 - Adjust Hero Game State",
      text: `
        <div class="shepherd-text-content">
          <p>Adjust each Hero's Game State as recorded in the Campaign Log:</p>
          <div class="shepherd-grid">
            <div>
              <strong>Action Cubes:</strong>
              <ul>
                <li>⚡ Available Action Cubes: Check their Initiative card, then give them the appropriate Cubes based on Hero Skills learned</li>
                <li>🎯 Action Cubes allocation: How many are allocated to Skills or Expended. You may place all in the Expended Cube Box</li>
              </ul>
            </div>
            <div>
              <strong>Health & Status:</strong>
              <ul>
                <li>💀 Curse and Trauma Cubes: Can be placed in any Hero or Role Skill. No need to repeat those selected in the previous session</li>
                <li>❤️ Hero's current Health</li>
              </ul>
            </div>
          </div>
          <div class="shepherd-info"><strong>ℹ️ Note:</strong> Heroes resume the game with all Hero Skills unassigned.</div>
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
      id: "final-setup",
      title: "6 - Final Setup and Resume",
      text: `
        <div class="shepherd-text-content">
          <p>Once all Hero information is set:</p>
          <ul class="shepherd-checklist">
            <li>🚪 Place Heroes back on the board. Each Hero may reposition their Model to a space within Range 1 of the Door listed as "Selected Door" in their Campaign Log</li>
            <li>📍 At least one Hero, however, must be adjacent to it to open it</li>
            <li>🔓 Open that Door and build its Setup</li>
            <li>🔄 Return the Initiative marker to the first card on the Track</li>
          </ul>
          <div class="shepherd-success">
            <h3>🎉 Ready to Resume!</h3>
            <p>That's it! You are ready to resume the game!</p>
            <p class="shepherd-footer">Welcome back, dear Adventurers! ⚔️</p>
          </div>
        </div>
      `,
      attachTo: {
        element: ".shepherd-select-door",
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
          text: buttons.complete.text,
          classes: buttons.complete.classes,
          action() {
            this.complete();
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

    (window as any).shepherdLoadManageResources = () => {
      onManageResourcesClick();
    };
    (window as any).shepherdLoadEquipmentSkills = () => {
      onEquipmentSkillsClick();
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

  const startLoadTour = async () => {
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
      await nextTick();
      await wait(700);

      try {
        if (savedStep >= 2 && savedStep <= 3) {
          console.log(
            "[LoadTour] Preparando painel do herói para passo",
            savedStep + 1,
          );
          const hero = getFirstHeroRoot();
          if (hero) {
            await scrollIntoViewWithOffset(hero, 200);
            await expandHeroPanel(hero);
            await nextFrames(3);
          }
        }
        tour.value.show(savedStep);

        await nextFrames(2);
        tour.value.getCurrentStep()?.updatePosition?.();
      } catch (e) {
        console.error("[LoadTour] Erro ao restaurar passo:", e);
        await wait(1000);
        try {
          tour.value.show(savedStep);
        } catch {
          tour.value.show(0);
        }
      }
    }
  };

  const pauseTourForNavigation = (
    reason?: "manage-resources" | "equipment-skills" | "nav",
  ) => {
    saveProgress();
    markResume(reason || "nav");

    if (tour.value) {
      try {
        tour.value.cancel();
      } catch (e) {
        console.error("[LoadTour] Erro ao pausar tour:", e);
      }
    }
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

  return {
    startLoadTour,
    destroyTour,
    isActive,
    currentStep: computed(() => currentStepIndex.value + 1),
    totalSteps: computed(() => tour.value?.steps.length || 0),

    pauseTourForNavigation,
    shouldResumeAfterNav: hasResume,
    consumeResumeFlag: consumeResume,
  };
}
