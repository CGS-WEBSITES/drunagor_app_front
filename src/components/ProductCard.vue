<template>
  <v-card
    class="pa-0 mx-auto d-flex"
    
    
    :class="isMobile ? 'my-mobile-card' : ''"
  >

  
    <v-row class="ma-0 pa-0 d-flex align-stretch flex-nowrap">
      <!-- Coluna Esquerda: Imagem do Produto com Fundo Verde -->
      <v-col
        :cols="isMobile ? 4 : 6"
        :md="4"
        class="d-flex flex-column align-center"
        :class="isMobile ? 'pa-' : 'pa-4'"
        style="background-color: #00635D;"
      >
        <!-- Imagem da Caixa -->
         
        <v-img
          :src="product.image || require('@/assets/default-box.png')"
          class="rounded"
          :height="isMobile ? '75px' : '75px'"
          width="100%"
          alt="Product Image"
        >
      </v-img>
      </v-col>

      <!-- Coluna Direita: Imagem de Fundo com Informações -->
      <v-col
        class="text-white"
        :class="isMobile ? 'pa-3' : 'pa-4'"
        id="right-column"
      >
        <!-- Texto Sobreposto -->
        <v-card-title
          :class="isMobile ? 'text-h6' : 'text-h5'"
          class="font-weight-bold"
        >
          {{ product.name || "No Product Selected" }}
        </v-card-title>

          <v-checkbox class="element"  color="success" label="Owned"></v-checkbox>
          <v-checkbox class="element1" color="warning" label="Wishlist"></v-checkbox>
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
  background-position: right;
}

.element {
  position: relative;
  top: 100px;
}

.element1 {
  position: relative;
  top: 22px;
  right: -100px;
}


</style>
