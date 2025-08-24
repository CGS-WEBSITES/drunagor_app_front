<template>
  <v-app>
    <v-main class="bg-grey-lighten-3">
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="3">
            <v-card class="fill-height d-flex flex-column">
              <v-card-title class="flex-shrink-0">
                Controles e Assets
              </v-card-title>
              <v-divider></v-divider>

              <v-card-text class="flex-grow-1 overflow-y-auto">
                <v-list-subheader>LISTA DE E-MAILS</v-list-subheader>
                <v-autocomplete
                  v-model="selectedEmails"
                  :items="emails"
                  label="Enviar para"
                  multiple
                  chips
                  closable-chips
                  variant="outlined"
                  density="compact"
                  placeholder="Selecione os destinatários"
                ></v-autocomplete>

                <v-divider class="my-4"></v-divider>

                <v-list-subheader>ASSETS PARA ENVIO (BUCKET)</v-list-subheader>
                <v-list density="compact" lines="one">
                  <v-list-item
                    v-for="asset in assets"
                    :key="asset.name"
                    :title="asset.name"
                    :subtitle="`${asset.size} KB`"
                  >
                    <template v-slot:prepend>
                      <v-icon :icon="asset.icon"></v-icon>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>

              <v-divider></v-divider>
              <v-card-actions class="flex-shrink-0">
                <v-btn
                  color="primary"
                  variant="flat"
                  prepend-icon="mdi-upload"
                  block
                >
                  Fazer Upload de Asset
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="5">
            <v-card class="fill-height d-flex flex-column">
              <v-card-title class="flex-shrink-0"> Editor HTML </v-card-title>
              <v-divider></v-divider>
              <div class="editor-wrapper flex-grow-1">
                <v-textarea
                  v-model="htmlContent"
                  label="Código HTML do E-mail"
                  variant="filled"
                  hide-details
                  class="editor-textarea"
                  no-resize
                ></v-textarea>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="fill-height d-flex flex-column">
              <v-card-title class="flex-shrink-0">
                Pré-visualização do E-mail
              </v-card-title>
              <v-divider></v-divider>
              <div class="email-preview-pane flex-grow-1">
                <div v-html="htmlContent"></div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const htmlContent = ref(`
  <style>
    .email-body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .header {
      background-color: #004d40;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 20px;
    }
    .footer {
      margin-top: 20px;
      padding: 10px;
      font-size: 12px;
      text-align: center;
      color: #777;
    }
  </style>
  <div class="email-body">
    <div class="header">
      <h1>Título do E-mail</h1>
    </div>
    <div class="content">
      <h2>Olá,</h2>
      <p>Este é um parágrafo de exemplo para o corpo do seu e-mail. Você pode <strong>editar este HTML</strong> na coluna do meio para ver as alterações aqui em tempo real.</p>
      <button style="background-color: #00796b; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer;">
        Botão de Ação
      </button>
    </div>
    <div class="footer">
      <p>Empresa Exemplo &copy; 2025</p>
    </div>
  </div>
`);

const emails = ref([
  "contato@empresa.com",
  "suporte@cliente.com",
  "marketing@parceiro.com",
  "dev.team@interno.com",
  "ceo@empresa.com",
]);
const selectedEmails = ref([]);

const assets = ref([
  { name: "logo.png", size: "15", icon: "mdi-image" },
  { name: "banner_promocional.jpg", size: "128", icon: "mdi-image-area" },
  { name: "documento_termos.pdf", size: "256", icon: "mdi-file-pdf-box" },
]);
</script>

<style scoped>
.fill-height {
  height: 100%;
}

.v-row {
  height: calc(100vh - 48px);
}

.editor-wrapper {
  height: 100%;
}

.editor-textarea {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-textarea :deep(.v-input__control) {
  flex-grow: 1;
}

.editor-textarea :deep(.v-field) {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.editor-textarea :deep(.v-field__field) {
  flex-grow: 1;
}

.editor-textarea :deep(textarea) {
  height: 100%;
  overflow-y: auto !important;
}

.email-preview-pane {
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  margin: 16px;
  border-radius: 4px;
  overflow-y: auto;
}
</style>
