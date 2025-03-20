<template>
    <v-dialog activator="parent" max-width="800">
      <template v-slot:default="{ isActive }">
        <v-card
          :class="{ 'on-hover': isHovering }"
          :elevation="isHovering ? 12 : 2"
          v-bind="props"
          min-height="380"
        >
          <v-card-title class="d-flex justify-space-betwenn">
            <div>Choose your Background</div>
            <v-btn
              icon="mdi-close"
              class="ml-auto"
              text="Close"
              @click="isActive.value = false"
              variant="plain"
            ></v-btn>
          </v-card-title>
  
          <v-card-text>
            <v-row no-gutters class="pa-2">
              <v-alert
                closable
                v-model="showAlert"
                :icon="alertIcon"
                :title="alertTitle"
                :text="alertText"
                :type="alertType"
              ></v-alert>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="6"
                class="pa-2"
                v-for="(item, index) in availbleBackground"
                :key="index"
              >
                <v-hover v-slot="{ isHovering, props }">
                  <v-card
                    :class="{
                      'on-hover': isHovering,
                      'pa-0 d-flex justify-center': true,
                    }"
                    :elevation="
                      isHovering ||
                      (selectedBackground.hash && selectedBackground.hash === item.hash)
                        ? 18
                        : 0
                    "
                    v-bind="props"
                    class="pa-0"
                    :disabled="
                      selectedBackground.hash && selectedBackground.hash != item.hash
                    "
                    :key="reloadKey"
                    @click="selectedBackground.hash = item.hash"
                  >
                    <v-img
                      :src="assets + '/Profile/' + item.hash"
                      :alt="item.hash"
                      :max-width="518"
                      style="
                        border: 0.5px solid gold;
                        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                        background-color: black;
                      "
                    >
                    </v-img>
                  </v-card>
                </v-hover>
                <div
                  class="d-flex justify-end"
                  style="
                    width: 100%;
                    height: 0px;
                    position: relative;
                    bottom: 105%;
                    left: 5%;
                  "
                >
                  <v-btn
                    v-if="
                      selectedBackground.hash && selectedBackground.hash === item.hash
                    "
                    icon
                    color="error"
                    elevation="3"
                    rounded="xl"
                    size="x-small"
                    @click="clearBack()"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
  
          <v-card-actions class="pa-0">
            <v-row no-gutters>
              <v-col cols="6">
                <v-btn
                  height="52"
                  block
                  color="success"
                  variant="flat"
                  @click="saveBG()"
                  :disabled="!selectedBackground.hash"
                >
                  Save
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  height="52"
                  block
                  color="error"
                  variant="flat"
                  @click="
                    () => {
                      isActive.value = false;
                      clearBack();
                    }
                  "
                >
                  Cancel
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </template>
    
    <script lang="ts" setup>
 import { ref, inject, watch, nextTick } from "vue";
import { useUserStore } from "@/store/UserStore";
import { getToken } from "@/service/AccessToken";

const UserStore = useUserStore(); // Store do usuário
const reloadKey = ref<number>(0);
const assets = inject<string>("assets");

interface Background {
  hash: string | null;
}

const selectedBackground = ref<Background>({ hash: null });

const availbleBackground = ref<Background[]>([
  { hash: "profile-bg-corelich-transparent.png" },
  { hash: "profile-bg-corewar-transparent.png" },
  { hash: "profile-bg-warriors-transparent.png" },
]);

const axios: any = inject("axios");
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref("");
const showAlert = ref(false);

// **WATCH** para atualizar a interface quando o background mudar
watch(() => UserStore.user.background_hash, () => {
  selectedBackground.value.hash = UserStore.user.background_hash;
  reloadKey.value += 1; // Força atualização do Vue
});

const setAllert = (icon: string, title: string, text: string, type: string) => {
  alertIcon.value = icon;
  alertTitle.value = title;
  alertText.value = text;
  showAlert.value = true;
  alertType.value = type;
};

const saveBG = async () => {
  const user = UserStore.user;

  try {
    const response = await axios.put(
      "users/alter",
      {
        users_pk: user.users_pk,
        background_hash: selectedBackground.value.hash,
      },
      {
        headers: getToken(),
      }
    );

    console.log("✅ API Response:", response);

    // Atualiza o usuário no store sem precisar recarregar a página
    UserStore.setUser({
      ...user,
      background_hash: selectedBackground.value.hash,
    });

    // Aguarda atualização reativa do Vue antes de continuar
    await nextTick();

    reloadKey.value += 1; // Força um re-render no componente
    setAllert("mdi-check", "Success", "Background updated!", "success");
  } catch (error) {
    console.error("❌ Error updating background:", error);
    setAllert(
      "mdi-alert-circle",
      "Error",
      error.response?.data?.message || "A network error occurred.",
      "error"
    );
  }
};

const clearBack = () => {
  selectedBackground.value.hash = null;
  console.log("🗑️ Background reset:", selectedBackground.value);
};

  </script>
    