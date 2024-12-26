<template>
  <v-container class="fill-height d-flex" fluid>
    <!-- The video -->
    <video autoplay muted loop id="myVideo">
      <source
        :src="$assetsBucket + '/landing-page/presentation-video.mp4'"
        type="video/mp4"
      />
    </video>
    <div class="content d-flex flex-column justify-center align-center">
      <div>
        <v-img  width="500" src="@/assets/core.webp"></v-img>
      </div>
      <div class="mt-2">
        <v-btn color="#B8860B" large @click="$router.push({ name: 'Login' })">Sign up</v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 0,
      loginEmail: "",
      loginPassword: "",
      signupUsername: "",
      signupEmail: "",
      signupPassword: "",
      signupConfirmPassword: "",
      selectedCountry: null,
      agreeTerms: false,
      countries: ["USA", "Canada", "Brazil", "Mexico", "Germany"],
      rules: {
        required: (value) => !!value || "Required.",
        email: (value) => /.+@.+\..+/.test(value) || "E-mail must be valid",
        min: (v) => v.length >= 8 || "Min 8 characters",
      },
      videoThumbnail: "", // Insira o caminho da imagem ou URL do thumbnail
    };
  },
  methods: {
    matchPasswords(value) {
      return value === this.signupPassword || "Passwords must match";
    },
    submitForm() {
      if (this.$refs.form.validate()) {
        console.log("Form Submitted!");
      }
    },
  },
};
</script>
<style scoped>
#myVideo {
  min-width: 100%;
  min-height: 100%;
}
.content {
  position: relative ;
  bottom: 60%;
  width: 100%;
}
</style>
