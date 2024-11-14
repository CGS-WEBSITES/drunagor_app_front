import * as _ from "lodash-es";
import { useI18n } from "vue-i18n";
export class CampaignLogAuraRepository {
    auras = [];
    find(auraId) {
        return _.find(this.auras, { id: auraId });
    }
    findAll() {
        return this.auras;
    }
    load(locale) {
        const i18n = useI18n();
        const auraList = i18n.messages.value[locale].auras;
        this.auras = auraList["core"].campaign;
        this.auras = _.sortBy(this.auras, ["name"]);
    }
}
