import ImageUrl from "@/assets/monster/big/ShadowGuardianBig.webp";
import MiniatureUrl from "@/assets/monster/miniature/ShadowGuardianMiniature.webp";
export class ShadowGuardian {
    id = "shadow-guardian";
    name = "Shadow Guardian";
    content = "the-shadow-world";
    variants = ["standard", "alternate"];
    images = {
        big: ImageUrl,
        miniature: MiniatureUrl,
    };
    color = "gray";
    translation_key = "monster.shadow-guardian";
}
