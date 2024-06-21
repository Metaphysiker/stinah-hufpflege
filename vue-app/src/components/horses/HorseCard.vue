<script setup lang="ts">
import { DateFormatter } from "@/helpers/DateFormatter";
import { IHorse } from "@/interfaces/IHorse";
import { ITreatment } from "@/interfaces/ITreatment";
import { ITreatmentSearch } from "@/interfaces/ITreatmentSearch";
import { TreatmentService } from "@/services/TreatmentService";
import { AxiosStatic } from "axios";
import { Ref, inject, onMounted, ref } from "vue";
import NewFile from "../files/NewFile.vue";
const dateFormatter = new DateFormatter();
const axios: AxiosStatic | undefined = inject("axios");
const treatments: Ref<ITreatment[]> = ref([]);
const treatmentService = new TreatmentService(axios);

const props = defineProps({
  horse: {
    required: true,
    type: Object as () => IHorse,
  },
});

onMounted(() => {
  const treatmentSearch: ITreatmentSearch = {
    horseId: props.horse.id,
    page: 0,
    pageSize: 20,
  };

  treatmentService.search(treatmentSearch).then((response) => {
    treatments.value = response;
  });
});

const addFileKeys = (fileKeys: string[]) => {
  console.log(fileKeys);
};
</script>
<template>
  <h1>{{ horse.name }}</h1>
  <div v-for="treatment of treatments" class="mb-2">
    <v-card variant="outlined">
      <v-card-text>
        <div>
          <h3>{{ dateFormatter.dddotmmdotyyyy(treatment.createdAt) }}</h3>
        </div>
        <div>{{ treatment.note }}</div>
        <div v-if="treatment.noteForNextTreatment">
          <v-divider class="my-2"></v-divider>
          <div>
            {{ treatment.noteForNextTreatment }}
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>

  <NewFile @files-uploaded="(fileKeys) => addFileKeys(fileKeys)"></NewFile>
</template>
