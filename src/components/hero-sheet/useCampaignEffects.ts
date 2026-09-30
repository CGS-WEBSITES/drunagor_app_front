// Aura, status and outcome lists of each campaign type.
// Repositories read translations with useI18n, so call this from setup.
import { ConfigurationStore } from "@/store/ConfigurationStore";
import { CampaignLogAuraRepository as CoreAura } from "@/data/repository/campaign/core/CampaignLogAuraRepository";
import { CampaignLogStatusRepository as CoreStatus } from "@/data/repository/campaign/core/CampaignLogStatusRepository";
import { CampaignLogOutcomeRepository as CoreOutcome } from "@/data/repository/campaign/core/CampaignLogOutcomeRepository";
import { CampaignLogAuraRepository as AwakeningsAura } from "@/data/repository/campaign/awakenings/CampaignLogAuraRepository";
import { CampaignLogStatusRepository as AwakeningsStatus } from "@/data/repository/campaign/awakenings/CampaignLogStatusRepository";
import { CampaignLogAuraRepository as ApocalypseAura } from "@/data/repository/campaign/apocalypse/CampaignLogAuraRepository";
import { CampaignLogStatusRepository as ApocalypseStatus } from "@/data/repository/campaign/apocalypse/CampaignLogStatusRepository";
import { CampaignLogOutcomeRepository as ApocalypseOutcome } from "@/data/repository/campaign/apocalypse/CampaignLogOutcomeRepository";
import { CampaignLogStatusRepository as Season1Status } from "@/data/repository/campaign/underkeep/CampaignLogStatusRepository";
import { CampaignLogOutcomeRepository as Season1Outcome } from "@/data/repository/campaign/underkeep/CampaignLogOutcomeRepository";
import { CampaignLogStatusRepository as Season2Status } from "@/data/repository/campaign/underkeep2/CampaignLogStatusRepository";
import { CampaignLogOutcomeRepository as Season2Outcome } from "@/data/repository/campaign/underkeep2/CampaignLogOutcomeRepository";

export type Effect = { id: string; name: string; effect?: string };
type Repo = { load(locale: string): void; findAll(): Effect[] };

export interface CampaignEffects {
  id: string;
  short: string;
  label: string;
  aura: Effect[] | null;
  status: Effect[];
  outcome: Effect[] | null;
  outcomeLabel: string;
  nights?: boolean;
}

export function useCampaignEffects(): CampaignEffects[] {
  const language = ConfigurationStore().enabledLanguage;
  const load = (repository: Repo) => {
    repository.load(language);
    return repository.findAll();
  };
  return [
    { id: "core", short: "Core", label: "Core campaign", aura: load(new CoreAura()), status: load(new CoreStatus()), outcome: load(new CoreOutcome()), outcomeLabel: "Outcome" },
    { id: "awakenings", short: "Awakenings", label: "Awakenings", aura: load(new AwakeningsAura()), status: load(new AwakeningsStatus()), outcome: null, outcomeLabel: "Outcome" },
    { id: "apocalypse", short: "Apocalypse", label: "Apocalypse", aura: load(new ApocalypseAura()), status: load(new ApocalypseStatus()), outcome: load(new ApocalypseOutcome()), outcomeLabel: "Outcome" },
    { id: "underkeep", short: "DN S1", label: "Drunagor Nights – Season 1", aura: null, status: load(new Season1Status()), outcome: load(new Season1Outcome()), outcomeLabel: "Dungeon role", nights: true },
    { id: "underkeep2", short: "DN S2", label: "Drunagor Nights – Season 2", aura: null, status: load(new Season2Status()), outcome: load(new Season2Outcome()), outcomeLabel: "Dungeon role", nights: true },
  ];
}
