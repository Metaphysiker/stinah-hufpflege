<script setup lang="ts">
defineProps({
  title: {
    required: true,
    type: String,
  },
});

const emits = defineEmits(["close"]);
</script>

<template>
  <v-toolbar class="standard-toolbar">
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <div class="standard-toolbar-close-button">
      <v-btn icon @click="emits('close')">
        <v-icon size="large">mdi-close</v-icon>
      </v-btn>
    </div>
  </v-toolbar>
  <v-divider></v-divider>
</template>
