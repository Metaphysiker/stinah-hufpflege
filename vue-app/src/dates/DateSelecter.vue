<script setup lang="ts">
import { DateFormatter } from "@/helpers/DateFormatter";
import { computed, ref } from "vue";

const emit = defineEmits(["dateSelected"]);
const dateFormatter = new DateFormatter();
defineProps({
  label: {
    type: String,
    required: true,
  },
});
const date = defineModel({ required: true, type: Object as () => Date });

const dateMenu = ref(false);
const dateString = computed(() => {
  return dateFormatter.dddotmmdotyyyy(date.value);
});
</script>
<template>
  <v-menu v-model="dateMenu" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-text-field
        readonly
        v-model="dateString"
        :label="label"
        append-inner-icon="mdi-calendar"
        variant="underlined"
        v-bind="props"
      ></v-text-field>
    </template>
    <v-card>
      <v-btn @click="dateMenu = false">Schliessen</v-btn>
      <v-date-picker
        :hide-header="true"
        border="xs"
        v-model="date"
      ></v-date-picker>
      <v-btn @click="dateMenu = false">Schliessen</v-btn>
    </v-card>
  </v-menu>
</template>
