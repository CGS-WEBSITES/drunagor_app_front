<template>
  <v-card class="pa-0 mx-auto d-flex" :class="isMobile ? 'my-mobile-card' : ''">


    <v-row class="ma-0 pa-0 d-flex align-stretch flex-nowrap">
      <!-- Coluna Esquerda: Imagem do Produto com Fundo Verde -->
      <v-col :cols="isMobile ? 4 : 4" :md="4" class="d-flex flex-column align-center" :class="isMobile ? 'pa-' : 'pa-4'"
        :style="{
          backgroundColor: product.color
        }">
        <!-- Imagem da Caixa -->

        <v-img :src="product.image || require('@/assets/defalt-box.png')" class="rounded"
          :height="isMobile ? '75px' : '75px'" width="100%" alt="Product Image">
        </v-img>
      </v-col>

      <!-- Coluna Direita: Imagem de Fundo com Informações -->
      <v-col class="box-shadow text-white" :class="isMobile ? 'pa-3' : 'pa-4'" :style="{
        backgroundImage: `url(${product.cardbg})`,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backgroundBlendMode: 'darken',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        height: '150px',
        paddingTop: '300px'
      }">
        <!-- Texto Sobreposto -->
        <v-card-title :class="isMobile ? 'text-h6' : 'text-h5'" class="element3 font-weight-bold">
          {{ product.name || "No Product Selected" }}
        </v-card-title>

        <v-checkbox class="element" color="success" label="Owned"></v-checkbox>
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
  background-image: url('@/assets/bg-corebox.png');
  background-color: rgba(0, 0, 0, 0.4);
  background-blend-mode: darken;
  height: 150px;
  background-position: center;
  padding-top: 300px;
  background-size: cover;
}

.box-shadow {
  background-color: rgba(0, 0, 0, 0.65);

}


.element {
  position: relative;
  top: -8px;
  right: 10px;
}

.element1 {
  position: relative;
  top: -50px;
  right: 10px;
}

.element3 {
  position: relative;
  top: -18px;
  right: 15px;
}
</style>
