import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { RandomHeroFactory } from "@/service/RandomHeroFactory";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import * as _ from "lodash-es";
export class RandomizeHero {
  configurationStore = ConfigurationStore();
  repository = new HeroDataRepository();
  randomize(excludedHeroIds = []) {
    let heroes = _.cloneDeep(this.repository.findAll());
    heroes = heroes.filter((hero) => {
      if (
        this.configurationStore.isEnabledHeroContent(hero.content) === false
      ) {
        return false;
      }
      if (excludedHeroIds.includes(hero.id)) {
        return false;
      }
      return true;
    });
    if (heroes.length === 0) {
      return null;
    }
    return RandomHeroFactory.fromHeroData(
      heroes[Math.floor(Math.random() * heroes.length)],
    );
  }
}
