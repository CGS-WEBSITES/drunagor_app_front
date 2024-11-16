import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
export const ConfigurationStore = defineStore("configuration", () => {
  const enabledMonsterContent = useStorage("ContentStore.enabled", ["core"]);
  const enabledHeroContent = useStorage("ContentStore.enabled.hero", [
    "core",
    "spoils-of-war",
    "desert-of-hellscar",
    "rise-of-the-undead-dragon",
    "handuriel",
    "lordwrath",
  ]);
  const enabledVariants = useStorage("VariantStore.enabled", ["standard"]);
  const enabledLanguage = useStorage("LanguageStore.enabled", "en_US");
  function getEnabledMonsterContent() {
    return enabledMonsterContent.value;
  }
  function getEnabledHeroContent() {
    return enabledHeroContent.value;
  }
  function getEnabledVariants() {
    return enabledVariants.value;
  }
  function getEnabledLanguage() {
    return enabledLanguage.value;
  }
  function isEnabledMonsterContent(contentId) {
    return enabledMonsterContent.value.includes(contentId);
  }
  function isEnabledHeroContent(contentId) {
    return enabledHeroContent.value.includes(contentId);
  }
  function isEnabledVariant(variantId) {
    return enabledVariants.value.includes(variantId);
  }
  function isEnabledLanguage(locale) {
    return enabledLanguage.value === locale;
  }
  return {
    enabledMonsterContent,
    enabledHeroContent,
    enabledVariants,
    enabledLanguage,
    getEnabledMonsterContent,
    getEnabledHeroContent,
    getEnabledVariants,
    getEnabledLanguage,
    isEnabledMonsterContent,
    isEnabledHeroContent,
    isEnabledVariant,
    isEnabledLanguage,
  };
});
