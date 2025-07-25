import AvatarImageUrl from "@/assets/hero/avatar/AndreasAvatar.webp";
import TrackerImageUrl from "@/assets/hero/trackerimage/AndreasAvatar.png";
import TrackerInfoUrl from "@/assets/hero/trackerinfo/AndreasINFO.png";
import type { HeroData } from "@/data/repository/HeroData";
import type { ArmorType } from "@/data/type/ArmorType";
import type { ContentId } from "@/data/type/ContentId";
import type { HeroClass } from "@/data/type/HeroClass";
import type { HeroPath } from "@/data/type/HeroPath";
import type { HeroRace } from "@/data/type/HeroRace";
import type { OffHandType } from "@/data/type/OffHandType";
import type { WeaponType } from "@/data/type/WeaponType";

export class AndreasCleric implements HeroData {
  id = "andreas-cleric";
  name = "Andreas (Cleric)";
  content: ContentId = "awakenings";
  class: HeroClass = "Cleric";
  path: HeroPath = "Devotion";
  race: HeroRace = "Human";
  proficiencies = {
    weapon: ["Light"] as WeaponType[],
    offHand: ["Shield"] as OffHandType[],
    armor: ["Plate"] as ArmorType[],
  };
  images = {
    avatar: AvatarImageUrl,
    trackerimage: TrackerImageUrl,
    trackerInfo: TrackerInfoUrl
  };
}
