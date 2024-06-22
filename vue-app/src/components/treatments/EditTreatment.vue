<script setup lang="ts">
import { ITreatment } from "@/interfaces/ITreatment";
import TreatmentForm from "./TreatmentForm.vue";
import { AxiosStatic } from "axios";
import { Ref, inject, ref, watch } from "vue";
import { TreatmentService } from "@/services/TreatmentService";
import { TreatmentHelper } from "@/helpers/TreatmentHelper";
const axios: AxiosStatic | undefined = inject("axios");
const treatmentService = new TreatmentService(axios);
const treatmentHelper = new TreatmentHelper();
const emit = defineEmits(["updated"]);

const treatmentToBeEdited = defineModel({
  required: true,
  type: Object as () => ITreatment,
});

const copyOfTreatmentToBeEdited: Ref<ITreatment | undefined> = ref(undefined);

watch(
  treatmentToBeEdited,
  () => {
    copyOfTreatmentToBeEdited.value = treatmentHelper.cloneTreatment(
      treatmentToBeEdited.value
    );
  },
  { immediate: true }
);

const update = () => {
  if (copyOfTreatmentToBeEdited.value) {
    treatmentService
      .update(copyOfTreatmentToBeEdited.value)
      .then((newTreatment) => {
        treatmentToBeEdited.value = newTreatment;
        emit("updated");
      });
  }
};
</script>

<template>
  <v-card-title>Behandlungs-Eintrag bearbeiten</v-card-title>
  <v-card-text>
    <TreatmentForm v-model="copyOfTreatmentToBeEdited"></TreatmentForm>
    <v-btn @click="update()">Aktualisieren</v-btn>
  </v-card-text>
</template>
