<template>
    <v-card color="#2A2A2A" class="pb-6" @click="$emit('click')">
      <!-- Imagem do Produto -->
      <v-img
        :src="product.image || '@/assets/apoc.png'"
        height="200px"
        class="opacity-80"
      ></v-img>
  
      <!-- Título do Produto -->
      <v-card-title>{{ product.name }}</v-card-title>
  
      <!-- Subtítulo com Ícones Verticais -->
      <v-card-subtitle class="d-flex flex-column align-start">
        <div class="d-flex align-center mb-2">
          <v-icon class="mr-2" color="white">mdi-content-save</v-icon>
          <span>CONTENT</span>
        </div>
        <div class="d-flex align-center">
          <v-icon class="mr-2" color="white">mdi-shape</v-icon>
          <span>COMPONENT TYPE</span>
        </div>
      </v-card-subtitle>
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
    emits: ["click"],
  };
  </script>
  