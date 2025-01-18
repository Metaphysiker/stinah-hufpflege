<script setup lang="ts">
import StandardToolbar from "../StandardToolbar.vue";
import { useWaitingStore } from "@/stores/waitingStore";
import { storeToRefs } from "pinia";
const waitingStore = useWaitingStore();
const { waiting, waitingText } = storeToRefs(waitingStore);
</script>

<template>
  <v-dialog v-model="waiting" max-width="400">
    <v-card>
      <StandardToolbar
        title="Bitte warten"
        @close="waiting = false"
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
          <div style="white-space: pre-line">{{ waitingText }}</div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
