<script setup lang="ts">
import HorseForm from "./HorseForm.vue";
import { HorseService } from "../../services/HorseService";
import type { AxiosStatic } from "axios";
import { Ref, inject, ref, watch } from "vue";
import { IHorse } from "../../interfaces/IHorse";
import { Horse } from "../../classes/Horse";
const emit = defineEmits(["updated"]);
const axios: AxiosStatic | undefined = inject("axios");
const horseService = new HorseService(axios);
const horseToBeEdited: Ref<IHorse | null> = ref(null);
const horseClass = new Horse();
const props = defineProps({
  horseInput: {
    required: true,
    type: Object as () => IHorse,
  },
});

watch(
  () => props.horseInput,
  (horse) => {
    horseToBeEdited.value = horseClass.clone(horse);
  },
  { immediate: true }
);
const create = () => {
  if (horseToBeEdited.value) {
    horseService.update(horseToBeEdited.value).then(() => {
      emit("updated");
    });
  }
};
</script>
<template>
  <HorseForm v-model="horseToBeEdited"></HorseForm>
  <v-btn @click="create()">Aktualisieren</v-btn>
</template>
