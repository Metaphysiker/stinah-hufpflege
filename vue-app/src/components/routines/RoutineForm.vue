<script setup lang="ts">
import DateSelecter from "@/dates/DateSelecter.vue";
import { IRoutine } from "@/interfaces/IRoutine";
import { inject, onBeforeMount, ref, Ref } from "vue";
import { IHorse } from "@/interfaces/IHorse";
import { HorseService } from "@/services/HorseService";
import { AxiosStatic } from "axios";
import { IHorseSearch } from "@/interfaces/IHorseSearch";
import { storeToRefs } from "pinia";
import { useTreatmentCategoryStore } from "@/stores/treatmentCategoryStore";
import { ITreatmentCategory } from "@/interfaces/ITreatmentCategory";
import { Translator } from "@/helpers/Translator";
import { RoutineHelper } from "@/helpers/RoutineHelper";
import { DateFormatter } from "@/helpers/DateFormatter";
const routineToBeEdited = defineModel({
  required: true,
  type: Object as () => IRoutine,
});
const props = defineProps({
  readonly: {
    required: false,
    type: Boolean,
  },
});

const axios: AxiosStatic | undefined = inject("axios");
const horseService = new HorseService(axios);
const horses: Ref<IHorse[]> = ref([]);
const selectedHorseId: Ref<number | null> = ref(null);
const treatmentCategoriesCopy = ref<ITreatmentCategory[]>([]);
const treatmentCategoryStore = useTreatmentCategoryStore();
const { treatmentCategories } = storeToRefs(treatmentCategoryStore);
const translator = new Translator();
const routineHelper = new RoutineHelper();
const dateFormatter = new DateFormatter();

onBeforeMount(() => {
  treatmentCategoriesCopy.value = [...treatmentCategories.value];
  const horseSearch: IHorseSearch = {
    page: 0,
    pageSize: 300,
  };
  horseService.Search(horseSearch).then((response) => {
    horses.value = response.data;
    if (routineToBeEdited.value.horseId) {
      selectedHorseId.value = routineToBeEdited.value.horseId;
    }
  });
});

const horseSelected = () => {
  if (selectedHorseId.value) {
    routineToBeEdited.value.horseId = selectedHorseId.value;
  } else {
    routineToBeEdited.value.horseId = undefined;
  }
};

const nextTreatmentDateForCategory = () => {
  if (routineToBeEdited.value) {
    const lastTimeTreated = routineHelper.calculateHypotheticalNextTreatmentDate(
      routineToBeEdited.value
    );
    if (!lastTimeTreated) return "";
    return dateFormatter.dddotmmdotyyyy(lastTimeTreated);
  }
  return "";
};

const setDateToToday = () => {
  if (routineToBeEdited.value) {
    routineToBeEdited.value.date = new Date();
  }
};
</script>
<template>
  <v-autocomplete
    v-model="selectedHorseId"
    label="Pferd"
    :items="horses"
    item-title="name"
    item-value="id"
    @update:model-value="horseSelected()"
  ></v-autocomplete>

  <v-select
    v-model="routineToBeEdited.treatmentCategoryName"
    :hide-details="true"
    label="Kategorie"
    :item-title="(item) => translator.translate(item.name)"
    :item-value="(item) => item.name"
    :items="treatmentCategoriesCopy"
  ></v-select>
  <div class="my-2">
    <v-row>
      <v-col cols="6">
        <DateSelecter label="Datum" v-model="routineToBeEdited.date" />
      </v-col>
      <v-col cols="6" class="d-flex align-center">
        <v-btn @click="setDateToToday">Auf Heute setzen</v-btn>
      </v-col>
    </v-row>
  </div>

  <v-card class="mb-3" variant="outlined">
    <v-card-text>
      <v-text-field
        :readonly="props.readonly"
        label="Rhythmus in Wochen"
        v-model="routineToBeEdited.rhythmInWeeks"
        variant="underlined"
        type="number"
      ></v-text-field>
      <div class="my-2" elevation-2>
        Nächste Behandlung:
        <strong>{{ nextTreatmentDateForCategory() }}</strong>
      </div>
    </v-card-text>
  </v-card>

  <v-textarea
    label="Notiz"
    v-model="routineToBeEdited.note"
    variant="outlined"
    rows="15"
  ></v-textarea>
</template>
