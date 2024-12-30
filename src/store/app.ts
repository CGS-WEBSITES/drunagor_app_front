// store/app.ts
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    user: {
      username: "", // Nome de usuário
      email: "",    // Email do usuário (opcional)
    },
  }),
  actions: {
    setUser(userData: { username: string; email?: string }) {
      this.user.username = userData.username;
      if (userData.email) this.user.email = userData.email;
    },
  },
});
