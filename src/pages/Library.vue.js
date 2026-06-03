/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onBeforeMount, inject, nextTick, watch } from "vue";
import Filters from "@/components/Filters.vue";
import ProductCard from "@/components/ProductCard.vue";
import { useUserStore } from "@/store/UserStore";
const filterStatus = ref("all");
const nameFilter = ref("");
const user = useUserStore().user;
const cardName = ref("");
const boximage = ref("");
const Description = ref("");
const confirmationDialog = ref(false);
const confirmationMessage = ref("");
const dialog = ref(false);
const nameOptions = ["A - Z", "Z - A"];
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
const filteredProducts = computed(() => {
    let result = products.value.filter(p => {
        const pName = p.name?.toLowerCase() || '';
        return !['underkeep', 'underkeep2'].includes(pName);
    });
    if (filterStatus.value === 'wishlist') {
        result = result.filter((product) => product.wish === true);
    }
    else if (filterStatus.value === 'owned') {
        result = result.filter((product) => product.owned === true);
    }
    // Optionally implement filtering by nameFilter, selectedBox, etc. if needed
    if (nameFilter.value === 'A - Z') {
        result.sort((a, b) => a.name.localeCompare(b.name));
    }
    else if (nameFilter.value === 'Z - A') {
        result.sort((a, b) => b.name.localeCompare(a.name));
    }
    return result;
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "pa-0 mt-14 mt-md-16 pb-12" },
    fluid: true,
}));
const __VLS_2 = __VLS_1({
    ...{ class: "pa-0 mt-14 mt-md-16 pb-12" },
    fluid: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    justify: "center",
    ...{ class: "d-none d-md-flex" },
}));
const __VLS_7 = __VLS_6({
    justify: "center",
    ...{ class: "d-none d-md-flex" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    cols: "12",
    ...{ class: "text-center mb-4" },
}));
const __VLS_11 = __VLS_10({
    cols: "12",
    ...{ class: "text-center mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "cinzel-text font-weight-black pt-4 pb-4 justify-center text-center text-h2 text-white" },
});
var __VLS_12;
var __VLS_8;
const __VLS_13 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ class: "pa-2 pa-md-4 rounded justify-center d-none d-md-flex" },
    align: "stretch",
    ...{ style: {} },
}));
const __VLS_15 = __VLS_14({
    ...{ class: "pa-2 pa-md-4 rounded justify-center d-none d-md-flex" },
    align: "stretch",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    cols: "12",
    md: "3",
    ...{ class: "px-3" },
}));
const __VLS_19 = __VLS_18({
    cols: "12",
    md: "3",
    ...{ class: "px-3" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
const __VLS_21 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    color: "primary",
    ...{ class: "pa-4 h-100 d-flex flex-column" },
    rounded: "lg",
    elevation: "0",
}));
const __VLS_23 = __VLS_22({
    color: "primary",
    ...{ class: "pa-4 h-100 d-flex flex-column" },
    rounded: "lg",
    elevation: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
const __VLS_25 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    ...{ class: "pa-0 mb-4 text-white" },
}));
const __VLS_27 = __VLS_26({
    ...{ class: "pa-0 mb-4 text-white" },
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
var __VLS_28;
/** @type {[typeof Filters, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(Filters, new Filters({
    ...{ 'onUpdate:filterStatus': {} },
    ...{ 'onUpdate:nameFilter': {} },
    filterStatus: (__VLS_ctx.filterStatus),
    nameFilter: (__VLS_ctx.nameFilter),
    nameOptions: (__VLS_ctx.nameOptions),
}));
const __VLS_30 = __VLS_29({
    ...{ 'onUpdate:filterStatus': {} },
    ...{ 'onUpdate:nameFilter': {} },
    filterStatus: (__VLS_ctx.filterStatus),
    nameFilter: (__VLS_ctx.nameFilter),
    nameOptions: (__VLS_ctx.nameOptions),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
let __VLS_32;
let __VLS_33;
let __VLS_34;
const __VLS_35 = {
    'onUpdate:filterStatus': (...[$event]) => {
        __VLS_ctx.filterStatus = $event;
    }
};
const __VLS_36 = {
    'onUpdate:nameFilter': (...[$event]) => {
        __VLS_ctx.nameFilter = $event;
    }
};
var __VLS_31;
var __VLS_24;
var __VLS_20;
const __VLS_37 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    cols: "12",
    md: "9",
}));
const __VLS_39 = __VLS_38({
    cols: "12",
    md: "9",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
const __VLS_41 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    ...{ class: "pa-4 h-100" },
    color: "primary",
    rounded: "lg",
}));
const __VLS_43 = __VLS_42({
    ...{ class: "pa-4 h-100" },
    color: "primary",
    rounded: "lg",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_44.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "library-scroll-container pr-1 pr-md-2" },
});
const __VLS_45 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    dense: true,
}));
const __VLS_47 = __VLS_46({
    dense: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
for (const [product] of __VLS_getVForSourceType((__VLS_ctx.filteredProducts))) {
    const __VLS_49 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
        key: (product.id),
        cols: "12",
        md: "6",
    }));
    const __VLS_51 = __VLS_50({
        key: (product.id),
        cols: "12",
        md: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    __VLS_52.slots.default;
    /** @type {[typeof ProductCard, typeof ProductCard, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(ProductCard, new ProductCard({
        ...{ 'onClick': {} },
        product: (product),
        ...{ class: "cursor-pointer" },
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onClick': {} },
        product: (product),
        ...{ class: "cursor-pointer" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_56;
    let __VLS_57;
    let __VLS_58;
    const __VLS_59 = {
        onClick: (() => __VLS_ctx.goToLink(product.link))
    };
    __VLS_55.slots.default;
    {
        const { actions: __VLS_thisSlot } = __VLS_55.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: () => { } },
            ...{ class: "d-flex w-100 justify-space-between mt-2" },
        });
        const __VLS_60 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
            ...{ 'onClick': {} },
            prependIcon: "mdi-star",
            size: "small",
            variant: (product.wish ? 'flat' : 'outlined'),
            color: (product.wish ? '#136D6D' : 'rgba(255,255,255,0.7)'),
            ...{ class: "text-caption rounded-pill flex-grow-1 mr-1" },
        }));
        const __VLS_62 = __VLS_61({
            ...{ 'onClick': {} },
            prependIcon: "mdi-star",
            size: "small",
            variant: (product.wish ? 'flat' : 'outlined'),
            color: (product.wish ? '#136D6D' : 'rgba(255,255,255,0.7)'),
            ...{ class: "text-caption rounded-pill flex-grow-1 mr-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        let __VLS_64;
        let __VLS_65;
        let __VLS_66;
        const __VLS_67 = {
            onClick: (...[$event]) => {
                __VLS_ctx.toggleWishlist(product.id);
            }
        };
        __VLS_63.slots.default;
        var __VLS_63;
        const __VLS_68 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
            ...{ 'onClick': {} },
            prependIcon: "mdi-check-circle",
            size: "small",
            variant: (product.owned ? 'flat' : 'outlined'),
            color: (product.owned ? '#136D6D' : 'rgba(255,255,255,0.7)'),
            ...{ class: "text-caption rounded-pill flex-grow-1 ml-1" },
        }));
        const __VLS_70 = __VLS_69({
            ...{ 'onClick': {} },
            prependIcon: "mdi-check-circle",
            size: "small",
            variant: (product.owned ? 'flat' : 'outlined'),
            color: (product.owned ? '#136D6D' : 'rgba(255,255,255,0.7)'),
            ...{ class: "text-caption rounded-pill flex-grow-1 ml-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        let __VLS_72;
        let __VLS_73;
        let __VLS_74;
        const __VLS_75 = {
            onClick: (...[$event]) => {
                __VLS_ctx.toggleOwned(product.id);
            }
        };
        __VLS_71.slots.default;
        var __VLS_71;
    }
    var __VLS_55;
    var __VLS_52;
}
var __VLS_48;
var __VLS_44;
var __VLS_40;
var __VLS_16;
const __VLS_76 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    ...{ class: "pa-2 justify-center mx-auto d-flex d-md-none align-start" },
    ...{ style: {} },
}));
const __VLS_78 = __VLS_77({
    ...{ class: "pa-2 justify-center mx-auto d-flex d-md-none align-start" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
const __VLS_80 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    cols: "12",
    ...{ class: "px-2" },
}));
const __VLS_82 = __VLS_81({
    cols: "12",
    ...{ class: "px-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
const __VLS_84 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    color: "primary",
    ...{ class: "pa-3 pa-sm-4 d-flex flex-column justify-start" },
    rounded: "lg",
    ...{ style: {} },
}));
const __VLS_86 = __VLS_85({
    color: "primary",
    ...{ class: "pa-3 pa-sm-4 d-flex flex-column justify-start" },
    rounded: "lg",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
const __VLS_88 = {}.VExpansionPanels;
/** @type {[typeof __VLS_components.VExpansionPanels, typeof __VLS_components.vExpansionPanels, typeof __VLS_components.VExpansionPanels, typeof __VLS_components.vExpansionPanels, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    ...{ class: "mb-4" },
}));
const __VLS_90 = __VLS_89({
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
const __VLS_92 = {}.VExpansionPanel;
/** @type {[typeof __VLS_components.VExpansionPanel, typeof __VLS_components.vExpansionPanel, typeof __VLS_components.VExpansionPanel, typeof __VLS_components.vExpansionPanel, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    bgColor: "secondary",
    elevation: "0",
    ...{ style: {} },
}));
const __VLS_94 = __VLS_93({
    bgColor: "secondary",
    elevation: "0",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
const __VLS_96 = {}.VExpansionPanelTitle;
/** @type {[typeof __VLS_components.VExpansionPanelTitle, typeof __VLS_components.vExpansionPanelTitle, typeof __VLS_components.VExpansionPanelTitle, typeof __VLS_components.vExpansionPanelTitle, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    ...{ class: "font-weight-bold text-white text-h6 px-4" },
}));
const __VLS_98 = __VLS_97({
    ...{ class: "font-weight-bold text-white text-h6 px-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
var __VLS_99;
const __VLS_100 = {}.VExpansionPanelText;
/** @type {[typeof __VLS_components.VExpansionPanelText, typeof __VLS_components.vExpansionPanelText, typeof __VLS_components.VExpansionPanelText, typeof __VLS_components.vExpansionPanelText, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({}));
const __VLS_102 = __VLS_101({}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
/** @type {[typeof Filters, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(Filters, new Filters({
    ...{ 'onUpdate:filterStatus': {} },
    ...{ 'onUpdate:nameFilter': {} },
    filterStatus: (__VLS_ctx.filterStatus),
    nameFilter: (__VLS_ctx.nameFilter),
    nameOptions: (__VLS_ctx.nameOptions),
}));
const __VLS_105 = __VLS_104({
    ...{ 'onUpdate:filterStatus': {} },
    ...{ 'onUpdate:nameFilter': {} },
    filterStatus: (__VLS_ctx.filterStatus),
    nameFilter: (__VLS_ctx.nameFilter),
    nameOptions: (__VLS_ctx.nameOptions),
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
let __VLS_107;
let __VLS_108;
let __VLS_109;
const __VLS_110 = {
    'onUpdate:filterStatus': (...[$event]) => {
        __VLS_ctx.filterStatus = $event;
    }
};
const __VLS_111 = {
    'onUpdate:nameFilter': (...[$event]) => {
        __VLS_ctx.nameFilter = $event;
    }
};
var __VLS_106;
var __VLS_103;
var __VLS_95;
var __VLS_91;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "library-scroll-container" },
});
const __VLS_112 = {}.VRow;
/** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    noGutters: true,
}));
const __VLS_114 = __VLS_113({
    noGutters: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
for (const [product] of __VLS_getVForSourceType((__VLS_ctx.filteredProducts))) {
    const __VLS_116 = {}.VCol;
    /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        key: (product.id),
        cols: "12",
    }));
    const __VLS_118 = __VLS_117({
        key: (product.id),
        cols: "12",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    /** @type {[typeof ProductCard, typeof ProductCard, ]} */ ;
    // @ts-ignore
    const __VLS_120 = __VLS_asFunctionalComponent(ProductCard, new ProductCard({
        ...{ 'onClick': {} },
        product: (product),
        ...{ class: "cursor-pointer mb-3" },
    }));
    const __VLS_121 = __VLS_120({
        ...{ 'onClick': {} },
        product: (product),
        ...{ class: "cursor-pointer mb-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_120));
    let __VLS_123;
    let __VLS_124;
    let __VLS_125;
    const __VLS_126 = {
        onClick: (() => __VLS_ctx.goToLink(product.link))
    };
    __VLS_122.slots.default;
    {
        const { actions: __VLS_thisSlot } = __VLS_122.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: () => { } },
            ...{ class: "d-flex w-100 justify-space-between mt-1" },
        });
        const __VLS_127 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
            ...{ 'onClick': {} },
            prependIcon: "mdi-star",
            size: "small",
            variant: (product.wish ? 'flat' : 'outlined'),
            color: (product.wish ? '#136D6D' : 'rgba(255,255,255,0.7)'),
            ...{ class: "text-caption rounded-pill flex-grow-1 mr-1" },
        }));
        const __VLS_129 = __VLS_128({
            ...{ 'onClick': {} },
            prependIcon: "mdi-star",
            size: "small",
            variant: (product.wish ? 'flat' : 'outlined'),
            color: (product.wish ? '#136D6D' : 'rgba(255,255,255,0.7)'),
            ...{ class: "text-caption rounded-pill flex-grow-1 mr-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_128));
        let __VLS_131;
        let __VLS_132;
        let __VLS_133;
        const __VLS_134 = {
            onClick: (...[$event]) => {
                __VLS_ctx.toggleWishlist(product.id);
            }
        };
        __VLS_130.slots.default;
        var __VLS_130;
        const __VLS_135 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
            ...{ 'onClick': {} },
            prependIcon: "mdi-check-circle",
            size: "small",
            variant: (product.owned ? 'flat' : 'outlined'),
            color: (product.owned ? '#136D6D' : 'rgba(255,255,255,0.7)'),
            ...{ class: "text-caption rounded-pill flex-grow-1 ml-1" },
        }));
        const __VLS_137 = __VLS_136({
            ...{ 'onClick': {} },
            prependIcon: "mdi-check-circle",
            size: "small",
            variant: (product.owned ? 'flat' : 'outlined'),
            color: (product.owned ? '#136D6D' : 'rgba(255,255,255,0.7)'),
            ...{ class: "text-caption rounded-pill flex-grow-1 ml-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_136));
        let __VLS_139;
        let __VLS_140;
        let __VLS_141;
        const __VLS_142 = {
            onClick: (...[$event]) => {
                __VLS_ctx.toggleOwned(product.id);
            }
        };
        __VLS_138.slots.default;
        var __VLS_138;
    }
    var __VLS_122;
    var __VLS_119;
}
var __VLS_115;
var __VLS_87;
var __VLS_83;
var __VLS_79;
const __VLS_143 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
    modelValue: (__VLS_ctx.dialog),
    maxWidth: "440",
}));
const __VLS_145 = __VLS_144({
    modelValue: (__VLS_ctx.dialog),
    maxWidth: "440",
}, ...__VLS_functionalComponentArgsRest(__VLS_144));
__VLS_146.slots.default;
const __VLS_147 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({
    ...{ class: "custom-background" },
}));
const __VLS_149 = __VLS_148({
    ...{ class: "custom-background" },
}, ...__VLS_functionalComponentArgsRest(__VLS_148));
__VLS_150.slots.default;
const __VLS_151 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
    ...{ class: "font-weight-bold text-h4" },
}));
const __VLS_153 = __VLS_152({
    ...{ class: "font-weight-bold text-h4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
__VLS_154.slots.default;
(__VLS_ctx.cardName);
var __VLS_154;
const __VLS_155 = {}.VImg;
/** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
// @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({
    src: "https://assets.drunagor.app/Library/box-corebox.png",
    ...{ class: "my-4" },
    height: "200",
}));
const __VLS_157 = __VLS_156({
    src: "https://assets.drunagor.app/Library/box-corebox.png",
    ...{ class: "my-4" },
    height: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_156));
const __VLS_159 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({
    cols: "12",
}));
const __VLS_161 = __VLS_160({
    cols: "12",
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
__VLS_162.slots.default;
const __VLS_163 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent(__VLS_163, new __VLS_163({
    ...{ 'onClick': {} },
    block: true,
    prependIcon: "mdi-script-text",
    color: "#312F2F",
    ...{ class: "explore rounded-lg" },
}));
const __VLS_165 = __VLS_164({
    ...{ 'onClick': {} },
    block: true,
    prependIcon: "mdi-script-text",
    color: "#312F2F",
    ...{ class: "explore rounded-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
let __VLS_167;
let __VLS_168;
let __VLS_169;
const __VLS_170 = {
    onClick: (() => __VLS_ctx.goToLink('https://aodarkness.com'))
};
__VLS_166.slots.default;
var __VLS_166;
var __VLS_162;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "pl-4 font-weight-medium text-h5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "pl-4 pb-4 text-body-1" },
});
(__VLS_ctx.Description);
const __VLS_171 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_172 = __VLS_asFunctionalComponent(__VLS_171, new __VLS_171({
    ...{ 'onClick': {} },
    ...{ class: "rounded-0" },
    color: "red",
    text: "Close",
}));
const __VLS_173 = __VLS_172({
    ...{ 'onClick': {} },
    ...{ class: "rounded-0" },
    color: "red",
    text: "Close",
}, ...__VLS_functionalComponentArgsRest(__VLS_172));
let __VLS_175;
let __VLS_176;
let __VLS_177;
const __VLS_178 = {
    onClick: (...[$event]) => {
        __VLS_ctx.dialog = false;
    }
};
var __VLS_174;
var __VLS_150;
var __VLS_146;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-14']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-md-16']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-md-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['cinzel-text']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-md-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-none']} */ ;
/** @type {__VLS_StyleScopedClasses['d-md-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-100']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-100']} */ ;
/** @type {__VLS_StyleScopedClasses['library-scroll-container']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-md-2']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow-1']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['d-md-none']} */ ;
/** @type {__VLS_StyleScopedClasses['align-start']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-sm-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['library-scroll-container']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow-1']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-background']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['explore']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-0']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Filters: Filters,
            ProductCard: ProductCard,
            filterStatus: filterStatus,
            nameFilter: nameFilter,
            cardName: cardName,
            Description: Description,
            dialog: dialog,
            nameOptions: nameOptions,
            goToLink: goToLink,
            toggleWishlist: toggleWishlist,
            toggleOwned: toggleOwned,
            filteredProducts: filteredProducts,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
