<script setup lang="ts">
import { DateFormatter } from "@/helpers/DateFormatter";
import EditTreatment from "./EditTreatment.vue";
const dateFormatter = new DateFormatter();
import { ITreatment } from "@/interfaces/ITreatment";
import { inject, ref } from "vue";
import { AxiosStatic } from "axios";
import { TreatmentService } from "@/services/TreatmentService";
import StandardToolbar from "../StandardToolbar.vue";
const emit = defineEmits(["deleted"]);
const axios: AxiosStatic | undefined = inject("axios");
const treatmentService = new TreatmentService(axios);

const treatment = defineModel({
  required: true,
  type: Object as () => ITreatment,
});

const editTreatmentDialog = ref(false);

const closeEditTreatmentWithoutSaving = () => {
  editTreatmentDialog.value = false;
};

const deleteTreatmentDialog = ref(false);

const deleteTreatment = () => {
  treatmentService.delete(treatment.value).then(() => {
    emit("deleted");
  });
};
</script>

<template>
  <v-card variant="outlined">
    <v-card-text>
      <div>
        <h3>{{ dateFormatter.dddotmmdotyyyy(treatment.createdAt) }}</h3>
      </div>
      <div style="white-space: pre-line">{{ treatment.note }}</div>
      <div class="d-flex justify-end">
        <v-btn class="me-2" color="green" @click="editTreatmentDialog = true"
          ><v-icon> mdi-pencil </v-icon></v-btn
        >
        <v-btn color="red" @click="deleteTreatmentDialog = true"
          ><v-icon> mdi-close-circle-outline </v-icon></v-btn
        >
      </div>
    </v-card-text>
  </v-card>

  <v-dialog fullscreen v-model="editTreatmentDialog">
    <v-card>
      <StandardToolbar
        title="Behandlungs-Eintrag bearbeiten"
        @close="closeEditTreatmentWithoutSaving()"
      ></StandardToolbar>
      <v-card-text>
        <EditTreatment
          v-model="treatment"
          @updated="editTreatmentDialog = false"
        ></EditTreatment>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog fullscreen v-model="deleteTreatmentDialog">
    <v-card>
      <StandardToolbar
        title="Eintrag entfernen"
        @close="deleteTreatmentDialog = false"
      ></StandardToolbar>
      <v-card-text>
        <div class="mb-3">Eintrag wirklich entfernen?</div>

        <v-btn @click="deleteTreatment()">Ja, entfernen</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
