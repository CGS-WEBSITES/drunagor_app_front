import * as _ from "lodash-es";
import { useI18n } from "vue-i18n";
export class KeywordDataRepository {
  find(id) {
    return _.find(this.keywords, { id: id });
  }
  findAll() {
    return this.keywords;
  }
  load(locale) {
    const i18n = useI18n();
    let keywords = i18n.messages.value[locale].keyword;
    if (keywords.length < 1) {
      keywords = i18n.messages.value[i18n.fallbackLocale.value].keyword;
    }
    this.keywords = keywords;
    this.keywords = _.sortBy(this.keywords, ["keyword"]);
  }
  keywords = [];
}
