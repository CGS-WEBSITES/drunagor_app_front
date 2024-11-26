import { RandomImage } from "@/entity/RandomImage";
import { RandomMonster } from "@/entity/RandomMonster";
export class RandomMonsterFactory {
  static fromMonsterData(monsterData) {
    return new RandomMonster(
      monsterData.id,
      monsterData.name,
      monsterData.translation_key,
      monsterData.variants,
      new RandomImage(monsterData.images.big, monsterData.images.miniature),
    );
  }
}
