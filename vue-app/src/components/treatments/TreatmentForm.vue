<script setup lang="ts">
import DateSelecter from "@/dates/DateSelecter.vue";
import { ITreatment } from "@/interfaces/ITreatment";
import { computed, inject, onBeforeMount, ref, Ref } from "vue";
import { IHorse } from "@/interfaces/IHorse";
import { HorseService } from "@/services/HorseService";
import { AxiosStatic } from "axios";
import { IHorseSearch } from "@/interfaces/IHorseSearch";
import { storeToRefs } from "pinia";
import { useTreatmentCategoryStore } from "@/stores/treatmentCategoryStore";
import { ITreatmentCategory } from "@/interfaces/ITreatmentCategory";
import { Translator } from "@/helpers/Translator";
const treatmentToBeEdited = defineModel({
  required: true,
  type: Object as () => ITreatment,
});
const axios: AxiosStatic | undefined = inject("axios");
const horseService = new HorseService(axios);
const horses: Ref<IHorse[]> = ref([]);
const selectedHorseId: Ref<number | null> = ref(null);
const treatmentCategoriesCopy = ref<ITreatmentCategory[]>([]);
const treatmentCategoryStore = useTreatmentCategoryStore();
const { treatmentCategories } = storeToRefs(treatmentCategoryStore);
const translator = new Translator();
import { CareAreas } from "@/enum/CareAreas";
import HoofChecker from "../hoofCheck/HoofChecker.vue";
import { CrudOperations } from "@/enum/CrudOperations";

const props = defineProps({
  readonly: {
    required: false,
    type: Boolean,
  },
  crudOperation: {
    default: CrudOperations.update,
    type: Object as () => CrudOperations,
  },
});

onBeforeMount(() => {
  treatmentCategoriesCopy.value = [...treatmentCategories.value];
  const horseSearch: IHorseSearch = {
    page: 0,
    pageSize: 300,
  };
  horseService.Search(horseSearch).then((response) => {
    horses.value = response.data;
    if (treatmentToBeEdited.value.horseId) {
      selectedHorseId.value = treatmentToBeEdited.value.horseId;
    }
  });
});

const horseSelected = () => {
  if (selectedHorseId.value) {
    treatmentToBeEdited.value.horseId = selectedHorseId.value;
  } else {
    treatmentToBeEdited.value.horseId = undefined;
  }
};

const selectedHorse = computed(() => {
  return horses.value.find((h) => h.id === selectedHorseId.value);
});
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
    v-model="treatmentToBeEdited.category"
    :hide-details="true"
    label="Kategorie"
    :item-title="(item) => translator.translate(item.name)"
    :item-value="(item) => item.name"
    :items="treatmentCategoriesCopy"
  ></v-select>
  <v-text-field
    v-if="false"
    class="my-2"
    :readonly="true"
    label="Unterkategorie: "
    v-model="treatmentToBeEdited.subCategory"
  >
  </v-text-field>

  <div class="my-2">
    <DateSelecter label="Datum" v-model="treatmentToBeEdited.date" />
  </div>

  <v-textarea
    label="Notiz"
    v-model="treatmentToBeEdited.note"
    variant="outlined"
    rows="15"
  ></v-textarea>

  <div
  class="border rounded pa-1 my-2"
    v-if="
      selectedHorse &&
      treatmentToBeEdited.subCategory === 'followUp1' &&
      selectedHorse.followUp1AdvanceNotice &&
      props.crudOperation === CrudOperations.create
    "
  >
    <strong>Nachbehandlung (1): </strong> {{ selectedHorse.followUp1AdvanceNotice }}
    <br></br>
    <v-checkbox v-model="treatmentToBeEdited.clearFollowUp1AdvanceNotice" label="Nach Speichern leeren?"></v-checkbox>
  </div>

  <div
  class="border rounded pa-1 my-2"
    v-if="
      selectedHorse &&
      treatmentToBeEdited.subCategory === 'followUp2' &&
      selectedHorse.followUp2AdvanceNotice &&
      props.crudOperation === CrudOperations.create
    "
  >
    <strong>Nachbehandlung (2): </strong> {{ selectedHorse.followUp2AdvanceNotice }}
    <br></br>
    <v-checkbox v-model="treatmentToBeEdited.clearFollowUp2AdvanceNotice" label="Nach Speichern leeren?"></v-checkbox>
  </div>

  <template v-if="treatmentToBeEdited.category === CareAreas.Hoofcare.toString()">
    <HoofChecker v-model="treatmentToBeEdited"></HoofChecker>
  </template>
</template>
