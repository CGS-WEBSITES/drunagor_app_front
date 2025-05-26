import ImageUrl from "@/assets/monster/big/WermuggdirBig.webp";
import type { CommanderData } from "@/data/store/CommanderData";
import type { ContentId } from "@/data/type/ContentId";

export class Wermuggdir implements CommanderData {
  id = "wermuggdir";
  name = "Wermuggdir";
  content: ContentId = "desert-of-hellscar";
  images = {
    big: ImageUrl,
    miniature: "",
  };
  translation_key = "monster.wermuggdir";
}
