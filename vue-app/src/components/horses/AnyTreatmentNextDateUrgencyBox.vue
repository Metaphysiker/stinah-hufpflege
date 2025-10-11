<script setup lang="ts">
import { DateFormatter } from "@/helpers/DateFormatter";
import { HorseHelper } from "@/helpers/HorseHelper";
import { UrgencyHelper } from "@/helpers/UrgencyHelper";
import { IHorse } from "@/interfaces/IHorse";
import { ITreatmentCategory } from "@/interfaces/ITreatmentCategory";
import { HorseService } from "@/services/HorseService";
import { AxiosStatic } from "axios";
import { computed, inject } from "vue";
const axios: AxiosStatic | undefined = inject("axios");
const horseService = new HorseService(axios);
const horseHelper = new HorseHelper(horseService);
const urgencyHelper = new UrgencyHelper(horseHelper);
const dateFormatter = new DateFormatter();
const props = defineProps({
  horse: {
    required: true,
    type: Object as () => IHorse,
  },
  selectedTreatmentCategory: {
    required: false,
    type: Object as () => ITreatmentCategory | undefined,
  },
});

const nextAnyTreatmentDate = computed(() => {
  return horseHelper.calculateAnyNextTreatmentDate(
    props.horse,
    props.selectedTreatmentCategory?.name
  );
});
</script>
<template>
  <span
    v-if="nextAnyTreatmentDate"
    class="rounded pa-1 text-center"
    :class="urgencyHelper.getClassForUrgencyWithDate(nextAnyTreatmentDate)"
  >
    {{
      dateFormatter.dddotmmdotyyyy(
        nextAnyTreatmentDate as Date
      )
    }}
  </span>
</template>
