import AvatarImageUrl from "@/assets/hero/avatar/SunAvatar.webp";
import TrackerImageUrl from "@/assets/hero/trackerimage/SunAvatar.png";
import TrackerInfoUrl from "@/assets/hero/trackerinfo/SunINFO.png";
import type { HeroData } from "@/data/repository/HeroData";
import type { ArmorType } from "@/data/type/ArmorType";
import type { ContentId } from "@/data/type/ContentId";
import type { HeroClass } from "@/data/type/HeroClass";
import type { HeroPath } from "@/data/type/HeroPath";
import type { HeroRace } from "@/data/type/HeroRace";
import type { OffHandType } from "@/data/type/OffHandType";
import type { WeaponType } from "@/data/type/WeaponType";

export class Sun implements HeroData {
  id = "sun";
  name = "Sun";
  content: ContentId = "spoils-of-war";
  class: HeroClass = "Monk";
  path: HeroPath = "Cunning";
  race: HeroRace = "Human";
  proficiencies = {
    weapon: ["Light"] as WeaponType[],
    offHand: ["Off Hand Weapon"] as OffHandType[],
    armor: ["Cloth"] as ArmorType[],
  };
  images = {
    avatar: AvatarImageUrl,
    trackerimage: TrackerImageUrl,
    trackerInfo: TrackerInfoUrl
  };
}
