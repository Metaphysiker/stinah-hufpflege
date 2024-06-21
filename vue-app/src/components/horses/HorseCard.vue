<script setup lang="ts">
import { DateFormatter } from "@/helpers/DateFormatter";
import { IHorse } from "@/interfaces/IHorse";
import { ITreatment } from "@/interfaces/ITreatment";
import { ITreatmentSearch } from "@/interfaces/ITreatmentSearch";
import { TreatmentService } from "@/services/TreatmentService";
import { AxiosStatic } from "axios";
import { Ref, inject, onMounted, ref } from "vue";
import NewFile from "../files/NewFile.vue";
import { FileHelper } from "@/helpers/FileHelper";
import { HorseService } from "@/services/HorseService";
import ShowFiles from "../files/ShowFiles.vue";
const fileHelper = new FileHelper();
const dateFormatter = new DateFormatter();
const axios: AxiosStatic | undefined = inject("axios");
const treatments: Ref<ITreatment[]> = ref([]);
const treatmentService = new TreatmentService(axios);
const horseService = new HorseService(axios);

const horse = defineModel({
  required: true,
  type: Object as () => IHorse,
});

onMounted(() => {
  const treatmentSearch: ITreatmentSearch = {
    horseId: horse.value.id,
    page: 0,
    pageSize: 20,
  };

  treatmentService.search(treatmentSearch).then((response) => {
    treatments.value = response;
  });
});

const addFileKeys = (fileKeys: string[]) => {
  fileHelper.addFileKeysToHorse(fileKeys, horse.value);
  horseService.update(horse.value).then((newHorse) => {
    horse.value = newHorse;
  });
};

const tab = ref("one");
</script>
<template>
  <h1>{{ horse.name }}</h1>

  <v-tabs v-model="tab" bg-color="gray">
    <v-tab value="one">Behandlungen</v-tab>
    <v-tab value="two">Dokumente</v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="one">
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
    </v-tabs-window-item>

    <v-tabs-window-item value="two">
      <NewFile @files-uploaded="(fileKeys) => addFileKeys(fileKeys)"></NewFile>
      <v-divider class="my-2"></v-divider>
      <ShowFiles
        :file-keys-string="horse.fileKeysString"
        :reverse="true"
      ></ShowFiles>
    </v-tabs-window-item>
  </v-tabs-window>
</template>
