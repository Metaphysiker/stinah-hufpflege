<script setup lang="ts">
const axios: AxiosStatic | undefined = inject("axios");
const fileService = new FileService(axios);
import { FileService } from "@/services/FileService";
import { AxiosStatic } from "axios";
import { inject, ref } from "vue";

const errorMessages = ref<string[]>([]);

const emit = defineEmits(["filesUploaded"]);

const uploadFile = () => {
  const promisesToUpload = filesToUpload.value.map((file) => {
    return fileService.uploadFile(file);
  });

  Promise.all(promisesToUpload)
    .then((responses) => {
      fileKeys.value.push(...responses);
      filesToUpload.value = [];
      emit("filesUploaded", responses);
    })
    .catch((error) => {
      errorMessages.value.push(error);
    });
};

const filesToUpload = ref<File[]>([]);
const fileKeys = ref<string[]>([]);

const clearErrorMessages = () => {
  errorMessages.value = [];
};
</script>
<template>
  <v-card variant="outlined">
    <v-card-title>Upload</v-card-title>
    <v-card-text>
      <v-file-input
        label="File input"
        multiple
        v-model="filesToUpload"
        @change="clearErrorMessages()"
      ></v-file-input>

      <v-btn @click="uploadFile()">Hochladen</v-btn>
      <div class="my-2 text-h5 text-red" v-for="errorMessage of errorMessages">
        {{ errorMessage }}
      </div>
    </v-card-text>
  </v-card>
</template>
