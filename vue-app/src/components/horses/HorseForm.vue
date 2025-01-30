<script setup lang="ts">
import { IHorse } from "../../interfaces/IHorse";
import { HorseHelper } from "../../helpers/HorseHelper";
import { computed, inject } from "vue";
import { DateFormatter } from "@/helpers/DateFormatter";
import { HorseService } from "@/services/HorseService";
import { AxiosStatic } from "axios";
import { CareAreas } from "@/enum/CareAreas";
const axios: AxiosStatic | undefined = inject("axios");
const horseService = new HorseService(axios);
const dateFormatter = new DateFormatter();
const horseHelper = new HorseHelper(horseService);
const horseToBeEdited = defineModel({
  required: true,
  type: Object as () => IHorse,
});

const props = defineProps({
  readonly: {
    required: false,
    type: Boolean,
  },
});

const nextTreatmentDateForCategory = (
  category: string | undefined,
  numberOfWeeks: number
) => {
  if (horseToBeEdited.value) {
    const lastTimeTreated = horseHelper.calculateHypotheticalNextTreatmentDate(
      horseToBeEdited.value,
      category,
      numberOfWeeks
    );
    if (!lastTimeTreated) return "";
    return dateFormatter.dddotmmdotyyyy(lastTimeTreated);
  }
  return "";
};

const age = computed(() => {
  return new Date().getFullYear() - horseToBeEdited.value.birthYear;
});
</script>
<template>
  <v-text-field
    :readonly="props.readonly"
    label="Name"
    v-model="horseToBeEdited.name"
    variant="underlined"
  ></v-text-field>

  <v-card class="mb-3" variant="outlined">
    <v-card-text>
      <v-text-field
        :readonly="props.readonly"
        label="Hufpflegerhythmus in Wochen"
        v-model="horseToBeEdited.numberOfWeeksUntilNextTreatmentHoofcare"
        variant="underlined"
        type="number"
      ></v-text-field>
      <div class="my-2">
        Nächste Behandlung:
        <strong>{{
          nextTreatmentDateForCategory(
            CareAreas.Hoofcare.toString(),
            horseToBeEdited.numberOfWeeksUntilNextTreatmentHoofcare
          )
        }}</strong>
      </div>
    </v-card-text>
  </v-card>

  <v-card class="mb-3" variant="outlined">
    <v-card-text>
      <v-text-field
        :readonly="props.readonly"
        label="Zahnpflegerhythmus in Wochen"
        v-model="horseToBeEdited.numberOfWeeksUntilNextTreatmentToothcare"
        variant="underlined"
        type="number"
      ></v-text-field>
      <div class="my-2" elevation-2>
        Nächste Behandlung:
        <strong>{{
          nextTreatmentDateForCategory(
            CareAreas.Toothcare.toString(),
            horseToBeEdited.numberOfWeeksUntilNextTreatmentToothcare
          )
        }}</strong>
      </div>
    </v-card-text>
  </v-card>

  <v-card class="mb-3" variant="outlined">
    <v-card-text>
      <v-text-field
        :readonly="props.readonly"
        label="Jahrgang"
        v-model="horseToBeEdited.birthYear"
        variant="underlined"
        type="number"
      ></v-text-field>
      <br />
      <strong>Alter: </strong>{{ age }}
    </v-card-text>
  </v-card>

  <v-textarea
    label="Paten / Patenschaften"
    v-model="horseToBeEdited.patenschaften"
    variant="outlined"
  ></v-textarea>

  <v-checkbox
    :readonly="props.readonly"
    label="Beschlagen?"
    v-model="horseToBeEdited.beschlagen"
  ></v-checkbox>
</template>
