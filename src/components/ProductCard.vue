<template>
  <v-card
    v-if="isMobile"
    class="pa-0 mx-auto d-flex my-mobile-card"
    elevation="0"
    style="border-radius: 8px; overflow: hidden; width: 100%; aspect-ratio: 328 / 123; border: 1px solid rgba(255,255,255,0.1);"
  >
    <div class="d-flex w-100 h-100">
      <!-- Coluna Esquerda: 36.6% proporção -->
      <div
        class="d-flex align-center justify-center pa-0"
        :style="{ backgroundColor: product.color, width: '36.6%', height: '100%' }"
      >
        <v-img
          :src="product.image || require('@/assets/defalt-box.png')"
          contain
          alt="Product Image"
          style="box-shadow: none; width: 100%; height: 100%;"
        ></v-img>
      </div>

      <div
        class="d-flex flex-column justify-space-between text-white pa-2"
        :style="{
          flex: 1,
          height: '100%',
          backgroundImage: `url(${product.cardbg})`,
          backgroundColor: 'rgba(20, 20, 25, 0.7)',
          backgroundBlendMode: 'overlay',
          backgroundPosition: 'center',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat'
        }"
      >
        <v-card-title
          class="font-weight-bold pa-0 text-wrap"
          style="line-height: 1.1; font-size: clamp(0.9rem, 4vw, 1.1rem);"
        >
          {{ product.name || "No Product Selected" }}
        </v-card-title>
        
        <div class="mt-auto d-flex align-center w-100">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </v-card>

  <v-card
    v-else
    class="pa-0 mt-2 mx-auto d-flex my-desktop-card"
    elevation="0"
    style="border-radius: 8px; overflow: hidden; height: 183px; border: 1px solid rgba(255,255,255,0.1); width: 100%;"
  >
    <v-row class="ma-0 pa-0 flex-nowrap w-100">
      <!-- Coluna Esquerda: Imagem do Produto com Fundo -->
      <v-col
        cols="4"
        class="d-flex align-center justify-center pa-2"
        :style="{ backgroundColor: product.color }"
      >
        <v-img
          :src="product.image || require('@/assets/defalt-box.png')"
          class="rounded"
          max-height="150px"
          contain
          alt="Product Image"
          style="box-shadow: none;"
        ></v-img>
      </v-col>

      <!-- Coluna Direita: Imagem de Fundo com Informações -->
      <v-col
        cols="8"
        class="d-flex flex-column justify-space-between text-white pa-3"
        :style="{
          backgroundImage: `url(${product.cardbg})`,
          backgroundColor: 'rgba(20, 20, 25, 0.7)',
          backgroundBlendMode: 'overlay',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }"
      >
        <v-card-title
          class="text-h5 font-weight-bold pa-0 text-wrap"
          style="line-height: 1.2;"
        >
          {{ product.name || "No Product Selected" }}
        </v-card-title>
        
        <div class="mt-auto d-flex align-center w-100">
          <slot name="actions"></slot>
        </div>
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
.my-mobile-card {
  width: 100%;
}
.my-desktop-card {
  width: 100%;
}
</style>
