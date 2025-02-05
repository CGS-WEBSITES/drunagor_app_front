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
  const user = ref<User | null>(null);

  const storedUser = localStorage.getItem("app_user");
  if (storedUser) {
    user.value = JSON.parse(storedUser) as User;
  }

  watch(user, (newUser) => {
    if (newUser) {
      localStorage.setItem("app_user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("app_user");
    }
  }, { deep: true });

  const setUser = (newUser: User) => {
    user.value = newUser;
    localStorage.setItem("app_user", JSON.stringify(newUser));
  };

  return { user, setUser };
});