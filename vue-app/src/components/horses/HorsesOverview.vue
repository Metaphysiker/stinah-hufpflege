<script setup lang="ts">
import NewHorse from "./NewHorse.vue";
import EditHorse from "./EditHorse.vue";
import HorsesTable from "./HorsesTable.vue";
import { HorseService } from "../../services/HorseService";
import type { AxiosStatic } from "axios";
import { Ref, inject, onMounted, ref } from "vue";
import { IHorse } from "../../interfaces/IHorse";
import { HorseHelper } from "../../helpers/HorseHelper";
import NewTreatment from "../treatments/NewTreatment.vue";
import HorseCard from "./HorseCard.vue";
import StandardToolbar from "../StandardToolbar.vue";
const currentHorse: Ref<IHorse | undefined> = ref(undefined);
const horseForHorseCard: Ref<IHorse | undefined> = ref(undefined);

const horseHelper = new HorseHelper();
const axios: AxiosStatic | undefined = inject("axios");
const horseService = new HorseService(axios);
const horses: Ref<IHorse[]> = ref([]);
const reload = () => {
  newHorseDialog.value = false;
  editHorseDialog.value = false;
  deleteHorseDialog.value = false;
  horseService.findAll().then((response) => {
    horses.value = response;
  });
};

onMounted(() => {
  reload();
});

const horseTreated = (horse: IHorse) => {
  horseHelper.treated(horse);
  horseService.update(horse).then(() => {
    reload();
  });
};
const editHorseDialog = ref(false);
const newHorseDialog = ref(false);
const deleteHorseDialog = ref(false);
const horseToDelete = ref<IHorse | undefined>(undefined);
const horseToEdit = ref<IHorse | undefined>(undefined);
const deleteHorse = () => {
  if (horseToDelete.value) {
    horseService.delete(horseToDelete.value).then(() => {
      reload();
      deleteHorseDialog.value = false;
    });
  }
};

const newTreatmentDialog = ref(false);
const horseCardDialog = ref(false);

const clickOnBehandelt = (horse: IHorse) => {
  currentHorse.value = horse;
  newTreatmentDialog.value = true;
};

const clickOnName = (horse: IHorse) => {
  horseForHorseCard.value = horse;
  horseCardDialog.value = true;
};

const treatmentCreated = () => {
  if (currentHorse.value) {
    horseTreated(currentHorse.value);
  }
  newTreatmentDialog.value = false;
};
</script>

<template>
  <v-container fluid>
    <HorsesTable
      :horses="horses"
      @clickOnBehandelt="(horse) => clickOnBehandelt(horse)"
      @click-on-name="(horse) => clickOnName(horse)"
      @clickOnDelete="
        (horse) => {
          deleteHorseDialog = true;
          horseToDelete = horse;
        }
      "
      @clickOnEdit="
        (horse) => {
          horseToEdit = horse;
          editHorseDialog = true;
        }
      "
    />
  </v-container>
  <v-container>
    <div class="d-flex justify-end">
      <v-btn
        text="Neues Pferd hinzufügen"
        @click="newHorseDialog = true"
      ></v-btn>
    </div>
  </v-container>

  <v-dialog fullscreen v-model="newHorseDialog">
    <v-card>
      <StandardToolbar
        title="Neues Pferd"
        @close="newHorseDialog = false"
      ></StandardToolbar>
      <v-card-text>
        <NewHorse @created="reload()"></NewHorse>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog fullscreen v-model="editHorseDialog">
    <v-card>
      <StandardToolbar
        title="Pferd bearbeiten"
        @close="editHorseDialog = false"
      ></StandardToolbar>
      <v-card-text v-if="horseToEdit">
        <EditHorse :horse-input="horseToEdit" @updated="reload()"></EditHorse>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog fullscreen v-model="deleteHorseDialog">
    <v-card>
      <StandardToolbar
        title="Pferd entfernen"
        @close="deleteHorseDialog = false"
      ></StandardToolbar>
      <v-card-text>
        <div class="mb-5">Pferd wirklich entfernen?</div>

        <v-btn @click="deleteHorse()">Ja, entfernen</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog fullscreen v-model="newTreatmentDialog">
    <v-card>
      <v-card-text>
        <div v-if="currentHorse">
          <NewTreatment
            :horse-input="currentHorse"
            @created="treatmentCreated()"
          ></NewTreatment>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Schliessen" @click="newTreatmentDialog = false"></v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog fullscreen v-model="horseCardDialog">
    <v-card v-if="horseForHorseCard">
      <HorseCard
        v-model="horseForHorseCard"
        @close="horseCardDialog = false"
      ></HorseCard>
    </v-card>
  </v-dialog>
</template>
