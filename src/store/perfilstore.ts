import { defineStore } from "pinia";
import { perfil } from "./perfil"; // Importa o estado inicial

export const usePerfilStore = defineStore("perfil", () => {
  // Busca o perfil do usuário da API
  async function fetchPerfilFromAPI() {
    try {
      const response = await fetch("https://seu-backend.com/api/perfil");
      if (!response.ok) {
        throw new Error("Erro ao buscar perfil");
      }

      const data = await response.json();

      // Atualiza o estado global
      setPerfil({
        users_pk: data.users_pk,
        name: data.name,
        user_name: data.user_name,
        picture_hash: data.picture_hash,
        google_id: data.google_id,
        zip_code: data.zip_code,
      });
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    }
  }

  // Atualiza o perfil do usuário no backend
  async function updatePerfil(updatedData: {
    user_name: string;
    zip_code: string;
    email: string;
    password?: string;
  }) {
    try {
      const response = await fetch("https://seu-backend.com/api/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          users_pk: perfil.value.users_pk,
          user_name: updatedData.user_name,
          zip_code: updatedData.zip_code,
          email: updatedData.email,
          password: updatedData.password || undefined, // Opcional
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar perfil");
      }

      const data = await response.json();

      // Atualiza o estado com os novos dados
      setPerfil({
        ...perfil.value,
        user_name: data.user_name,
        zip_code: data.zip_code,
      });

      console.log("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  }

  // Atualiza o estado localmente
  function setPerfil(data: {
    users_pk: number;
    name: string;
    user_name: string;
    picture_hash: string;
    google_id: string;
    zip_code: string;
  }) {
    perfil.value.users_pk = data.users_pk;
    perfil.value.name = data.name;
    perfil.value.user_name = data.user_name;
    perfil.value.picture_hash = data.picture_hash;
    perfil.value.google_id = data.google_id;
    perfil.value.zip_code = data.zip_code;
  }

  return {
    perfil,
    fetchPerfilFromAPI,
    updatePerfil,
    setPerfil,
  };
});
