<script setup lang="ts">
import { IHorse } from "@/interfaces/IHorse";
import HorseHoof from "./HorseHoof.vue";

defineProps({
  horses: {
    required: true,
    type: Object as () => IHorse[],
  },
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
  <div class="d-flex flex-wrap">
    <div v-for="horse in horses" class="" :key="horse.id">
      <div class="border ma-2 pa-2 rounded">
        <HorseHoof :horse="horse"></HorseHoof>
      </div>
    </div>
  </div>
</template>
