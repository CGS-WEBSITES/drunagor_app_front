import ImageUrl from "@/assets/monster/big/CorruptedFarmerBig.webp";
export class CorruptedFarmer {
  id = "corrupted-farmer";
  name = "Corrupted Farmer";
  content = "rise-of-the-undead-dragon";
  variants = ["standard", "alternate"];
  images = {
    big: ImageUrl,
    miniature: "",
  };
  color = "white";
  translation_key = "monster.corrupted-farmer";
}
