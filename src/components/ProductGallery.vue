<template>
  <v-row justify="center" align="center" class="gap-2">
    <v-col
      cols="12"
      md="6"
      lg="6"
      class="d-flex justify-center"
      v-for="item in products"
      :key="item.id"
    >
      <ProductCard
        id="product-card"
        :product="item"
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
#product-card {
  max-width: 488px;
  width: 100%;
}
</style>
