<script setup lang="ts">
import { FileService } from "@/services/FileService";
import { AxiosStatic } from "axios";
import { computed, inject } from "vue";
const axios: AxiosStatic | undefined = inject("axios");
const fileService = new FileService(axios);
const props = defineProps({
  fileKey: {
    required: true,
    type: String,
  },
});

const validateImageExtension = (fileKey: string) => {
  var allowedExtensions = ["jpg", "jpeg", "png", "gif"];
  var extension = fileKey.split(".")?.pop()?.toLowerCase();
  if (!extension) {
    return false;
  }
  return allowedExtensions.indexOf(extension) !== -1;
};

const isFileNameImage = computed(() => {
  return validateImageExtension(props.fileKey);
});
</script>

<template>
  <div>
    <div class="text-center" v-if="isFileNameImage">
      <v-img cover :src="fileService.getFileUrl(fileKey)"></v-img>
      <div class="d-flex justify-end">
        <v-btn
          class="ma-2"
          outlined
          :href="fileService.getFileUrl(fileKey)"
          target="_blank"
          download
        >
          Download
        </v-btn>
      </div>
    </div>
    <div v-else>
      <v-btn
        class="ma-2"
        outlined
        :href="fileService.getFileUrl(fileKey)"
        target="_blank"
        download
      >
        {{ props.fileKey }}
      </v-btn>
    </div>
  </div>
</template>
