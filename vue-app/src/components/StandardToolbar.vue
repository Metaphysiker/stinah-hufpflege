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
    <div class="standard-toolbar-close-button" @click="emits('close')">
      <v-btn icon>
        <v-icon size="large">mdi-close</v-icon>
      </v-btn>
    </div>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
  </v-toolbar>
  <v-divider></v-divider>
</template>
