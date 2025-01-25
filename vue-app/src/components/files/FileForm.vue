<script setup lang="ts">
import { inject, onBeforeMount, ref, Ref } from "vue";
import { IHorse } from "@/interfaces/IHorse";
import { AxiosStatic } from "axios";
import { IHorseSearch } from "@/interfaces/IHorseSearch";
import { IFile } from "@/interfaces/IFile";
import { HorseService } from "@/services/HorseService";
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

const horseSelected = () => {
  if (selectedHorseId.value) {
    fileToBeEdited.value.horseId = selectedHorseId.value;
  } else {
    fileToBeEdited.value.horseId = undefined;
  }
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
</template>
