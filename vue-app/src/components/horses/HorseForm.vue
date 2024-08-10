<script setup lang="ts">
import { IHorse } from "../../interfaces/IHorse";
import { HorseHelper } from "../../helpers/HorseHelper";
import DateSelecter from "@/dates/DateSelecter.vue";
import { computed } from "vue";
const horseHelper = new HorseHelper();
const horseToBeEdited = defineModel({
  required: true,
  type: Object as () => IHorse,
});

const nextTreatmentDate = computed(() => {
  if (horseToBeEdited.value) {
    return horseHelper.getNextTreatmentDateString(horseToBeEdited.value);
  }
  return "";
});
</script>
<template>
  <v-text-field
    label="Name"
    v-model="horseToBeEdited.name"
    variant="underlined"
  ></v-text-field>
  <DateSelecter
    label="Letzter Beschlag"
    v-model="horseToBeEdited.lastTimeTreated"
  />
  <v-text-field
    label="Hufpflegerhythmus in Wochen"
    v-model="horseToBeEdited.numberOfWeeksUntilNextTreatment"
    variant="underlined"
    type="number"
  ></v-text-field>
  <div class="my-2">
    Nächste Behandlung: <strong>{{ nextTreatmentDate }}</strong>
  </div>
  <v-text-field
    label="Jahrgang"
    v-model="horseToBeEdited.birthYear"
    variant="underlined"
    type="number"
  ></v-text-field>
  <v-checkbox
    label="Beschlagen?"
    v-model="horseToBeEdited.beschlagen"
  ></v-checkbox>
</template>
