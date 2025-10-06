<script setup lang="ts">
import { IHorse } from "@/interfaces/IHorse";
import { computed, inject, onBeforeMount, Ref, ref, watch } from "vue";
import TreatmentList from "../treatments/TreatmentList.vue";
import RoutineList from "../routines/RoutineList.vue";
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
import FileList from "../files/FileList.vue";
import { IFileSearch } from "@/interfaces/IFileSearch";
import { File } from "@/classes/File";
import { IFile } from "@/interfaces/IFile";
import { Routine } from "@/classes/Routine";
import { IRoutine } from "@/interfaces/IRoutine";
import { IRoutineSearch } from "@/interfaces/IRoutineSearch";
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
  categories: selectedTreatmentCategory.value
    ? [selectedTreatmentCategory.value.name]
    : [],
  subCategories: [""],
});

const treatmentSearchFollowUp1: Ref<ITreatmentSearch> = ref({
  horseId: props.model.id,
  sortBy: "Date",
  sortOrder: "descending",
  pageSize: 5,
  page: 0,
  categories: selectedTreatmentCategory.value
    ? [selectedTreatmentCategory.value.name]
    : [],
  subCategories: ["followUp1"],
});

const treatmentSearchFollowUp2: Ref<ITreatmentSearch> = ref({
  horseId: props.model.id,
  sortBy: "Date",
  sortOrder: "descending",
  pageSize: 5,
  page: 0,
  categories: selectedTreatmentCategory.value
    ? [selectedTreatmentCategory.value.name]
    : [],
  subCategories: ["followUp2"],
});

const routineSearch: Ref<IRoutineSearch> = ref({
  horseId: props.model.id,
  sortBy: "Date",
  sortOrder: "descending",
  pageSize: 5,
  page: 0,
});

const fileSearch: Ref<IFileSearch> = ref({
  horseId: props.model.id,
  sortBy: "CreatedAt",
  sortOrder: "descending",
  pageSize: 5,
  page: 0,
});

const labelForTreatments = computed(() => {
  if (props.model.treatmentIds.length === 0) {
    return "Keine Behandlungen vorhanden";
  }

  const translatedCategory = translator.translate(selectedTreatmentCategory.value?.name);

  return `Letzte Vollbehandlungen` + ` (${translatedCategory})`;
});

const labelForRoutines = computed(() => {
  if (props.model.routineIds.length === 0) {
    return "Keine Routinen vorhanden";
  }
  return `Routinen`;
});

const labelForFiles = computed(() => {
  if (props.model.fileIds.length === 0) {
    return "Keine Dateien vorhanden";
  }

  return `Letzte Dateien`;
});

const newTreatment: Ref<ITreatment> = ref(new Treatment());
const newRoutine: Ref<IRoutine> = ref(new Routine());
const newFile: Ref<IFile> = ref(new File());

const assignNewTreatment = (subCategory: string) => {
  const treatment = new Treatment();
  treatment.horseId = props.model.id;
  treatment.category = selectedTreatmentCategory.value?.name || "";
  treatment.subCategory = subCategory;
  newTreatment.value = treatment;
};

const assignNewRoutine = () => {
  const routine = new Routine();
  routine.horseId = props.model.id;
  routine.treatmentCategoryName = selectedTreatmentCategory.value?.name || "";
  newRoutine.value = routine;
};

const assignNewFile = () => {
  const file = new File();
  file.horseId = props.model.id;
  newFile.value = file;
};

onBeforeMount(() => {
  assignNewTreatment("");
  assignNewFile();
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
const createRoutineDialog = ref(false);
const createFileDialog = ref(false);

const treatmentCreated = () => {
  treatmentListKey.value++;
  treatmentListKeyFollowUp1.value++;
  treatmentListKeyFollowUp2.value++;
  createTreatmentDialog.value = false;
  emit("saved", props.model);
};

const routineCreated = () => {
  routineListKey.value++;
  createRoutineDialog.value = false;
  emit("saved", props.model);
};

const fileCreated = () => {
  fileListKey.value++;
  createFileDialog.value = false;
  emit("saved", props.model);
};

const treatmentListKey = ref(0);
const treatmentListKeyFollowUp1 = ref(0);
const treatmentListKeyFollowUp2 = ref(0);
const routineListKey = ref(0);
const fileListKey = ref(0);

const addTreatment = (subCategory: string) => {
  assignNewTreatment(subCategory);
  createTreatmentDialog.value = true;
};

const addRoutine = () => {
  assignNewRoutine();
  createRoutineDialog.value = true;
};

const addFile = () => {
  assignNewFile();
  createFileDialog.value = true;
};

const nextTreatmentDateForCategory = (
  horse: IHorse,
  category: string | undefined,
  subCategory: string | undefined
) => {
  const nextTreatmentDate = horseHelper.calculateNextTreatmentDate(
    horse,
    category,
    subCategory
  );
  if (!nextTreatmentDate) return "";
  return dateFormatter.dddotmmdotyyyy(nextTreatmentDate);
};

const fullTreatments = computed(() => {
  return props.model.treatmentDates.filter((td) => (td.subCategory ?? "") === "");
});

const followUp1Treatments = computed(() => {
  if (props.model.numberOfWeeksUntilNextTreatmentHoofcareFollowUp1 === 0) {
    return [];
  }
  return props.model.treatmentDates.filter((td) => td.subCategory === "followUp1");
});

const followUp2Treatments = computed(() => {
  if (props.model.numberOfWeeksUntilNextTreatmentHoofcareFollowUp2 === 0) {
    return [];
  }
  return props.model.treatmentDates.filter((td) => td.subCategory === "followUp2");
});
</script>

<template>
  <slot></slot>
  <div>
    <p><strong>Name: </strong>{{ model.name }}</p>
    <p><strong>Alter: </strong>{{ age }}</p>
    <p><strong>Geboren: </strong>{{ model.birthYear }}</p>
    <p>
      <strong>Hufpflegerhythmus in Wochen: </strong
      >{{ model.numberOfWeeksUntilNextTreatmentHoofcare }}
    </p>
    <p>
      <strong>Nachbehandlungsrhythmus (1) in Wochen: </strong
      >{{ model.numberOfWeeksUntilNextTreatmentHoofcareFollowUp1 }}
    </p>
    <p>
      <strong>Nachbehandlungsrhythmus (2) in Wochen: </strong
      >{{ model.numberOfWeeksUntilNextTreatmentHoofcareFollowUp2 }}
    </p>
    <p><strong>Arbeit am Huf für das nächste Mal: </strong>{{ model.workOnHoof }}</p>
    <p>
      <strong>Zahnpflegerhythmuspflegerhythmus in Wochen: </strong
      >{{ model.numberOfWeeksUntilNextTreatmentToothcare }}
    </p>

    <p>
      <strong>Gesundheitsrhythmus in Wochen: </strong
      >{{ model.numberOfWeeksUntilNextTreatmentHealthcare }}
    </p>

    <div style="white-space: pre-line">
      <strong>Patenschaften: </strong><br />
      {{ model.patenschaften }}
    </div>

    <v-divider class="my-2"> </v-divider>
    <div v-for="treatmentDate of fullTreatments" :key="treatmentDate.category">
      <strong
        >Nächste Vollbehandlung ({{
          translator.translate(treatmentDate.category)
        }})</strong
      >:
      {{ nextTreatmentDateForCategory(model, treatmentDate.category, "") }}
      <v-divider class="my-2"> </v-divider>
    </div>

    <div v-for="treatmentDate of followUp1Treatments" :key="treatmentDate.category">
      <strong
        >Nächste Nachbehandlung (1) ({{
          translator.translate(treatmentDate.category)
        }})</strong
      >:
      {{ nextTreatmentDateForCategory(model, treatmentDate.category, "followUp1") }}
      <v-divider class="my-2"> </v-divider>
    </div>

    <div v-for="treatmentDate of followUp2Treatments" :key="treatmentDate.category">
      <strong
        >Nächste Nachbehandlung (2) ({{
          translator.translate(treatmentDate.category)
        }})</strong
      >:
      {{ nextTreatmentDateForCategory(model, treatmentDate.category, "followUp2") }}
      <v-divider class="my-2"> </v-divider>
    </div>

    <div class="d-flex justify-start">
      <v-btn @click="addTreatment('')" elevation="3" class="my-3">
        Vollbehandlung hinzufügen
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

    <div class="d-flex justify-start">
      <v-btn @click="addTreatment('followUp1')" elevation="3" class="my-3">
        Nachbehandlung hinzufügen (1)
      </v-btn>
    </div>
    <v-divider class="my-2"> </v-divider>

    <div>
      <strong>Letzte Nachbehandlungen (1)</strong>
    </div>
    <TreatmentList
      :key="treatmentListKeyFollowUp1"
      :treatment-search="treatmentSearchFollowUp1"
      @reload="emit('reload')"
    ></TreatmentList>
    <v-divider class="my-2"> </v-divider>

    <div class="d-flex justify-start">
      <v-btn @click="addTreatment('followUp2')" elevation="3" class="my-3">
        Nachbehandlung hinzufügen (2)
      </v-btn>
    </div>
    <v-divider class="my-2"> </v-divider>

    <div>
      <strong>Letzte Nachbehandlungen (2)</strong>
    </div>
    <TreatmentList
      :key="treatmentListKeyFollowUp2"
      :treatment-search="treatmentSearchFollowUp2"
      @reload="emit('reload')"
    ></TreatmentList>
    abccccccccccccccccccccccccccc
    <v-divider class="my-2"> </v-divider>

    <div class="d-flex justify-start">
      <v-btn @click="addRoutine()" elevation="3" class="my-3"> Routine hinzufügen </v-btn>
    </div>
    <v-divider class="my-2"> </v-divider>

    <div>
      <strong>{{ labelForRoutines }}</strong>
    </div>
    <RoutineList
      :key="routineListKey"
      :routine-search="routineSearch"
      @reload="emit('reload')"
    ></RoutineList>

    <div class="d-flex justify-start">
      <v-btn @click="addFile()" elevation="3" class="my-3"> Datei hinzufügen </v-btn>
    </div>
    <v-divider class="my-2"> </v-divider>
    <div>
      <strong>{{ labelForFiles }}</strong>
    </div>
    <FileList
      :key="fileListKey"
      :file-search="fileSearch"
      @reload="emit('reload')"
    ></FileList>
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

  <v-dialog fullscreen v-model="createRoutineDialog">
    <v-card>
      <NewModelCard
        interface-name="IRoutine"
        :model-blueprint="newRoutine"
        @created="routineCreated()"
        @close="createRoutineDialog = false"
      ></NewModelCard>
    </v-card>
  </v-dialog>

  <v-dialog fullscreen v-model="createFileDialog">
    <v-card>
      <NewModelCard
        interface-name="IFile"
        :model-blueprint="newFile"
        @created="fileCreated()"
        @close="createFileDialog = false"
      ></NewModelCard>
    </v-card>
  </v-dialog>
</template>
