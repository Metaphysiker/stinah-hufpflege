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
import StandardToolbar from "../StandardToolbar.vue";
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
  noteForNextTreatmentToBeCopied.value = "";
  loading.value = true;
  const treatmentSearch: ITreatmentSearch = {
    horseId: horse.value.id,
    page: 0,
    pageSize: 20,
  };

  treatmentService.search(treatmentSearch).then((response) => {
    treatments.value = response;
    loading.value = false;
    treatments.value.sort((a, b) => {
      return a.date < b.date ? 1 : -1;
    });
  });
};

const addFileKeys = (fileKeys: string[]) => {
  fileHelper.addFileKeysToHorse(fileKeys, horse.value);
  horseService.update(horse.value).then((newHorse) => {
    horse.value = newHorse;
  });
};

const treatmentDelete = () => {
  getTreatments();
};

const removeFileKey = (fileKey: string) => {
  fileHelper.removeFileKeyFromHorse(fileKey, horse.value);
  horseService.update(horse.value).then((newHorse) => {
    horse.value = newHorse;
  });
};

const showTreatments = ref(true);
const showFiles = ref(false);
const showNextTime = ref(false);

const toggleShowTreatments = () => {
  showFiles.value = false;
  showNextTime.value = false;
  showTreatments.value = !showTreatments.value;
};

const toggleShowFiles = () => {
  showTreatments.value = false;
  showNextTime.value = false;
  showFiles.value = !showFiles.value;
};

const toggleShowNextTime = () => {
  showTreatments.value = false;
  showFiles.value = false;
  showNextTime.value = !showNextTime.value;
};

const emits = defineEmits(["close"]);
const loading = ref(false);

const saveNoteForNextTreatment = () => {
  console.log(horse.value.noteForNextTreatment);
  horseService.update(horse.value).then((newHorse) => {
    horse.value = newHorse;
  });
};

const copyNoteForNextTreatmentToTreatment = () => {
  noteForNextTreatmentToBeCopied.value = horse.value.noteForNextTreatment;
  toggleShowTreatments();
};

const noteForNextTreatmentToBeCopied = ref("");
</script>
<template>
  <StandardToolbar
    :title="horse.name"
    @close="emits('close')"
  ></StandardToolbar>

  <div class="pa-2">
    <v-btn
      @click="toggleShowTreatments()"
      class="mb-3 me-3"
      elevation="3"
      :class="{ 'bg-green': showTreatments }"
      >Behandlungen anschauen</v-btn
    >
    <v-btn
      @click="toggleShowNextTime()"
      class="mb-3 me-3"
      elevation="3"
      :class="{ 'bg-green': showNextTime }"
    >
      Zu beachten beim nächsten Mal
    </v-btn>
    <v-btn
      @click="toggleShowFiles()"
      class="mb-3"
      elevation="3"
      :class="{ 'bg-green': showFiles }"
      >Dokumente anschauen</v-btn
    >
    <v-divider class="my-2"></v-divider>

    <div v-if="showNextTime">
      <v-textarea
        label="Zu beachten beim nächsten Mal"
        v-model="horse.noteForNextTreatment"
        variant="outlined"
      ></v-textarea>
      <v-btn @click="saveNoteForNextTreatment()" class="mb-3 me-3"
        >Speichern</v-btn
      >
      <v-btn @click="copyNoteForNextTreatmentToTreatment()" class="mb-3 me-3"
        >Zu Behandlung kopieren</v-btn
      >
    </div>

    <div v-if="showTreatments">
      <NewTreatment
        :horse-input="horse"
        :content-input="noteForNextTreatmentToBeCopied"
        @created="getTreatments()"
        @clear-content-input="noteForNextTreatmentToBeCopied = ''"
      ></NewTreatment>
      <v-progress-linear indeterminate v-if="loading"></v-progress-linear>

      <div
        v-for="(treatment, index) of treatments"
        class="mb-2"
        :key="treatment.id"
      >
        <v-divider class="my-2"></v-divider>
        <TreatmentCard
          v-model="treatments[index]"
          @deleted="treatmentDelete()"
        ></TreatmentCard>
      </div>
    </div>

    <div v-if="showFiles">
      <NewFile @files-uploaded="(fileKeys) => addFileKeys(fileKeys)"></NewFile>
      <v-divider class="my-2"></v-divider>
      <ShowFiles
        :file-keys-string="horse.fileKeysString"
        :reverse="true"
        @remove-file-key="(fileKey) => removeFileKey(fileKey)"
      ></ShowFiles>
    </div>
  </div>
</template>
div
