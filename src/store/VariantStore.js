import { Alternate } from "@/entity/Alternate";
import { Complex } from "@/entity/Complex";
import { Standard } from "@/entity/Standard";
import * as _ from "lodash-es";
import { defineStore } from "pinia";
export const VariantStore = defineStore("variant", () => {
    const variants = [
        new Standard(),
        new Alternate(),
        new Complex(),
    ];
    function getAll() {
        return variants;
    }
    function find(variantId) {
        const variant = _.find(variants, { id: variantId });
        if (variant === undefined) {
            throw new Error("Variant with id:" + variantId + " can not be found");
        }
        return variant;
    }
    return {
        variants,
        getAll,
        find,
    };
});
