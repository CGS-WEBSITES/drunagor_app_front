import { defineStore } from "pinia";
import { ref } from "vue";

export interface Store {
  site: string | null;
  name: string | null;
  zip_code: string | null;
  countries_fk: number | null;
  users_fk: number | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

export const useStore = defineStore('store', () => {
  const store = ref<Store>({
    site: null,
    name: null,
    zip_code: null,
    countries_fk: null,
    users_fk: null,
    address: null,
    latitude: null,
    longitude: null,
  });

  const setStore = (newStorer: Store) => {
    store.value = newStorer;
  };

  return { store, setStore };
});