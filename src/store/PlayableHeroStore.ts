import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { Hero, SequentialAdventureState, RESOURCE_DEFINITIONS } from "./Hero";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import type { HeroData } from "@/data/repository/HeroData";

export interface PlayableHeroView {
  pk: number;
  visibleId: string;
  creationDate: string;
  rawHash: string;
  heroId: string;
  state: Hero;
  staticData: HeroData | null;
}

export const usePlayableHeroStore = defineStore("playableHero", () => {
  const heroes = ref<PlayableHeroView[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const loaded = ref(false);

  const heroDataRepository = new HeroDataRepository();

  const hasHeroes = computed(() => heroes.value.length > 0);

  function decodeHeroHash(heroHash: string): Hero | null {
    try {
      const json = atob(heroHash);
      return JSON.parse(json) as Hero;
    } catch (e) {
      console.error("[PlayableHeroStore] Failed to decode hero_hash", e);
      return null;
    }
  }

  function encodeHeroHash(hero: Hero): string {
    const cleanData = JSON.parse(JSON.stringify(hero));
    delete cleanData.playableHeroesPk;
    return btoa(JSON.stringify(cleanData));
  }

  async function fetchHeroes(usersPk: number): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await axios.get("/playable_heroes/search", {
        params: { users_fk: usersPk },
      });

      const apiList = data?.playable_heroes ?? [];

      heroes.value = apiList.map((ph: any) => {
        const state = decodeHeroHash(ph.hero_hash);
        const heroId: string = state?.heroId ?? "";
        const staticData = heroId
          ? (heroDataRepository.find(heroId) ?? null)
          : null;

        return {
          pk: ph.playable_heroes_pk,
          visibleId: ph.playable_heroes_pk.toString(),
          creationDate: ph.creation_date,
          rawHash: ph.hero_hash,
          heroId,
          state: state ?? new Hero(heroId, ""),
          staticData,
        };
      });

      loaded.value = true;
    } catch (e: any) {
      console.error("[PlayableHeroStore] Error loading playable heroes", e);
      error.value = e?.response?.data?.message || "Failed to load heroes.";
    } finally {
      loading.value = false;
    }
  }

  function findByPk(pk: number): PlayableHeroView | null {
    return heroes.value.find((h) => h.pk === pk) ?? null;
  }

  function findByHeroId(heroId: string): PlayableHeroView | null {
    return heroes.value.find((h) => h.heroId === heroId) ?? null;
  }

  function findAll(): PlayableHeroView[] {
    return heroes.value;
  }

  async function createHero(
    heroId: string,
    usersPk: number,
  ): Promise<PlayableHeroView> {
    const newHero = new Hero(heroId, "");
    newHero.sequentialAdventureState = new SequentialAdventureState();

    RESOURCE_DEFINITIONS.forEach((resource) => {
      newHero.sequentialAdventureState!.resources[resource.id] = 0;
    });

    const heroHash = encodeHeroHash(newHero);

    const { data } = await axios.post("/playable_heroes/cadastro", {
      hero_hash: heroHash,
      users_fk: usersPk,
    });

    const pk = data.playable_hero?.playable_heroes_pk;
    if (!pk) {
      throw new Error("Failed to get playable_heroes_pk from backend");
    }

    newHero.playableHeroesPk = pk;

    const staticData = heroDataRepository.find(heroId) ?? null;

    const heroView: PlayableHeroView = {
      pk,
      visibleId: pk.toString(),
      creationDate: new Date().toISOString(),
      rawHash: heroHash,
      heroId,
      state: newHero,
      staticData,
    };

    heroes.value.push(heroView);

    return heroView;
  }

  async function updateHero(pk: number, updates: Partial<Hero>): Promise<void> {
    const heroView = findByPk(pk);
    if (!heroView) {
      throw new Error(`Hero with pk ${pk} not found`);
    }

    Object.assign(heroView.state, updates);

    const heroHash = encodeHeroHash(heroView.state);

    await axios.put("/playable_heroes/alter", null, {
      params: {
        playable_heroes_pk: pk,
        hero_hash: heroHash,
      },
    });

    heroView.rawHash = heroHash;
  }

  async function saveHero(pk: number): Promise<void> {
    const heroView = findByPk(pk);
    if (!heroView) {
      throw new Error(`Hero with pk ${pk} not found`);
    }

    const heroHash = encodeHeroHash(heroView.state);

    await axios.put("/playable_heroes/alter", null, {
      params: {
        playable_heroes_pk: pk,
        hero_hash: heroHash,
      },
    });

    heroView.rawHash = heroHash;
  }

  async function deleteHero(pk: number): Promise<void> {
    await axios.delete(`/playable_heroes/${pk}/delete`);
    heroes.value = heroes.value.filter((h) => h.pk !== pk);
  }

  function updateLocalState(pk: number, updates: Partial<Hero>): void {
    const heroView = findByPk(pk);
    if (heroView) {
      Object.assign(heroView.state, updates);
    }
  }

  function reset(): void {
    heroes.value = [];
    loaded.value = false;
    error.value = null;
  }

  return {
    heroes,
    loading,
    error,
    loaded,
    hasHeroes,
    fetchHeroes,
    findByPk,
    findByHeroId,
    findAll,
    createHero,
    updateHero,
    saveHero,
    deleteHero,
    updateLocalState,
    reset,
  };
});
