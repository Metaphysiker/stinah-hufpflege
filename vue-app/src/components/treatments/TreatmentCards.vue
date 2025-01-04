<script setup lang="ts">
import { IHorse } from "@/interfaces/IHorse";
import { ITreatment } from "@/interfaces/ITreatment";
import { ITreatmentSearch } from "@/interfaces/ITreatmentSearch";
import { TreatmentService } from "@/services/TreatmentService";
import { AxiosStatic } from "axios";
import { inject, onMounted, Ref, ref } from "vue";
const axios: AxiosStatic | undefined = inject("axios");
const treatmentService = new TreatmentService(axios);
const treatments: Ref<ITreatment[]> = ref([]);
const loading = ref(false);

const props = defineProps({
  categories: {
    required: false,
    type: Array as () => string[],
  },
  horse: {
    required: true,
    type: Object as () => IHorse,
  },
});

onMounted(() => {
  getTreatments();
});

const getTreatments = () => {
  //noteForNextTreatmentToBeCopied.value = "";
  loading.value = true;
  const treatmentSearch: ITreatmentSearch = {
    horseId: props.horse.id,
    page: 0,
    pageSize: 20,
  };

  if (props.categories) {
    treatmentSearch.categories = props.categories;
  }

  treatmentService.search(treatmentSearch).then((response) => {
    treatments.value = response;
    loading.value = false;
    treatments.value.sort((a, b) => {
      return a.date < b.date ? 1 : -1;
    });
  });
};

const treatmentDelete = () => {
  getTreatments();
};
</script>

<template>
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
</template>
