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

export interface PlaytestSlot {
  slot_number: number;
  player_name: string;
  email?: string;
  phone?: string;
  is_master: boolean;
  users_fk?: number | null;
  checked_in?: boolean;
  playtest_bookings_pk?: number;
}

export interface PlaytestTable {
  id: string;
  table_number: number;
  time: string;
  description?: string;
  slots: PlaytestSlot[];
  waitlist?: PlaytestSlot[];
  started?: boolean;
}

export interface PlaytestDaySchedule {
  date: string;
  display_date: string;
  tables: PlaytestTable[];
}

export interface PlaytestGhostEvent {
  events_pk: string | number;
  is_ghost: boolean;
  is_playtest: boolean;
  store_name: string;
  address: string;
  scenario: string;
  event_date: string;
  end_date: string;
  seats_number: number;
  available_seats: number;
  seasons_fk?: number;
  picture_hash?: string;
  description?: string;
  days: PlaytestDaySchedule[];
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
