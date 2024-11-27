import * as _ from "lodash-es";
export class StoryRecordFollowerRepository {
  followers = [
    {
      id: "elros",
      name: "Elros, the Assassin",
    },
    {
      id: "lorelai",
      name: "Lorelai, the Mage",
    },
    {
      id: "maya",
      name: "Maya, the Ranger",
    },
    {
      id: "minerva",
      name: "Minerva",
    },
    {
      id: "vorn",
      name: "Vorn, the Warrior",
    },
  ];
  find(outcomeId) {
    return _.find(this.followers, { id: outcomeId });
  }
  findAll() {
    return this.followers;
  }
}
