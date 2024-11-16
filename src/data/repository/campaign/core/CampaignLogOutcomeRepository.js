import * as _ from "lodash-es";
import { useI18n } from "vue-i18n";
export class CampaignLogOutcomeRepository {
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
    this.outcomes = outcomeList["core"].campaign;
    this.outcomes = _.sortBy(this.outcomes, ["name"]);
  }
}
