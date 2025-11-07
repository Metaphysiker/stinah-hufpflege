<script setup lang="ts">
const colorToBeEdited = defineModel({
  required: true,
  type: String,
});

const props = defineProps({
  exampleString: {
    required: false,
    type: String,
    default: "Test",
  },
});

const swatches = [
  ["#FFEB3B"], // Light Yellow
  ["#B2FF59"], // Light Green
  ["#81D4FA"], // Light Blue
  ["#FFCDD2"], // Light Pink
  ["#FFE0B2"], // Light Orange
  ["#D1C4E9"], // Lavender
  ["#C8E6C9"], // Mint
  ["#F0F4C3"], // Light Lime
  ["#F5F5F5"], // Light Gray
  ["#FFF9C4"], // Pastel Yellow
  ["#FFD1DC"], // Pastel Pink
  ["#B3FFFC"], // Pale Aqua
  ["#E2F0CB"], // Light Moss
  ["#F6E3B4"], // Light Beige
  ["#E0BBE4"], // Light Purple
];
</script>

<template>
  <v-card>
    <v-card-title>Farbe auswählen</v-card-title>
    <v-btn :style="{ backgroundColor: colorToBeEdited }">{{ exampleString }}</v-btn>
    <v-card-text>
      <v-color-picker
        v-model="colorToBeEdited"
        :swatches="swatches"
        hide-canvas
        hide-sliders
        hide-inputs
        class="ma-2"
        show-swatches
      ></v-color-picker>
    </v-card-text>
  </v-card>
</template>
