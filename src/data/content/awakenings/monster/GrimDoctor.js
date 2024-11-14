import ImageUrl from "@/assets/monster/big/GrimDoctorBig.webp";
export class GrimDoctor {
    id = "grim-doctor";
    name = "Grim Doctor";
    content = "awakenings";
    variants = ["standard", "alternate"];
    images = {
        big: ImageUrl,
        miniature: "",
    };
    color = "white";
    translation_key = "monster.grim-doctor";
}
