<script setup lang="ts">
import { IHorse } from "@/interfaces/IHorse";
import { computed, Ref, ref, watch } from "vue";
import TreatmentList from "../treatments/TreatmentList.vue";
import { ITreatmentSearch } from "@/interfaces/ITreatmentSearch";

const props = defineProps({
  model: {
    required: true,
    type: Object as () => IHorse,
  },
});

const emit = defineEmits(["edit"]);

const modelClone = ref<IHorse | undefined>(undefined);

watch(
  () => props.model,
  () => {
    modelClone.value = JSON.parse(JSON.stringify(props.model));
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
  if (props.model.treatments.length === 0) {
    return "Keine Behandlungen vorhanden";
  }

  return `Letzte ${treatmentSearch.value.pageSize} Behandlungen`;
});
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
    <div>
      <strong>{{ labelForTreatments }}</strong>
    </div>
    <TreatmentList :treatment-search="treatmentSearch"></TreatmentList>
  </div>
</template>
