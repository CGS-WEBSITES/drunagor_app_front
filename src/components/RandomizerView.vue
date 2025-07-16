<template>
  <v-row no-gutters class="justify-center">
    <v-col cols="12" class="pa-0">
      <SwappableImage
        :title="name"
        :sub-title="variant"
        :background="backgroundImage"
        :frontImage="frontImage"
        :backImage="backImage"
      />
    </v-col>

    <v-col cols="12" class="d-flex justify-center pb-0 pt-0">
      <v-checkbox
        :label="$t('randomizer.exclude-current-monster')"
        v-model="excludeCurrentCharacter"
      >
      </v-checkbox>
    </v-col>

    <v-container max-width="680" class="d-none d-md-flex pt-0">
      <v-col cols="12">
        <v-card
          color="primary"
          rounded=""
          class="d-flex justify-center pa-3 elevation-0"
        >
          <v-btn
            class="mx-1"
            variant="elevated"
            @click="getRandomMonster('white')"
            style="
              display: flex;
              align-items: center;
              gap: 8px;
              background-color: #ffffff;
              color: #000000;
            "
          >
            <div
              style="
                width: 24px;
                height: 24px;
                background-image: url(&quot;https://s3.us-east-2.amazonaws.com/assets.drunagor.app/CampaignTracker/WHITE+MONSTERS.png&quot;);
                background-size: contain;
                background-repeat: no-repeat;
              "
            ></div>
            {{ $t("randomizer.white") }}
          </v-btn>

          <v-btn
            class="mx-1"
            variant="elevated"
            @click="getRandomMonster('gray')"
            style="
              display: flex;
              align-items: center;
              gap: 8px;
              background-color: #898582;
              color: #ffffff;
            "
          >
            <div
              style="
                width: 24px;
                height: 24px;
                background-image: url(&quot;https://s3.us-east-2.amazonaws.com/assets.drunagor.app/CampaignTracker/GRAY+MONSTERS.png&quot;);
                background-size: contain;
                background-repeat: no-repeat;
              "
            ></div>
            {{ $t("randomizer.gray") }}
          </v-btn>

          <v-btn
            class="mx-1"
            variant="elevated"
            @click="getRandomMonster('black')"
            style="
              display: flex;
              align-items: center;
              gap: 8px;
              background-color: #11100b;
              color: #ffffff;
            "
          >
            <div
              style="
                width: 24px;
                height: 24px;
                background-image: url(&quot;https://s3.us-east-2.amazonaws.com/assets.drunagor.app/CampaignTracker/BLACK+MONSTERS.png&quot;);
                background-size: contain;
                background-repeat: no-repeat;
              "
            ></div>
            {{ $t("randomizer.black") }}
          </v-btn>

          <v-btn
            class="mx-1"
            variant="elevated"
            @click="getRandomCommander()"
            style="
              display: flex;
              align-items: center;
              gap: 8px;
              background-color: #947031;
              color: #ffffff;
            "
          >
            <div
              style="
                width: 24px;
                height: 24px;
                background-image: url(&quot;https://s3.us-east-2.amazonaws.com/assets.drunagor.app/CampaignTracker/COMMANDER.png&quot;);
                background-size: contain;
                background-repeat: no-repeat;
              "
            ></div>
            {{ $t("randomizer.commander") }}
          </v-btn>
        </v-card>
      </v-col>
    </v-container>

    <v-container class="d-md-none pa-4">
      <v-card>
        <v-card class="d-flex justify-center pa-3 elevation-0">
          <v-btn
            class="mx-1"
            variant="elevated"
            @click="getRandomMonster('white')"
            style="
              display: flex;
              align-items: center;
              gap: 8px;
              background-color: #ffffff;
              color: #000000;
            "
          >
            <div
              style="
                width: 24px;
                height: 24px;
                background-image: url(&quot;https://s3.us-east-2.amazonaws.com/assets.drunagor.app/CampaignTracker/WHITE+MONSTERS.png&quot;);
                background-size: contain;
                background-repeat: no-repeat;
              "
            ></div>
            {{ $t("randomizer.white") }}
          </v-btn>

          <v-btn
            class="mx-1"
            variant="elevated"
            @click="getRandomMonster('gray')"
            style="
              display: flex;
              align-items: center;
              gap: 8px;
              background-color: #898582;
              color: #ffffff;
            "
          >
            <div
              style="
                width: 24px;
                height: 24px;
                background-image: url(&quot;https://s3.us-east-2.amazonaws.com/assets.drunagor.app/CampaignTracker/GRAY+MONSTERS.png&quot;);
                background-size: contain;
                background-repeat: no-repeat;
              "
            ></div>
            {{ $t("randomizer.gray") }}
          </v-btn>

          <v-btn
            class="mx-1"
            variant="elevated"
            @click="getRandomMonster('black')"
            style="
              display: flex;
              align-items: center;
              gap: 8px;
              background-color: #11100b;
              color: #ffffff;
            "
          >
            <div
              style="
                width: 24px;
                height: 24px;
                background-image: url(&quot;https://s3.us-east-2.amazonaws.com/assets.drunagor.app/CampaignTracker/BLACK+MONSTERS.png&quot;);
                background-size: contain;
                background-repeat: no-repeat;
              "
            ></div>
            {{ $t("randomizer.black") }}
          </v-btn>
        </v-card>
        <v-card class="d-flex justify-center pb-3 elevation-0">
          <v-btn
            class="mx-"
            variant="elevated"
            @click="getRandomCommander()"
            style="
              display: flex;
              align-items: center;
              gap: 8px;
              background-color: #947031;
              color: #ffffff;
            "
          >
            <div
              style="
                width: 24px;
                height: 24px;
                background-image: url(&quot;https://s3.us-east-2.amazonaws.com/assets.drunagor.app/CampaignTracker/COMMANDER.png&quot;);
                background-size: contain;
                background-repeat: no-repeat;
              "
            ></div>
            {{ $t("randomizer.commander") }}
          </v-btn>
        </v-card>
      </v-card>
    </v-container>

    <v-col cols="12" class="">
      <ConfigurationVariant />
      <RandomizerQuickSelect />
    </v-col>
  </v-row>
</template>

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
    getExcludedCharacters(),
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
    variantStore.find(monster.getRandomVariant()).translation_key,
  );
  frontImage.value = monster.image.main;
  backImage.value = monster.image.miniature;
}

function getRandomCommander() {
  let commander: RandomCommander | null = new RandomizeCommander().randomize(
    getExcludedCharacters(),
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

<style scoped></style>
