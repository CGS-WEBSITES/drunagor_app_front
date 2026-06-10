import { defineStore } from "pinia";
import { ref } from "vue";

export interface UserTimezone {
  timezones_fk: number;
  iana_name: string;
  display_name: string;
  utc_offset_standard: string;
  source: string; 
}

export interface User {
  email: string | null;
  google_id: string | null;
  name: string | null;
  picture_hash: string | null;
  background_hash: string | null;
  roles_fk: number | null;
  user_name: string | null;
  users_pk: number | null;
  verified: boolean | null;
  zip_code: number | null;
  countries_fk: number | null;
  join_date?: string | null;
  timezone?: UserTimezone | null;
}

const FALLBACK_TIMEZONE: UserTimezone = {
  timezones_fk: 0,
  iana_name: "America/Chicago",
  display_name: "Chicago (UTC-6)",
  utc_offset_standard: "UTC-6",
  source: "frontend_fallback",
};

const STORAGE_KEY = "app_user";

export const useUserStore = defineStore("user", () => {
  const user = ref<User>({
    email: null,
    google_id: null,
    name: null,
    picture_hash: null,
    background_hash: null,
    roles_fk: null,
    user_name: null,
    users_pk: null,
    verified: null,
    zip_code: null,
    countries_fk: null,
    join_date: null,
    timezone: null,
  });

  const editingPictureHash = ref<string | null>(null);
  const editingBackgroundHash = ref<string | null>(null);
  const cacheBuster = ref<number>(Date.now());

  const setUser = (newUser: User) => {
    user.value = {
      ...newUser,
      timezone: newUser.timezone ?? FALLBACK_TIMEZONE,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value));
  };

  const restoreFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: User = JSON.parse(raw);
      user.value = {
        ...parsed,
        timezone: parsed.timezone ?? FALLBACK_TIMEZONE,
      };
    } catch {
      // Corrupted storage — leave store in default state
    }
  };

  const clearUser = () => {
    user.value = {
      email: null,
      google_id: null,
      name: null,
      picture_hash: null,
      background_hash: null,
      roles_fk: null,
      user_name: null,
      users_pk: null,
      verified: null,
      zip_code: null,
      countries_fk: null,
      join_date: null,
      timezone: null,
    };
    localStorage.removeItem(STORAGE_KEY);
  };

  const userIanaTimezone = () =>
    user.value.timezone?.iana_name ?? FALLBACK_TIMEZONE.iana_name;

  // Run immediately upon initialization of the store to prevent race conditions during early component mount phases
  restoreFromStorage();

  return {
    user,
    setUser,
    restoreFromStorage,
    clearUser,
    userIanaTimezone,
    editingPictureHash,
    editingBackgroundHash,
    cacheBuster,
  };
});