import AvatarImageUrl from "@/assets/hero/avatar/DuncanAvatar.webp";
import TrackerImageUrl from "@/assets/hero/trackerimage/DuncanAvatar.png";
import TrackerInfoUrl from "@/assets/hero/trackerinfo/DuncanINFO.png";
import type { HeroData } from "@/data/repository/HeroData";
import type { ArmorType } from "@/data/type/ArmorType";
import type { ContentId } from "@/data/type/ContentId";
import type { HeroClass } from "@/data/type/HeroClass";
import type { HeroPath } from "@/data/type/HeroPath";
import type { HeroRace } from "@/data/type/HeroRace";
import type { OffHandType } from "@/data/type/OffHandType";
import type { WeaponType } from "@/data/type/WeaponType";

export class Duncan implements HeroData {
  id = "duncan";
  name = "Duncan";
  content: ContentId = "spoils-of-war";
  class: HeroClass = "Warrior";
  path: HeroPath = "Strength";
  race: HeroRace = "Dwarf";
  proficiencies = {
    weapon: ["Heavy"] as WeaponType[],
    offHand: ["Shield"] as OffHandType[],
    armor: ["Plate"] as ArmorType[],
  };
  images = {
    avatar: AvatarImageUrl,
    trackerimage: TrackerImageUrl,
    trackerInfo: TrackerInfoUrl
  };
}
