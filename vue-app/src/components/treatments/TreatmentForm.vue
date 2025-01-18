<script setup lang="ts">
import DateSelecter from "@/dates/DateSelecter.vue";
import { ITreatment } from "@/interfaces/ITreatment";
import { inject, onBeforeMount, ref, Ref } from "vue";
import { IHorse } from "@/interfaces/IHorse";
import { HorseService } from "@/services/HorseService";
import { AxiosStatic } from "axios";
import { IHorseSearch } from "@/interfaces/IHorseSearch";
const treatmentToBeEdited = defineModel({
  required: true,
  type: Object as () => ITreatment,
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
    horses.value = response;
    if (treatmentToBeEdited.value.horseId) {
      selectedHorseId.value = treatmentToBeEdited.value.horseId;
    }
  });
});

const horseSelected = () => {
  if (selectedHorseId.value) {
    treatmentToBeEdited.value.horseId = selectedHorseId.value;
  } else {
    treatmentToBeEdited.value.horseId = undefined;
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

  {{ treatmentToBeEdited.date }}
  <DateSelecter label="Datum" v-model="treatmentToBeEdited.date" />

  <v-textarea
    label="Notiz"
    v-model="treatmentToBeEdited.note"
    variant="outlined"
  ></v-textarea>
</template>
