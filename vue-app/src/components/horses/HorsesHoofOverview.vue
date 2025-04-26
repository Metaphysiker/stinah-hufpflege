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
<template>
  <div class="d-flex">
    <div v-for="horse in horses" class="w-50" :key="horse.id">
      <div class="border ma-2 pa-2 rounded">
        <HorseHoof :horse="horse"></HorseHoof>
      </div>
    </div>
  </div>
</template>
