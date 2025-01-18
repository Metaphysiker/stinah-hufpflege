<script setup lang="ts">
import { IHorse } from "@/interfaces/IHorse";
import { computed, onBeforeMount, Ref, ref, watch } from "vue";
import TreatmentList from "../treatments/TreatmentList.vue";
import { ITreatmentSearch } from "@/interfaces/ITreatmentSearch";
import { ITreatment } from "@/interfaces/ITreatment";
import { Treatment } from "@/classes/Treatment";
import NewModelCard from "../generics/NewModelCard.vue";
import { HorseConverter } from "@/converters/HorseConverter";

const props = defineProps({
  model: {
    required: true,
    type: Object as () => IHorse,
  },
});

const emit = defineEmits(["edit"]);

const modelClone = ref<IHorse | undefined>(undefined);

const horseConverter = new HorseConverter();

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

  return `Letzte ${treatmentSearch.value.pageSize} Behandlungen`;
});

const newTreatment: Ref<ITreatment> = ref(new Treatment());

onBeforeMount(() => {
  const treatment = new Treatment();
  treatment.horseId = props.model.id;
  newTreatment.value = treatment;
});

const createTreatmentDialog = ref(false);

const treatmentCreated = () => {
  treatmentListKey.value++;
  createTreatmentDialog.value = false;
};

const treatmentListKey = ref(0);
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

    <div class="d-flex justify-start">
      <v-btn @click="createTreatmentDialog = true" elevation="3" class="my-3">
        Behandlung hinzufügen
      </v-btn>
    </div>
    <div>
      <strong>{{ labelForTreatments }}</strong>
    </div>
    <TreatmentList
      :key="treatmentListKey"
      :treatment-search="treatmentSearch"
    ></TreatmentList>
  </div>

  <v-dialog fullscreen v-model="createTreatmentDialog">
    <v-card>
      <NewModelCard
        interface-name="ITreatment"
        :model-blueprint="newTreatment"
        @create="treatmentCreated()"
        @close="createTreatmentDialog = false"
      ></NewModelCard>
    </v-card>
  </v-dialog>
</template>
