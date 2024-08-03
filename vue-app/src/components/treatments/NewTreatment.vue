<script setup lang="ts">
import { Ref, inject, onBeforeMount, ref } from "vue";
import { AxiosStatic } from "axios";
import { ITreatment } from "@/interfaces/ITreatment";
import { Treatment } from "@/classes/Treatment";
import { TreatmentService } from "@/services/TreatmentService";
import TreatmentForm from "./TreatmentForm.vue";
import { IHorse } from "@/interfaces/IHorse";
const props = defineProps({
  horseInput: {
    required: true,
    type: Object as () => IHorse,
  },
});
const emit = defineEmits(["created"]);
const axios: AxiosStatic | undefined = inject("axios");
const treatmentService = new TreatmentService(axios);
const newTreatment: Ref<ITreatment> = ref(new Treatment());
const create = () => {
  treatmentService.create(newTreatment.value).then(() => {
    emit("created");
  });
};

onBeforeMount(() => {
  newTreatment.value.horseId = props.horseInput.id;
  newTreatment.value.noteForNextTreatment =
    props.horseInput.noteForNextTreatment;
});
</script>
<template>
  <TreatmentForm v-model="newTreatment"></TreatmentForm>
  <v-btn @click="create()">Speichern</v-btn>
</template>
