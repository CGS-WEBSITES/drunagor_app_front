<template>
  <!-- The campaign's heading: the party name, editable in place, and its box. -->
  <div class="campaign-title">
    <label class="campaign-title__field" :class="{ 'campaign-title__field--readonly': !isAdmin }">
      <input
        v-model="partyName"
        :readonly="!isAdmin"
        :placeholder="isAdmin ? 'Name your party' : 'Unnamed party'"
        :aria-label="t('text.party-name')"
        maxlength="60"
        class="campaign-title__input"
      />
      <v-icon v-if="isAdmin" size="20" class="campaign-title__pencil">mdi-pencil</v-icon>
    </label>
    <span v-if="mark.label" class="campaign-title__box">
      <img v-if="mark.symbol" :src="mark.symbol" alt="" />
      {{ mark.label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { CampaignStore } from "@/store/CampaignStore";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { CONTENT_LABELS, CONTENT_SYMBOLS } from "@/data/heroMeta";
import type { ContentId } from "@/data/type/ContentId";
import s1Flag from "@/assets/s1flag.png";
import s2Flag from "@/assets/s2flag.png";

const props = withDefaults(
  defineProps<{
    campaignId: string;
    isAdmin?: boolean;
  }>(),
  {
    isAdmin: true,
  },
);

const { t } = useI18n();
const campaignStore = CampaignStore();

const partyName = computed({
  get() {
    return campaignStore.find(props.campaignId)?.name ?? "";
  },
  set(newValue) {
    if (props.isAdmin) {
      campaignStore.updateCampaignProperty(props.campaignId, "name", newValue);
    }
  },
});

// Box symbol and name of this campaign.
const mark = computed(() => {
  const type = campaignStore.findOptional(props.campaignId)?.campaign ?? "";
  if (type === "underkeep") return { symbol: s1Flag, label: "Drunagor Nights · Season 1" };
  if (type === "underkeep2") return { symbol: s2Flag, label: "Drunagor Nights · Season 2" };
  const content = type as ContentId;
  return { symbol: CONTENT_SYMBOLS[content], label: type === "core" ? "Corebox" : CONTENT_LABELS[content] ?? "" };
});
</script>

<style scoped>
.campaign-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
  font-family: "Poppins", sans-serif;
}
.campaign-title__field {
  display: flex;
  align-self: flex-start;
  max-width: 100%;
  align-items: center;
  gap: 8px;
  padding: 2px 6px 2px 0;
  border-bottom: 2px solid transparent;
  cursor: text;
  transition: border-color 0.15s ease;
}
.campaign-title__field:hover,
.campaign-title__field:focus-within {
  border-bottom-color: rgba(var(--v-theme-accent), 0.6);
}
.campaign-title__field--readonly {
  cursor: default;
}
.campaign-title__field--readonly:hover {
  border-bottom-color: transparent;
}
/* As wide as the name, so the pencil sits right after it. */
.campaign-title__input {
  field-sizing: content;
  min-width: 10ch;
  max-width: 100%;
  background: transparent;
  color: #fff;
  font-size: clamp(1.4rem, 4vw, 2.2rem);
  font-weight: 800;
  line-height: 1.2;
  text-transform: uppercase;
  outline: none;
}
.campaign-title__input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}
.campaign-title__pencil {
  opacity: 0.45;
}
.campaign-title__field:hover .campaign-title__pencil,
.campaign-title__field:focus-within .campaign-title__pencil {
  color: rgb(var(--v-theme-accent));
  opacity: 1;
}
.campaign-title__box {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.85;
}
.campaign-title__box img {
  width: auto;
  height: 18px;
}
</style>
