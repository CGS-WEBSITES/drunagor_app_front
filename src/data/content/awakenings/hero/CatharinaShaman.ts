import AvatarImageUrl from "@/assets/hero/avatar/CatharinaShamanAvatar.webp";
import TrackerImageUrl from "@/assets/hero/trackerimage/CatharinaShamanAvatar.png";
import TrackerInfoUrl from "@/assets/hero/trackerinfo/CatharinaShamanINFO.png";
import type { HeroData } from "@/data/repository/HeroData";
import type { ArmorType } from "@/data/type/ArmorType";
import type { ContentId } from "@/data/type/ContentId";
import type { HeroClass } from "@/data/type/HeroClass";
import type { HeroPath } from "@/data/type/HeroPath";
import type { HeroRace } from "@/data/type/HeroRace";
import type { OffHandType } from "@/data/type/OffHandType";
import type { WeaponType } from "@/data/type/WeaponType";

export class CatharinaShaman implements HeroData {
  id = "catharina";
  name = "Catharina (Shaman)";
  content: ContentId = "awakenings";
  class: HeroClass = "Shaman";
  path: HeroPath = "Mystics";
  race: HeroRace = "Human";
  proficiencies = {
    weapon: ["Implement"] as WeaponType[],
    offHand: ["Off Hand Weapon"] as OffHandType[],
    armor: ["Cloth"] as ArmorType[],
  };
  images = {
    avatar: AvatarImageUrl,
    trackerimage: TrackerImageUrl,
    trackerInfo: TrackerInfoUrl
  };
}
