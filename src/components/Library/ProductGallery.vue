<template>
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="item in products"
        :key="item.id"
      >
        <ProductCard :product="item" @click="$emit('open-dialog', item)" />
      </v-col>
    </v-row>
  </template>
  
  <script>
  import ProductCard from "@/components/Library/ProductCard.vue";
  
  export default {
    components: { ProductCard },
    props: { products: Array },
  };
  </script>
  