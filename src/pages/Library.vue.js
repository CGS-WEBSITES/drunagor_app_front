/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { ref, computed, onBeforeMount, inject, nextTick } from "vue";
import ProductCard from "@/components/ProductCard.vue";
import { useUserStore } from "@/store/UserStore";
const filterStatus = ref("owned");
const rewardsStatus = ref("rewards_owned");
const selectedBox = ref("");
const componentChecked = ref(false);
const selectedComponentType = ref("");
const contentChecked = ref(false);
const selectedContent = ref("");
const user = useUserStore().user;
const cardName = ref("");
const boximage = ref("");
const Description = ref("");
const confirmationDialog = ref(false);
const confirmationMessage = ref("");
const dialog = ref(false);
const boxOptions = [
    "Companions and Furnitures",
    "AoDarkness",
    "Desert of Hellscar",
];
const contentOptions = ["Core", "Cosmetic", "Game Content"];
const componentTypes = [
    "Books",
    "Cards",
    "Miniatures",
    "Maps",
    "Doors",
    "Playerboards",
    "Punchboards",
    "Scorepad",
    "Trays",
];
const showFilters = ref(false);
const isDesktop = computed(() => window.innerWidth >= 960);
const setDialog = (name, description, image) => {
    cardName.value = name;
    dialog.value = true;
    Description.value = description;
    boximage.value = image;
};
const products = ref([]);
const goToLink = (link) => {
    if (link) {
        window.open(link, "_blank");
    }
    else {
        console.warn("Nenhum link encontrado para redirecionar.");
    }
};
const activeTab = ref(1);
const wishlist = ref([]);
const owned = ref([]);
const token = localStorage.getItem("accessToken");
const storedUser = localStorage.getItem("app_user");
const appUser = storedUser ? JSON.parse(storedUser) : null;
const toggleWishlist = async (productId) => {
    const product = products.value.find((p) => p.id === productId);
    if (!product)
        return;
    const isCurrentlyWishlisted = product.wish === true;
    const librariesPk = product.libraries_pk;
    if (!librariesPk) {
        await axios
            .post(url + "libraries/cadastro", {
            users_fk: appUser.users_pk,
            skus_fk: productId,
            wish: "true",
            owned: "false",
        }, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
            product.wish = true;
            product.owned = false;
            product.libraries_pk = response.data.libraries_pk;
            wishlist.value.push(productId);
        })
            .catch((error) => {
            console.error("Erro ao adicionar à wishlist:", error);
        });
    }
    else {
        await axios
            .put(url + "libraries/alter", {
            libraries_pk: librariesPk,
            users_fk: appUser.users_pk,
            skus_fk: productId,
            wish: isCurrentlyWishlisted ? "false" : "true",
            owned: "false",
        }, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => {
            product.wish = isCurrentlyWishlisted ? false : true;
            product.owned = false;
            if (isCurrentlyWishlisted) {
                wishlist.value = wishlist.value.filter((id) => id !== productId);
            }
            else {
                wishlist.value.push(productId);
            }
        })
            .catch((error) => {
            console.error("Erro ao atualizar a wishlist:", error);
        });
    }
};
const toggleOwned = async (productId) => {
    const product = products.value.find((p) => p.id === productId);
    if (!product)
        return;
    const isCurrentlyOwned = product.owned === true;
    const librariesPk = product.libraries_pk;
    if (!librariesPk) {
        console.log("isCurrentlyOwned:", isCurrentlyOwned);
        await axios
            .post(url + "libraries/cadastro", {
            users_fk: appUser.users_pk,
            skus_fk: productId,
            owned: "true",
            wish: "false",
        }, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
            product.owned = true;
            product.wish = false;
            product.libraries_pk = response.data.libraries_pk;
            owned.value.push(productId);
        })
            .catch((error) => {
            console.error("Erro ao adicionar ao owned:", error);
        });
    }
    else {
        await axios
            .put(url + "libraries/alter", {
            libraries_pk: librariesPk,
            users_fk: appUser.users_pk,
            skus_fk: productId,
            owned: isCurrentlyOwned ? "false" : "true",
            wish: "false",
        }, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => {
            product.owned = isCurrentlyOwned ? false : true;
            product.wish = false;
            if (isCurrentlyOwned) {
                owned.value = owned.value.filter((id) => id !== productId);
            }
            else {
                owned.value.push(productId);
            }
        })
            .catch((error) => {
            console.error("Erro ao atualizar o owned:", error);
        });
    }
};
const toggleFromWishlist = async (productId) => {
    const product = products.value.find((p) => p.id === productId);
    if (!product)
        return;
    await axios
        .put(url + "libraries/alter", {
        libraries_pk: product.libraries_pk,
        users_fk: appUser.users_pk,
        skus_fk: productId,
        wish: "false",
        owned: "false",
    }, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
        product.wish = false;
        product.owned = false;
        wishlist.value = wishlist.value.filter((id) => id !== productId);
        confirmationMessage.value = `Product "${product.name}" removed from Wishlist!`;
        confirmationDialog.value = true;
    })
        .catch((error) => {
        console.error("Erro ao remover da wishlist:", error);
    });
};
const toggleFromOwned = async (productId) => {
    const product = products.value.find((p) => p.id === productId);
    if (!product)
        return;
    await axios
        .put(url + "libraries/alter", {
        libraries_pk: product.libraries_pk,
        users_fk: appUser.users_pk,
        skus_fk: productId,
        owned: "false",
        wish: "false",
    }, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
        product.owned = false;
        product.wish = false;
        owned.value = owned.value.filter((id) => id !== productId);
        confirmationMessage.value = `Product "${product.name}" removed from Owned!`;
        confirmationDialog.value = true;
    })
        .catch((error) => {
        console.error("Erro ao remover do owned:", error);
    });
};
// const isInWishlist = (productId: number) => {
//   return wishlistItems.value.some((product) => product.id === productId);
// };
// const isOwned = (productId: number) => {
//   return ownedItems.value.some((product) => product.id === productId);
// };
const wishlistItems = computed(() => {
    const itemsWithWishTrue = products.value.filter((product) => product.wish === true);
    return itemsWithWishTrue;
});
const ownedItems = computed(() => {
    const itemsWithOwnedTrue = products.value.filter((product) => product.owned === true);
    return itemsWithOwnedTrue;
});
const axios = inject("axios");
const url = inject("apiUrl") || "";
const fetchProducts = async () => {
    try {
        const response = await axios.get(url + "skus/search", {
            params: {
                users_fk: appUser.users_pk,
                limit: 30,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const uniqueProducts = new Map();
        response.data.skus.forEach((el) => {
            if (!uniqueProducts.has(el.skus_pk)) {
                uniqueProducts.set(el.skus_pk, {
                    id: el.skus_pk,
                    name: el.name,
                    image: el.picture_hash,
                    link: el.link,
                    skus_pk: el.skus_pk,
                    description: "Descrição padrão",
                    color: el.color,
                    cardbg: el.background,
                    owned: el.owned,
                    wish: el.wish,
                    libraries_pk: el.libraries_pk,
                });
            }
        });
        products.value = Array.from(uniqueProducts.values());
        console.log("Produtos:", products.value);
    }
    catch (error) {
        console.log("Erro na API:", error);
    }
};
onBeforeMount(fetchProducts);
watch(confirmationDialog, async (newVal) => {
    if (newVal) {
        await nextTick();
        await fetchProducts();
    }
});
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    // CSS variable injection 
    // CSS variable injection end 
    const __VLS_0 = {}.VContainer;
    /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: ("pa-0 mt-16") },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: ("pa-0 mt-16") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const __VLS_6 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
        justify: ("center"),
    }));
    const __VLS_8 = __VLS_7({
        justify: ("center"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const __VLS_12 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        cols: ("12"),
        ...{ class: ("text-center mb-4") },
    }));
    const __VLS_14 = __VLS_13({
        cols: ("12"),
        ...{ class: ("text-center mb-4") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        ...{ class: ("cinzel-text font-weight-black pt-15 pb-4 justify-center text-center text-h2") },
    });
    __VLS_17.slots.default;
    var __VLS_17;
    __VLS_11.slots.default;
    var __VLS_11;
    const __VLS_18 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
        color: ("primary"),
        minHeight: ("220px"),
        ...{ class: ("pa-2") },
    }));
    const __VLS_20 = __VLS_19({
        color: ("primary"),
        minHeight: ("220px"),
        ...{ class: ("pa-2") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    const __VLS_24 = {}.VTabs;
    /** @type { [typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, typeof __VLS_components.VTabs, typeof __VLS_components.vTabs, ] } */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        modelValue: ((__VLS_ctx.activeTab)),
        alignTabs: ("center"),
        ...{ class: ("box-shadow centered-tabs d-flex justify-center") },
    }));
    const __VLS_26 = __VLS_25({
        modelValue: ((__VLS_ctx.activeTab)),
        alignTabs: ("center"),
        ...{ class: ("box-shadow centered-tabs d-flex justify-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    const __VLS_30 = {}.VTab;
    /** @type { [typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ] } */ ;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
        value: ((1)),
    }));
    const __VLS_32 = __VLS_31({
        value: ((1)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    __VLS_35.slots.default;
    var __VLS_35;
    const __VLS_36 = {}.VTab;
    /** @type { [typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ] } */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        value: ((2)),
    }));
    const __VLS_38 = __VLS_37({
        value: ((2)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_41.slots.default;
    var __VLS_41;
    const __VLS_42 = {}.VTab;
    /** @type { [typeof __VLS_components.VTab, typeof __VLS_components.vTab, typeof __VLS_components.VTab, typeof __VLS_components.vTab, ] } */ ;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
        value: ((3)),
    }));
    const __VLS_44 = __VLS_43({
        value: ((3)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    __VLS_47.slots.default;
    var __VLS_47;
    __VLS_29.slots.default;
    var __VLS_29;
    if (__VLS_ctx.activeTab === 1) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        const __VLS_48 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
            dense: (true),
        }));
        const __VLS_50 = __VLS_49({
            dense: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        for (const [product] of __VLS_getVForSourceType((__VLS_ctx.products))) {
            const __VLS_54 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
                key: ((product.id)),
                cols: ("12"),
                sm: ("6"),
                md: ("6"),
                lg: ("4"),
            }));
            const __VLS_56 = __VLS_55({
                key: ((product.id)),
                cols: ("12"),
                sm: ("6"),
                md: ("6"),
                lg: ("4"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_55));
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("card-wrapper") },
            });
            // @ts-ignore
            /** @type { [typeof ProductCard, ] } */ ;
            // @ts-ignore
            const __VLS_60 = __VLS_asFunctionalComponent(ProductCard, new ProductCard({
                ...{ 'onClick': {} },
                product: ((product)),
            }));
            const __VLS_61 = __VLS_60({
                ...{ 'onClick': {} },
                product: ((product)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_60));
            let __VLS_65;
            const __VLS_66 = {
                onClick: (() => __VLS_ctx.goToLink(product.link))
            };
            let __VLS_62;
            let __VLS_63;
            var __VLS_64;
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("buttons-container") },
            });
            const __VLS_67 = {}.VBtn;
            /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
            // @ts-ignore
            const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
                ...{ 'onClick': {} },
                prependIcon: ("mdi-list-box-outline"),
                size: ("small"),
                variant: ("outlined"),
                ...{ style: (({ backgroundColor: product.wish ? '#136D6D' : '' })) },
            }));
            const __VLS_69 = __VLS_68({
                ...{ 'onClick': {} },
                prependIcon: ("mdi-list-box-outline"),
                size: ("small"),
                variant: ("outlined"),
                ...{ style: (({ backgroundColor: product.wish ? '#136D6D' : '' })) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_68));
            let __VLS_73;
            const __VLS_74 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.activeTab === 1)))
                        return;
                    __VLS_ctx.toggleWishlist(product.id);
                }
            };
            let __VLS_70;
            let __VLS_71;
            (product.wish ? "- Wishlist" : "+ Wishlist");
            __VLS_72.slots.default;
            var __VLS_72;
            const __VLS_75 = {}.VBtn;
            /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
            // @ts-ignore
            const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
                ...{ 'onClick': {} },
                prependIcon: ("mdi-tag-check-outline"),
                variant: ("outlined"),
                size: ("small"),
                ...{ style: (({ backgroundColor: product.owned ? '#136D6D' : '' })) },
            }));
            const __VLS_77 = __VLS_76({
                ...{ 'onClick': {} },
                prependIcon: ("mdi-tag-check-outline"),
                variant: ("outlined"),
                size: ("small"),
                ...{ style: (({ backgroundColor: product.owned ? '#136D6D' : '' })) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_76));
            let __VLS_81;
            const __VLS_82 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.activeTab === 1)))
                        return;
                    __VLS_ctx.toggleOwned(product.id);
                }
            };
            let __VLS_78;
            let __VLS_79;
            (product.owned ? "- Owned" : "+ Owned");
            __VLS_80.slots.default;
            var __VLS_80;
            __VLS_59.slots.default;
            var __VLS_59;
        }
        __VLS_53.slots.default;
        var __VLS_53;
    }
    if (__VLS_ctx.activeTab === 2) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        const __VLS_83 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
            dense: (true),
        }));
        const __VLS_85 = __VLS_84({
            dense: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_84));
        for (const [product] of __VLS_getVForSourceType((__VLS_ctx.wishlistItems))) {
            const __VLS_89 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
                key: ((product.id)),
                cols: ("12"),
                sm: ("6"),
                md: ("4"),
            }));
            const __VLS_91 = __VLS_90({
                key: ((product.id)),
                cols: ("12"),
                sm: ("6"),
                md: ("4"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_90));
            const __VLS_95 = {}.VCard;
            /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
            // @ts-ignore
            const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({}));
            const __VLS_97 = __VLS_96({}, ...__VLS_functionalComponentArgsRest(__VLS_96));
            // @ts-ignore
            /** @type { [typeof ProductCard, ] } */ ;
            // @ts-ignore
            const __VLS_101 = __VLS_asFunctionalComponent(ProductCard, new ProductCard({
                ...{ 'onClick': {} },
                product: ((product)),
            }));
            const __VLS_102 = __VLS_101({
                ...{ 'onClick': {} },
                product: ((product)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_101));
            let __VLS_106;
            const __VLS_107 = {
                onClick: (() => __VLS_ctx.goToLink(product.link))
            };
            let __VLS_103;
            let __VLS_104;
            var __VLS_105;
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("wishlist-button-container") },
            });
            const __VLS_108 = {}.VBtn;
            /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
            // @ts-ignore
            const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
                ...{ 'onClick': {} },
                prependIcon: ("mdi-list-box-outline"),
                size: ("small"),
                variant: ("outlined"),
                ...{ style: (({ backgroundColor: product.wish ? '#136D6D' : '' })) },
            }));
            const __VLS_110 = __VLS_109({
                ...{ 'onClick': {} },
                prependIcon: ("mdi-list-box-outline"),
                size: ("small"),
                variant: ("outlined"),
                ...{ style: (({ backgroundColor: product.wish ? '#136D6D' : '' })) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_109));
            let __VLS_114;
            const __VLS_115 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.activeTab === 2)))
                        return;
                    __VLS_ctx.toggleFromWishlist(product.id);
                }
            };
            let __VLS_111;
            let __VLS_112;
            (product.wish ? " - Wishlist" : "+ Wishlist");
            __VLS_113.slots.default;
            var __VLS_113;
            __VLS_100.slots.default;
            var __VLS_100;
            __VLS_94.slots.default;
            var __VLS_94;
        }
        __VLS_88.slots.default;
        var __VLS_88;
    }
    if (__VLS_ctx.activeTab === 3) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        const __VLS_116 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
            dense: (true),
        }));
        const __VLS_118 = __VLS_117({
            dense: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        for (const [product] of __VLS_getVForSourceType((__VLS_ctx.ownedItems))) {
            const __VLS_122 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
                key: ((product.id)),
                cols: ("12"),
                sm: ("6"),
                md: ("4"),
            }));
            const __VLS_124 = __VLS_123({
                key: ((product.id)),
                cols: ("12"),
                sm: ("6"),
                md: ("4"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_123));
            const __VLS_128 = {}.VCard;
            /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
            // @ts-ignore
            const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({}));
            const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
            // @ts-ignore
            /** @type { [typeof ProductCard, ] } */ ;
            // @ts-ignore
            const __VLS_134 = __VLS_asFunctionalComponent(ProductCard, new ProductCard({
                ...{ 'onClick': {} },
                product: ((product)),
            }));
            const __VLS_135 = __VLS_134({
                ...{ 'onClick': {} },
                product: ((product)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_134));
            let __VLS_139;
            const __VLS_140 = {
                onClick: (() => __VLS_ctx.goToLink(product.link))
            };
            let __VLS_136;
            let __VLS_137;
            var __VLS_138;
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("owned-button-container") },
            });
            const __VLS_141 = {}.VBtn;
            /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
            // @ts-ignore
            const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
                ...{ 'onClick': {} },
                prependIcon: ("mdi-tag-check-outline"),
                variant: ("outlined"),
                size: ("small"),
                ...{ style: (({ backgroundColor: product.owned ? '#136D6D' : '' })) },
            }));
            const __VLS_143 = __VLS_142({
                ...{ 'onClick': {} },
                prependIcon: ("mdi-tag-check-outline"),
                variant: ("outlined"),
                size: ("small"),
                ...{ style: (({ backgroundColor: product.owned ? '#136D6D' : '' })) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_142));
            let __VLS_147;
            const __VLS_148 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.activeTab === 3)))
                        return;
                    __VLS_ctx.toggleFromOwned(product.id);
                }
            };
            let __VLS_144;
            let __VLS_145;
            (product.owned ? "- Owned" : "+ Owned");
            __VLS_146.slots.default;
            var __VLS_146;
            __VLS_133.slots.default;
            var __VLS_133;
            __VLS_127.slots.default;
            var __VLS_127;
        }
        __VLS_121.slots.default;
        var __VLS_121;
    }
    __VLS_23.slots.default;
    var __VLS_23;
    __VLS_5.slots.default;
    var __VLS_5;
    const __VLS_149 = {}.VDialog;
    /** @type { [typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ] } */ ;
    // @ts-ignore
    const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
        modelValue: ((__VLS_ctx.dialog)),
        maxWidth: ("440"),
    }));
    const __VLS_151 = __VLS_150({
        modelValue: ((__VLS_ctx.dialog)),
        maxWidth: ("440"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_150));
    const __VLS_155 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({
        ...{ class: ("custom-background") },
    }));
    const __VLS_157 = __VLS_156({
        ...{ class: ("custom-background") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_156));
    const __VLS_161 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
        ...{ class: ("font-weight-bold text-h4") },
    }));
    const __VLS_163 = __VLS_162({
        ...{ class: ("font-weight-bold text-h4") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_162));
    (__VLS_ctx.cardName);
    __VLS_166.slots.default;
    var __VLS_166;
    const __VLS_167 = {}.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
    // @ts-ignore
    const __VLS_168 = __VLS_asFunctionalComponent(__VLS_167, new __VLS_167({
        src: ("https://assets.drunagor.app.s3.us-east-2.amazonaws.com/Library/box-corebox.png"),
        ...{ class: ("my-4") },
        height: ("200"),
    }));
    const __VLS_169 = __VLS_168({
        src: ("https://assets.drunagor.app.s3.us-east-2.amazonaws.com/Library/box-corebox.png"),
        ...{ class: ("my-4") },
        height: ("200"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_168));
    const __VLS_173 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
        cols: ("12"),
    }));
    const __VLS_175 = __VLS_174({
        cols: ("12"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_174));
    const __VLS_179 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_180 = __VLS_asFunctionalComponent(__VLS_179, new __VLS_179({
        ...{ 'onClick': {} },
        block: (true),
        prependIcon: ("mdi-script-text"),
        color: ("#312F2F"),
        ...{ class: ("explore rounded-lg") },
    }));
    const __VLS_181 = __VLS_180({
        ...{ 'onClick': {} },
        block: (true),
        prependIcon: ("mdi-script-text"),
        color: ("#312F2F"),
        ...{ class: ("explore rounded-lg") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_180));
    let __VLS_185;
    const __VLS_186 = {
        onClick: (() => __VLS_ctx.goToLink('https://aodarkness.com'))
    };
    let __VLS_182;
    let __VLS_183;
    __VLS_184.slots.default;
    var __VLS_184;
    __VLS_178.slots.default;
    var __VLS_178;
    __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: ("pl-4 font-weight-medium text-h5") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: ("pl-4 pb-4 text-body-1") },
    });
    (__VLS_ctx.Description);
    const __VLS_187 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_188 = __VLS_asFunctionalComponent(__VLS_187, new __VLS_187({
        ...{ 'onClick': {} },
        ...{ class: ("rounded-0") },
        color: ("red"),
        text: ("Close"),
    }));
    const __VLS_189 = __VLS_188({
        ...{ 'onClick': {} },
        ...{ class: ("rounded-0") },
        color: ("red"),
        text: ("Close"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_188));
    let __VLS_193;
    const __VLS_194 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialog = false;
        }
    };
    let __VLS_190;
    let __VLS_191;
    var __VLS_192;
    __VLS_160.slots.default;
    var __VLS_160;
    __VLS_154.slots.default;
    var __VLS_154;
    ['pa-0', 'mt-16', 'text-center', 'mb-4', 'cinzel-text', 'font-weight-black', 'pt-15', 'pb-4', 'justify-center', 'text-center', 'text-h2', 'pa-2', 'box-shadow', 'centered-tabs', 'd-flex', 'justify-center', 'card-wrapper', 'buttons-container', 'wishlist-button-container', 'owned-button-container', 'custom-background', 'font-weight-bold', 'text-h4', 'my-4', 'explore', 'rounded-lg', 'pl-4', 'font-weight-medium', 'text-h5', 'pl-4', 'pb-4', 'text-body-1', 'rounded-0',];
    var __VLS_slots;
    var $slots;
    let __VLS_inheritedAttrs;
    var $attrs;
    const __VLS_refs = {};
    var $refs;
    var $el;
    return {
        attrs: {},
        slots: __VLS_slots,
        refs: $refs,
        rootEl: $el,
    };
}
;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ProductCard: ProductCard,
            cardName: cardName,
            Description: Description,
            dialog: dialog,
            products: products,
            goToLink: goToLink,
            activeTab: activeTab,
            toggleWishlist: toggleWishlist,
            toggleOwned: toggleOwned,
            toggleFromWishlist: toggleFromWishlist,
            toggleFromOwned: toggleFromOwned,
            wishlistItems: wishlistItems,
            ownedItems: ownedItems,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
