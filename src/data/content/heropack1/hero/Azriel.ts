import AvatarImageUrl from "@/assets/hero/avatar/AzrielAvatar.webp";
import TrackerImageUrl from "@/assets/hero/trackerimage/AzrielAvatar.png";
import TrackerInfoUrl from "@/assets/hero/trackerinfo/AzrielINFO.png";
import type { HeroData } from "@/data/repository/HeroData";
import type { ArmorType } from "@/data/type/ArmorType";
import type { ContentId } from "@/data/type/ContentId";
import type { HeroClass } from "@/data/type/HeroClass";
import type { HeroPath } from "@/data/type/HeroPath";
import type { HeroRace } from "@/data/type/HeroRace";
import type { OffHandType } from "@/data/type/OffHandType";
import type { WeaponType } from "@/data/type/WeaponType";

export class Azriel implements HeroData {
  id = "azriel";
  name = "Azriel";
  content: ContentId = "hero-pack-1";
  class: HeroClass = "Swordmage";
  path: HeroPath = "Devotion";
  race: HeroRace = "Human";
  proficiencies = {
    weapon: ["Light"] as WeaponType[],
    offHand: ["Off Hand Weapon"] as OffHandType[],
    armor: ["Leather"] as ArmorType[],
  };
  images = {
    avatar: AvatarImageUrl,
    trackerimage: TrackerImageUrl,
    trackerInfo: TrackerInfoUrl
  };
}
