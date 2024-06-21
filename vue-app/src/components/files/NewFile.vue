<script setup lang="ts">
const axios: AxiosStatic | undefined = inject("axios");
const fileService = new FileService(axios);
import { FileService } from "@/services/FileService";
import { AxiosStatic } from "axios";
import { inject, ref } from "vue";

const emit = defineEmits(["filesUploaded"]);

const uploadFile = () => {
  const promisesToUpload = filesToUpload.value.map((file) => {
    return fileService.uploadFile(file);
  });

  Promise.all(promisesToUpload).then((responses) => {
    fileKeys.value.push(...responses);
    filesToUpload.value = [];
    emit("filesUploaded", responses);
  });

  for (const file of filesToUpload.value) {
    fileService.uploadFile(file).then((response) => {
      fileKeys.value.push(response);
    });
  }
};

const filesToUpload = ref<File[]>([]);
const fileKeys = ref<string[]>([]);
</script>
<template>
  <v-card variant="outlined">
    <v-card-title>Upload</v-card-title>
    <v-card-text>
      <v-file-input
        label="File input"
        multiple
        v-model="filesToUpload"
      ></v-file-input>

      <v-btn @click="uploadFile()">Hochladen</v-btn>
    </v-card-text>
  </v-card>
</template>
