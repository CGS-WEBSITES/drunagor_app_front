<template>
  <v-card class="pa-0 mx-auto" max-width="488px">
    <v-row class="ma-0 pa-0 d-flex align-stretch flex-nowrap">
      <!-- Coluna Esquerda: Imagem do Produto com Fundo Verde -->
      <v-col
        :cols="isMobile ? 3 : 6"
        :md="4"
        class="d-flex flex-column align-center"
        :class="isMobile ? 'pa-2' : 'pa-4'"
        style="background-color: #00635D;"
      >
        <!-- Imagem da Caixa -->
        <v-img
          :src="product.image || require('@/assets/default-box.png')"
          class="rounded"
          :height="isMobile ? '100px' : '150px'"
          width="100%"
          alt="Product Image"
        ></v-img>
      </v-col>

      <!-- Coluna Direita: Imagem de Fundo com Informações -->
      <v-col
        :cols="isMobile ? 9 : 6"
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
  computed: {
    isMobile() {
      return window.innerWidth < 600; // Defina o limite do breakpoint
    },
  },
};
</script>

<style scoped>
#right-column {
  background-image: url('@/assets/bg_apoc.png');
  background-size: cover;
  background-position: center;
}
</style>
