import { defineStore } from "pinia";
import { ref } from "vue";

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
}

export const useUserStore = defineStore('user', () => {
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
  });

  const setUser = (newUser: User) => {
    user.value = newUser;

    localStorage.setItem("app_user", JSON.stringify(newUser));
  };

  return { user, setUser };
});