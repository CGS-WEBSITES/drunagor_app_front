import ImageUrl from "@/assets/monster/big/RavagerBig.webp";
export class Ravager {
  id = "ravager";
  name = "Ravager";
  content = "the-ruin-of-luccanor";
  variants = ["standard", "alternate"];
  images = {
    big: ImageUrl,
    miniature: "",
  };
  color = "white";
  translation_key = "monster.ravager";
}
