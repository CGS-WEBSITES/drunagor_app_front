<template>
  <v-row justify="center" align="center" class="ml-1 ">
    <v-col
      cols="12"
      md="6"
      lg="6"
      class="d-flex justify-center px-1"
      v-for="item in products"
      :key="item.id"
    >
  
  
      <ProductCard
        id="product-card"
        :product="item"
        class="w-100"
        @click="$emit('open-dialog', item)"
      />
    </v-col>
  </v-row>
</template>

<script>
import ProductCard from "@/components/ProductCard.vue";

export default {
  components: { ProductCard },
  props: { products: Array },
};
</script>

<style scoped>

</style>
