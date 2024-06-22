<script setup lang="ts">
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
import NewTreatment from "../treatments/NewTreatment.vue";
import TreatmentCard from "../treatments/TreatmentCard.vue";
const fileHelper = new FileHelper();
const axios: AxiosStatic | undefined = inject("axios");
const treatments: Ref<ITreatment[]> = ref([]);
const treatmentService = new TreatmentService(axios);
const horseService = new HorseService(axios);

const horse = defineModel({
  required: true,
  type: Object as () => IHorse,
});

onMounted(() => {
  getTreatments();
});

const getTreatments = () => {
  const treatmentSearch: ITreatmentSearch = {
    horseId: horse.value.id,
    page: 0,
    pageSize: 20,
  };

  treatmentService.search(treatmentSearch).then((response) => {
    treatments.value = response;
    treatments.value.sort((a, b) => {
      return a.createdAt < b.createdAt ? 1 : -1;
    });
  });
};

const addFileKeys = (fileKeys: string[]) => {
  fileHelper.addFileKeysToHorse(fileKeys, horse.value);
  horseService.update(horse.value).then((newHorse) => {
    horse.value = newHorse;
  });
};

const tab = ref("behandlungen");

const treatmentDelete = () => {
  getTreatments();
};

const removeFileKey = (fileKey: string) => {
  fileHelper.removeFileKeyFromHorse(fileKey, horse.value);
  horseService.update(horse.value).then((newHorse) => {
    horse.value = newHorse;
  });
};
</script>
<template>
  <h1>{{ horse.name }}</h1>

  <v-tabs v-model="tab" bg-color="gray">
    <v-tab value="zubeachten">Zu beachten</v-tab>
    <v-tab value="behandlungen">Behandlungen</v-tab>
    <v-tab value="dokumente">Dokumente</v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="behandlungen">
      <NewTreatment
        :horse-input="horse"
        @created="getTreatments()"
      ></NewTreatment>
      <div
        v-for="(treatment, index) of treatments"
        class="mb-2"
        :key="treatment.id"
      >
        <TreatmentCard
          v-model="treatments[index]"
          @deleted="treatmentDelete()"
        ></TreatmentCard>
      </div>
    </v-tabs-window-item>

    <v-tabs-window-item value="dokumente">
      <NewFile @files-uploaded="(fileKeys) => addFileKeys(fileKeys)"></NewFile>
      <v-divider class="my-2"></v-divider>
      <ShowFiles
        :file-keys-string="horse.fileKeysString"
        :reverse="true"
        @remove-file-key="(fileKey) => removeFileKey(fileKey)"
      ></ShowFiles>
    </v-tabs-window-item>

    <v-tabs-window-item value="zubeachten">
      <div>
        <h3>Zu beachten beim nächsten Mal</h3>
        <div>{{ horse.noteForNextTreatment }}</div>
      </div>
    </v-tabs-window-item>
  </v-tabs-window>
</template>
