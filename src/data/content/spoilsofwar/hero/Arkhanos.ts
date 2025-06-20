import AvatarImageUrl from "@/assets/hero/avatar/ArkhanosAvatar.webp";
import TrackerImageUrl from "@/assets/hero/trackerimage/ArkhanosAvatar.png";
import TrackerInfoUrl from "@/assets/hero/trackerinfo/ArkanosINFO.png";
import type { HeroData } from "@/data/repository/HeroData";
import type { ArmorType } from "@/data/type/ArmorType";
import type { ContentId } from "@/data/type/ContentId";
import type { HeroClass } from "@/data/type/HeroClass";
import type { HeroPath } from "@/data/type/HeroPath";
import type { HeroRace } from "@/data/type/HeroRace";
import type { OffHandType } from "@/data/type/OffHandType";
import type { WeaponType } from "@/data/type/WeaponType";

export class Arkhanos implements HeroData {
  id = "arkhanos";
  name = "Arkhanos";
  content: ContentId = "spoils-of-war";
  class: HeroClass = "Mage";
  path: HeroPath = "Mystics";
  race: HeroRace = "Human";
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
