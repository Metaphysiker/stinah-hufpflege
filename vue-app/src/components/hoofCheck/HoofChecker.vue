<script setup lang="ts">
import { HoofCheck } from "@/classes/HoofCheck";
import { onMounted, watch } from "vue";
import HoofCheckSingleHoof from "./HoofCheckSingleHoof.vue";
import { ITreatment } from "@/interfaces/ITreatment";
import { HoofCheckStatuses } from "@/enum/HoofCheckStates";
import { EnumHelper } from "@/helpers/EnumHelper";

const enumHelper = new EnumHelper();
const treatmentToBeEdited = defineModel({
  required: true,
  type: Object as () => ITreatment,
});

const props = defineProps({
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
  onlyShowHoofWithProblems: {
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

const showHoofCheckSingleHoof = (hoofCheckStatus: HoofCheckStatuses) => {
  if (!props.onlyShowHoofWithProblems) return true;
  if (
    enumHelper.isSame(hoofCheckStatus, HoofCheckStatuses.Okay) ||
    enumHelper.isSame(hoofCheckStatus, HoofCheckStatuses.Neutral)
  )
    return false;
  return true;
};
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
      <v-col
        col-6
        class="text-center"
        v-if="showHoofCheckSingleHoof(treatmentToBeEdited.hoofCheck.frontLeft)"
      >
        <HoofCheckSingleHoof
          :readonly="readonly"
          v-model:hoof-check-status="treatmentToBeEdited.hoofCheck.frontLeft"
          v-model:hoof-check-task="treatmentToBeEdited.hoofCheck.frontLeftTask"
          position="Vorne Links"
          :add-text-field="addTextField"
        ></HoofCheckSingleHoof>
      </v-col>
      <v-col
        col-6
        class="text-center"
        v-if="showHoofCheckSingleHoof(treatmentToBeEdited.hoofCheck.frontRight)"
      >
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
      <v-col
        col-6
        class="text-center"
        v-if="showHoofCheckSingleHoof(treatmentToBeEdited.hoofCheck.backLeft)"
      >
        <HoofCheckSingleHoof
          :readonly="readonly"
          v-model:hoof-check-status="treatmentToBeEdited.hoofCheck.backLeft"
          v-model:hoof-check-task="treatmentToBeEdited.hoofCheck.backLeftTask"
          position="Hinten Links"
          :add-text-field="addTextField"
        ></HoofCheckSingleHoof>
      </v-col>
      <v-col
        col-6
        class="text-center"
        v-if="showHoofCheckSingleHoof(treatmentToBeEdited.hoofCheck.backRight)"
      >
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
