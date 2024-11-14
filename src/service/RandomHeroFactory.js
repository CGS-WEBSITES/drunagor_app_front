import { RandomHero } from "@/entity/RandomHero";
export class RandomHeroFactory {
    static fromHeroData(hero) {
        return new RandomHero(hero.id, hero.name);
    }
}
