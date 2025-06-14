<script setup lang="ts">
import { useApiErrorHandlerStore } from "@/stores/apiErrorHandlerStore";
import { storeToRefs } from "pinia";
import StandardToolbar from "./StandardToolbar.vue";

const apiErrorHanlderStore = useApiErrorHandlerStore();
const { showDialog, message } = storeToRefs(apiErrorHanlderStore);
</script>

<template>
  <v-dialog v-model="showDialog" max-width="400">
    <v-card>
      <StandardToolbar
        title="Problem"
        @close="showDialog = false"
      ></StandardToolbar>
      <v-card-text>
        <div class="d-flex justify-center mb-4">
          <v-progress-circular
            :size="70"
            :width="7"
            indeterminate
          ></v-progress-circular>
        </div>
        <div class="d-flex justify-center">
          <div style="white-space: pre-line">{{ message }}</div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
