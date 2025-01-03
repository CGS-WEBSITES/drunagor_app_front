import { useStorage } from "@vueuse/core";

export const user = useStorage("AppStore.user", {
  username: "",
  email: "",
});
