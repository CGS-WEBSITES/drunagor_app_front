/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { ref, onMounted, computed, inject } from "vue";
const StateList = ref([
    { name: "Alabama" },
    { name: "Alaska" },
    { name: "Arizona" },
    { name: "Arkansas" },
    { name: "California" },
    { name: "Colorado" },
    { name: "Connecticut" },
    { name: "Delaware" },
    { name: "Florida" },
    { name: "Georgia" },
    { name: "Hawaii" },
    { name: "Idaho" },
    { name: "Illinois" },
    { name: "Indiana" },
    { name: "Iowa" },
    { name: "Kansas" },
    { name: "Kentucky" },
    { name: "Louisiana" },
    { name: "Maine" },
    { name: "Maryland" },
    { name: "Massachusetts" },
    { name: "Michigan" },
    { name: "Minnesota" },
    { name: "Mississippi" },
    { name: "Missouri" },
    { name: "Montana" },
    { name: "Nebraska" },
    { name: "Nevada" },
    { name: "New Hampshire" },
    { name: "New Jersey" },
    { name: "New Mexico" },
    { name: "New York" },
    { name: "North Carolina" },
    { name: "North Dakota" },
    { name: "Ohio" },
    { name: "Oklahoma" },
    { name: "Oregon" },
    { name: "Pennsylvania" },
    { name: "Rhode Island" },
    { name: "South Carolina" },
    { name: "South Dakota" },
    { name: "Tennessee" },
    { name: "Texas" },
    { name: "Utah" },
    { name: "Vermont" },
    { name: "Virginia" },
    { name: "Washington" },
    { name: "West Virginia" },
    { name: "Wisconsin" },
    { name: "Wyoming" },
]);
// Exemplo de controle de país
const selectedCountry = ref(250);
const form = ref({
    site: "",
    storename: "",
    country: null,
    zipcode: "",
    MerchantID: "",
    storeImage: "",
    complement: "",
    address: "",
    streetNumber: "",
    city: "",
    state: "",
});
// Obtendo o axios injetado
const axios = inject("axios");
// Obter usuário logado
const storedUser = localStorage.getItem("app_user");
const appUser = storedUser ? JSON.parse(storedUser).users_pk : null;
const countriesList = ref([]);
const fetchCountries = () => {
    axios
        .get("countries/search")
        .then((response) => {
        countriesList.value = response.data.countries.map((country) => ({
            countries_pk: country.countries_pk,
            name: country.name,
            abbreviation: country.abbreviation,
        }));
    })
        .catch((error) => {
        console.error("Erro ao buscar países:", error);
    });
};
onMounted(() => {
    fetchCountries();
});
const stores = ref([]);
const fetchStores = async () => {
    try {
        const response = await axios.get("/stores/list", {
            params: { users_fk: userStore.user?.users_pk },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        stores.value = [...response.data.stores];
    }
    catch (error) {
        console.error("❌ Erro ao buscar lojas:", error.response?.data || error.message);
        stores.value = [];
    }
};
onMounted(() => {
    fetchStores();
});
import { useUserStore } from "@/store/UserStore";
const storeForm = ref(null);
const onlyAllowNumbers = (event) => {
    const char = String.fromCharCode(event.keyCode);
    if (!/^[0-9]$/.test(char)) {
        event.preventDefault();
    }
};
const userStore = useUserStore();
const showVerificationMessage = ref(false); // Adicione isso no seu <script setup>
const saveStore = async () => {
    const { valid } = await storeForm.value.validate();
    if (!valid) {
        console.warn("❌ Formulário inválido. Corrija os erros.");
        return;
    }
    const store = form.value;
    const fullAddress = `${store.streetNumber}, ${store.address}, ${store.complement}, ${store.city}, ${store.state}, ${store.country}`;
    const payload = {
        web_site: store.site,
        name: store.storename,
        zip_code: store.zipcode,
        countries_fk: store.country,
        users_fk: userStore.user?.users_pk,
        address: fullAddress,
        picture_hash: form.value.storeImage,
        merchant_id: store.MerchantID
    };
    try {
        const response = await axios.post("/stores/cadastro", payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        form.value = {
            storename: "",
            description: "",
            address: "",
            streetNumber: "",
            complement: "",
            city: "",
            state: "",
            zipcode: "",
            country: "",
            MerchantID: "",
            storeImage: "",
            site: "",
        };
        isExpanded.value = false;
        showVerificationMessage.value = true; // 👈 Exibe mensagem ao salvar
        await fetchStores();
        setTimeout(() => {
            showVerificationMessage.value = false; // Esconde após 5s
        }, 5000);
    }
    catch (error) {
        console.error("❌ Erro ao cadastrar a loja:", error.response?.data || error.message);
    }
};
const cancelForm = () => {
    form.value = {
        site: "",
        storename: "",
        country: null,
        zipcode: "",
        MerchantID: "",
        storeImage: "",
        complement: "",
        address: "",
        streetNumber: "",
        city: "",
        state: "",
    };
    isExpanded.value = false;
};
const isExpanded = ref(false);
const toggleForm = () => {
    isExpanded.value = !isExpanded.value;
};
const editDialog = ref(false);
const editableStore = ref({
    site: "",
    storename: "",
    country: null,
    zipcode: "",
    MerchantID: "",
    storeImage: "",
    address: "",
    streetNumber: "",
    complement: "",
    city: "",
    state: "",
});
const selectedStoreIndex = ref(null);
const openEditDialog = (store, index) => {
    const [streetNumber, address, complement, city, state, country] = store.address?.split(",").map((s) => s.trim()) || [];
    editableStore.value = {
        stores_pk: store.stores_pk,
        storename: store.name || store.storename,
        site: store.web_site || store.site || "",
        zipcode: store.zip_code || store.zipcode || "",
        country: country || "",
        state: state || "",
        city: city || "",
        complement: complement || "",
        address: address || "",
        streetNumber: streetNumber || "",
        MerchantID: store.MerchantID || store.merchant_id,
        storeImage: store.picture_hash || store.storeImage,
    };
    selectedStoreIndex.value = index;
    editDialog.value = true;
};
const handleImageUpload = async (event) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file)
        return;
    const formData = new FormData();
    formData.append("file", file);
    await axios
        .post("/images/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    })
        .then((response) => {
        form.value.storeImage = response.data.image_key;
    })
        .catch((error) => {
        console.error("❌ Error uploading image:", error.response?.data || error);
    });
};
const saveEditedStore = async () => {
    const store = editableStore.value;
    const fullAddress = `${store.streetNumber}, ${store.address}, ${store.complement}, ${store.city}, ${store.state}, ${store.country}`;
    const payload = {
        stores_pk: store.stores_pk,
        name: store.storename,
        web_site: store.site,
        zip_code: store.zipcode,
        countries_fk: store.country,
        users_fk: userStore.user?.users_pk,
        address: fullAddress,
        picture_hash: form.value.storeImage,
        merchant_id: store.MerchantID
    };
    try {
        await axios.put(`/stores/alter`, payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        // Atualiza localmente a lista, se necessário
        await fetchStores();
        editDialog.value = false;
    }
    catch (error) {
        console.error("❌ Erro ao atualizar a loja:", error.response?.data || error.message);
    }
};
const removeStore = async (stores_pk) => {
    try {
        const token = localStorage.getItem("accessToken");
        await axios.delete(`/stores/${stores_pk}/delete/`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        // Atualiza a lista após excluir
        await fetchStores();
    }
    catch (error) {
        console.error("❌ Erro ao excluir a loja:", error.response?.data || error.message);
    }
};
const isUnitedStates = computed(() => {
    const selectedCountry = form.value.country;
    return selectedCountry === 250;
});
const accountData = ref(null);
const getMerchantAccount = () => {
    const merchantId = "136699508";
    const token = "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";
    axios
        .get(`https://shoppingcontent.googleapis.com/content/v2.1/${merchantId}/accounts`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
        console.log("Dados da conta:", response.data);
        accountData.value = response.data;
    })
        .catch((error) => {
        console.error("Erro ao buscar dados da conta:", error);
    });
};
onMounted(() => {
    getMerchantAccount();
});
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    // CSS variable injection 
    // CSS variable injection end 
    const __VLS_0 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: ("d-flex justify-center mb-4") },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: ("d-flex justify-center mb-4") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const __VLS_6 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
        ...{ 'onClick': {} },
        color: ("secundary"),
        ...{ class: ("text-h5 font-weight-black pl-2 pt-2 pb-2 text-uppercase mb-0") },
        minWidth: ("378px"),
        minHeight: ("60px"),
    }));
    const __VLS_8 = __VLS_7({
        ...{ 'onClick': {} },
        color: ("secundary"),
        ...{ class: ("text-h5 font-weight-black pl-2 pt-2 pb-2 text-uppercase mb-0") },
        minWidth: ("378px"),
        minHeight: ("60px"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    let __VLS_12;
    const __VLS_13 = {
        onClick: (__VLS_ctx.toggleForm)
    };
    let __VLS_9;
    let __VLS_10;
    const __VLS_14 = {}.VIcon;
    /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
        ...{ class: ("pr-3") },
    }));
    const __VLS_16 = __VLS_15({
        ...{ class: ("pr-3") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    __VLS_19.slots.default;
    var __VLS_19;
    __VLS_11.slots.default;
    var __VLS_11;
    __VLS_5.slots.default;
    var __VLS_5;
    if (__VLS_ctx.showVerificationMessage) {
        const __VLS_20 = {}.VAlert;
        /** @type { [typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, typeof __VLS_components.VAlert, typeof __VLS_components.vAlert, ] } */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            type: ("info"),
            color: ("warning"),
            ...{ class: ("my-4") },
            icon: ("mdi-alert-octagram-outline"),
            text: (true),
        }));
        const __VLS_22 = __VLS_21({
            type: ("info"),
            color: ("warning"),
            ...{ class: ("my-4") },
            icon: ("mdi-alert-octagram-outline"),
            text: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        __VLS_25.slots.default;
        var __VLS_25;
    }
    const __VLS_26 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
        cols: ("12"),
        ...{ class: ("d-flex justify-center pa-0") },
    }));
    const __VLS_28 = __VLS_27({
        cols: ("12"),
        ...{ class: ("d-flex justify-center pa-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    const __VLS_32 = {}.VContainer;
    /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        maxWidth: ("800"),
        ...{ style: ({}) },
        ...{ class: ("pa-4") },
    }));
    const __VLS_34 = __VLS_33({
        maxWidth: ("800"),
        ...{ style: ({}) },
        ...{ class: ("pa-4") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    const __VLS_38 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
        ...{ class: ("pl-2 pr-2 pb-2 pt-2") },
        rounded: ("lg"),
        elevation: ("3"),
    }));
    const __VLS_40 = __VLS_39({
        ...{ class: ("pl-2 pr-2 pb-2 pt-2") },
        rounded: ("lg"),
        elevation: ("3"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    if (__VLS_ctx.isExpanded) {
        const __VLS_44 = {}.VCardText;
        /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({}));
        const __VLS_46 = __VLS_45({}, ...__VLS_functionalComponentArgsRest(__VLS_45));
        const __VLS_50 = {}.VForm;
        /** @type { [typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ] } */ ;
        // @ts-ignore
        const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
            ref: ("storeForm"),
        }));
        const __VLS_52 = __VLS_51({
            ref: ("storeForm"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_51));
        // @ts-ignore navigation for `const storeForm = ref()`
        /** @type { typeof __VLS_ctx.storeForm } */ ;
        var __VLS_56 = {};
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: ("text-h6 font-weight-medium pl-3 pb-3 pt-0") },
        });
        const __VLS_57 = {}.VFileInput;
        /** @type { [typeof __VLS_components.VFileInput, typeof __VLS_components.vFileInput, typeof __VLS_components.VFileInput, typeof __VLS_components.vFileInput, ] } */ ;
        // @ts-ignore
        const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
            ...{ 'onChange': {} },
            label: ("Upload Store Image (Recommended square images)"),
            accept: ("image/*"),
            variant: ("outlined"),
            ...{ class: ("mb-3") },
        }));
        const __VLS_59 = __VLS_58({
            ...{ 'onChange': {} },
            label: ("Upload Store Image (Recommended square images)"),
            accept: ("image/*"),
            variant: ("outlined"),
            ...{ class: ("mb-3") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_58));
        let __VLS_63;
        const __VLS_64 = {
            onChange: (__VLS_ctx.handleImageUpload)
        };
        let __VLS_60;
        let __VLS_61;
        var __VLS_62;
        if (__VLS_ctx.form.storeImage) {
            const __VLS_65 = {}.VImg;
            /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
            // @ts-ignore
            const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
                src: ((__VLS_ctx.form.storeImage.startsWith('http')
                    ? __VLS_ctx.form.storeImage
                    : `http://druna-user-pic.s3.us-east-2.amazonaws.com/${__VLS_ctx.form.storeImage}`)),
                height: ("100"),
                ...{ class: ("rounded-lg mb-3") },
            }));
            const __VLS_67 = __VLS_66({
                src: ((__VLS_ctx.form.storeImage.startsWith('http')
                    ? __VLS_ctx.form.storeImage
                    : `http://druna-user-pic.s3.us-east-2.amazonaws.com/${__VLS_ctx.form.storeImage}`)),
                height: ("100"),
                ...{ class: ("rounded-lg mb-3") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_66));
        }
        const __VLS_71 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
            label: ("Website"),
            variant: ("outlined"),
            modelValue: ((__VLS_ctx.form.site)),
        }));
        const __VLS_73 = __VLS_72({
            label: ("Website"),
            variant: ("outlined"),
            modelValue: ((__VLS_ctx.form.site)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_72));
        const __VLS_77 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
            label: ("Store Name"),
            variant: ("outlined"),
            modelValue: ((__VLS_ctx.form.storename)),
            rules: (([(v) => !!v || 'Store name is required'])),
        }));
        const __VLS_79 = __VLS_78({
            label: ("Store Name"),
            variant: ("outlined"),
            modelValue: ((__VLS_ctx.form.storename)),
            rules: (([(v) => !!v || 'Store name is required'])),
        }, ...__VLS_functionalComponentArgsRest(__VLS_78));
        const __VLS_83 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
            ...{ 'onKeypress': {} },
            label: ("Street Number"),
            variant: ("outlined"),
            modelValue: ((__VLS_ctx.form.streetNumber)),
            rules: (([(v) => !!v || 'Street Number is required'])),
            type: ("text"),
        }));
        const __VLS_85 = __VLS_84({
            ...{ 'onKeypress': {} },
            label: ("Street Number"),
            variant: ("outlined"),
            modelValue: ((__VLS_ctx.form.streetNumber)),
            rules: (([(v) => !!v || 'Street Number is required'])),
            type: ("text"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_84));
        let __VLS_89;
        const __VLS_90 = {
            onKeypress: (__VLS_ctx.onlyAllowNumbers)
        };
        let __VLS_86;
        let __VLS_87;
        var __VLS_88;
        const __VLS_91 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
            label: ("Street Name"),
            variant: ("outlined"),
            modelValue: ((__VLS_ctx.form.address)),
            rules: (([(v) => !!v || 'Street name is required'])),
        }));
        const __VLS_93 = __VLS_92({
            label: ("Street Name"),
            variant: ("outlined"),
            modelValue: ((__VLS_ctx.form.address)),
            rules: (([(v) => !!v || 'Street name is required'])),
        }, ...__VLS_functionalComponentArgsRest(__VLS_92));
        const __VLS_97 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
            label: ("Apt, suite, etc."),
            variant: ("outlined"),
            modelValue: ((__VLS_ctx.form.complement)),
        }));
        const __VLS_99 = __VLS_98({
            label: ("Apt, suite, etc."),
            variant: ("outlined"),
            modelValue: ((__VLS_ctx.form.complement)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_98));
        const __VLS_103 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
            label: ("City"),
            variant: ("outlined"),
            modelValue: ((__VLS_ctx.form.city)),
            rules: (([(v) => !!v || 'City name is required'])),
        }));
        const __VLS_105 = __VLS_104({
            label: ("City"),
            variant: ("outlined"),
            modelValue: ((__VLS_ctx.form.city)),
            rules: (([(v) => !!v || 'City name is required'])),
        }, ...__VLS_functionalComponentArgsRest(__VLS_104));
        const __VLS_109 = {}.VAutocomplete;
        /** @type { [typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, ] } */ ;
        // @ts-ignore
        const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
            modelValue: ((__VLS_ctx.form.country)),
            items: ((__VLS_ctx.countriesList)),
            itemTitle: ("name"),
            itemValue: ("countries_pk"),
            variant: ("solo-filled"),
            label: ("Select or type a country"),
            rules: (([(v) => !!v || 'country is required'])),
            ...{ class: ("mb-0") },
        }));
        const __VLS_111 = __VLS_110({
            modelValue: ((__VLS_ctx.form.country)),
            items: ((__VLS_ctx.countriesList)),
            itemTitle: ("name"),
            itemValue: ("countries_pk"),
            variant: ("solo-filled"),
            label: ("Select or type a country"),
            rules: (([(v) => !!v || 'country is required'])),
            ...{ class: ("mb-0") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_110));
        if (__VLS_ctx.isUnitedStates) {
            const __VLS_115 = {}.VAutocomplete;
            /** @type { [typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, ] } */ ;
            // @ts-ignore
            const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
                modelValue: ((__VLS_ctx.form.state)),
                items: ((__VLS_ctx.StateList)),
                itemTitle: ("name"),
                variant: ("outlined"),
                label: ("Select State"),
                rules: (([(v) => !!v || 'State is required'])),
                ...{ class: ("mb-0") },
            }));
            const __VLS_117 = __VLS_116({
                modelValue: ((__VLS_ctx.form.state)),
                items: ((__VLS_ctx.StateList)),
                itemTitle: ("name"),
                variant: ("outlined"),
                label: ("Select State"),
                rules: (([(v) => !!v || 'State is required'])),
                ...{ class: ("mb-0") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_116));
        }
        if (__VLS_ctx.isUnitedStates) {
            const __VLS_121 = {}.VTextField;
            /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
            // @ts-ignore
            const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
                label: ("Zip Code"),
                variant: ("outlined"),
                modelValue: ((__VLS_ctx.form.zipcode)),
                rules: (([(v) => !!v || 'Zipcode is required'])),
            }));
            const __VLS_123 = __VLS_122({
                label: ("Zip Code"),
                variant: ("outlined"),
                modelValue: ((__VLS_ctx.form.zipcode)),
                rules: (([(v) => !!v || 'Zipcode is required'])),
            }, ...__VLS_functionalComponentArgsRest(__VLS_122));
        }
        const __VLS_127 = {}.VTextField;
        /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
        // @ts-ignore
        const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
            label: ("Google Merchant ID"),
            variant: ("outlined"),
            modelValue: ((__VLS_ctx.form.MerchantID)),
        }));
        const __VLS_129 = __VLS_128({
            label: ("Google Merchant ID"),
            variant: ("outlined"),
            modelValue: ((__VLS_ctx.form.MerchantID)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_128));
        __VLS_55.slots.default;
        var __VLS_55;
        const __VLS_133 = {}.VCardActions;
        /** @type { [typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ] } */ ;
        // @ts-ignore
        const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({}));
        const __VLS_135 = __VLS_134({}, ...__VLS_functionalComponentArgsRest(__VLS_134));
        const __VLS_139 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
            ...{ 'onClick': {} },
            color: ("green"),
        }));
        const __VLS_141 = __VLS_140({
            ...{ 'onClick': {} },
            color: ("green"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_140));
        let __VLS_145;
        const __VLS_146 = {
            onClick: (__VLS_ctx.saveStore)
        };
        let __VLS_142;
        let __VLS_143;
        __VLS_144.slots.default;
        var __VLS_144;
        const __VLS_147 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({
            ...{ 'onClick': {} },
            color: ("red"),
            text: ("true"),
        }));
        const __VLS_149 = __VLS_148({
            ...{ 'onClick': {} },
            color: ("red"),
            text: ("true"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_148));
        let __VLS_153;
        const __VLS_154 = {
            onClick: (__VLS_ctx.cancelForm)
        };
        let __VLS_150;
        let __VLS_151;
        __VLS_152.slots.default;
        var __VLS_152;
        __VLS_138.slots.default;
        var __VLS_138;
        __VLS_49.slots.default;
        var __VLS_49;
    }
    const __VLS_155 = {}.VDivider;
    /** @type { [typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ] } */ ;
    // @ts-ignore
    const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({
        ...{ class: ("my-4") },
    }));
    const __VLS_157 = __VLS_156({
        ...{ class: ("my-4") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_156));
    if (__VLS_ctx.stores.length > 0) {
        const __VLS_161 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
            noGutters: (true),
            ...{ class: ("d-flex flex-column") },
        }));
        const __VLS_163 = __VLS_162({
            noGutters: (true),
            ...{ class: ("d-flex flex-column") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_162));
        for (const [store, index] of __VLS_getVForSourceType((__VLS_ctx.stores))) {
            const __VLS_167 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_168 = __VLS_asFunctionalComponent(__VLS_167, new __VLS_167({
                key: ((store.stores_pk)),
                ...{ class: ("pr-4") },
                cols: ("12"),
            }));
            const __VLS_169 = __VLS_168({
                key: ((store.stores_pk)),
                ...{ class: ("pr-4") },
                cols: ("12"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_168));
            const __VLS_173 = {}.VCard;
            /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
            // @ts-ignore
            const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
                color: ("primary"),
                minHeight: ("130px"),
                ...{ class: ("mb-4 event-card") },
            }));
            const __VLS_175 = __VLS_174({
                color: ("primary"),
                minHeight: ("130px"),
                ...{ class: ("mb-4 event-card") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_174));
            const __VLS_179 = {}.VRow;
            /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
            // @ts-ignore
            const __VLS_180 = __VLS_asFunctionalComponent(__VLS_179, new __VLS_179({
                noGutters: (true),
            }));
            const __VLS_181 = __VLS_180({
                noGutters: (true),
            }, ...__VLS_functionalComponentArgsRest(__VLS_180));
            const __VLS_185 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
                cols: ("2"),
                lg: ("2"),
            }));
            const __VLS_187 = __VLS_186({
                cols: ("2"),
                lg: ("2"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_186));
            const __VLS_191 = {}.VImg;
            /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
            // @ts-ignore
            const __VLS_192 = __VLS_asFunctionalComponent(__VLS_191, new __VLS_191({
                src: ((store.picture_hash
                    ? `https://druna-assets.s3.us-east-2.amazonaws.com/${store.picture_hash}`
                    : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png')),
                ...{ class: ("event-img") },
            }));
            const __VLS_193 = __VLS_192({
                src: ((store.picture_hash
                    ? `https://druna-assets.s3.us-east-2.amazonaws.com/${store.picture_hash}`
                    : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png')),
                ...{ class: ("event-img") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_192));
            __VLS_190.slots.default;
            var __VLS_190;
            const __VLS_197 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
                cols: ("8"),
                lg: ("9"),
                ...{ class: ("pa-2") },
            }));
            const __VLS_199 = __VLS_198({
                cols: ("8"),
                lg: ("9"),
                ...{ class: ("pa-2") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_198));
            __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
                ...{ class: ("text-subtitle-1 font-weight-bold") },
            });
            (store.name);
            const __VLS_203 = {}.VTooltip;
            /** @type { [typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, ] } */ ;
            // @ts-ignore
            const __VLS_204 = __VLS_asFunctionalComponent(__VLS_203, new __VLS_203({
                location: ("top"),
            }));
            const __VLS_205 = __VLS_204({
                location: ("top"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_204));
            __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
            {
                const { activator: __VLS_thisSlot } = __VLS_208.slots;
                const [{ props }] = __VLS_getSlotParams(__VLS_thisSlot);
                const __VLS_209 = {}.VIcon;
                /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
                // @ts-ignore
                const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
                    ...(props),
                    color: ((store.verified ? 'green' : 'yellow')),
                    size: ("20"),
                    ...{ class: ("ml-2") },
                }));
                const __VLS_211 = __VLS_210({
                    ...(props),
                    color: ((store.verified ? 'green' : 'yellow')),
                    size: ("20"),
                    ...{ class: ("ml-2") },
                }, ...__VLS_functionalComponentArgsRest(__VLS_210));
                (store.verified
                    ? "mdi-check-decagram-outline"
                    : "mdi-alert-octagram-outline");
                __VLS_214.slots.default;
                var __VLS_214;
            }
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (store.verified
                ? "Your store has been verified and is eligible to create events."
                : "Your store is under review and cannot create events yet. The verification process may take up to 3 business days.");
            var __VLS_208;
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("text-caption") },
            });
            const __VLS_215 = {}.VIcon;
            /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
            // @ts-ignore
            const __VLS_216 = __VLS_asFunctionalComponent(__VLS_215, new __VLS_215({
                color: ("red"),
            }));
            const __VLS_217 = __VLS_216({
                color: ("red"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_216));
            __VLS_220.slots.default;
            var __VLS_220;
            (store.address);
            (store.streetNumber);
            (store.city);
            (store.state);
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: ("text-caption") },
            });
            (store.merchant_id);
            __VLS_202.slots.default;
            var __VLS_202;
            const __VLS_221 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
                cols: ("2"),
                lg: ("1"),
                ...{ class: ("d-flex flex-column align-center justify-center gap-2") },
            }));
            const __VLS_223 = __VLS_222({
                cols: ("2"),
                lg: ("1"),
                ...{ class: ("d-flex flex-column align-center justify-center gap-2") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_222));
            const __VLS_227 = {}.VBtn;
            /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
            // @ts-ignore
            const __VLS_228 = __VLS_asFunctionalComponent(__VLS_227, new __VLS_227({
                ...{ 'onClick': {} },
                color: ("terciary"),
                icon: (true),
                ...{ class: ("mb-4") },
                size: ("small"),
            }));
            const __VLS_229 = __VLS_228({
                ...{ 'onClick': {} },
                color: ("terciary"),
                icon: (true),
                ...{ class: ("mb-4") },
                size: ("small"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_228));
            let __VLS_233;
            const __VLS_234 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.stores.length > 0)))
                        return;
                    __VLS_ctx.openEditDialog(store, index);
                }
            };
            let __VLS_230;
            let __VLS_231;
            const __VLS_235 = {}.VIcon;
            /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
            // @ts-ignore
            const __VLS_236 = __VLS_asFunctionalComponent(__VLS_235, new __VLS_235({}));
            const __VLS_237 = __VLS_236({}, ...__VLS_functionalComponentArgsRest(__VLS_236));
            __VLS_240.slots.default;
            var __VLS_240;
            __VLS_232.slots.default;
            var __VLS_232;
            const __VLS_241 = {}.VBtn;
            /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
            // @ts-ignore
            const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
                ...{ 'onClick': {} },
                color: ("red"),
                size: ("small"),
                icon: (true),
            }));
            const __VLS_243 = __VLS_242({
                ...{ 'onClick': {} },
                color: ("red"),
                size: ("small"),
                icon: (true),
            }, ...__VLS_functionalComponentArgsRest(__VLS_242));
            let __VLS_247;
            const __VLS_248 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.stores.length > 0)))
                        return;
                    __VLS_ctx.removeStore(store.stores_pk);
                }
            };
            let __VLS_244;
            let __VLS_245;
            const __VLS_249 = {}.VIcon;
            /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
            // @ts-ignore
            const __VLS_250 = __VLS_asFunctionalComponent(__VLS_249, new __VLS_249({}));
            const __VLS_251 = __VLS_250({}, ...__VLS_functionalComponentArgsRest(__VLS_250));
            __VLS_254.slots.default;
            var __VLS_254;
            __VLS_246.slots.default;
            var __VLS_246;
            __VLS_226.slots.default;
            var __VLS_226;
            __VLS_184.slots.default;
            var __VLS_184;
            __VLS_178.slots.default;
            var __VLS_178;
            __VLS_172.slots.default;
            var __VLS_172;
        }
        __VLS_166.slots.default;
        var __VLS_166;
    }
    const __VLS_255 = {}.VDialog;
    /** @type { [typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ] } */ ;
    // @ts-ignore
    const __VLS_256 = __VLS_asFunctionalComponent(__VLS_255, new __VLS_255({
        modelValue: ((__VLS_ctx.editDialog)),
        maxWidth: ("500"),
    }));
    const __VLS_257 = __VLS_256({
        modelValue: ((__VLS_ctx.editDialog)),
        maxWidth: ("500"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_256));
    const __VLS_261 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_262 = __VLS_asFunctionalComponent(__VLS_261, new __VLS_261({}));
    const __VLS_263 = __VLS_262({}, ...__VLS_functionalComponentArgsRest(__VLS_262));
    const __VLS_267 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_268 = __VLS_asFunctionalComponent(__VLS_267, new __VLS_267({
        ...{ class: ("text-h5 font-weight-bold") },
    }));
    const __VLS_269 = __VLS_268({
        ...{ class: ("text-h5 font-weight-bold") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_268));
    __VLS_272.slots.default;
    var __VLS_272;
    const __VLS_273 = {}.VCardText;
    /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
    // @ts-ignore
    const __VLS_274 = __VLS_asFunctionalComponent(__VLS_273, new __VLS_273({}));
    const __VLS_275 = __VLS_274({}, ...__VLS_functionalComponentArgsRest(__VLS_274));
    const __VLS_279 = {}.VTextField;
    /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
    // @ts-ignore
    const __VLS_280 = __VLS_asFunctionalComponent(__VLS_279, new __VLS_279({
        label: ("Site"),
        outlined: (true),
        modelValue: ((__VLS_ctx.editableStore.site)),
    }));
    const __VLS_281 = __VLS_280({
        label: ("Site"),
        outlined: (true),
        modelValue: ((__VLS_ctx.editableStore.site)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_280));
    const __VLS_285 = {}.VTextField;
    /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
    // @ts-ignore
    const __VLS_286 = __VLS_asFunctionalComponent(__VLS_285, new __VLS_285({
        label: ("Store Name"),
        outlined: (true),
        modelValue: ((__VLS_ctx.editableStore.storename)),
    }));
    const __VLS_287 = __VLS_286({
        label: ("Store Name"),
        outlined: (true),
        modelValue: ((__VLS_ctx.editableStore.storename)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_286));
    const __VLS_291 = {}.VTextField;
    /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
    // @ts-ignore
    const __VLS_292 = __VLS_asFunctionalComponent(__VLS_291, new __VLS_291({
        ...{ 'onKeypress': {} },
        label: ("Street Number"),
        outlined: (true),
        modelValue: ((__VLS_ctx.editableStore.streetNumber)),
    }));
    const __VLS_293 = __VLS_292({
        ...{ 'onKeypress': {} },
        label: ("Street Number"),
        outlined: (true),
        modelValue: ((__VLS_ctx.editableStore.streetNumber)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_292));
    let __VLS_297;
    const __VLS_298 = {
        onKeypress: (__VLS_ctx.onlyAllowNumbers)
    };
    let __VLS_294;
    let __VLS_295;
    var __VLS_296;
    const __VLS_299 = {}.VTextField;
    /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
    // @ts-ignore
    const __VLS_300 = __VLS_asFunctionalComponent(__VLS_299, new __VLS_299({
        label: ("Street Name"),
        outlined: (true),
        modelValue: ((__VLS_ctx.editableStore.address)),
    }));
    const __VLS_301 = __VLS_300({
        label: ("Street Name"),
        outlined: (true),
        modelValue: ((__VLS_ctx.editableStore.address)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_300));
    const __VLS_305 = {}.VTextField;
    /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
    // @ts-ignore
    const __VLS_306 = __VLS_asFunctionalComponent(__VLS_305, new __VLS_305({
        label: ("Apt, suite, etc."),
        outlined: (true),
        modelValue: ((__VLS_ctx.editableStore.complement)),
    }));
    const __VLS_307 = __VLS_306({
        label: ("Apt, suite, etc."),
        outlined: (true),
        modelValue: ((__VLS_ctx.editableStore.complement)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_306));
    const __VLS_311 = {}.VTextField;
    /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
    // @ts-ignore
    const __VLS_312 = __VLS_asFunctionalComponent(__VLS_311, new __VLS_311({
        label: ("City"),
        outlined: (true),
        modelValue: ((__VLS_ctx.editableStore.city)),
    }));
    const __VLS_313 = __VLS_312({
        label: ("City"),
        outlined: (true),
        modelValue: ((__VLS_ctx.editableStore.city)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_312));
    const __VLS_317 = {}.VTextField;
    /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
    // @ts-ignore
    const __VLS_318 = __VLS_asFunctionalComponent(__VLS_317, new __VLS_317({
        label: ("State"),
        outlined: (true),
        modelValue: ((__VLS_ctx.editableStore.state)),
    }));
    const __VLS_319 = __VLS_318({
        label: ("State"),
        outlined: (true),
        modelValue: ((__VLS_ctx.editableStore.state)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_318));
    const __VLS_323 = {}.VAutocomplete;
    /** @type { [typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, ] } */ ;
    // @ts-ignore
    const __VLS_324 = __VLS_asFunctionalComponent(__VLS_323, new __VLS_323({
        modelValue: ((__VLS_ctx.editableStore.country)),
        items: ((__VLS_ctx.countriesList)),
        itemTitle: ("name"),
        itemValue: ("countries_pk"),
        variant: ("solo-filled"),
        label: ("Select or type a country"),
        ...{ class: ("mb-0") },
    }));
    const __VLS_325 = __VLS_324({
        modelValue: ((__VLS_ctx.editableStore.country)),
        items: ((__VLS_ctx.countriesList)),
        itemTitle: ("name"),
        itemValue: ("countries_pk"),
        variant: ("solo-filled"),
        label: ("Select or type a country"),
        ...{ class: ("mb-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_324));
    const __VLS_329 = {}.VTextField;
    /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
    // @ts-ignore
    const __VLS_330 = __VLS_asFunctionalComponent(__VLS_329, new __VLS_329({
        label: ("Zip Code"),
        outlined: (true),
        modelValue: ((__VLS_ctx.editableStore.zipcode)),
    }));
    const __VLS_331 = __VLS_330({
        label: ("Zip Code"),
        outlined: (true),
        modelValue: ((__VLS_ctx.editableStore.zipcode)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_330));
    const __VLS_335 = {}.VTextField;
    /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */ ;
    // @ts-ignore
    const __VLS_336 = __VLS_asFunctionalComponent(__VLS_335, new __VLS_335({
        label: ("Merchant ID"),
        outlined: (true),
        modelValue: ((__VLS_ctx.editableStore.MerchantID)),
    }));
    const __VLS_337 = __VLS_336({
        label: ("Merchant ID"),
        outlined: (true),
        modelValue: ((__VLS_ctx.editableStore.MerchantID)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_336));
    const __VLS_341 = {}.VFileInput;
    /** @type { [typeof __VLS_components.VFileInput, typeof __VLS_components.vFileInput, typeof __VLS_components.VFileInput, typeof __VLS_components.vFileInput, ] } */ ;
    // @ts-ignore
    const __VLS_342 = __VLS_asFunctionalComponent(__VLS_341, new __VLS_341({
        ...{ 'onChange': {} },
        label: ("Upload Store Image"),
        accept: ("image/*"),
    }));
    const __VLS_343 = __VLS_342({
        ...{ 'onChange': {} },
        label: ("Upload Store Image"),
        accept: ("image/*"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_342));
    let __VLS_347;
    const __VLS_348 = {
        onChange: (__VLS_ctx.handleEditImageUpload)
    };
    let __VLS_344;
    let __VLS_345;
    var __VLS_346;
    if (__VLS_ctx.editableStore.storeImage) {
        const __VLS_349 = {}.VImg;
        /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
        // @ts-ignore
        const __VLS_350 = __VLS_asFunctionalComponent(__VLS_349, new __VLS_349({
            src: ((__VLS_ctx.editableStore.storeImage)),
            height: ("100"),
            ...{ class: ("mt-2 rounded") },
        }));
        const __VLS_351 = __VLS_350({
            src: ((__VLS_ctx.editableStore.storeImage)),
            height: ("100"),
            ...{ class: ("mt-2 rounded") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_350));
    }
    __VLS_278.slots.default;
    var __VLS_278;
    const __VLS_355 = {}.VCardActions;
    /** @type { [typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ] } */ ;
    // @ts-ignore
    const __VLS_356 = __VLS_asFunctionalComponent(__VLS_355, new __VLS_355({
        ...{ class: ("d-flex justify-space-between") },
    }));
    const __VLS_357 = __VLS_356({
        ...{ class: ("d-flex justify-space-between") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_356));
    const __VLS_361 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_362 = __VLS_asFunctionalComponent(__VLS_361, new __VLS_361({
        ...{ 'onClick': {} },
        color: ("red"),
    }));
    const __VLS_363 = __VLS_362({
        ...{ 'onClick': {} },
        color: ("red"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_362));
    let __VLS_367;
    const __VLS_368 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editDialog = false;
        }
    };
    let __VLS_364;
    let __VLS_365;
    __VLS_366.slots.default;
    var __VLS_366;
    const __VLS_369 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_370 = __VLS_asFunctionalComponent(__VLS_369, new __VLS_369({
        ...{ 'onClick': {} },
        color: ("green"),
    }));
    const __VLS_371 = __VLS_370({
        ...{ 'onClick': {} },
        color: ("green"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_370));
    let __VLS_375;
    const __VLS_376 = {
        onClick: (__VLS_ctx.saveEditedStore)
    };
    let __VLS_372;
    let __VLS_373;
    __VLS_374.slots.default;
    var __VLS_374;
    __VLS_360.slots.default;
    var __VLS_360;
    __VLS_266.slots.default;
    var __VLS_266;
    __VLS_260.slots.default;
    var __VLS_260;
    __VLS_43.slots.default;
    var __VLS_43;
    __VLS_37.slots.default;
    var __VLS_37;
    __VLS_31.slots.default;
    var __VLS_31;
    ['d-flex', 'justify-center', 'mb-4', 'text-h5', 'font-weight-black', 'pl-2', 'pt-2', 'pb-2', 'text-uppercase', 'mb-0', 'pr-3', 'my-4', 'd-flex', 'justify-center', 'pa-0', 'pa-4', 'pl-2', 'pr-2', 'pb-2', 'pt-2', 'text-h6', 'font-weight-medium', 'pl-3', 'pb-3', 'pt-0', 'mb-3', 'rounded-lg', 'mb-3', 'mb-0', 'mb-0', 'my-4', 'd-flex', 'flex-column', 'pr-4', 'mb-4', 'event-card', 'event-img', 'pa-2', 'text-subtitle-1', 'font-weight-bold', 'ml-2', 'text-caption', 'text-caption', 'd-flex', 'flex-column', 'align-center', 'justify-center', 'gap-2', 'mb-4', 'text-h5', 'font-weight-bold', 'mb-0', 'mt-2', 'rounded', 'd-flex', 'justify-space-between',];
    var __VLS_slots;
    var $slots;
    let __VLS_inheritedAttrs;
    var $attrs;
    const __VLS_refs = {
        'storeForm': __VLS_56,
    };
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
            StateList: StateList,
            form: form,
            countriesList: countriesList,
            stores: stores,
            storeForm: storeForm,
            onlyAllowNumbers: onlyAllowNumbers,
            showVerificationMessage: showVerificationMessage,
            saveStore: saveStore,
            cancelForm: cancelForm,
            isExpanded: isExpanded,
            toggleForm: toggleForm,
            editDialog: editDialog,
            editableStore: editableStore,
            openEditDialog: openEditDialog,
            handleImageUpload: handleImageUpload,
            saveEditedStore: saveEditedStore,
            removeStore: removeStore,
            isUnitedStates: isUnitedStates,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeRefs: {},
});
; /* PartiallyEnd: #4569/main.vue */
