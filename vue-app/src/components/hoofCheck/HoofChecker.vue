<script setup lang="ts">
import { HoofCheck } from "@/classes/HoofCheck";
import { onMounted, watch } from "vue";
import HoofCheckSingleHoof from "./HoofCheckSingleHoof.vue";
import { ITreatment } from "@/interfaces/ITreatment";

const treatmentToBeEdited = defineModel({
  required: true,
  type: Object as () => ITreatment,
});

defineProps({
  readonly: {
    default: false,
    type: Boolean,
  },
  showHoofTitle: {
    default: true,
    type: Boolean,
  },
  addTextField: {
    default: false,
    type: Boolean,
  },
});

onMounted(() => {
  if (treatmentToBeEdited.value.hoofCheckString) {
    treatmentToBeEdited.value.hoofCheck = JSON.parse(
      treatmentToBeEdited.value.hoofCheckString
    );
  } else {
    treatmentToBeEdited.value.hoofCheck = new HoofCheck();
  }
});

watch(
  () => treatmentToBeEdited.value.hoofCheck,
  (newValue) => {
    treatmentToBeEdited.value.hoofCheckString = JSON.stringify(newValue);
  },
  { deep: true }
);
</script>

<style scoped lang="scss">
.div-with-hoof-drawing-as-background {
  height: 10rem;
  width: 100%;
  background-size: contain;
  background-position: center;
  background-image: url("@/assets/images/hoof-drawing1.png");
}
</style>
<template>
  <h3 v-if="showHoofTitle">Hufe</h3>
  <template v-if="treatmentToBeEdited.hoofCheck">
    <v-row>
      <v-col col-6 class="text-center">
        <HoofCheckSingleHoof
          :readonly="readonly"
          v-model:hoof-check-status="treatmentToBeEdited.hoofCheck.frontLeft"
          v-model:hoof-check-task="treatmentToBeEdited.hoofCheck.frontLeftTask"
          position="Vorne Links"
          :add-text-field="addTextField"
        ></HoofCheckSingleHoof>
      </v-col>
      <v-col col-6 class="text-center">
        <HoofCheckSingleHoof
          :readonly="readonly"
          v-model:hoof-check-status="treatmentToBeEdited.hoofCheck.frontRight"
          v-model:hoof-check-task="treatmentToBeEdited.hoofCheck.frontRightTask"
          position="Vorne Rechts"
          :add-text-field="addTextField"
        ></HoofCheckSingleHoof>
      </v-col>
    </v-row>
    <v-row>
      <v-col col-6 class="text-center">
        <HoofCheckSingleHoof
          :readonly="readonly"
          v-model:hoof-check-status="treatmentToBeEdited.hoofCheck.backLeft"
          v-model:hoof-check-task="treatmentToBeEdited.hoofCheck.backLeftTask"
          position="Hinten Links"
          :add-text-field="addTextField"
        ></HoofCheckSingleHoof>
      </v-col>
      <v-col col-6 class="text-center">
        <HoofCheckSingleHoof
          :readonly="readonly"
          v-model:hoof-check-status="treatmentToBeEdited.hoofCheck.backRight"
          v-model:hoof-check-task="treatmentToBeEdited.hoofCheck.backRightTask"
          position="Hinten Rechts"
          :add-text-field="addTextField"
        ></HoofCheckSingleHoof
      ></v-col>
    </v-row>
  </template>
</template>
