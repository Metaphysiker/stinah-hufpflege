<script setup lang="ts">
import { Ref, inject, onBeforeMount, ref } from "vue";
import { AxiosStatic } from "axios";
import { IRoutine } from "@/interfaces/IRoutine";
import { Routine } from "@/classes/Routine";
import { RoutineService } from "@/services/RoutineService";
import RoutineForm from "./RoutineForm.vue";
import { IHorse } from "@/interfaces/IHorse";
const props = defineProps({
  horseInput: {
    required: true,
    type: Object as () => IHorse,
  },
  contentInput: {
    required: false,
    type: String,
  },
  treatmentCategory: {
    required: true,
    type: String,
  },
});
const emit = defineEmits(["created", "clearContentInput"]);
const axios: AxiosStatic | undefined = inject("axios");
const routineService = new RoutineService(axios);
const newRoutine: Ref<IRoutine> = ref(new Routine());
const create = () => {
  loading.value = true;
  newRoutine.value.treatmentCategoryName = props.treatmentCategory;
  routineService.Create(newRoutine.value).then(() => {
    emit("created");
    newRoutine.value = new Routine();
    newRoutine.value.horseId = props.horseInput.id;
    loading.value = false;
  });
};

onBeforeMount(() => {
  newRoutine.value.horseId = props.horseInput.id;

  if (props.contentInput) {
    newRoutine.value.note = props.contentInput;
  }
  emit("clearContentInput");
});

const loading = ref(false);
</script>
<template>
  <RoutineForm v-model="newRoutine"></RoutineForm>
  <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
  <v-btn class="mb-2" @click="create()">Speichern</v-btn>
  <v-divider class="mb-2"></v-divider>
</template>
