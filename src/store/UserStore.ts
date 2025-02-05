import { defineStore } from "pinia";
import { ref, watch } from "vue";

export interface User {
  email: string | null;
  google_id: string | null;
  name: string | null;
  picture_hash: string | null;
  roles_fk: number | null;
  user_name: string | null;
  users_pk: number | null;
  verified: boolean | null;
  zip_code: number | null;
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User>({
    email: null,
    google_id: null,
    name: null,
    picture_hash: null,
    roles_fk: null,
    user_name: null,
    users_pk: null,
    verified: null,
    zip_code: null,
  });

  const setUser = (newUser: User) => {
    user.value = newUser;
  };

  return { user, setUser };
});