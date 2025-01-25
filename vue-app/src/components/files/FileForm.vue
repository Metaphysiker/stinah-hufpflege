<script setup lang="ts">
import { inject, onBeforeMount, ref, Ref } from "vue";
import { IHorse } from "@/interfaces/IHorse";
import { AxiosStatic } from "axios";
import { IHorseSearch } from "@/interfaces/IHorseSearch";
import { IFile } from "@/interfaces/IFile";
import { HorseService } from "@/services/HorseService";
import NewFile from "./NewFile.vue";
const fileToBeEdited = defineModel({
  required: true,
  type: Object as () => IFile,
});
const axios: AxiosStatic | undefined = inject("axios");
const horseService = new HorseService(axios);
const horses: Ref<IHorse[]> = ref([]);
const selectedHorseId: Ref<number | null> = ref(null);

onBeforeMount(() => {
  const horseSearch: IHorseSearch = {
    page: 0,
    pageSize: 300,
  };
  horseService.Search(horseSearch).then((response) => {
    horses.value = response.data;
    if (fileToBeEdited.value.horseId) {
      selectedHorseId.value = fileToBeEdited.value.horseId;
    }
  });
});

const emit = defineEmits<{
  validate: [void];
}>();

const horseSelected = () => {
  if (selectedHorseId.value) {
    fileToBeEdited.value.horseId = selectedHorseId.value;
  } else {
    fileToBeEdited.value.horseId = undefined;
  }
  emit("validate");
};

const filesUploaded = (fileKeyStrings: string[]) => {
  fileToBeEdited.value.fileKeyStrings = fileKeyStrings;
  emit("validate");
};
</script>
<template>
  <v-autocomplete
    v-model="selectedHorseId"
    label="Pferd"
    :items="horses"
    item-title="name"
    item-value="id"
    @update:model-value="horseSelected()"
  ></v-autocomplete>
  <div
    v-if="
      fileToBeEdited.fileKeyStrings && fileToBeEdited.fileKeyStrings.length == 0
    "
  >
    <NewFile
      @files-uploaded="(fileKeyStrings: string[]) => filesUploaded(fileKeyStrings)"
    ></NewFile>
  </div>
  <div
    v-if="
      fileToBeEdited.fileKeyStrings && fileToBeEdited.fileKeyStrings.length > 0
    "
  >
    <p><strong>Hochgeladene Dateien:</strong></p>
    <ul>
      <li v-for="fileKey in fileToBeEdited.fileKeyStrings" :key="fileKey">
        - {{ fileKey }}
      </li>
    </ul>
  </div>
</template>
