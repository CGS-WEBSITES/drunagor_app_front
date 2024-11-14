import { MonsterDataStore } from "@/data/store/MonsterDataStore";
import { RandomMonsterFactory } from "@/service/RandomMonsterFactory";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import * as _ from "lodash-es";
export class RandomizeMonster {
    configurationStore = ConfigurationStore();
    monsterDataStore = MonsterDataStore();
    randomizeByColor(requestedColor, excludedMonsterIds = []) {
        let monsters = _.cloneDeep(this.monsterDataStore.findAll());
        monsters.forEach((monster) => {
            monster.variants = this.filterDisabledVariants(monster.variants);
        });
        monsters = monsters.filter((monster) => {
            if (monster.variants.length === 0) {
                return false;
            }
            if (this.configurationStore.isEnabledMonsterContent(monster.content) ===
                false) {
                return false;
            }
            if (monster.color !== requestedColor) {
                return false;
            }
            if (excludedMonsterIds.includes(monster.id)) {
                return false;
            }
            return true;
        });
        if (monsters.length === 0) {
            return null;
        }
        return RandomMonsterFactory.fromMonsterData(monsters[Math.floor(Math.random() * monsters.length)]);
    }
    filterDisabledVariants(variants) {
        const filteredVariants = variants.filter((variantId) => {
            return this.configurationStore.isEnabledVariant(variantId);
        });
        return filteredVariants;
    }
}
