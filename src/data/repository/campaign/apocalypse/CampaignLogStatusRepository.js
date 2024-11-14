import * as _ from "lodash-es";
import { useI18n } from "vue-i18n";
export class CampaignLogStatusRepository {
    statuses = [];
    find(statusId) {
        return _.find(this.statuses, { id: statusId });
    }
    findAll() {
        return this.statuses;
    }
    load(locale) {
        const i18n = useI18n();
        const statusList = i18n.messages.value[locale].statuses;
        this.statuses = statusList["apocalypse"].campaign;
        this.statuses = _.sortBy(this.statuses, ["name"]);
    }
}
