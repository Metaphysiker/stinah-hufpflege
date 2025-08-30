<script setup lang="ts">
import { IRoutine } from "@/interfaces/IRoutine";
import { AxiosStatic } from "axios";
import { Ref, inject, ref, watch } from "vue";
import { RoutineConverter } from "@/converters/RoutineConverter";
import { RoutineService } from "@/services/RoutineService";
import RoutineForm from "./RoutineForm.vue";
const axios: AxiosStatic | undefined = inject("axios");
const routineService = new RoutineService(axios);
const routineConverter = new RoutineConverter();
const emit = defineEmits(["updated"]);

const routineToBeEdited = defineModel({
  required: true,
  type: Object as () => IRoutine,
});

const copyOfRoutineToBeEdited: Ref<IRoutine | undefined> = ref(undefined);

watch(
  routineToBeEdited,
  () => {
    copyOfRoutineToBeEdited.value = routineConverter.convert(routineToBeEdited.value);
  },
  { immediate: true }
);

const update = () => {
  if (copyOfRoutineToBeEdited.value) {
    routineService.Update(copyOfRoutineToBeEdited.value).then((newRoutine) => {
      routineToBeEdited.value = newRoutine;
      emit("updated");
    });
  }
};
</script>

<template>
  <v-card-text v-if="copyOfRoutineToBeEdited">
    <RoutineForm v-model="copyOfRoutineToBeEdited"></RoutineForm>
    <v-btn @click="update()">Aktualisieren</v-btn>
  </v-card-text>
</template>
