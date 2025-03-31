import { defineStore } from "pinia";
import { ref } from "vue";

// Interface for events used in display (listing, details, etc.)
export interface EventDisplay {
  name?: string;
  location?: string;
  eventdesc?: string;
  eventseats?: string;
  date?: string;
  hour?: string;
  ampm?: string;
  image?: string;
  shopdesc?: string;
  shopname?: string;
  shopimage?: string;
  rewards?: Array<{
    name: string;
    description: string;
    image: string;
  }>;
}

// Interface for event creation fields
export interface EventCreation {
  seats_number: number | null;
  season_hash: string | null;
  chapter_hash: string | null;
  date: string | null;
  stores_fk: number | null;
  users_fk: number | null;
  active: boolean | null;
}

export const useEventStore = defineStore("event", () => {
  const events = ref<EventDisplay[]>([]);

  const newEvent = ref<EventCreation>({
    seats_number: null,
    season_hash: null,
    chapter_hash: null,
    date: null,
    stores_fk: null,
    users_fk: null,
    active: null,
  });

  const setEvents = (newEvents: EventDisplay[]) => {
    events.value = newEvents;
  };

  const addEvent = (event: EventDisplay) => {
    events.value.push(event);
  };

  const setNewEvent = (eventData: EventCreation) => {
    newEvent.value = eventData;
  };

  return { events, newEvent, setEvents, addEvent, setNewEvent };
});
