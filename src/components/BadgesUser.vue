<template>
  <v-container max-width="800" style="min-width: 360px" class="pa-4">
    <v-card
      rounded="lg"
      elevation="3"
      color="primary"
      class="pl-1 pt-1 pr-1 pb-0 clickable-badges-card"
      @click="showAllBadges = true"
    >
      <!-- Header -->
      <v-card-title class="d-flex justify-space-between pb-0">
        <span
          class="text-uppercase font-weight-black text-bold text-h5 mb-4 pb-0 text-white"
          >BADGES</span
        >
      </v-card-title>

      <!-- Virtual Scroller -->
      <div v-if="userRewards.length > 0">
        <v-virtual-scroll class="pt-0" :items="userRewards" :item-height="130">
          <template #default="{ item }">
            <v-card
              rounded="lg"
              elevation="3"
              class="py-2 px-0 mb-2 d-flex align-center position-relative"
              color="secundary"
            >
              <v-row class="align-center">
                <!-- Icon -->
                <v-col
                  cols="2"
                  lg="2"
                  class="d-flex align-center justify-center ml-3 ml-md-0"
                >
                  <v-img
                    :src="item.image"
                    alt="Reward Icon"
                    max-height="80"
                    class="rounded-lg"
                  ></v-img>
                </v-col>

                <!-- Details -->
                <v-col cols="9" class="pl-0 d-flex flex-column justify-center" :class="{ 'pr-badge-rarity': rarityOf(item.rewardsPk) }">
                  <p class="font-weight-bold white--text ma-0">
                    {{ item.title }}
                  </p>
                  <p class="text-body-2 grey--text ma-0">
                    {{ item.description }}
                  </p>
                  <p class="text-caption grey--text ma-0">{{ item.date }}</p>
                </v-col>
              </v-row>
              <!-- Share of the community that has it. -->
              <div v-if="rarityOf(item.rewardsPk)" class="badge-rarity" :style="{ color: rarityOf(item.rewardsPk)!.color }">
                <strong>{{ rarityOf(item.rewardsPk)!.percent }}</strong>
                <span>{{ rarityOf(item.rewardsPk)!.label }}</span>
              </div>
            </v-card>
          </template>
        </v-virtual-scroll>
      </div>

      <!-- No rewards message -->
      <div v-else class="text-center py-6">
        <v-icon color="grey lighten-1" size="48"
          >mdi-emoticon-sad-outline</v-icon
        >
        <p class="mt-4 text-body-1 white--text font-weight-medium">
          You don't have any rewards yet.
        </p>
        <p class="text-caption grey--text pb-3"></p>
      </div>
    </v-card>

    <!-- Achievements Overlay Dialog -->
    <AllBadgesDialog v-model="showAllBadges" :userId="userId" />
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import AllBadgesDialog from "@/components/dialogs/AllBadgesDialog.vue";
import { badgeRarity, formatPercent, useBadgeStats } from "@/utils/badgeRarity";

const userRewards = ref<any[]>([]);
const showAllBadges = ref(false);

// Percentage of the community with each badge, and its rarity tier.
const badgeStats = useBadgeStats(axios);
const rarityOf = (rewardPk: number) => {
  const percent = badgeStats.value?.[Number(rewardPk)];
  if (percent == null) return null;
  return { ...badgeRarity(percent), percent: formatPercent(percent) };
};
const route = useRoute();

const userId = computed(() => {
  try {
    const encodedId = route.params.id as string;
    if (!encodedId) return 0;
    return atob(encodedId);
  } catch (e) {
    console.error("Error decoding route params.id", e);
    return 0;
  }
});

const fetchUserRewards = async () => {
  try {
    if (!userId.value) return;

    const response = await axios.get("/rl_users_rewards/list_rewards", {
      params: { users_fk: userId.value },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    userRewards.value = (response.data.rewards || []).map((reward: any) => ({
      rewardsPk: reward.rewards_pk,
      image: `https://assets.drunagor.app/${reward.picture_hash}`,
      title: reward.name,
      description: reward.description,
      date: new Date(reward.date).toLocaleDateString(),
    }));
  } catch (err) {
    console.error("❌ Error fetching user rewards:", err);
    userRewards.value = [];
  }
};

onMounted(() => {
  fetchUserRewards();
});
</script>

<style scoped>
.clickable-badges-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.clickable-badges-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
}

/* Rarity: big italic percentage, tier name under it. */
.badge-rarity {
  position: absolute;
  right: 14px;
  bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: "Poppins", sans-serif;
  font-style: italic;
  line-height: 1;
  text-transform: uppercase;
}
.badge-rarity strong {
  font-size: 1.4rem;
  font-weight: 800;
}
.badge-rarity span {
  margin-top: 2px;
  font-size: 0.62rem;
  font-weight: 800;
}
.pr-badge-rarity {
  padding-right: 96px !important;
}
</style>
