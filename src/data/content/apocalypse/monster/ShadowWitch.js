import ImageUrl from "@/assets/monster/big/ShadowWitchBig.webp";
export class ShadowWitch {
  id = "shadow-witch";
  name = "Shadow Witch";
  content = "apocalypse";
  variants = ["standard", "alternate"];
  images = {
    big: ImageUrl,
    miniature: "",
  };
  color = "white";
  translation_key = "monster.shadow-witch";
}
