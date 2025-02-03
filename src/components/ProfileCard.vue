<template>
  <div>
    <a :href="product.link" target="_blank" rel="noopener noreferrer">
      <div class="product-card">
        <!-- Substitua o conteúdo abaixo pelo layout do seu card -->
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
/* Estilos para o card (ajuste conforme necessário) */
.product-card {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
