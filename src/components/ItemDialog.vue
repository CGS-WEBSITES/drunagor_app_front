<template>
  <v-dialog
    :model-value="dialogVisible"
    @update:model-value="$emit('update:dialogVisible', $event)"
    max-width="900px"
  >
    <v-card class="pa-0" color="#0F7273">
      <v-row class="ma-0 pa-0">
        <!-- Botão "X" no canto superior direito -->
        <v-btn
          icon
          @click="$emit('update:dialogVisible', false)"
          class="position-absolute"
          style="top: 10px; right: 10px"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <!-- Coluna Esquerda: Imagem e Botões -->
        <v-col cols="12" md="4" class="d-flex flex-column align-center pa-4">
          <!-- Imagem -->
          <v-img
            :src="product.image || '@/assets/apoc.png'"
            class="rounded mb-4"
            height="240px"
            width="auto"
            alt="Product Image"
          ></v-img>

          <!-- Botões ADD TO WISHLIST e MARK AS OWNED juntos -->
          <div class="w-100">
            <v-btn
              prepend-icon="mdi mdi-star-check"
              color="#B89816"
              class="mb-1"
              block
              >ADD TO WISHLIST</v-btn
            >
            <v-btn prepend-icon="mdi mdi-plus-circle" color="#139394" block
              >MARK AS OWNED</v-btn
            >
          </div>

          <!-- Botão DIGITAL FILES na parte inferior -->
          <v-spacer></v-spacer>
          <v-btn
            prepend-icon="mdi mdi-file-download-outline"
            color="#312F2F"
            block
            max-height="80px"
            density="compact"
          >
            Explore
          </v-btn>
        </v-col>

        <!-- Coluna Direita -->
        <v-col cols="12" md="8" class="pa-0 position-relative">
          <!-- Imagem de fundo cobrindo o v-col -->
          <v-img
            src="@/assets/Apocalypse_Cover.png"
            cover
            height="100%"
            width="100%"
            class="opacity-80 fill-height"
          >
            <!-- Conteúdo sobreposto -->
            <v-container class="text-white pa-4" fluid>
              <v-card-title class="text-h5 font-weight-bold">
                {{ product?.name }}
              </v-card-title>
              <v-card-subtitle class="d-flex align-center">
                <v-icon class="me-2">mdi-file</v-icon> CONTENT
              </v-card-subtitle>
              <v-card-subtitle class="d-flex align-center">
                <v-icon class="me-2">mdi-puzzle</v-icon> COMPONENT TYPE
              </v-card-subtitle>

              <div class="mt-3">
                <!-- Informações do Produto -->
                <div v-if="product" class="text-white">
                  <v-row>
                    <v-col cols="12" md="10">
                      <p class="text-subtitle-2 font-weight-bold">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Voluptatibus distinctio similique reiciendis assumenda
                        dignissimos deserunt. Inventore eum iste aut
                        exercitationem consequuntur optio, est fugit veritatis
                        cum reiciendis aperiam, labore dolore?
                      </p>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-container>
          </v-img>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: Boolean,
    product: Object,
  },
  emits: ["update:dialogVisible"],
};
</script>
