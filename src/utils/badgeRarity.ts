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
  if (percent < 1) return "<1%";
  return `${Math.round(percent)}%`;
}

// Share of the community per badge.
//
// The API has no per-badge totals, so the share is measured on the community
// itself: the active users list gives everyone, and the badges of a random
// sample of them (all of them, when there are few) give each badge's share.
// The result is kept for a day in this browser.
const stats = ref<Record<number, number> | null>(null);
let loading: Promise<void> | null = null;

const CACHE_KEY = "badgeRarity.v1";
const CACHE_HOURS = 24;
const SAMPLE_SIZE = 250;
const CONCURRENCY = 6;

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}` });

function readCache(): Record<number, number> | null {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null");
    if (cached && Date.now() - cached.at < CACHE_HOURS * 3600 * 1000) return cached.percents;
  } catch {
    // Unreadable cache: measure again.
  }
  return null;
}

function writeCache(percents: Record<number, number>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), percents }));
  } catch {
    // Storage full or blocked: keep it for this session only.
  }
}

function sample<T>(list: T[], size: number): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, size);
}

async function measure(axios: any): Promise<Record<number, number>> {
  const { data } = await axios.get("/users/search", { params: { limit: 100000 }, headers: authHeaders() });
  const users: { users_pk: number }[] = data?.users ?? [];
  if (!users.length) throw new Error("No users");

  const queue = sample(users, SAMPLE_SIZE);
  const holders: Record<number, number> = {};
  let measured = 0;
  const worker = async () => {
    while (queue.length) {
      const user = queue.shift()!;
      try {
        const res = await axios.get("/rl_users_rewards/list_rewards", { params: { users_fk: user.users_pk }, headers: authHeaders() });
        const owned = new Set<number>((res.data?.rewards ?? []).map((reward: any) => Number(reward.rewards_pk)));
        owned.forEach((pk) => (holders[pk] = (holders[pk] ?? 0) + 1));
        measured += 1;
      } catch {
        // Skip users we can't read.
      }
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  if (!measured) throw new Error("No samples");

  const percents: Record<number, number> = {};
  for (const [pk, count] of Object.entries(holders)) percents[Number(pk)] = (count / measured) * 100;
  return percents;
}

// Badges nobody in the sample holds are missing from the map: show them as rarest.
export function useBadgeStats(axios: any) {
  if (!loading) {
    const cached = readCache();
    if (cached) {
      stats.value = cached;
      loading = Promise.resolve();
      return stats;
    }
    loading = axios
      .get("/rl_users_rewards/stats", { headers: authHeaders() })
      .then(({ data }: any) => {
        // Exact numbers, when the backend has them.
        if (!(Number(data?.total_users) > 0) || !Array.isArray(data?.rewards)) throw new Error("No stats");
        const map: Record<number, number> = {};
        for (const reward of data.rewards) {
          if (reward?.rewards_pk != null && reward.percent != null) map[Number(reward.rewards_pk)] = Number(reward.percent);
        }
        return map;
      })
      .catch(() => measure(axios))
      .then((percents: Record<number, number>) => {
        stats.value = percents;
        writeCache(percents);
      })
      .catch(() => {
        // Can't measure now: badges show without percentages.
        stats.value = null;
        loading = null;
      });
  }
  return stats;
}
