import ImageUrl from "@/assets/monster/big/FlinchBig.webp";
import type { CommanderData } from "@/data/store/CommanderData";
import type { ContentId } from "@/data/type/ContentId";

export class Flinch implements CommanderData {
  id = "commander-flinch";
  name = "Flinch";
  content: ContentId = "awakenings";
  images = {
    big: ImageUrl,
    miniature: "",
  };
  translation_key = "monster.commander-flinch";
}
