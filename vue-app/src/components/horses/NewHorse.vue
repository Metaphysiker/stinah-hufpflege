<script setup lang="ts">
import { Horse } from "../../classes/Horse";
import HorseForm from "./HorseForm.vue";
import { HorseService } from "../../services/HorseService";
import { Ref, inject, ref } from "vue";
import { IHorse } from "../../interfaces/IHorse";
import { AxiosStatic } from "axios";
const emit = defineEmits(["created"]);
const axios: AxiosStatic | undefined = inject("axios");
const horseService = new HorseService(axios);
const newHorse: Ref<IHorse> = ref(new Horse());
const create = () => {
  horseService.create(newHorse.value).then(() => {
    emit("created");
  });
};
</script>
<template>
  <HorseForm v-model="newHorse"></HorseForm>
  <v-btn @click="create()">Speichern</v-btn>
</template>
