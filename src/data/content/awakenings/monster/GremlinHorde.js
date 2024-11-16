import ImageUrl from "@/assets/monster/big/GremlinHordeBig.webp";
export class GremlinHorde {
  id = "gremlin-horde";
  name = "Gremlin Horde";
  content = "awakenings";
  variants = ["standard", "alternate"];
  images = {
    big: ImageUrl,
    miniature: "",
  };
  color = "white";
  translation_key = "monster.gremlin-horde";
}
