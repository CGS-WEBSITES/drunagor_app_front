export default (await import("vue")).defineComponent({
  data: () => ({
    videoThumbnail: "",
    step: 1,
    loginEmail: "", // Variável de e-mail de login
    loginPassword: "", // Variável de senha de login
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    selectedCountry: null,
    agreeTerms: false,
    countries: [
      "Afghanistan",
      "Albania",
      "Algeria",
      "Andorra",
      "Angola",
      "Antigua and Barbuda",
      "Argentina",
      "Armenia",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bhutan",
      "Bolivia",
      "Bosnia and Herzegovina",
      "Botswana",
      "Brazil",
      "Brunei",
      "Bulgaria",
      "Burkina Faso",
      "Burundi",
      "Cabo Verde",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Central African Republic",
      "Chad",
      "Chile",
      "China",
      "Colombia",
      "Comoros",
      "Congo (Congo-Brazzaville)",
      "Costa Rica",
      "Croatia",
      "Cuba",
      "Cyprus",
      "Czech Republic",
      "Democratic Republic of the Congo",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Eswatini",
      "Ethiopia",
      "Fiji",
      "Finland",
      "France",
      "Gabon",
      "Gambia",
      "Georgia",
      "Germany",
      "Ghana",
      "Greece",
      "Grenada",
      "Guatemala",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Honduras",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran",
      "Iraq",
      "Ireland",
      "Israel",
      "Italy",
      "Jamaica",
      "Japan",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "Kuwait",
      "Kyrgyzstan",
      "Laos",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands",
      "Mauritania",
      "Mauritius",
      "Mexico",
      "Micronesia",
      "Moldova",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Morocco",
      "Mozambique",
      "Myanmar (Burma)",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "North Korea",
      "North Macedonia",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines",
      "Poland",
      "Portugal",
      "Qatar",
      "Romania",
      "Russia",
      "Rwanda",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Vincent and the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome and Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "Somalia",
      "South Africa",
      "South Korea",
      "South Sudan",
      "Spain",
      "Sri Lanka",
      "Sudan",
      "Suriname",
      "Sweden",
      "Switzerland",
      "Syria",
      "Taiwan",
      "Tajikistan",
      "Tanzania",
      "Thailand",
      "Timor-Leste",
      "Togo",
      "Tonga",
      "Trinidad and Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates",
      "United Kingdom",
      "United States",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Vatican City",
      "Venezuela",
      "Vietnam",
      "Yemen",
      "Zambia",
      "Zimbabwe",
    ], // Lista de países
    rules: {
      required: (value) => !!value || "Required.",
      email: (value) => /.+@.+\..+/.test(value) || "E-mail must be valid",
      min: (v) => v.length >= 8 || "Min 8 characters",
    },
  }),
  methods: {
    matchPasswords(value) {
      return value === this.password || "Passwords must match";
    },
    submitForm() {
      if (this.$refs.form.validate()) {
        console.log("Formulário válido e enviado");
      }
    },
  },
}); /* PartiallyEnd: #3632/script.vue */
function __VLS_template() {
  const __VLS_ctx = {};
  const __VLS_localComponents = {
    ...{},
    ...__VLS_ctx,
  };
  let __VLS_components;
  const __VLS_localDirectives = {
    ...{},
    ...__VLS_ctx,
  };
  let __VLS_directives;
  let __VLS_styleScopedClasses;
  __VLS_styleScopedClasses["footer"];
  __VLS_styleScopedClasses["footer"];
  __VLS_styleScopedClasses["footer"];
  __VLS_styleScopedClasses["v-footer"];
  // CSS variable injection
  // CSS variable injection end
  let __VLS_resolvedLocalAndGlobalComponents;
  const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.VApp;
  /** @type { [typeof __VLS_components.VApp, typeof __VLS_components.vApp, typeof __VLS_components.VApp, typeof __VLS_components.vApp, ] } */
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({ id: "inspire", fluid: true }),
  );
  const __VLS_2 = __VLS_1(
    { id: "inspire", fluid: true },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  var __VLS_6 = {};
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.p,
    __VLS_intrinsicElements.p,
  )({ ...{ class: "tittle-login pt-16" } });
  const __VLS_7 = __VLS_resolvedLocalAndGlobalComponents.VContent;
  /** @type { [typeof __VLS_components.VContent, typeof __VLS_components.vContent, typeof __VLS_components.VContent, typeof __VLS_components.vContent, ] } */
  // @ts-ignore
  const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({}));
  const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
  const __VLS_13 = __VLS_resolvedLocalAndGlobalComponents.VContainer;
  /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */
  // @ts-ignore
  const __VLS_14 = __VLS_asFunctionalComponent(
    __VLS_13,
    new __VLS_13({ ...{ class: "fill-height" }, fluid: true }),
  );
  const __VLS_15 = __VLS_14(
    { ...{ class: "fill-height" }, fluid: true },
    ...__VLS_functionalComponentArgsRest(__VLS_14),
  );
  const __VLS_19 = __VLS_resolvedLocalAndGlobalComponents.VRow;
  /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */
  // @ts-ignore
  const __VLS_20 = __VLS_asFunctionalComponent(
    __VLS_19,
    new __VLS_19({ align: "center", justify: "center" }),
  );
  const __VLS_21 = __VLS_20(
    { align: "center", justify: "center" },
    ...__VLS_functionalComponentArgsRest(__VLS_20),
  );
  const __VLS_25 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_26 = __VLS_asFunctionalComponent(
    __VLS_25,
    new __VLS_25({ cols: "12", sm: "8", md: "8" }),
  );
  const __VLS_27 = __VLS_26(
    { cols: "12", sm: "8", md: "8" },
    ...__VLS_functionalComponentArgsRest(__VLS_26),
  );
  const __VLS_31 = __VLS_resolvedLocalAndGlobalComponents.VCard;
  /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */
  // @ts-ignore
  const __VLS_32 = __VLS_asFunctionalComponent(
    __VLS_31,
    new __VLS_31({ ...{ class: "elevation-12" } }),
  );
  const __VLS_33 = __VLS_32(
    { ...{ class: "elevation-12" } },
    ...__VLS_functionalComponentArgsRest(__VLS_32),
  );
  const __VLS_37 = __VLS_resolvedLocalAndGlobalComponents.VWindow;
  /** @type { [typeof __VLS_components.VWindow, typeof __VLS_components.vWindow, typeof __VLS_components.VWindow, typeof __VLS_components.vWindow, ] } */
  // @ts-ignore
  const __VLS_38 = __VLS_asFunctionalComponent(
    __VLS_37,
    new __VLS_37({ modelValue: __VLS_ctx.step }),
  );
  const __VLS_39 = __VLS_38(
    { modelValue: __VLS_ctx.step },
    ...__VLS_functionalComponentArgsRest(__VLS_38),
  );
  const __VLS_43 = __VLS_resolvedLocalAndGlobalComponents.VWindowItem;
  /** @type { [typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, ] } */
  // @ts-ignore
  const __VLS_44 = __VLS_asFunctionalComponent(
    __VLS_43,
    new __VLS_43({ value: 1 }),
  );
  const __VLS_45 = __VLS_44(
    { value: 1 },
    ...__VLS_functionalComponentArgsRest(__VLS_44),
  );
  const __VLS_49 = __VLS_resolvedLocalAndGlobalComponents.VRow;
  /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */
  // @ts-ignore
  const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({}));
  const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
  const __VLS_55 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_56 = __VLS_asFunctionalComponent(
    __VLS_55,
    new __VLS_55({ cols: "12", md: "8" }),
  );
  const __VLS_57 = __VLS_56(
    { cols: "12", md: "8" },
    ...__VLS_functionalComponentArgsRest(__VLS_56),
  );
  const __VLS_61 = __VLS_resolvedLocalAndGlobalComponents.VCardText;
  /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */
  // @ts-ignore
  const __VLS_62 = __VLS_asFunctionalComponent(
    __VLS_61,
    new __VLS_61({ ...{ class: "mt-12" } }),
  );
  const __VLS_63 = __VLS_62(
    { ...{ class: "mt-12" } },
    ...__VLS_functionalComponentArgsRest(__VLS_62),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "text-center" } });
  const __VLS_67 = __VLS_resolvedLocalAndGlobalComponents.VImg;
  /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */
  // @ts-ignore
  const __VLS_68 = __VLS_asFunctionalComponent(
    __VLS_67,
    new __VLS_67({
      src: "@/assets/darkness.png",
      maxWidth: "50",
      alt: "Welcome Back Icon",
      ...{ class: "center-icon" },
    }),
  );
  const __VLS_69 = __VLS_68(
    {
      src: "@/assets/darkness.png",
      maxWidth: "50",
      alt: "Welcome Back Icon",
      ...{ class: "center-icon" },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_68),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.h1,
    __VLS_intrinsicElements.h1,
  )({ ...{ class: "text-center display-2" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.h4,
    __VLS_intrinsicElements.h4,
  )({ ...{ class: "text-center mt-4" } });
  const __VLS_73 = __VLS_resolvedLocalAndGlobalComponents.VForm;
  /** @type { [typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ] } */
  // @ts-ignore
  const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({}));
  const __VLS_75 = __VLS_74({}, ...__VLS_functionalComponentArgsRest(__VLS_74));
  const __VLS_79 = __VLS_resolvedLocalAndGlobalComponents.VTextField;
  /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */
  // @ts-ignore
  const __VLS_80 = __VLS_asFunctionalComponent(
    __VLS_79,
    new __VLS_79({
      label: "Email",
      modelValue: __VLS_ctx.loginEmail,
      prependIcon: "mdi-email",
      type: "text",
      color: "black",
    }),
  );
  const __VLS_81 = __VLS_80(
    {
      label: "Email",
      modelValue: __VLS_ctx.loginEmail,
      prependIcon: "mdi-email",
      type: "text",
      color: "black",
    },
    ...__VLS_functionalComponentArgsRest(__VLS_80),
  );
  const __VLS_85 = __VLS_resolvedLocalAndGlobalComponents.VTextField;
  /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */
  // @ts-ignore
  const __VLS_86 = __VLS_asFunctionalComponent(
    __VLS_85,
    new __VLS_85({
      id: "password",
      modelValue: __VLS_ctx.loginPassword,
      label: "Password",
      prependIcon: "mdi-lock",
      type: "password",
      color: "black",
    }),
  );
  const __VLS_87 = __VLS_86(
    {
      id: "password",
      modelValue: __VLS_ctx.loginPassword,
      label: "Password",
      prependIcon: "mdi-lock",
      type: "password",
      color: "black",
    },
    ...__VLS_functionalComponentArgsRest(__VLS_86),
  );
  __VLS_nonNullable(__VLS_78.slots).default;
  var __VLS_78;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.h3,
    __VLS_intrinsicElements.h3,
  )({ ...{ class: "text-center mt-4" } });
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_nonNullable(__VLS_66.slots).default;
  var __VLS_66;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "text-center mt-3" } });
  const __VLS_91 = __VLS_resolvedLocalAndGlobalComponents.VBtn;
  /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */
  // @ts-ignore
  const __VLS_92 = __VLS_asFunctionalComponent(
    __VLS_91,
    new __VLS_91({ ...{ style: {} } }),
  );
  const __VLS_93 = __VLS_92(
    { ...{ style: {} } },
    ...__VLS_functionalComponentArgsRest(__VLS_92),
  );
  __VLS_nonNullable(__VLS_96.slots).default;
  var __VLS_96;
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_nonNullable(__VLS_60.slots).default;
  var __VLS_60;
  const __VLS_97 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_98 = __VLS_asFunctionalComponent(
    __VLS_97,
    new __VLS_97({
      cols: "12",
      md: "4",
      ...{ style: {} },
      ...{ class: "teal accent-3" },
    }),
  );
  const __VLS_99 = __VLS_98(
    { cols: "12", md: "4", ...{ style: {} }, ...{ class: "teal accent-3" } },
    ...__VLS_functionalComponentArgsRest(__VLS_98),
  );
  const __VLS_103 = __VLS_resolvedLocalAndGlobalComponents.VCardText;
  /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */
  // @ts-ignore
  const __VLS_104 = __VLS_asFunctionalComponent(
    __VLS_103,
    new __VLS_103({ ...{ class: "white--text mt-12" } }),
  );
  const __VLS_105 = __VLS_104(
    { ...{ class: "white--text mt-12" } },
    ...__VLS_functionalComponentArgsRest(__VLS_104),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.h1,
    __VLS_intrinsicElements.h1,
  )({ ...{ class: "text-center text-white display-1" } });
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.h5,
    __VLS_intrinsicElements.h5,
  )({ ...{ class: "text-center text-white text-h6" } });
  __VLS_nonNullable(__VLS_108.slots).default;
  var __VLS_108;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "text-center" } });
  const __VLS_109 = __VLS_resolvedLocalAndGlobalComponents.VBtn;
  /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */
  // @ts-ignore
  const __VLS_110 = __VLS_asFunctionalComponent(
    __VLS_109,
    new __VLS_109({ ...{ onClick: {} }, outlined: true, light: true }),
  );
  const __VLS_111 = __VLS_110(
    { ...{ onClick: {} }, outlined: true, light: true },
    ...__VLS_functionalComponentArgsRest(__VLS_110),
  );
  let __VLS_115;
  const __VLS_116 = {
    onClick: (...[$event]) => {
      __VLS_ctx.step++;
    },
  };
  let __VLS_112;
  let __VLS_113;
  __VLS_nonNullable(__VLS_114.slots).default;
  var __VLS_114;
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_nonNullable(__VLS_102.slots).default;
  var __VLS_102;
  __VLS_nonNullable(__VLS_54.slots).default;
  var __VLS_54;
  __VLS_nonNullable(__VLS_48.slots).default;
  var __VLS_48;
  const __VLS_117 = __VLS_resolvedLocalAndGlobalComponents.VWindowItem;
  /** @type { [typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, typeof __VLS_components.VWindowItem, typeof __VLS_components.vWindowItem, ] } */
  // @ts-ignore
  const __VLS_118 = __VLS_asFunctionalComponent(
    __VLS_117,
    new __VLS_117({ value: 2 }),
  );
  const __VLS_119 = __VLS_118(
    { value: 2 },
    ...__VLS_functionalComponentArgsRest(__VLS_118),
  );
  const __VLS_123 = __VLS_resolvedLocalAndGlobalComponents.VRow;
  /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */
  // @ts-ignore
  const __VLS_124 = __VLS_asFunctionalComponent(
    __VLS_123,
    new __VLS_123({ ...{ class: "fill-height" } }),
  );
  const __VLS_125 = __VLS_124(
    { ...{ class: "fill-height" } },
    ...__VLS_functionalComponentArgsRest(__VLS_124),
  );
  const __VLS_129 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_130 = __VLS_asFunctionalComponent(
    __VLS_129,
    new __VLS_129({ cols: "12", md: "8" }),
  );
  const __VLS_131 = __VLS_130(
    { cols: "12", md: "8" },
    ...__VLS_functionalComponentArgsRest(__VLS_130),
  );
  const __VLS_135 = __VLS_resolvedLocalAndGlobalComponents.VCardText;
  /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */
  // @ts-ignore
  const __VLS_136 = __VLS_asFunctionalComponent(
    __VLS_135,
    new __VLS_135({ ...{ class: "mt-12" } }),
  );
  const __VLS_137 = __VLS_136(
    { ...{ class: "mt-12" } },
    ...__VLS_functionalComponentArgsRest(__VLS_136),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "text-center" } });
  const __VLS_141 = __VLS_resolvedLocalAndGlobalComponents.VImg;
  /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */
  // @ts-ignore
  const __VLS_142 = __VLS_asFunctionalComponent(
    __VLS_141,
    new __VLS_141({
      src: "@/assets/darkness.png",
      maxWidth: "50",
      alt: "Create Account Icon",
      ...{ class: "center-icon" },
    }),
  );
  const __VLS_143 = __VLS_142(
    {
      src: "@/assets/darkness.png",
      maxWidth: "50",
      alt: "Create Account Icon",
      ...{ class: "center-icon" },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_142),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.h1,
    __VLS_intrinsicElements.h1,
  )({ ...{ class: "text-center display-2" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.h4,
    __VLS_intrinsicElements.h4,
  )({ ...{ class: "text-center mt-4" } });
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  const __VLS_147 = __VLS_resolvedLocalAndGlobalComponents.VForm;
  /** @type { [typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ] } */
  // @ts-ignore
  const __VLS_148 = __VLS_asFunctionalComponent(
    __VLS_147,
    new __VLS_147({ ref: "form" }),
  );
  const __VLS_149 = __VLS_148(
    { ref: "form" },
    ...__VLS_functionalComponentArgsRest(__VLS_148),
  );
  // @ts-ignore navigation for `const form = ref()`
  __VLS_ctx.form;
  var __VLS_153 = {};
  const __VLS_154 = __VLS_resolvedLocalAndGlobalComponents.VRow;
  /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */
  // @ts-ignore
  const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({}));
  const __VLS_156 = __VLS_155(
    {},
    ...__VLS_functionalComponentArgsRest(__VLS_155),
  );
  const __VLS_160 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_161 = __VLS_asFunctionalComponent(
    __VLS_160,
    new __VLS_160({ cols: "12", sm: "6" }),
  );
  const __VLS_162 = __VLS_161(
    { cols: "12", sm: "6" },
    ...__VLS_functionalComponentArgsRest(__VLS_161),
  );
  const __VLS_166 = __VLS_resolvedLocalAndGlobalComponents.VTextField;
  /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */
  // @ts-ignore
  const __VLS_167 = __VLS_asFunctionalComponent(
    __VLS_166,
    new __VLS_166({
      label: "Username",
      modelValue: __VLS_ctx.username,
      prependIcon: "mdi-account",
      type: "text",
      rules: [__VLS_ctx.rules.required],
      color: "black",
    }),
  );
  const __VLS_168 = __VLS_167(
    {
      label: "Username",
      modelValue: __VLS_ctx.username,
      prependIcon: "mdi-account",
      type: "text",
      rules: [__VLS_ctx.rules.required],
      color: "black",
    },
    ...__VLS_functionalComponentArgsRest(__VLS_167),
  );
  __VLS_nonNullable(__VLS_165.slots).default;
  var __VLS_165;
  const __VLS_172 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_173 = __VLS_asFunctionalComponent(
    __VLS_172,
    new __VLS_172({ cols: "12", sm: "6" }),
  );
  const __VLS_174 = __VLS_173(
    { cols: "12", sm: "6" },
    ...__VLS_functionalComponentArgsRest(__VLS_173),
  );
  const __VLS_178 = __VLS_resolvedLocalAndGlobalComponents.VTextField;
  /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */
  // @ts-ignore
  const __VLS_179 = __VLS_asFunctionalComponent(
    __VLS_178,
    new __VLS_178({
      label: "Email",
      modelValue: __VLS_ctx.email,
      prependIcon: "mdi-email",
      type: "email",
      rules: [__VLS_ctx.rules.required, __VLS_ctx.rules.email],
      color: "black",
    }),
  );
  const __VLS_180 = __VLS_179(
    {
      label: "Email",
      modelValue: __VLS_ctx.email,
      prependIcon: "mdi-email",
      type: "email",
      rules: [__VLS_ctx.rules.required, __VLS_ctx.rules.email],
      color: "black",
    },
    ...__VLS_functionalComponentArgsRest(__VLS_179),
  );
  __VLS_nonNullable(__VLS_177.slots).default;
  var __VLS_177;
  __VLS_nonNullable(__VLS_159.slots).default;
  var __VLS_159;
  const __VLS_184 = __VLS_resolvedLocalAndGlobalComponents.VRow;
  /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */
  // @ts-ignore
  const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({}));
  const __VLS_186 = __VLS_185(
    {},
    ...__VLS_functionalComponentArgsRest(__VLS_185),
  );
  const __VLS_190 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_191 = __VLS_asFunctionalComponent(
    __VLS_190,
    new __VLS_190({ cols: "12", sm: "6" }),
  );
  const __VLS_192 = __VLS_191(
    { cols: "12", sm: "6" },
    ...__VLS_functionalComponentArgsRest(__VLS_191),
  );
  const __VLS_196 = __VLS_resolvedLocalAndGlobalComponents.VTextField;
  /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */
  // @ts-ignore
  const __VLS_197 = __VLS_asFunctionalComponent(
    __VLS_196,
    new __VLS_196({
      label: "Password",
      modelValue: __VLS_ctx.password,
      prependIcon: "mdi-lock",
      type: "password",
      rules: [__VLS_ctx.rules.required, __VLS_ctx.rules.min],
      color: "black",
    }),
  );
  const __VLS_198 = __VLS_197(
    {
      label: "Password",
      modelValue: __VLS_ctx.password,
      prependIcon: "mdi-lock",
      type: "password",
      rules: [__VLS_ctx.rules.required, __VLS_ctx.rules.min],
      color: "black",
    },
    ...__VLS_functionalComponentArgsRest(__VLS_197),
  );
  __VLS_nonNullable(__VLS_195.slots).default;
  var __VLS_195;
  const __VLS_202 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_203 = __VLS_asFunctionalComponent(
    __VLS_202,
    new __VLS_202({ cols: "12", sm: "6" }),
  );
  const __VLS_204 = __VLS_203(
    { cols: "12", sm: "6" },
    ...__VLS_functionalComponentArgsRest(__VLS_203),
  );
  const __VLS_208 = __VLS_resolvedLocalAndGlobalComponents.VTextField;
  /** @type { [typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ] } */
  // @ts-ignore
  const __VLS_209 = __VLS_asFunctionalComponent(
    __VLS_208,
    new __VLS_208({
      label: "Confirm Password",
      modelValue: __VLS_ctx.confirmPassword,
      prependIcon: "mdi-lock",
      type: "password",
      rules: [__VLS_ctx.rules.required, __VLS_ctx.matchPasswords],
      color: "black",
    }),
  );
  const __VLS_210 = __VLS_209(
    {
      label: "Confirm Password",
      modelValue: __VLS_ctx.confirmPassword,
      prependIcon: "mdi-lock",
      type: "password",
      rules: [__VLS_ctx.rules.required, __VLS_ctx.matchPasswords],
      color: "black",
    },
    ...__VLS_functionalComponentArgsRest(__VLS_209),
  );
  __VLS_nonNullable(__VLS_207.slots).default;
  var __VLS_207;
  __VLS_nonNullable(__VLS_189.slots).default;
  var __VLS_189;
  const __VLS_214 = __VLS_resolvedLocalAndGlobalComponents.VRow;
  /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */
  // @ts-ignore
  const __VLS_215 = __VLS_asFunctionalComponent(__VLS_214, new __VLS_214({}));
  const __VLS_216 = __VLS_215(
    {},
    ...__VLS_functionalComponentArgsRest(__VLS_215),
  );
  const __VLS_220 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_221 = __VLS_asFunctionalComponent(
    __VLS_220,
    new __VLS_220({ cols: "12" }),
  );
  const __VLS_222 = __VLS_221(
    { cols: "12" },
    ...__VLS_functionalComponentArgsRest(__VLS_221),
  );
  const __VLS_226 = __VLS_resolvedLocalAndGlobalComponents.VSelect;
  /** @type { [typeof __VLS_components.VSelect, typeof __VLS_components.vSelect, ] } */
  // @ts-ignore
  const __VLS_227 = __VLS_asFunctionalComponent(
    __VLS_226,
    new __VLS_226({
      modelValue: __VLS_ctx.selectedCountry,
      items: __VLS_ctx.countries,
      label: "Select your country",
      prependIcon: "mdi-earth",
      rules: [__VLS_ctx.rules.required],
      color: "black",
    }),
  );
  const __VLS_228 = __VLS_227(
    {
      modelValue: __VLS_ctx.selectedCountry,
      items: __VLS_ctx.countries,
      label: "Select your country",
      prependIcon: "mdi-earth",
      rules: [__VLS_ctx.rules.required],
      color: "black",
    },
    ...__VLS_functionalComponentArgsRest(__VLS_227),
  );
  __VLS_nonNullable(__VLS_225.slots).default;
  var __VLS_225;
  __VLS_nonNullable(__VLS_219.slots).default;
  var __VLS_219;
  const __VLS_232 = __VLS_resolvedLocalAndGlobalComponents.VRow;
  /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */
  // @ts-ignore
  const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({}));
  const __VLS_234 = __VLS_233(
    {},
    ...__VLS_functionalComponentArgsRest(__VLS_233),
  );
  const __VLS_238 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_239 = __VLS_asFunctionalComponent(
    __VLS_238,
    new __VLS_238({ cols: "12" }),
  );
  const __VLS_240 = __VLS_239(
    { cols: "12" },
    ...__VLS_functionalComponentArgsRest(__VLS_239),
  );
  const __VLS_244 = __VLS_resolvedLocalAndGlobalComponents.VCheckbox;
  /** @type { [typeof __VLS_components.VCheckbox, typeof __VLS_components.vCheckbox, ] } */
  // @ts-ignore
  const __VLS_245 = __VLS_asFunctionalComponent(
    __VLS_244,
    new __VLS_244({
      modelValue: __VLS_ctx.agreeTerms,
      label: "I have read and agree to the terms and conditions",
      rules: [__VLS_ctx.rules.required],
      color: "black",
    }),
  );
  const __VLS_246 = __VLS_245(
    {
      modelValue: __VLS_ctx.agreeTerms,
      label: "I have read and agree to the terms and conditions",
      rules: [__VLS_ctx.rules.required],
      color: "black",
    },
    ...__VLS_functionalComponentArgsRest(__VLS_245),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.p,
    __VLS_intrinsicElements.p,
  )({});
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.a,
    __VLS_intrinsicElements.a,
  )({ href: "#" });
  __VLS_nonNullable(__VLS_243.slots).default;
  var __VLS_243;
  __VLS_nonNullable(__VLS_237.slots).default;
  var __VLS_237;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "text-center mt-n5" } });
  const __VLS_250 = __VLS_resolvedLocalAndGlobalComponents.VBtn;
  /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */
  // @ts-ignore
  const __VLS_251 = __VLS_asFunctionalComponent(
    __VLS_250,
    new __VLS_250({ ...{ onClick: {} }, ...{ style: {} } }),
  );
  const __VLS_252 = __VLS_251(
    { ...{ onClick: {} }, ...{ style: {} } },
    ...__VLS_functionalComponentArgsRest(__VLS_251),
  );
  let __VLS_256;
  const __VLS_257 = {
    onClick: __VLS_ctx.submitForm,
  };
  let __VLS_253;
  let __VLS_254;
  __VLS_nonNullable(__VLS_255.slots).default;
  var __VLS_255;
  __VLS_nonNullable(__VLS_152.slots).default;
  var __VLS_152;
  __VLS_nonNullable(__VLS_140.slots).default;
  var __VLS_140;
  __VLS_nonNullable(__VLS_134.slots).default;
  var __VLS_134;
  const __VLS_258 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_259 = __VLS_asFunctionalComponent(
    __VLS_258,
    new __VLS_258({
      cols: "12",
      md: "4",
      ...{ style: {} },
      ...{ class: "teal accent-3" },
    }),
  );
  const __VLS_260 = __VLS_259(
    { cols: "12", md: "4", ...{ style: {} }, ...{ class: "teal accent-3" } },
    ...__VLS_functionalComponentArgsRest(__VLS_259),
  );
  const __VLS_264 = __VLS_resolvedLocalAndGlobalComponents.VCardText;
  /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */
  // @ts-ignore
  const __VLS_265 = __VLS_asFunctionalComponent(
    __VLS_264,
    new __VLS_264({ ...{ class: "white--text mt-12" } }),
  );
  const __VLS_266 = __VLS_265(
    { ...{ class: "white--text mt-12" } },
    ...__VLS_functionalComponentArgsRest(__VLS_265),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.h2,
    __VLS_intrinsicElements.h2,
  )({ ...{ class: "text-center text-white" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.h1,
    __VLS_intrinsicElements.h1,
  )({ ...{ class: "text-center display-1 text-white" } });
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.h5,
    __VLS_intrinsicElements.h5,
  )({ ...{ class: "text-center text-white text-h6" } });
  __VLS_nonNullable(__VLS_269.slots).default;
  var __VLS_269;
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "text-center text-white mt-8" } });
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.h5,
    __VLS_intrinsicElements.h5,
  )({ ...{ class: "white--text text-white text-h6" } });
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  const __VLS_270 = __VLS_resolvedLocalAndGlobalComponents.VBtn;
  /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */
  // @ts-ignore
  const __VLS_271 = __VLS_asFunctionalComponent(
    __VLS_270,
    new __VLS_270({ ...{ onClick: {} }, outlined: true, light: true }),
  );
  const __VLS_272 = __VLS_271(
    { ...{ onClick: {} }, outlined: true, light: true },
    ...__VLS_functionalComponentArgsRest(__VLS_271),
  );
  let __VLS_276;
  const __VLS_277 = {
    onClick: (...[$event]) => {
      __VLS_ctx.step--;
    },
  };
  let __VLS_273;
  let __VLS_274;
  __VLS_nonNullable(__VLS_275.slots).default;
  var __VLS_275;
  __VLS_elementAsFunction(__VLS_intrinsicElements.br)({});
  __VLS_nonNullable(__VLS_263.slots).default;
  var __VLS_263;
  __VLS_nonNullable(__VLS_128.slots).default;
  var __VLS_128;
  __VLS_nonNullable(__VLS_122.slots).default;
  var __VLS_122;
  __VLS_nonNullable(__VLS_42.slots).default;
  var __VLS_42;
  __VLS_nonNullable(__VLS_36.slots).default;
  var __VLS_36;
  __VLS_nonNullable(__VLS_30.slots).default;
  var __VLS_30;
  __VLS_nonNullable(__VLS_24.slots).default;
  var __VLS_24;
  __VLS_nonNullable(__VLS_18.slots).default;
  var __VLS_18;
  __VLS_elementAsFunction(__VLS_intrinsicElements.hr)({});
  const __VLS_278 = __VLS_resolvedLocalAndGlobalComponents.VContainer;
  /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */
  // @ts-ignore
  const __VLS_279 = __VLS_asFunctionalComponent(
    __VLS_278,
    new __VLS_278({ ...{ class: "pa-4" }, color: "white", fluid: true }),
  );
  const __VLS_280 = __VLS_279(
    { ...{ class: "pa-4" }, color: "white", fluid: true },
    ...__VLS_functionalComponentArgsRest(__VLS_279),
  );
  const __VLS_284 = __VLS_resolvedLocalAndGlobalComponents.VCard;
  /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */
  // @ts-ignore
  const __VLS_285 = __VLS_asFunctionalComponent(
    __VLS_284,
    new __VLS_284({ ...{ class: "pa-4" }, color: "white", elevation: "2" }),
  );
  const __VLS_286 = __VLS_285(
    { ...{ class: "pa-4" }, color: "white", elevation: "2" },
    ...__VLS_functionalComponentArgsRest(__VLS_285),
  );
  __VLS_nonNullable(__VLS_289.slots).default;
  var __VLS_289;
  __VLS_nonNullable(__VLS_283.slots).default;
  var __VLS_283;
  const __VLS_290 = __VLS_resolvedLocalAndGlobalComponents.VContainer;
  /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */
  // @ts-ignore
  const __VLS_291 = __VLS_asFunctionalComponent(
    __VLS_290,
    new __VLS_290({ fluid: true, ...{ class: "bg-white" } }),
  );
  const __VLS_292 = __VLS_291(
    { fluid: true, ...{ class: "bg-white" } },
    ...__VLS_functionalComponentArgsRest(__VLS_291),
  );
  const __VLS_296 = __VLS_resolvedLocalAndGlobalComponents.VRow;
  /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */
  // @ts-ignore
  const __VLS_297 = __VLS_asFunctionalComponent(
    __VLS_296,
    new __VLS_296({
      align: "center",
      justify: "center",
      ...{ class: "bg-white" },
    }),
  );
  const __VLS_298 = __VLS_297(
    { align: "center", justify: "center", ...{ class: "bg-white" } },
    ...__VLS_functionalComponentArgsRest(__VLS_297),
  );
  const __VLS_302 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_303 = __VLS_asFunctionalComponent(
    __VLS_302,
    new __VLS_302({ cols: "12", ...{ class: "text-center" } }),
  );
  const __VLS_304 = __VLS_303(
    { cols: "12", ...{ class: "text-center" } },
    ...__VLS_functionalComponentArgsRest(__VLS_303),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({ ...{ class: "video-section" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.h2,
    __VLS_intrinsicElements.h2,
  )({});
  if (__VLS_ctx.videoThumbnail !== "") {
    const __VLS_308 = __VLS_resolvedLocalAndGlobalComponents.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */
    // @ts-ignore
    const __VLS_309 = __VLS_asFunctionalComponent(
      __VLS_308,
      new __VLS_308({
        src: __VLS_ctx.videoThumbnail,
        alt: "Video",
        ...{ class: "video-placeholder" },
      }),
    );
    const __VLS_310 = __VLS_309(
      {
        src: __VLS_ctx.videoThumbnail,
        alt: "Video",
        ...{ class: "video-placeholder" },
      },
      ...__VLS_functionalComponentArgsRest(__VLS_309),
    );
  }
  __VLS_nonNullable(__VLS_307.slots).default;
  var __VLS_307;
  __VLS_nonNullable(__VLS_301.slots).default;
  var __VLS_301;
  __VLS_nonNullable(__VLS_295.slots).default;
  var __VLS_295;
  __VLS_elementAsFunction(__VLS_intrinsicElements.hr)({});
  const __VLS_314 = __VLS_resolvedLocalAndGlobalComponents.VFooter;
  /** @type { [typeof __VLS_components.VFooter, typeof __VLS_components.vFooter, typeof __VLS_components.VFooter, typeof __VLS_components.vFooter, ] } */
  // @ts-ignore
  const __VLS_315 = __VLS_asFunctionalComponent(
    __VLS_314,
    new __VLS_314({ ...{ class: "footer black" }, padless: true }),
  );
  const __VLS_316 = __VLS_315(
    { ...{ class: "footer black" }, padless: true },
    ...__VLS_functionalComponentArgsRest(__VLS_315),
  );
  const __VLS_320 = __VLS_resolvedLocalAndGlobalComponents.VContainer;
  /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */
  // @ts-ignore
  const __VLS_321 = __VLS_asFunctionalComponent(
    __VLS_320,
    new __VLS_320({ fluid: true }),
  );
  const __VLS_322 = __VLS_321(
    { fluid: true },
    ...__VLS_functionalComponentArgsRest(__VLS_321),
  );
  const __VLS_326 = __VLS_resolvedLocalAndGlobalComponents.VRow;
  /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */
  // @ts-ignore
  const __VLS_327 = __VLS_asFunctionalComponent(
    __VLS_326,
    new __VLS_326({ justify: "space-between", align: "center" }),
  );
  const __VLS_328 = __VLS_327(
    { justify: "space-between", align: "center" },
    ...__VLS_functionalComponentArgsRest(__VLS_327),
  );
  const __VLS_332 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_333 = __VLS_asFunctionalComponent(
    __VLS_332,
    new __VLS_332({ cols: "12", sm: "4" }),
  );
  const __VLS_334 = __VLS_333(
    { cols: "12", sm: "4" },
    ...__VLS_functionalComponentArgsRest(__VLS_333),
  );
  const __VLS_338 = __VLS_resolvedLocalAndGlobalComponents.VImg;
  /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */
  // @ts-ignore
  const __VLS_339 = __VLS_asFunctionalComponent(
    __VLS_338,
    new __VLS_338({
      ...{ class: "logocgs" },
      src: "@/assets/cgs.png",
      maxWidth: "92",
      alt: "logo",
    }),
  );
  const __VLS_340 = __VLS_339(
    {
      ...{ class: "logocgs" },
      src: "@/assets/cgs.png",
      maxWidth: "92",
      alt: "logo",
    },
    ...__VLS_functionalComponentArgsRest(__VLS_339),
  );
  __VLS_nonNullable(__VLS_337.slots).default;
  var __VLS_337;
  const __VLS_344 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_345 = __VLS_asFunctionalComponent(
    __VLS_344,
    new __VLS_344({ cols: "12", sm: "4", ...{ class: "info-footer" } }),
  );
  const __VLS_346 = __VLS_345(
    { cols: "12", sm: "4", ...{ class: "info-footer" } },
    ...__VLS_functionalComponentArgsRest(__VLS_345),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.h3,
    __VLS_intrinsicElements.h3,
  )({ ...{ class: "white--text" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.p,
    __VLS_intrinsicElements.p,
  )({ ...{ class: "white--text" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.p,
    __VLS_intrinsicElements.p,
  )({ ...{ class: "white--text" } });
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.p,
    __VLS_intrinsicElements.p,
  )({ ...{ class: "white--text" } });
  __VLS_nonNullable(__VLS_349.slots).default;
  var __VLS_349;
  const __VLS_350 = __VLS_resolvedLocalAndGlobalComponents.VCol;
  /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */
  // @ts-ignore
  const __VLS_351 = __VLS_asFunctionalComponent(
    __VLS_350,
    new __VLS_350({ cols: "12", sm: "4", ...{ class: "text-center" } }),
  );
  const __VLS_352 = __VLS_351(
    { cols: "12", sm: "4", ...{ class: "text-center" } },
    ...__VLS_functionalComponentArgsRest(__VLS_351),
  );
  __VLS_elementAsFunction(
    __VLS_intrinsicElements.h3,
    __VLS_intrinsicElements.h3,
  )({ ...{ class: "white--text" } });
  const __VLS_356 = __VLS_resolvedLocalAndGlobalComponents.VBtn;
  /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */
  // @ts-ignore
  const __VLS_357 = __VLS_asFunctionalComponent(
    __VLS_356,
    new __VLS_356({ fab: true, icon: true, color: "black", dark: true }),
  );
  const __VLS_358 = __VLS_357(
    { fab: true, icon: true, color: "black", dark: true },
    ...__VLS_functionalComponentArgsRest(__VLS_357),
  );
  const __VLS_362 = __VLS_resolvedLocalAndGlobalComponents.VIcon;
  /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */
  // @ts-ignore
  const __VLS_363 = __VLS_asFunctionalComponent(
    __VLS_362,
    new __VLS_362({ color: "white" }),
  );
  const __VLS_364 = __VLS_363(
    { color: "white" },
    ...__VLS_functionalComponentArgsRest(__VLS_363),
  );
  __VLS_nonNullable(__VLS_367.slots).default;
  var __VLS_367;
  __VLS_nonNullable(__VLS_361.slots).default;
  var __VLS_361;
  const __VLS_368 = __VLS_resolvedLocalAndGlobalComponents.VBtn;
  /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */
  // @ts-ignore
  const __VLS_369 = __VLS_asFunctionalComponent(
    __VLS_368,
    new __VLS_368({ fab: true, icon: true, color: "black", dark: true }),
  );
  const __VLS_370 = __VLS_369(
    { fab: true, icon: true, color: "black", dark: true },
    ...__VLS_functionalComponentArgsRest(__VLS_369),
  );
  const __VLS_374 = __VLS_resolvedLocalAndGlobalComponents.VIcon;
  /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */
  // @ts-ignore
  const __VLS_375 = __VLS_asFunctionalComponent(
    __VLS_374,
    new __VLS_374({ color: "white" }),
  );
  const __VLS_376 = __VLS_375(
    { color: "white" },
    ...__VLS_functionalComponentArgsRest(__VLS_375),
  );
  __VLS_nonNullable(__VLS_379.slots).default;
  var __VLS_379;
  __VLS_nonNullable(__VLS_373.slots).default;
  var __VLS_373;
  const __VLS_380 = __VLS_resolvedLocalAndGlobalComponents.VBtn;
  /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */
  // @ts-ignore
  const __VLS_381 = __VLS_asFunctionalComponent(
    __VLS_380,
    new __VLS_380({ fab: true, icon: true, color: "black", dark: true }),
  );
  const __VLS_382 = __VLS_381(
    { fab: true, icon: true, color: "black", dark: true },
    ...__VLS_functionalComponentArgsRest(__VLS_381),
  );
  const __VLS_386 = __VLS_resolvedLocalAndGlobalComponents.VIcon;
  /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */
  // @ts-ignore
  const __VLS_387 = __VLS_asFunctionalComponent(
    __VLS_386,
    new __VLS_386({ color: "white" }),
  );
  const __VLS_388 = __VLS_387(
    { color: "white" },
    ...__VLS_functionalComponentArgsRest(__VLS_387),
  );
  __VLS_nonNullable(__VLS_391.slots).default;
  var __VLS_391;
  __VLS_nonNullable(__VLS_385.slots).default;
  var __VLS_385;
  __VLS_nonNullable(__VLS_355.slots).default;
  var __VLS_355;
  __VLS_nonNullable(__VLS_331.slots).default;
  var __VLS_331;
  __VLS_nonNullable(__VLS_325.slots).default;
  var __VLS_325;
  __VLS_nonNullable(__VLS_319.slots).default;
  var __VLS_319;
  __VLS_nonNullable(__VLS_12.slots).default;
  var __VLS_12;
  __VLS_nonNullable(__VLS_5.slots).default;
  var __VLS_5;
  __VLS_styleScopedClasses["tittle-login"];
  __VLS_styleScopedClasses["pt-16"];
  __VLS_styleScopedClasses["fill-height"];
  __VLS_styleScopedClasses["elevation-12"];
  __VLS_styleScopedClasses["mt-12"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["center-icon"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["display-2"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["mt-4"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["mt-4"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["mt-3"];
  __VLS_styleScopedClasses["teal"];
  __VLS_styleScopedClasses["accent-3"];
  __VLS_styleScopedClasses["white--text"];
  __VLS_styleScopedClasses["mt-12"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["text-white"];
  __VLS_styleScopedClasses["display-1"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["text-white"];
  __VLS_styleScopedClasses["text-h6"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["fill-height"];
  __VLS_styleScopedClasses["mt-12"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["center-icon"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["display-2"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["mt-4"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["mt-n5"];
  __VLS_styleScopedClasses["teal"];
  __VLS_styleScopedClasses["accent-3"];
  __VLS_styleScopedClasses["white--text"];
  __VLS_styleScopedClasses["mt-12"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["text-white"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["display-1"];
  __VLS_styleScopedClasses["text-white"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["text-white"];
  __VLS_styleScopedClasses["text-h6"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["text-white"];
  __VLS_styleScopedClasses["mt-8"];
  __VLS_styleScopedClasses["white--text"];
  __VLS_styleScopedClasses["text-white"];
  __VLS_styleScopedClasses["text-h6"];
  __VLS_styleScopedClasses["pa-4"];
  __VLS_styleScopedClasses["pa-4"];
  __VLS_styleScopedClasses["bg-white"];
  __VLS_styleScopedClasses["bg-white"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["video-section"];
  __VLS_styleScopedClasses["video-placeholder"];
  __VLS_styleScopedClasses["footer"];
  __VLS_styleScopedClasses["black"];
  __VLS_styleScopedClasses["logocgs"];
  __VLS_styleScopedClasses["info-footer"];
  __VLS_styleScopedClasses["white--text"];
  __VLS_styleScopedClasses["white--text"];
  __VLS_styleScopedClasses["white--text"];
  __VLS_styleScopedClasses["white--text"];
  __VLS_styleScopedClasses["text-center"];
  __VLS_styleScopedClasses["white--text"];
  var __VLS_slots;
  var __VLS_inheritedAttrs;
  const __VLS_refs = {
    form: __VLS_153,
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
let __VLS_self;
