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
    console.log(responses);
    fileKeys.value.push(...responses);
    filesToUpload.value = [];
    emit("filesUploaded", responses);
  });

  for (const file of filesToUpload.value) {
    fileService.uploadFile(file).then((response) => {
      console.log(response);
      fileKeys.value.push(response);
    });
  }
};

const filesToUpload = ref<File[]>([]);
const fileKeys = ref<string[]>([]);

const getFileUrl = (key: string) => {
  return fileService.getFileUrl(key);
};
</script>
<template>
  <v-card>
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
  <div v-for="file of filesToUpload">
    {{ file.name }}
  </div>
  <div v-for="key of fileKeys">
    <img :src="getFileUrl(key)" />
    <br />
    {{ key }}
  </div>
</template>
