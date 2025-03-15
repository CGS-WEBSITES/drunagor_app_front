<script setup lang="ts">
import { VariantStore } from "@/store/VariantStore";
import type { MonsterColor } from "@/data/type/MonsterColor";
import type { RandomMonster } from "@/entity/RandomMonster";
import type { RandomCommander } from "@/entity/RandomCommander";
import { RandomizeMonster } from "@/service/RandomizeMonster";
import { RandomizeCommander } from "@/service/RandomizeCommander";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import SwappableImage from "@/components/SwappableImage.vue";
import RandomizerTitle from "@/assets/Randomizer.webp";
import backgroundImage from "@/assets/monster/big/Background.webp";
import RandomizerQuickSelect from "@/components/RandomizerQuickSelect.vue";

const toast = useToast();
const { t } = useI18n();

const name = ref(t("randomizer.random-monster"));
const variant = ref("");
const currentCharacterId = ref("");
const frontImage = ref(RandomizerTitle.toString());
const backImage = ref("");
const excludeCurrentCharacter = ref(true);

const variantStore = VariantStore();

function getExcludedCharacters(): string[] {
  let excludedCharacters: string[] = [];
  if (excludeCurrentCharacter.value) {
    excludedCharacters = [currentCharacterId.value];
  }
  return excludedCharacters;
}

function getRandomMonster(color: MonsterColor) {
  let monster: RandomMonster | null = new RandomizeMonster().randomizeByColor(
    color,
    getExcludedCharacters()
  );

  if (monster === null) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: t("randomizer.error.no-other-monster-available"),
      life: 3000,
    });
    return;
  }

  currentCharacterId.value = monster.id;
  name.value = t(monster.translation_key);
  variant.value = t(
    variantStore.find(monster.getRandomVariant()).translation_key
  );
  frontImage.value = monster.image.main;
  backImage.value = monster.image.miniature;
}

function getRandomCommander() {
  let commander: RandomCommander | null = new RandomizeCommander().randomize(
    getExcludedCharacters()
  );

  if (commander === null) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: t("randomizer.error.no-other-commander-available"),
      life: 3000,
    });
    return;
  }

  currentCharacterId.value = commander.id;
  name.value = t(commander.translation_key);
  variant.value = t("randomizer.commander");
  if (commander.id === "demon-lord" || commander.id === "fallen-sisters") {
    variant.value = t("randomizer.overlord");
  }

  frontImage.value = commander.image.main;
  backImage.value = commander.image.miniature;

}
</script>

<template>
  <v-row no-gutters class="justify-center">

    <v-col cols="12" class="pa-0">
      <SwappableImage :title="name" :sub-title="variant" :background="backgroundImage" :frontImage="frontImage"
        :backImage="backImage" />
    </v-col>

    <v-col cols="12" class="d-flex justify-center pa-0">
      <v-checkbox
        :label="$t('randomizer.exclude-current-monster')" v-model="excludeCurrentCharacter">
      </v-checkbox>
    </v-col>


    <v-container max-width="680" class="d-none d-md-flex">
    <v-col cols="12" >
      <v-card rounded="" class="d-flex justify-center pa-3 elevation-0">
        <v-btn rounded class="mx-1" variant="elevated" @click="getRandomMonster('white')">{{ $t('randomizer.white') }}</v-btn class="mx-2">
        <v-btn rounded class="mx-1" variant="elevated" @click="getRandomMonster('gray')">{{ $t('randomizer.gray') }}</v-btn class="mx-2">
        <v-btn rounded class="mx-1" variant="elevated" @click="getRandomMonster('black')">{{ $t('randomizer.black') }}</v-btn class="mx-2">
        <v-btn rounded class="mx-1" variant="elevated" @click="getRandomCommander()">{{ $t('randomizer.commander') }}</v-btn>
      </v-card>
    </v-col>
  </v-container>
    


    <v-container class="d-md-none pa-4">
      <v-card>
      <v-card class="d-flex justify-center pa-3 elevation-0">
        <v-btn rounded class="mx-1" variant="elevated" @click="getRandomMonster('white')">{{ $t('randomizer.white') }}</v-btn class="mx-2">
        <v-btn rounded class="mx-1" variant="elevated" @click="getRandomMonster('gray')">{{ $t('randomizer.gray') }}</v-btn class="mx-2">
        <v-btn rounded class="mx-1" variant="elevated" @click="getRandomMonster('black')">{{ $t('randomizer.black') }}</v-btn class="mx-2">
      </v-card>
      <v-card class="d-flex justify-center pa-3 elevation-0">
      <v-btn  rounded variant="elevated" @click="getRandomCommander()">{{ $t('randomizer.commander') }}</v-btn>
    </v-card>
  </v-card>
      
    </v-container>



    <v-col cols="12" class="">
      <RandomizerQuickSelect />
    </v-col>

  

    
  </v-row>
</template>

<style scoped></style>
