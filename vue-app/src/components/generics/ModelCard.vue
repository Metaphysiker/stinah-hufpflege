<script setup lang="ts" generic="T extends IModel">
import { computed, onMounted, ref } from "vue";
import StandardToolbar from "../StandardToolbar.vue";
import { IModel } from "@/interfaces/IModel";

const model = defineModel({
  required: true,
  type: Object as () => IModel,
});

onMounted(() => {
  //getTreatments();
});

const showTreatments = computed(() => {
  return Object.hasOwn(model.value, "treatments");
});

const showFiles = computed(() => {
  return Object.hasOwn(model.value, "files");
});

const showNextTime = ref(false);

const toggleShowTreatments = () => {
  //showFiles.value = false;
  showNextTime.value = false;
  //showTreatments.value = !showTreatments.value;
};

const toggleShowFiles = () => {
  //showTreatments.value = false;
  showNextTime.value = false;
  //showFiles.value = !showFiles.value;
};

const toggleShowNextTime = () => {
  //showTreatments.value = false;
  //showFiles.value = false;
  showNextTime.value = !showNextTime.value;
};

const emits = defineEmits(["close"]);
</script>
<template>
  <StandardToolbar title="ModelName" @close="emits('close')"></StandardToolbar>

  <div class="pa-2">
    <v-btn
      @click="toggleShowTreatments()"
      class="mb-3 me-3"
      elevation="3"
      :class="{ 'bg-green': showTreatments }"
      >Behandlungen anschauen</v-btn
    >
    <v-btn
      @click="toggleShowNextTime()"
      class="mb-3 me-3"
      elevation="3"
      :class="{ 'bg-green': showNextTime }"
    >
      Zu beachten beim nächsten Mal
    </v-btn>
    <v-btn
      @click="toggleShowFiles()"
      class="mb-3"
      elevation="3"
      :class="{ 'bg-green': showFiles }"
      >Dokumente anschauen</v-btn
    >
    <v-divider class="my-2"></v-divider>
  </div>
</template>
