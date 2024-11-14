import { CommanderDataStore } from "@/data/store/CommanderDataStore";
import { RandomCommanderFactory } from "@/service/RandomCommanderFactory";
import { ConfigurationStore } from "@/store/ConfigurationStore";
import * as _ from "lodash-es";
export class RandomizeCommander {
    configurationStore = ConfigurationStore();
    commanderDataStore = CommanderDataStore();
    randomize(excludedCommanderIds = []) {
        let commanders = _.cloneDeep(this.commanderDataStore.findAll());
        commanders = commanders.filter((commander) => {
            if (this.configurationStore.isEnabledMonsterContent(commander.content) ===
                false) {
                return false;
            }
            if (excludedCommanderIds.includes(commander.id)) {
                return false;
            }
            return true;
        });
        if (commanders.length === 0) {
            return null;
        }
        return RandomCommanderFactory.fromCommanderData(commanders[Math.floor(Math.random() * commanders.length)]);
    }
}
