import { useStorage } from "@vueuse/core";
import * as _ from "lodash-es";
import { defineStore } from "pinia";
export const PartyStore = defineStore("party", () => {
  const members = useStorage("PartyStore.members", []);
  function has(heroId) {
    const inParty = _.find(members.value, { heroId: heroId });
    if (inParty == undefined) {
      return false;
    }
    return true;
  }
  function find(heroId) {
    const member = _.find(members.value, { heroId: heroId });
    if (member == undefined) {
      throw new Error("Member could not be found: " + heroId);
    }
    return member;
  }
  function findAll() {
    return members.value;
  }
  function addMember(member) {
    members.value.push(member);
  }
  function removeMember(heroId) {
    members.value = members.value.filter((member) => {
      if (member.heroId === heroId) {
        return false;
      }
      return true;
    });
  }
  return {
    members,
    has,
    find,
    findAll,
    addMember,
    removeMember,
  };
});
