<template>
  <v-dialog v-model="dialogIsActive" activator="parent" max-width="800">
    <v-card min-height="380">
      <v-card-title class="d-flex align-center">
        <span>Choose your Background</span>
        <v-btn
          icon="mdi-close"
          class="ml-auto"
          variant="text"
          @click="dialogIsActive = false"
        ></v-btn>
      </v-card-title>

      <v-card-text>
        <v-row v-if="showAlert" no-gutters class="pa-2">
          <v-alert
            closable
            :icon="alertIcon"
            :title="alertTitle"
            :text="alertText"
            :type="alertType"
            @update:modelValue="showAlert = false"
          ></v-alert>
        </v-row>

        <v-row>
          <v-col
            v-for="(item, index) in availableBackgrounds"
            :key="index"
            cols="12"
            md="6"
            class="pa-2"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 12 : 2"
                :disabled="isSaving"
                class="cursor-pointer"
                :class="{
                  'active-selection':
                    UserStore.user.background_hash === item.hash,
                }"
                @click="selectAndSaveBackground(item.hash)"
              >
                <v-img
                  :src="`${assets}/Profile/${item.hash}`"
                  :alt="item.hash"
                  aspect-ratio="16/9"
                  cover
                >
                  <v-overlay
                    :model-value="
                      isSaving && savingBackgroundHash === item.hash
                    "
                    contained
                    class="d-flex align-center justify-center"
                    scrim="rgba(0, 0, 0, 0.5)"
                  >
                    <v-progress-circular
                      indeterminate
                      color="white"
                      size="64"
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

const axios: any = inject("axios");
const assets = inject<string>("assets");
const UserStore = useUserStore();

const dialogIsActive = ref(false);
const isSaving = ref(false);
const savingBackgroundHash = ref<string | null>(null);

const showAlert = ref(false);
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref<"success" | "error" | "warning" | "info">("info");

interface Background {
  hash: string;
}
const availableBackgrounds = ref<Background[]>([
  { hash: "profile-bg-corelich-transparent.png" },
  { hash: "profile-bg-corewar-transparent.png" },
  { hash: "profile-bg-warriors-transparent.png" },
]);

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

const selectAndSaveBackground = async (backgroundHash: string) => {
  if (isSaving.value) return;

  isSaving.value = true;
  savingBackgroundHash.value = backgroundHash;
  const user = UserStore.user;

  try {
    const response = await axios.put(
      "users/alter",
      {
        users_pk: user.users_pk,
        background_hash: backgroundHash,
      },
      {
        headers: getToken(),
      },
    );

    await UserStore.setUser({
      ...user,
      background_hash: backgroundHash,
    });

    setAlert("mdi-check-circle", "Success!", "Background updated!", "success");

    setTimeout(() => {
      dialogIsActive.value = false;
    }, 1500);
  } catch (error: any) {
    console.error("Error saving background:", error);
    setAlert(
      "mdi-alert-circle",
      `Error ${error.response?.status || ""}`,
      error.response?.data?.message || "A network error occurred.",
      "error",
    );
  } finally {
    setTimeout(() => {
      isSaving.value = false;
      savingBackgroundHash.value = null;
    }, 1500);
  }
};

watch(dialogIsActive, (isActive) => {
  if (!isActive) {
    showAlert.value = false;
  }
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.active-selection {
  border: 3px solid #1976d2;
  box-shadow: 0 0 12px rgba(25, 118, 210, 0.7);
}
</style>
