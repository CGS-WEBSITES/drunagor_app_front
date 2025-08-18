<template>
  <div>
    <v-dialog v-model="visible" max-width="500">
      <v-card>
        <v-card-title>Invite Player</v-card-title>
        <v-card-text>
          <p class="py-2">Invite players to play:</p>
          <v-textarea readonly auto-grow v-model="token" class="ma-0" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeModal">Cancel</v-btn>
          <v-btn @click="copyToClipboard">Copy to clipboard</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn
      variant="elevated"
      id="share-campaign"
      rounded
      @click="openDialog"
    >
      <v-icon left class="mr-2">mdi-share-variant</v-icon>
      Invite Player
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";

const props = defineProps<{ campaignId: string }>();
const visible = ref(false);
const token = ref("");
const toast = useToast();

const openDialog = () => {
  const prefix = Math.floor(1000 + Math.random() * 9000).toString();
  token.value = `${prefix}${props.campaignId}`;
  visible.value = true;
};

defineExpose({
  openDialog,
});

const closeModal = () => {
  visible.value = false;
};

const copyToClipboard = () => {
  navigator.clipboard
    .writeText(token.value)
    .then(() => {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Token copied",
      });
      closeModal();
    })
    .catch(() => {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Failed to copy token",
      });
    });
};
</script>

<style scoped></style>