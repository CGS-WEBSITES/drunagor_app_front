<template>
  <v-card
    class="pa-0 mx-auto d-flex"
    max-width="488px"
    :class="isMobile ? 'my-mobile-card' : ''"
  >
    <v-row class="ma-0 pa-0 d-flex align-stretch flex-nowrap">
      <!-- Coluna Esquerda: Imagem do Produto com Fundo Verde -->
      <v-col
        :cols="isMobile ? 4 : 6"
        :md="4"
        class="d-flex flex-column align-center"
        :class="isMobile ? 'pa-2' : 'pa-4'"
        style="background-color: #00635D;"
      >
        <!-- Imagem da Caixa -->
        <v-img
          :src="product.image || require('@/assets/default-box.png')"
          class="rounded"
          :height="isMobile ? '75px' : '150px'"
          width="100%"
          alt="Product Image"
        ></v-img>
      </v-col>

      <!-- Coluna Direita: Imagem de Fundo com Informações -->
      <v-col
        :cols="isMobile ? 8 : 6"
        :md="8"
        class="text-white"
        :class="isMobile ? 'pa-2' : 'pa-4'"
        id="right-column"
      >
        <!-- Texto Sobreposto -->
        <v-card-title
          :class="isMobile ? 'text-h6' : 'text-h5'"
          class="font-weight-bold"
        >
          {{ product.name || "No Product Selected" }}
        </v-card-title>

        <v-card-subtitle>
          <div
            class="d-flex align-center"
            :class="isMobile ? 'mb-1' : 'mb-2'"
          >
            <v-icon class="mr-2" color="white">mdi-content-save</v-icon>
            <span>CONTENT</span>
          </div>
          <div class="d-flex align-center">
            <v-icon class="mr-2" color="white">mdi-shape</v-icon>
            <span>COMPONENT TYPE</span>
          </div>
        </v-card-subtitle>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isMobile: false,
    };
  },
  mounted() {
    this.checkIfMobile();
    window.addEventListener("resize", this.checkIfMobile);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkIfMobile);
  },
  methods: {
    checkIfMobile() {
      this.isMobile = window.innerWidth < 600;
    },
  },
};
</script>

<style scoped>
/* Centralização dos v-cards no mobile */
.my-mobile-card {
  margin-left: auto;
  margin-right: auto;
  width: 90%;
}

/* Ajuste da altura no mobile */
.my-mobile-card {
  height: 50%;
}

/* Ajuste do padding e alinhamento */
#right-column {
  background-image: url('@/assets/bg_apoc.png');
  background-size: cover;
  background-position: center;
}
</style>
