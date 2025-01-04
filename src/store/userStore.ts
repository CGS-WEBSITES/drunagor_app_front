import { defineStore } from "pinia";
import { user } from "./user"; // Importa a estrutura de dados do arquivo `user.ts`

export const useAppStore = defineStore("app", () => {
  // Verifica se o usuário está autenticado
  function isAuthenticated(): boolean {
    return !!user.value.username && !!user.value.email;
  }

  // Define o usuário (atualiza o estado com os dados do login)
  function setUser(username: string, email: string) {
    console.log("setUser called with:", { username, email });
    user.value.username = username;
    user.value.email = email;
  }

  // Limpa os dados do usuário (logout)
  function clearUser() {
    user.value.username = "";
    user.value.email = "";
  }

  // Obtém o username
  function getUsername(): string {
    return user.value.username || "Usuário não definido";
  }

  // Obtém o email
  function getEmail(): string {
    return user.value.email || "Email não definido";
  }

  return {
    isAuthenticated,
    setUser,
    clearUser,
    getUsername,
    getEmail,
  };
});
