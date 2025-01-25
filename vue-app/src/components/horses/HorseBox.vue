<script setup lang="ts">
import { IHorse } from "@/interfaces/IHorse";
import { computed, inject, onBeforeMount, Ref, ref, watch } from "vue";
import TreatmentList from "../treatments/TreatmentList.vue";
import { ITreatmentSearch } from "@/interfaces/ITreatmentSearch";
import { ITreatment } from "@/interfaces/ITreatment";
import { Treatment } from "@/classes/Treatment";
import NewModelCard from "../generics/NewModelCard.vue";
import { HorseConverter } from "@/converters/HorseConverter";
import { useTreatmentCategoryStore } from "@/stores/treatmentCategoryStore";
import { storeToRefs } from "pinia";
import { Translator } from "@/helpers/Translator";
import { HorseHelper } from "@/helpers/HorseHelper";
import { HorseService } from "@/services/HorseService";
import { AxiosStatic } from "axios";
import { DateFormatter } from "@/helpers/DateFormatter";
const treatmentCategoryStore = useTreatmentCategoryStore();
const { selectedTreatmentCategory } = storeToRefs(treatmentCategoryStore);
const translator = new Translator();
const dateFormatter = new DateFormatter();
const props = defineProps({
  model: {
    required: true,
    type: Object as () => IHorse,
  },
});

const emit = defineEmits<{
  edit: [void];
  reload: [void];
  deleted: [void];
  saved: [model: IHorse];
}>();

const modelClone = ref<IHorse | undefined>(undefined);

const horseConverter = new HorseConverter();
const axios: AxiosStatic | undefined = inject("axios");
const horseService = new HorseService(axios);
const horseHelper = new HorseHelper(horseService);

watch(
  () => props.model,
  () => {
    modelClone.value = horseConverter.convert(props.model);
  },
  { immediate: true }
);

const age = computed(() => {
  if (props.model) {
    return new Date().getFullYear() - props.model.birthYear;
  }
  return 0;
});

const treatmentSearch: Ref<ITreatmentSearch> = ref({
  horseId: props.model.id,
  sortBy: "Date",
  sortOrder: "descending",
  pageSize: 5,
  page: 0,
});

const labelForTreatments = computed(() => {
  if (props.model.treatmentIds.length === 0) {
    return "Keine Behandlungen vorhanden";
  }

  const translatedCategory = translator.translate(
    selectedTreatmentCategory.value?.name
  );

  return `Letzte Behandlungen` + ` (${translatedCategory})`;
});

const newTreatment: Ref<ITreatment> = ref(new Treatment());

const assignNewTreatment = () => {
  const treatment = new Treatment();
  treatment.horseId = props.model.id;
  treatment.category = selectedTreatmentCategory.value?.name || "";
  newTreatment.value = treatment;
};

onBeforeMount(() => {
  assignNewTreatment();
  updateTreatmentSearch();
});

const updateTreatmentSearch = () => {
  if (selectedTreatmentCategory.value) {
    treatmentSearch.value = {
      ...treatmentSearch.value,
      categories: [selectedTreatmentCategory.value.name],
    };
  }
};

const createTreatmentDialog = ref(false);

const treatmentCreated = () => {
  treatmentListKey.value++;
  createTreatmentDialog.value = false;
  emit("saved", props.model);
};

const treatmentListKey = ref(0);

const addTreatment = () => {
  assignNewTreatment();
  createTreatmentDialog.value = true;
};

const nextTreatmentDateForCategory = (
  horse: IHorse,
  category: string | undefined
) => {
  const nextTreatmentDate = horseHelper.calculateNextTreatmentDate(
    horse,
    category
  );
  if (!nextTreatmentDate) return "";
  return dateFormatter.dddotmmdotyyyy(nextTreatmentDate);
};
</script>

<template>
  <slot></slot>
  <div>
    <div class="d-flex align-items-center">
      <div>
        <strong>{{ model.name }}</strong>
      </div>
      <div class="ml-1">| {{ age }} Jahre alt</div>
      <div class="ml-1">| {{ model.birthYear }} geboren</div>
    </div>
    <v-divider class="my-2"> </v-divider>
    <div
      v-for="treatmentDate of model.treatmentDates"
      :key="treatmentDate.category"
    >
      <strong
        >Nächste Behandlung ({{
          translator.translate(treatmentDate.category)
        }})</strong
      >:
      {{ nextTreatmentDateForCategory(model, treatmentDate.category) }}
    </div>

    <v-divider class="my-2"> </v-divider>

    <div class="d-flex justify-start">
      <v-btn @click="addTreatment()" elevation="3" class="my-3">
        Behandlung hinzufügen
      </v-btn>
    </div>
    <v-divider class="my-2"> </v-divider>
    <div>
      <strong>{{ labelForTreatments }}</strong>
    </div>
    <TreatmentList
      :key="treatmentListKey"
      :treatment-search="treatmentSearch"
      @reload="emit('reload')"
    ></TreatmentList>
  </div>

  <v-dialog fullscreen v-model="createTreatmentDialog">
    <v-card>
      <NewModelCard
        interface-name="ITreatment"
        :model-blueprint="newTreatment"
        @created="treatmentCreated()"
        @close="createTreatmentDialog = false"
      ></NewModelCard>
    </v-card>
  </v-dialog>
</template>
