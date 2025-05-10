<script setup lang="ts">
import { IHorse } from "@/interfaces/IHorse";
import HorseHoof from "./HorseHoof.vue";
import { computed, ref } from "vue";

defineProps({
  horses: {
    required: true,
    type: Object as () => IHorse[],
  },
});

const currentView = ref("editView");

const switchView = () => {
  currentView.value =
    currentView.value === "editView" ? "printView" : "editView";
};
const currentViewLabel = computed(() => {
  return currentView.value === "editView"
    ? "Bearbeitungs-Ansicht"
    : "Druck-Ansicht";
});

const isPrintView = computed(() => {
  return currentView.value === "printView";
});
</script>

<style scoped lang="scss">
@media print {
  div {
    break-inside: avoid;
  }
}
</style>

<template>
  <div class="d-flex justify-end noprint">
    <v-btn @click="switchView">{{ currentViewLabel }}</v-btn>
  </div>
  <div class="d-flex flex-wrap">
    <div v-for="horse in horses" class="" :key="horse.id">
      <div class="border ma-2 pa-2 rounded">
        <HorseHoof
          :horse="horse"
          :show-save-button="!isPrintView"
          :only-show-hoof-with-problems="true"
        ></HorseHoof>
      </div>
    </div>
  </div>
</template>
