import ImageUrl from "@/assets/monster/big/BoneReaperBig.webp";
import MiniatureUrl from "@/assets/monster/miniature/BoneReaperMiniature.webp";
export class BoneReaper {
    id = "bone-reaper";
    name = "Bone Reaper";
    content = "spoils-of-war";
    variants = ["standard", "alternate"];
    images = {
        big: ImageUrl,
        miniature: MiniatureUrl,
    };
    color = "gray";
    translation_key = "monster.bone-reaper";
}
