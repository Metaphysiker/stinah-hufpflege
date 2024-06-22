<script setup lang="ts">
import { FileService } from "@/services/FileService";
import { AxiosStatic } from "axios";
import { computed, inject, ref } from "vue";
const emit = defineEmits(["removeFileKey"]);
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

const removeFileKeyDialog = ref(false);

const removeFileKey = () => {
  emit("removeFileKey", props.fileKey);
};
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
        <v-btn color="red" class="ma-2" @click="removeFileKeyDialog = true">
          <v-icon> mdi-close-circle-outline </v-icon>
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

  <v-dialog max-width="400" v-model="removeFileKeyDialog">
    <v-card>
      <v-card-text>
        <div>Eintrag wirklich entfernen?</div>

        <v-btn @click="removeFileKey()">Ja, entfernen</v-btn>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Schliessen" @click="removeFileKeyDialog = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
