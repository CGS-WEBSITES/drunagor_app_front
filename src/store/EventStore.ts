import { defineStore } from "pinia";
import { ref } from "vue";

export interface Event {
  seats_number: number | null;
  season_hash: string | null;
  chapter_hash: string | null;
  date: string | null;
  stores_fk: number | null;
  users_fk: number | null;
  active: boolean | null;
}

export const useEventStore = defineStore("event", () => {
  const events = ref<Event>({
    seats_number: null,
    season_hash: null,
    chapter_hash: null,
    date: null,
    stores_fk: null,
    users_fk: null,
    active: null,
  });

  const setEvent = (newEvent: Event) => {
    events.value = newEvent;
  };

  return { events, setEvent };
});
