<script setup lang="ts">
import { IHorse } from "@/interfaces/IHorse";
import { IRoutine } from "@/interfaces/IRoutine";
import { IRoutineSearch } from "@/interfaces/IRoutineSearch";
import { RoutineService } from "@/services/RoutineService";
import { AxiosStatic } from "axios";
import { inject, onMounted, Ref, ref } from "vue";
import RoutineCard from "./RoutineCard.vue";
const axios: AxiosStatic | undefined = inject("axios");
const routineService = new RoutineService(axios);
const routines: Ref<IRoutine[]> = ref([]);
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
  getRoutines();
});

const getRoutines = () => {
  loading.value = true;
  const routineSearch: IRoutineSearch = {
    horseId: props.horse.id,
    page: 0,
    pageSize: 20,
    sortBy: "Date",
    sortOrder: "descending",
  };

  if (props.categories) {
    routineSearch.categories = props.categories;
  }

  routineService.Search(routineSearch).then((response) => {
    routines.value = response.data;
    loading.value = false;
  });
};

const routineDelete = () => {
  getRoutines();
};
</script>

<template>
  <div v-for="(routine, index) of routines" class="mb-3" :key="routine.id">
    <RoutineCard v-model="routines[index]" @deleted="routineDelete()"></RoutineCard>
  </div>
</template>
