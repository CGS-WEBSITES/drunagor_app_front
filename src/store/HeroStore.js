import { useStorage } from "@vueuse/core";
import * as _ from "lodash-es";
import { defineStore } from "pinia";
export const HeroStore = defineStore("hero", () => {
    const heroes = useStorage("HeroStore.heroes", []);
    function hasInCampaign(heroId, campaignId) {
        const inCampaign = _.find(heroes.value, {
            heroId: heroId,
            campaignId: campaignId,
        });
        if (inCampaign == undefined) {
            return false;
        }
        return true;
    }
    function findInCampaign(heroId, campaignId) {
        const hero = _.find(heroes.value, {
            heroId: heroId,
            campaignId: campaignId,
        });
        if (hero == undefined) {
            throw new Error("Hero could not be found: " + campaignId + " " + heroId);
        }
        return hero;
    }
    function findAllInCampaign(campaignId) {
        return _.filter(heroes.value, (hero) => {
            if (hero.campaignId === campaignId) {
                return true;
            }
            return false;
        });
    }
    function add(hero) {
        heroes.value.push(hero);
    }
    function removeFromCampaign(heroId, campaignId) {
        heroes.value = heroes.value.filter((hero) => {
            if (hero.campaignId === campaignId && hero.heroId === heroId) {
                return false;
            }
            return true;
        });
    }
    return {
        heroes,
        hasInCampaign,
        findInCampaign,
        findAllInCampaign,
        add,
        removeFromCampaign,
    };
});
