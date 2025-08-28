<template>
  <div>
    <v-dialog v-model="visible" max-width="500">
      <v-card>
        <v-card-title>Invite Player</v-card-title>
        <v-card-text>
          <p class="py-2">Invite players to play:</p>
          <v-text-field readonly auto-grow v-model="token" class="ma-0" />
          <p class="py-2">
            Paste this number into the <em>Join Campaign option</em> in the
            Campaigns menu.
          </p>
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
      style="display: none"
    >
      <v-icon left class="mr-2">mdi-share-variant</v-icon>
      Invite Player
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useToast } from "primevue/usetoast";

const props = defineProps<{
  campaignId: string;
  inviteCode: string | null;
}>();

const visible = ref(false);
const token = ref(props.inviteCode || "");
const toast = useToast();

watch(
  () => props.inviteCode,
  (newCode) => {
    if (newCode) {
      token.value = newCode;
    }
  },
);

const openDialog = () => {
  if (props.inviteCode) {
    token.value = props.inviteCode;
    visible.value = true;
  } else {
    toast.add({
      severity: "warn",
      summary: "Warning",
      detail: "Invite code not available yet.",
    });
  }
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
