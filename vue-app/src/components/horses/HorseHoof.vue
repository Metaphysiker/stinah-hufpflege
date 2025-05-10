<script setup lang="ts">
import { IHorse } from "@/interfaces/IHorse";
import HoofChecker from "../hoofCheck/HoofChecker.vue";
import { ITreatment } from "@/interfaces/ITreatment";
import { inject, onMounted, ref, Ref } from "vue";
import { AxiosStatic } from "axios";
import { TreatmentService } from "@/services/TreatmentService";
import { ITreatmentSearch } from "@/interfaces/ITreatmentSearch";
import { useWaitingStore } from "@/stores/waitingStore";
import { storeToRefs } from "pinia";
const waitingStore = useWaitingStore();
const { waiting } = storeToRefs(waitingStore);
const axios: AxiosStatic | undefined = inject("axios");
const treatmentService = new TreatmentService(axios);
const lastTreatment: Ref<ITreatment | undefined> = ref(undefined);

const props = defineProps({
  horse: {
    required: true,
    type: Object as () => IHorse,
  },
  showSaveButton: {
    default: false,
    type: Boolean,
  },
});

onMounted(() => {
  const treatmentSearch: ITreatmentSearch = {
    horseId: props.horse.id,
    sortBy: "Date",
    sortOrder: "descending",
    pageSize: 1,
    page: 0,
  };

  treatmentService.Search(treatmentSearch).then((response) => {
    if (response.data.length > 0) {
      lastTreatment.value = response.data[0];
    }
  });
});

const save = () => {
  if (lastTreatment.value) {
    waiting.value = true;
    treatmentService.Update(lastTreatment.value).then((updatedTreatment) => {
      lastTreatment.value = updatedTreatment;
      waiting.value = false;
    });
  }
};
</script>
<template>
  <h3 class="text-center">{{ horse.name }}</h3>

  <template v-if="lastTreatment">
    <HoofChecker
      :show-hoof-title="false"
      :readonly="true"
      :model-value="lastTreatment"
      :addTextField="true"
    ></HoofChecker>
    <div v-if="showSaveButton">
      <v-btn @click="save">Speichern</v-btn>
    </div>
  </template>
</template>
