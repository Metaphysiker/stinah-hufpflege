<script setup lang="ts">
import { IHorse } from "../../interfaces/IHorse";
import { HorseHelper } from "../../helpers/HorseHelper";
import { computed } from "vue";
import { DateFormatter } from "@/helpers/DateFormatter";
const dateFormatter = new DateFormatter();
const horseHelper = new HorseHelper();
const horseToBeEdited = defineModel({
  required: true,
  type: Object as () => IHorse,
});

const nextTreatmentDateForHoofcare = computed(() => {
  if (horseToBeEdited.value) {
    const lastTimeTreated = horseHelper.getLastTimeTreated(
      horseToBeEdited.value,
      "hoofcare"
    );
    if (!lastTimeTreated) return "";
    return dateFormatter.dddotmmdotyyyy(lastTimeTreated);
  }
  return "";
});

const lastTimeTreatedForHoofcare = computed(
  () => horseHelper.getLastTimeTreated(horseToBeEdited.value, "hoofcare") || ""
);
</script>
<template>
  <v-text-field
    label="Name"
    v-model="horseToBeEdited.name"
    variant="underlined"
  ></v-text-field>
  <v-text-field
    label="Letzte Behandlung"
    readonly
    v-model="lastTimeTreatedForHoofcare"
    variant="underlined"
    type="date"
  ></v-text-field>

  <v-text-field
    label="Hufpflegerhythmus in Wochen"
    v-model="horseToBeEdited.numberOfWeeksUntilNextTreatment"
    variant="underlined"
    type="number"
  ></v-text-field>
  <div class="my-2">
    Nächste Behandlung: <strong>{{ nextTreatmentDateForHoofcare }}</strong>
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
