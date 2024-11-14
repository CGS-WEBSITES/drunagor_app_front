import ImageUrl from "@/assets/monster/big/GorgonHexerBig.webp";
export class GorgonHexer {
    id = "gorgon-hexer";
    name = "Gorgon Hexer";
    content = "awakenings";
    variants = ["standard", "alternate"];
    images = {
        big: ImageUrl,
        miniature: "",
    };
    color = "gray";
    translation_key = "monster.gorgon-hexer";
}
