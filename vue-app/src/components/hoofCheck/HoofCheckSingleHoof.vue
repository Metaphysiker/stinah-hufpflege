<script setup lang="ts">
import { HoofCheckStatuses } from "@/enum/HoofCheckStates";
import { computed, PropType } from "vue";

const hoofCheckModel = defineModel({
  type: String as PropType<HoofCheckStatuses>,
});

const props = defineProps({
  position: {
    required: true,
    type: String,
  },
  readonly: {
    default: false,
    type: Boolean,
  },
});

const iconAboveHoofDrawing = computed(() => {
  switch (hoofCheckModel.value) {
    case HoofCheckStatuses.Neutral:
      return "";
    case HoofCheckStatuses.NotOkay:
      return "mdi-close";
    case HoofCheckStatuses.Okay:
      return "mdi-check";
  }
});

const colorForIconAboveHoofDrawing = computed(() => {
  switch (hoofCheckModel.value) {
    case HoofCheckStatuses.Neutral:
      return "grey";
    case HoofCheckStatuses.NotOkay:
      return "error";
    case HoofCheckStatuses.Okay:
      return "success";
  }
});

const switchHoofCheckStatus = () => {
  if (!props.readonly) {
    switch (hoofCheckModel.value) {
      case HoofCheckStatuses.Neutral:
        hoofCheckModel.value = HoofCheckStatuses.Okay;
        break;
      case HoofCheckStatuses.Okay:
        hoofCheckModel.value = HoofCheckStatuses.NotOkay;
        break;
      case HoofCheckStatuses.NotOkay:
        hoofCheckModel.value = HoofCheckStatuses.Neutral;
        break;
    }
  }
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
  <p class="my-2">
    <strong>{{ position }}</strong>
  </p>
  <div
    class="div-with-hoof-drawing-as-background d-flex align-center justify-center"
    @click="switchHoofCheckStatus()"
  >
    <v-icon
      size="100"
      :color="colorForIconAboveHoofDrawing"
      class="mt-8"
      :icon="iconAboveHoofDrawing"
    ></v-icon>
  </div>
</template>
