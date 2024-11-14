import ImageUrl from "@/assets/monster/big/HellspawnBruteBig.webp";
export class HellspawnBrute {
    id = "hellspawn-brute";
    name = "Hellspawn Brute";
    content = "awakenings";
    variants = ["standard", "alternate"];
    images = {
        big: ImageUrl,
        miniature: "",
    };
    color = "gray";
    translation_key = "monster.hellspawn-brute";
}
