<template>
  <v-dialog v-model="dialogIsActive" activator="parent" max-width="800">
    <v-card min-height="380">
      <v-card-title class="d-flex align-center">
        <span>Choose your profile picture</span>
        <v-btn
          icon="mdi-close"
          class="ml-auto"
          variant="text"
          @click="dialogIsActive = false"
        ></v-btn>
      </v-card-title>

      <v-card-text class="py-4">
        <v-row v-if="showAlert" no-gutters class="pa-2 mb-4">
          <BaseAlert
            v-model="showAlert"
            :type="alertType"
            :icon="alertIcon"
            :title="alertTitle"
            closable
            class="w-100"
          >
            {{ alertText }}
          </BaseAlert>
        </v-row>

        <v-row justify="start">
          <v-col
            v-for="(item, index) in availablePictures"
            :key="index"
            class="d-flex justify-center pa-3"
            cols="6"
            sm="4"
            md="4"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 16 : 4"
                :disabled="isSaving"
                class="cursor-pointer"
                :class="{
                  'active-selection': UserStore.user.picture_hash === item.hash,
                }"
                @click="selectAndSavePicture(item.hash)"
                rounded="md"
              >
                <v-img
                  :src="`${assets}/Profile/${item.hash}`"
                  :alt="item.hash"
                  width="130"
                  height="130"
                  aspect-ratio="1"
                  cover
                >
                  <v-overlay
                    :model-value="isSaving && savingPictureHash === item.hash"
                    contained
                    class="d-flex align-center justify-center"
                    scrim="rgba(0, 0, 0, 0.5)"
                  >
                    <v-progress-circular
                      indeterminate
                      color="white"
                    ></v-progress-circular>
                  </v-overlay>
                </v-img>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, inject, watch } from "vue";
import { useUserStore } from "@/store/UserStore";
import { getToken } from "@/service/AccessToken";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";

const axios: any = inject("axios");
const assets = inject<string>("assets");
const UserStore = useUserStore();

const dialogIsActive = ref(false);
const isSaving = ref(false);
const savingPictureHash = ref<string | null>(null);

const showAlert = ref(false);
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref<"success" | "error" | "warning" | "info">("info");

interface Picture {
  hash: string;
}
const availablePictures = ref<Picture[]>([
  { hash: "user.png" },
  { hash: "jaheen.png" },
  { hash: "lich.png" },
  { hash: "lorelai.png" },
  { hash: "maya.png" },
  { hash: "vorn.png" },
]);

watch(dialogIsActive, (isActive) => {
  if (!isActive) {
    showAlert.value = false;
  }
});

const setAlert = (
  icon: string,
  title: string,
  text: string,
  type: "success" | "error" | "warning" | "info",
) => {
  alertIcon.value = icon;
  alertTitle.value = title;
  alertText.value = text;
  alertType.value = type;
  showAlert.value = true;
};

const selectAndSavePicture = async (pictureHash: string) => {
  if (isSaving.value) return;

  isSaving.value = true;
  savingPictureHash.value = pictureHash;
  const user = UserStore.user;

  try {
    const response = await axios.put(
      "users/alter",
      {
        users_pk: user.users_pk,
        picture_hash: pictureHash,
      },
      {
        headers: getToken(),
      },
    );

    await UserStore.setUser({ ...user, picture_hash: pictureHash });

    setAlert("mdi-check-circle", "Success!", response.data.message, "success");

    setTimeout(() => {
      dialogIsActive.value = false;
    }, 1500);
  } catch (error: any) {
    console.error("Error saving image:", error);
    setAlert(
      "mdi-alert-circle",
      `Error ${error.response?.status || ""}`,
      error.response?.data?.message || "A network error occurred.",
      "error",
    );
  } finally {
    setTimeout(() => {
      isSaving.value = false;
      savingPictureHash.value = null;
    }, 1500);
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.active-selection {
  border: 4px solid #1976d2;
}
</style>
