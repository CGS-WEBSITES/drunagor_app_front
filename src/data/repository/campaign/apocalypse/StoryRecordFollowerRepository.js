import * as _ from "lodash-es";
export class StoryRecordFollowerRepository {
    followers = [
        {
            id: "amster-dehanse",
            name: "Amsterd deHanse",
        },
        {
            id: "carmilla-reinard",
            name: "Carmilla Reinard",
        },
        {
            id: "condottieri-daviggo",
            name: "Condottieri DaViggo",
        },
        {
            id: "dunedancer-khadija",
            name: "Dunedancer Khadija",
        },
        {
            id: "robin-rising",
            name: "Robin Rising",
        },
    ];
    find(outcomeId) {
        return _.find(this.followers, { id: outcomeId });
    }
    findAll() {
        return this.followers;
    }
}
