<script setup lang="ts">
import { DateFormatter } from "@/helpers/DateFormatter";
const dateFormatter = new DateFormatter();
import { IRoutine } from "@/interfaces/IRoutine";
import { inject, ref } from "vue";
import { AxiosStatic } from "axios";
import StandardToolbar from "../StandardToolbar.vue";
import { RoutineService } from "@/services/RoutineService";
const emit = defineEmits(["deleted"]);
const axios: AxiosStatic | undefined = inject("axios");
const routineService = new RoutineService(axios);
import EditRoutine from "./EditRoutine.vue";
const routine = defineModel({
  required: true,
  type: Object as () => IRoutine,
});

const editRoutineDialog = ref(false);

const closeEditRoutineWithoutSaving = () => {
  editRoutineDialog.value = false;
};

const deleteRoutineDialog = ref(false);

const deleteRoutine = () => {
  if (!routine.value.id) {
    return;
  }
  routineService.Delete(routine.value.id).then(() => {
    emit("deleted");
  });
};
</script>

<template>
  <v-card variant="outlined">
    <v-card-text>
      <div>
        <h3>{{ dateFormatter.dddotmmdotyyyy(routine.date) }}</h3>
      </div>
      <div style="white-space: pre-line">{{ routine.note }}</div>
      <div class="d-flex justify-end">
        <v-btn class="me-2" color="green" @click="editRoutineDialog = true"
          ><v-icon> mdi-pencil </v-icon></v-btn
        >
        <v-btn color="red" @click="deleteRoutineDialog = true"
          ><v-icon> mdi-close-circle-outline </v-icon></v-btn
        >
      </div>
    </v-card-text>
  </v-card>

  <v-dialog fullscreen v-model="editRoutineDialog">
    <v-card>
      <StandardToolbar
        title="Behandlungs-Eintrag bearbeiten"
        @close="closeEditRoutineWithoutSaving()"
      ></StandardToolbar>
      <v-card-text>
        <EditRoutine v-model="routine" @updated="editRoutineDialog = false"></EditRoutine>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog fullscreen v-model="deleteRoutineDialog">
    <v-card>
      <StandardToolbar
        title="Eintrag entfernen"
        @close="deleteRoutineDialog = false"
      ></StandardToolbar>
      <v-card-text>
        <div class="mb-3">Eintrag wirklich entfernen?</div>

        <v-btn @click="deleteRoutine()">Ja, entfernen</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
