/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { ref, inject, watch, nextTick } from "vue";
import { useUserStore } from "@/store/UserStore";
import { getToken } from "@/service/AccessToken";
const UserStore = useUserStore(); // Store do usuário
const reloadKey = ref(0);
const assets = inject("assets");
const selectedBackground = ref({ hash: null });
const availbleBackground = ref([
    { hash: "profile-bg-corelich-transparent.png" },
    { hash: "profile-bg-corewar-transparent.png" },
    { hash: "profile-bg-warriors-transparent.png" },
]);
const axios = inject("axios");
const alertIcon = ref("");
const alertText = ref("");
const alertTitle = ref("");
const alertType = ref("");
const showAlert = ref(false);
// **WATCH** para atualizar a interface quando o background mudar
watch(() => UserStore.user.background_hash, () => {
    selectedBackground.value.hash = UserStore.user.background_hash;
    reloadKey.value += 1; // Força atualização do Vue
});
const setAllert = (icon, title, text, type) => {
    alertIcon.value = icon;
    alertTitle.value = title;
    alertText.value = text;
    showAlert.value = true;
    alertType.value = type;
};
const saveBG = async () => {
    const user = UserStore.user;
    try {
        const response = await axios.put("users/alter", {
            users_pk: user.users_pk,
            background_hash: selectedBackground.value.hash,
        }, {
            headers: getToken(),
        });
        console.log("✅ API Response:", response);
        // Atualiza o usuário no store sem precisar recarregar a página
        UserStore.setUser({
            ...user,
            background_hash: selectedBackground.value.hash,
        });
        // Aguarda atualização reativa do Vue antes de continuar
        await nextTick();
        reloadKey.value += 1; // Força um re-render no componente
        setAllert("mdi-check", "Success", "Background updated!", "success");
    }
    catch (error) {
        console.error("❌ Error updating background:", error);
        setAllert("mdi-alert-circle", "Error", error.response?.data?.message || "A network error occurred.", "error");
    }
};
const clearBack = () => {
    selectedBackground.value.hash = null;
    console.log("🗑️ Background reset:", selectedBackground.value);
};
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    const __VLS_0 = {}.VDialog;
    /** @type { [typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        activator: ("parent"),
        maxWidth: ("800"),
    }));
    const __VLS_2 = __VLS_1({
        activator: ("parent"),
        maxWidth: ("800"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { default: __VLS_thisSlot } = __VLS_5.slots;
        const [{ isActive }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_7 = {}.VCard;
        /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
        // @ts-ignore
        const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
            ...{ class: (({ 'on-hover': __VLS_ctx.isHovering })) },
            elevation: ((__VLS_ctx.isHovering ? 12 : 2)),
            ...(__VLS_ctx.props),
            minHeight: ("380"),
        }));
        const __VLS_9 = __VLS_8({
            ...{ class: (({ 'on-hover': __VLS_ctx.isHovering })) },
            elevation: ((__VLS_ctx.isHovering ? 12 : 2)),
            ...(__VLS_ctx.props),
            minHeight: ("380"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_8));
        const __VLS_13 = {}.VCardTitle;
        /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
        // @ts-ignore
        const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
            ...{ class: ("d-flex justify-space-betwenn") },
        }));
        const __VLS_15 = __VLS_14({
            ...{ class: ("d-flex justify-space-betwenn") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_14));
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        const __VLS_19 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
            ...{ 'onClick': {} },
            icon: ("mdi-close"),
            ...{ class: ("ml-auto") },
            text: ("Close"),
            variant: ("plain"),
        }));
        const __VLS_21 = __VLS_20({
            ...{ 'onClick': {} },
            icon: ("mdi-close"),
            ...{ class: ("ml-auto") },
            text: ("Close"),
            variant: ("plain"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_20));
        let __VLS_25;
        const __VLS_26 = {
            onClick: (...[$event]) => {
                isActive.value = false;
            }
        };
        let __VLS_22;
        let __VLS_23;
        var __VLS_24;
        __VLS_18.slots.default;
        var __VLS_18;
        const __VLS_27 = {}.VCardText;
        /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
        // @ts-ignore
        const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({}));
        const __VLS_29 = __VLS_28({}, ...__VLS_functionalComponentArgsRest(__VLS_28));
        const __VLS_33 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
            noGutters: (true),
            ...{ class: ("pa-2") },
        }));
        const __VLS_35 = __VLS_34({
            noGutters: (true),
            ...{ class: ("pa-2") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_34));
        const __VLS_39 = {}.VAlert;
        /** @type { [typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ] } */ ;
        // @ts-ignore
        const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
            closable: (true),
            modelValue: ((__VLS_ctx.showAlert)),
            icon: ((__VLS_ctx.alertIcon)),
            title: ((__VLS_ctx.alertTitle)),
            text: ((__VLS_ctx.alertText)),
            type: ((__VLS_ctx.alertType)),
        }));
        const __VLS_41 = __VLS_40({
            closable: (true),
            modelValue: ((__VLS_ctx.showAlert)),
            icon: ((__VLS_ctx.alertIcon)),
            title: ((__VLS_ctx.alertTitle)),
            text: ((__VLS_ctx.alertText)),
            type: ((__VLS_ctx.alertType)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_40));
        __VLS_38.slots.default;
        var __VLS_38;
        const __VLS_45 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({}));
        const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
        for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.availbleBackground))) {
            const __VLS_51 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
                cols: ("12"),
                sm: ("12"),
                md: ("6"),
                ...{ class: ("pa-2") },
                key: ((index)),
            }));
            const __VLS_53 = __VLS_52({
                cols: ("12"),
                sm: ("12"),
                md: ("6"),
                ...{ class: ("pa-2") },
                key: ((index)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_52));
            const __VLS_57 = {}.VHover;
            /** @type { [typeof __VLS_components.VHover, typeof __VLS_components.vHover, typeof __VLS_components.VHover, typeof __VLS_components.vHover, ] } */ ;
            // @ts-ignore
            const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({}));
            const __VLS_59 = __VLS_58({}, ...__VLS_functionalComponentArgsRest(__VLS_58));
            {
                const { default: __VLS_thisSlot } = __VLS_62.slots;
                const [{ isHovering, props }] = __VLS_getSlotParams(__VLS_thisSlot);
                const __VLS_63 = {}.VCard;
                /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
                // @ts-ignore
                const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
                    ...{ 'onClick': {} },
                    ...{ class: (({
                            'on-hover': isHovering,
                            'pa-0 d-flex justify-center': true,
                        })) },
                    elevation: ((isHovering ||
                        (__VLS_ctx.selectedBackground.hash && __VLS_ctx.selectedBackground.hash === item.hash)
                        ? 18
                        : 0)),
                    ...(props),
                    ...{ class: ("pa-0") },
                    disabled: ((__VLS_ctx.selectedBackground.hash && __VLS_ctx.selectedBackground.hash != item.hash)),
                    key: ((__VLS_ctx.reloadKey)),
                }));
                const __VLS_65 = __VLS_64({
                    ...{ 'onClick': {} },
                    ...{ class: (({
                            'on-hover': isHovering,
                            'pa-0 d-flex justify-center': true,
                        })) },
                    elevation: ((isHovering ||
                        (__VLS_ctx.selectedBackground.hash && __VLS_ctx.selectedBackground.hash === item.hash)
                        ? 18
                        : 0)),
                    ...(props),
                    ...{ class: ("pa-0") },
                    disabled: ((__VLS_ctx.selectedBackground.hash && __VLS_ctx.selectedBackground.hash != item.hash)),
                    key: ((__VLS_ctx.reloadKey)),
                }, ...__VLS_functionalComponentArgsRest(__VLS_64));
                let __VLS_69;
                const __VLS_70 = {
                    onClick: (...[$event]) => {
                        __VLS_ctx.selectedBackground.hash = item.hash;
                    }
                };
                let __VLS_66;
                let __VLS_67;
                const __VLS_71 = {}.VImg;
                /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
                // @ts-ignore
                const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
                    src: ((__VLS_ctx.assets + '/Profile/' + item.hash)),
                    alt: ((item.hash)),
                    maxWidth: ((518)),
                    ...{ style: ({}) },
                }));
                const __VLS_73 = __VLS_72({
                    src: ((__VLS_ctx.assets + '/Profile/' + item.hash)),
                    alt: ((item.hash)),
                    maxWidth: ((518)),
                    ...{ style: ({}) },
                }, ...__VLS_functionalComponentArgsRest(__VLS_72));
                __VLS_68.slots.default;
                var __VLS_68;
                __VLS_62.slots['' /* empty slot name completion */];
            }
            var __VLS_62;
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ("d-flex justify-end") },
                ...{ style: ({}) },
            });
            if (__VLS_ctx.selectedBackground.hash && __VLS_ctx.selectedBackground.hash === item.hash) {
                const __VLS_77 = {}.VBtn;
                /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
                // @ts-ignore
                const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
                    ...{ 'onClick': {} },
                    icon: (true),
                    color: ("error"),
                    elevation: ("3"),
                    rounded: ("xl"),
                    size: ("x-small"),
                }));
                const __VLS_79 = __VLS_78({
                    ...{ 'onClick': {} },
                    icon: (true),
                    color: ("error"),
                    elevation: ("3"),
                    rounded: ("xl"),
                    size: ("x-small"),
                }, ...__VLS_functionalComponentArgsRest(__VLS_78));
                let __VLS_83;
                const __VLS_84 = {
                    onClick: (...[$event]) => {
                        if (!((__VLS_ctx.selectedBackground.hash && __VLS_ctx.selectedBackground.hash === item.hash)))
                            return;
                        __VLS_ctx.clearBack();
                    }
                };
                let __VLS_80;
                let __VLS_81;
                const __VLS_85 = {}.VIcon;
                /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
                // @ts-ignore
                const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({}));
                const __VLS_87 = __VLS_86({}, ...__VLS_functionalComponentArgsRest(__VLS_86));
                __VLS_90.slots.default;
                var __VLS_90;
                __VLS_82.slots.default;
                var __VLS_82;
            }
            __VLS_56.slots.default;
            var __VLS_56;
        }
        __VLS_50.slots.default;
        var __VLS_50;
        __VLS_32.slots.default;
        var __VLS_32;
        const __VLS_91 = {}.VCardActions;
        /** @type { [typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ] } */ ;
        // @ts-ignore
        const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
            ...{ class: ("pa-0") },
        }));
        const __VLS_93 = __VLS_92({
            ...{ class: ("pa-0") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_92));
        const __VLS_97 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
            noGutters: (true),
        }));
        const __VLS_99 = __VLS_98({
            noGutters: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_98));
        const __VLS_103 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
            cols: ("6"),
        }));
        const __VLS_105 = __VLS_104({
            cols: ("6"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_104));
        const __VLS_109 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
            ...{ 'onClick': {} },
            height: ("52"),
            block: (true),
            color: ("success"),
            variant: ("flat"),
            disabled: ((!__VLS_ctx.selectedBackground.hash)),
        }));
        const __VLS_111 = __VLS_110({
            ...{ 'onClick': {} },
            height: ("52"),
            block: (true),
            color: ("success"),
            variant: ("flat"),
            disabled: ((!__VLS_ctx.selectedBackground.hash)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_110));
        let __VLS_115;
        const __VLS_116 = {
            onClick: (...[$event]) => {
                __VLS_ctx.saveBG();
            }
        };
        let __VLS_112;
        let __VLS_113;
        __VLS_114.slots.default;
        var __VLS_114;
        __VLS_108.slots.default;
        var __VLS_108;
        const __VLS_117 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
            cols: ("6"),
        }));
        const __VLS_119 = __VLS_118({
            cols: ("6"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_118));
        const __VLS_123 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
            ...{ 'onClick': {} },
            height: ("52"),
            block: (true),
            color: ("error"),
            variant: ("flat"),
        }));
        const __VLS_125 = __VLS_124({
            ...{ 'onClick': {} },
            height: ("52"),
            block: (true),
            color: ("error"),
            variant: ("flat"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_124));
        let __VLS_129;
        const __VLS_130 = {
            onClick: (() => {
                isActive.value = false;
                __VLS_ctx.clearBack();
            })
        };
        let __VLS_126;
        let __VLS_127;
        __VLS_128.slots.default;
        var __VLS_128;
        __VLS_122.slots.default;
        var __VLS_122;
        __VLS_102.slots.default;
        var __VLS_102;
        __VLS_96.slots.default;
        var __VLS_96;
        __VLS_12.slots.default;
        var __VLS_12;
    }
    var __VLS_5;
    ['on-hover', 'd-flex', 'justify-space-betwenn', 'ml-auto', 'pa-2', 'pa-2', 'on-hover', 'pa-0', 'd-flex', 'justify-center', 'pa-0', 'd-flex', 'justify-end', 'pa-0',];
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
            reloadKey: reloadKey,
            assets: assets,
            selectedBackground: selectedBackground,
            availbleBackground: availbleBackground,
            alertIcon: alertIcon,
            alertText: alertText,
            alertTitle: alertTitle,
            alertType: alertType,
            showAlert: showAlert,
            saveBG: saveBG,
            clearBack: clearBack,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
