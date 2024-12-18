import { RandomCommander } from "@/entity/RandomCommander";
import { RandomImage } from "@/entity/RandomImage";
export class RandomCommanderFactory {
  static fromCommanderData(commander) {
    return new RandomCommander(
      commander.id,
      commander.name,
      commander.translation_key,
      new RandomImage(commander.images.big, commander.images.miniature),
    );
  }
}
