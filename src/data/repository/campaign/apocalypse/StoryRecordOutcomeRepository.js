import * as _ from "lodash-es";
import { useI18n } from "vue-i18n";
export class StoryRecordOutcomeRepository {
    outcomes = [];
    find(outcomeId) {
        return _.find(this.outcomes, { id: outcomeId });
    }
    findAll() {
        return this.outcomes;
    }
    load(locale) {
        const i18n = useI18n();
        const outcomeList = i18n.messages.value[locale].outcome;
        this.outcomes = outcomeList["apocalypse"].storyrecord;
        this.outcomes = _.sortBy(this.outcomes, ["name"]);
    }
}
