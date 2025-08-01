import AvatarImageUrl from "@/assets/hero/avatar/WillowAvatar.webp";
import TrackerImageUrl from "@/assets/hero/trackerimage/WillowAvatar.png";
import TrackerInfoUrl from "@/assets/hero/trackerinfo/WillowINFO.png";
import type { HeroData } from "@/data/repository/HeroData";
import type { ArmorType } from "@/data/type/ArmorType";
import type { ContentId } from "@/data/type/ContentId";
import type { HeroClass } from "@/data/type/HeroClass";
import type { HeroPath } from "@/data/type/HeroPath";
import type { HeroRace } from "@/data/type/HeroRace";
import type { OffHandType } from "@/data/type/OffHandType";
import type { WeaponType } from "@/data/type/WeaponType";

export class Willow implements HeroData {
  id = "Willow";
  name = "Willow";
  content: ContentId = "spoils-of-war";
  class: HeroClass = "Druid";
  path: HeroPath = "Nature";
  race: HeroRace = "Halfling";
  proficiencies = {
    weapon: ["Implement"] as WeaponType[],
    offHand: ["Relic"] as OffHandType[],
    armor: ["Cloth"] as ArmorType[],
  };
  images = {
    avatar: AvatarImageUrl,
    trackerimage: TrackerImageUrl,
    trackerInfo: TrackerInfoUrl
  };
}
