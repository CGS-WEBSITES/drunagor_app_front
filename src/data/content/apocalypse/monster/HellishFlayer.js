import ImageUrl from "@/assets/monster/big/HellishFlayerBig.webp";
export class HellishFlayer {
  id = "hellish-flayer";
  name = "Hellish Flayer";
  content = "apocalypse";
  variants = ["standard", "alternate"];
  images = {
    big: ImageUrl,
    miniature: "",
  };
  color = "gray";
  translation_key = "monster.hellish-flayer";
}
