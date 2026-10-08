// Symbol and name of the box a campaign is played with (campaign list,
// dashboards). Drunagor Nights shows its season flag.
import s1Flag from "@/assets/s1flag.png";
import s2Flag from "@/assets/s2flag.png";
import { CONTENT_LABELS, CONTENT_SYMBOLS } from "@/data/heroMeta";
import type { ContentId } from "@/data/type/ContentId";

export const campaignMark = (type: string): { symbol?: string; label: string } => {
  if (type === "underkeep") return { symbol: s1Flag, label: "Drunagor Nights · S1" };
  if (type === "underkeep2") return { symbol: s2Flag, label: "Drunagor Nights · S2" };
  const content = type as ContentId;
  return { symbol: CONTENT_SYMBOLS[content], label: type === "core" ? "Corebox" : CONTENT_LABELS[content] ?? type };
};
