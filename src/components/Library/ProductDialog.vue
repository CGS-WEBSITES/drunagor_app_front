<template>
  <v-dialog
    :model-value="dialogVisible"
    @update:model-value="$emit('update:dialogVisible', $event)"
    max-width="900px"
  >
    <v-card class="pa-0" color="#0F7273">
      <v-row class="ma-0 pa-0">
        <!-- Coluna Esquerda: Imagem e Botões -->
        <v-col cols="12" md="4" class="d-flex flex-column align-center pa-4">
          <!-- Imagem -->
          <v-img
            :src="product?.image || '@/assets/apoc.png'"
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
            >
              ADD TO WISHLIST
            </v-btn>
            <v-btn prepend-icon="mdi mdi-plus-circle" color="#139394" block>
              MARK AS OWNED
            </v-btn>
          </div>

          <!-- Botão DIGITAL FILES na parte inferior -->
          <v-spacer></v-spacer>
          <v-btn
            prepend-icon="mdi mdi-file-download-outline"
            color="#312F2F"
            block
            max-height="50px"
            density="compact"
          >
            DIGITAL FILES
          </v-btn>
        </v-col>

        <!-- Coluna Direita: Detalhes do Produto -->
        <v-col cols="12" md="8" class="pa-0 position-relative">
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
                {{ product?.name || "No Product Selected" }}
              </v-card-title>
              <v-card-subtitle class="d-flex align-center">
                <v-checkbox
                  label="CONTENT"
                  :model-value="product?.contentChecked"
                  @update:model-value="
                    (value) => updateProduct('contentChecked', value)
                  "
                  hide-details
                ></v-checkbox>
                <v-checkbox
                  label="COMPONENT TYPE"
                  :model-value="product?.componentChecked"
                  @update:model-value="
                    (value) => updateProduct('componentChecked', value)
                  "
                  hide-details
                ></v-checkbox>
              </v-card-subtitle>

              <div class="mt-3">
                <div v-if="product" class="text-white">
                  <!-- Primeira linha: EPIC ITEMS, HERO CLASS, BOSSES, HEROES -->
                  <v-row>
                    <v-col cols="12" md="3">
                      <p class="text-subtitle-2 font-weight-bold">EPIC ITEMS</p>
                      <p class="text-body-2">Bane of shadows</p>
                      <p class="text-body-2">Dark Piercer</p>
                      <p class="text-body-2">Dragon eye of memory</p>
                      <p class="text-body-2">Dragonclaw shield</p>
                      <p class="text-body-2">Moonlight Dagger</p>
                    </v-col>

                    <v-col cols="12" md="3">
                      <p class="text-subtitle-2 font-weight-bold">HERO CLASS</p>
                      <p class="text-body-2">Paladin</p>
                    </v-col>

                    <v-col cols="12" md="3">
                      <p class="text-subtitle-2 font-weight-bold">BOSSES</p>
                      <p class="text-body-2">Aral'hezec</p>
                    </v-col>

                    <v-col cols="12" md="3">
                      <p class="text-subtitle-2 font-weight-bold">HEROES</p>
                      <p class="text-body-2">Drasek</p>
                      <p class="text-body-2">Jade</p>
                    </v-col>
                  </v-row>

                  <!-- Segunda linha: WHITE MONSTERS, DOORS -->
                  <v-row>
                    <v-col cols="12" md="3">
                      <p class="text-subtitle-2 font-weight-bold">
                        WHITE MONSTERS
                      </p>
                      <p class="text-body-2">Corrupted Farmer</p>
                      <p class="text-body-2">Dark Piercer</p>
                    </v-col>

                    <v-col cols="12" md="12">
                      <p class="text-subtitle-2 font-weight-bold">DOORS</p>
                      <p class="text-body-2">
                        Door 01 - Crashing the party - Chapter 1
                      </p>
                      <p class="text-body-2">
                        Door 02 - The entrance to the citadel - Chapter 2
                      </p>
                      <p class="text-body-2">
                        Door 03 - The inner courtyard - Chapter 2
                      </p>
                      <p class="text-body-2">
                        Door 04 - The ancient throne room - Chapter 2
                      </p>
                      <p class="text-body-2">
                        Door 05 - The ascending paths - Chapter 3
                      </p>
                      <p class="text-body-2">
                        Door 06 - The room of memories - Chapter 3
                      </p>
                    </v-col>
                  </v-row>
                </div>
              </div>

              <!-- Botão de Fechar no Final -->
              <v-card-actions class="justify-end pa-3">
                <v-btn
                  color="red"
                  text
                  @click="$emit('update:dialogVisible', false)"
                  class="text-white"
                >
                  CLOSE
                </v-btn>
              </v-card-actions>
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
  methods: {
    updateProduct(key, value) {
      if (this.product) {
        this.$emit("update:product", { ...this.product, [key]: value });
      }
    },
  },
};
</script>
