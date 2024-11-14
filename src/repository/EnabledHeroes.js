import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { ConfigurationStore } from "@/store/ConfigurationStore";
export class EnabledHeroes {
    configurationStore = ConfigurationStore();
    repository = new HeroDataRepository();
    findAll() {
        const data = this.repository.findAll();
        const enabledHeroes = data.filter((hero) => {
            if (this.configurationStore
                .getEnabledHeroContent()
                .includes(hero.content) === false) {
                return false;
            }
            return true;
        });
        return enabledHeroes;
    }
}
