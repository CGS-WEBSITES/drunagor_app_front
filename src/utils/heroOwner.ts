import axios from "axios";
import { ref, watch, type Ref } from "vue";
import { useUserStore } from "@/store/UserStore";

// Who a campaign hero belongs to: the account that owns its playable hero.
const owners = new Map<number, Promise<number | null>>();

function heroOwner(playableHeroesPk: number): Promise<number | null> {
  if (!owners.has(playableHeroesPk)) {
    owners.set(
      playableHeroesPk,
      axios
        .get(`/playable_heroes/${playableHeroesPk}`)
        .then(({ data }) => (data?.users_fk != null ? Number(data.users_fk) : null))
        .catch(() => {
          owners.delete(playableHeroesPk);
          return null;
        }),
    );
  }
  return owners.get(playableHeroesPk)!;
}

// Only a hero's own player edits it. Heroes with no playable hero behind them
// (older campaigns) or whose owner could not be read stay editable.
export function useCanEditHero(playableHeroesPk: () => number | string | null | undefined): Ref<boolean> {
  const userStore = useUserStore();
  const canEdit = ref(true);
  watch(
    playableHeroesPk,
    async (pk) => {
      const id = Number(pk);
      if (!id) {
        canEdit.value = true;
        return;
      }
      if (!userStore.user?.users_pk) userStore.restoreFromStorage();
      const owner = await heroOwner(id);
      canEdit.value = owner === null || owner === Number(userStore.user?.users_pk);
    },
    { immediate: true },
  );
  return canEdit;
}
