// How rare a badge is, from the share of the community that holds it.
import { ref } from "vue";

export interface BadgeRarity {
  label: string;
  color: string;
}

// Lowest percentage for each tier, rarest last.
const TIERS: [number, BadgeRarity][] = [
  [50, { label: "Common", color: "#FFFFFF" }],
  [40, { label: "Uncommon", color: "#BCE9A1" }],
  [35, { label: "Rare", color: "#DCB0EB" }],
  [30, { label: "Very rare", color: "#9F5BB7" }],
  [25, { label: "Epic", color: "#B239A6" }],
  [20, { label: "Legendary", color: "#E59B56" }],
  [15, { label: "Mythic", color: "#784AD9" }],
  [10, { label: "Divine", color: "#8BF57A" }],
  [5, { label: "Unique", color: "#F6406C" }],
  [0, { label: "Supreme", color: "#FF9B05" }],
];

export function badgeRarity(percent: number): BadgeRarity {
  return (TIERS.find(([min]) => percent >= min) ?? TIERS[TIERS.length - 1])[1];
}

export function formatPercent(percent: number): string {
  if (percent > 0 && percent < 1) return "<1%";
  return `${Math.round(percent)}%`;
}

// Share of the community per badge, loaded once per session.
const stats = ref<Record<number, number> | null>(null);
let loading: Promise<void> | null = null;

export function useBadgeStats(axios: any) {
  if (!loading) {
    loading = axios
      .get("/rl_users_rewards/stats")
      .then(({ data }: any) => {
        const map: Record<number, number> = {};
        for (const reward of data?.rewards ?? []) map[reward.rewards_pk] = Number(reward.percent) || 0;
        stats.value = map;
      })
      .catch(() => {
        // Not available yet: badges show without percentages.
        stats.value = null;
        loading = null;
      });
  }
  return stats;
}
