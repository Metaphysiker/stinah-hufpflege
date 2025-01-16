<script setup lang="ts">
import { DateFormatter } from "@/helpers/DateFormatter";
import { ITreatment } from "@/interfaces/ITreatment";
import { ITreatmentSearch } from "@/interfaces/ITreatmentSearch";
import { TreatmentService } from "@/services/TreatmentService";
import { AxiosStatic } from "axios";
import { inject, Ref, ref, watch } from "vue";
import ModelCard from "../generics/ModelCard.vue";
const dateFormatter = new DateFormatter();
const axios: AxiosStatic | undefined = inject("axios");
const treatmentService = new TreatmentService(axios);
const treatments: Ref<ITreatment[]> = ref([]);
const props = defineProps({
  treatmentSearch: {
    required: true,
    type: Object as () => ITreatmentSearch,
  },
});

const getTreatments = () => {
  return new Promise<void>((resolve) => {
    treatmentService.Search(props.treatmentSearch).then((response) => {
      treatments.value = response;
      resolve();
    });
  });
};

watch(
  () => props.treatmentSearch,
  () => {
    getTreatments();
  },
  { immediate: true }
);

const openTreatmentDialog = ref(false);

const openTreatment = (treatment: ITreatment) => {
  clickedOnTreatment.value = treatment;
  openTreatmentDialog.value = true;
};

const clickedOnTreatment: Ref<ITreatment | undefined> = ref(undefined);

const reload = () => {
  getTreatments().then(() => {
    const foundTreatment = treatments.value.find(
      (treatment) => treatment.id === clickedOnTreatment.value?.id
    );
    if (foundTreatment) {
      clickedOnTreatment.value = foundTreatment;
    } else {
      clickedOnTreatment.value = undefined;
      openTreatmentDialog.value = false;
    }
  });
};

const deleteTreatment = () => {
  openTreatmentDialog.value = false;
  reload();
};
</script>

<template>
  <v-list lines="two">
    <v-list-item
      @click="openTreatment(treatment)"
      class="pl-0"
      v-for="treatment in treatments"
      :key="treatment.id"
      :title="dateFormatter.dddotmmdotyyyy(treatment.date)"
      :subtitle="treatment.note"
    ></v-list-item>
  </v-list>

  <v-dialog fullscreen v-model="openTreatmentDialog">
    <v-card v-if="clickedOnTreatment">
      <ModelCard
        @close="openTreatmentDialog = false"
        interface-name="ITreatment"
        :model="clickedOnTreatment"
        @reload="reload()"
        @delete="deleteTreatment()"
      ></ModelCard>
    </v-card>
  </v-dialog>
</template>
