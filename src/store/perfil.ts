import { useStorage } from "@vueuse/core";

export const perfil = useStorage("AppStore.perfil", {
  users_pk: 0,
  name: "",
  user_name: "",
  picture_hash: "",
  google_id: "",
  zip_code: "",
});
