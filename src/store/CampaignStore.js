import { useStorage } from "@vueuse/core";
import * as _ from "lodash-es";
import { defineStore } from "pinia";
export const CampaignStore = defineStore("campaign", () => {
  const campaigns = useStorage("CampaignStore.campaigns", []);
  function has(campaignId) {
    const activeCampaign = _.find(campaigns.value, { campaignId: campaignId });
    if (activeCampaign == undefined) {
      return false;
    }
    return true;
  }
  function find(campaignId) {
    const campaign = _.find(campaigns.value, { campaignId: campaignId });
    if (campaign == undefined) {
      throw new Error("Campaign could not be found: " + campaignId);
    }
    return campaign;
  }
  function findAll() {
    return campaigns.value;
  }
  function add(campaign) {
    campaigns.value.push(campaign);
  }
  function remove(campaignId) {
    campaigns.value = campaigns.value.filter((campaign) => {
      if (campaign.campaignId === campaignId) {
        return false;
      }
      return true;
    });
  }
  function rename(campaignId, newName) {
    const campaign = find(campaignId);
    campaign.name = newName;
  }
  return {
    campaigns,
    has,
    find,
    findAll,
    add,
    remove,
    rename,
  };
});
