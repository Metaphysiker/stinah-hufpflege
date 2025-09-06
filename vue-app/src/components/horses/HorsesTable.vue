<script setup lang="ts">
import { computed, inject } from "vue";
import type { IHorse } from "../../interfaces/IHorse";
import { DateFormatter } from "../../helpers/DateFormatter";
import { UrgencyHelper } from "../../helpers/UrgencyHelper";
import { HorseHelper } from "@/helpers/HorseHelper";
import { HorseService } from "@/services/HorseService";
import { AxiosStatic } from "axios";
import { useTreatmentCategoryStore } from "@/stores/treatmentCategoryStore";
import { storeToRefs } from "pinia";
import { Translator } from "@/helpers/Translator";
import { CareAreas } from "@/enum/CareAreas";
import { ISortItem } from "@/interfaces/ISortItem";
import { RoutineHelper } from "@/helpers/RoutineHelper";
const treatmentCategoryStore = useTreatmentCategoryStore();
const { selectedTreatmentCategory } = storeToRefs(treatmentCategoryStore);
const axios: AxiosStatic | undefined = inject("axios");
const horseService = new HorseService(axios);
const horseHelper = new HorseHelper(horseService);
const urgencyHelper = new UrgencyHelper(horseHelper);
const dateFormatter = new DateFormatter();
const translator = new Translator();
const routineHelper = new RoutineHelper();

const getHeaders = () => {
  const category =
    "(" + translator.translate(selectedTreatmentCategory.value?.name) + ")";
  const titleForLastTimeTreated = "Letzte Behandlung " + category;

  let showNumberOfWeeksUntilNextTreatmentHoofcare = false;
  let showNumberOfWeeksUntilNextTreatmentToothcare = false;
  let showNumberOfWeeksUntilNextTreatmentHealthcare = false;
  let showNextTreatmentDate = false;

  if (selectedTreatmentCategory.value?.name === CareAreas.Hoofcare.toString()) {
    showNumberOfWeeksUntilNextTreatmentHoofcare = true;
    showNextTreatmentDate = true;
  } else if (selectedTreatmentCategory.value?.name === CareAreas.Toothcare.toString()) {
    showNumberOfWeeksUntilNextTreatmentToothcare = true;
    showNextTreatmentDate = true;
  } else if (selectedTreatmentCategory.value?.name === CareAreas.Healthcare.toString()) {
    showNumberOfWeeksUntilNextTreatmentHealthcare = true;
    showNextTreatmentDate = true;
  } else if (!selectedTreatmentCategory.value) {
    showNumberOfWeeksUntilNextTreatmentHoofcare = true;
    showNumberOfWeeksUntilNextTreatmentToothcare = true;
    showNumberOfWeeksUntilNextTreatmentHealthcare = true;
    showNextTreatmentDate = true;
  }

  const headersForRoutines = [];
  for (let i = 0; i < numberOfMostRoutinesOfAHorse.value; i++) {
    headersForRoutines.push({
      key: `routine_${i}`,
      title: `Routine ${i + 1}`,
      selected: true,
    });
  }

  const headersPart1 = [
    { key: "name", title: "Name", selected: true },
    {
      key: "lastTimeTreated",
      title: titleForLastTimeTreated,
      selected: true,
      sortRaw(a: IHorse, b: IHorse) {
        const aDate =
          horseHelper
            .getLastTimeTreatedForCategory(a, selectedTreatmentCategory.value?.name)
            ?.getTime() || 0;
        const bDate =
          horseHelper
            .getLastTimeTreatedForCategory(b, selectedTreatmentCategory.value?.name)
            ?.getTime() || 0;
        return aDate - bDate;
      },
    },
    {
      key: "nextTreatmentDate",
      title: "nächstes Mal",
      selected: showNextTreatmentDate,
      sortRaw(a: IHorse, b: IHorse) {
        const aDate =
          horseHelper
            .calculateNextTreatmentDate(a, selectedTreatmentCategory.value?.name)
            ?.getTime() || 0;
        const bDate =
          horseHelper
            .calculateNextTreatmentDate(b, selectedTreatmentCategory.value?.name)
            ?.getTime() || 0;

        return aDate - bDate;
      },
    },
  ];

  const headersPart2 = headersForRoutines;

  const headersPart3 = [
    {
      key: "numberOfWeeksUntilNextTreatmentHoofcare",
      title: translator.translate("numberOfWeeksUntilNextTreatmentHoofcare"),
      selected: showNumberOfWeeksUntilNextTreatmentHoofcare,
    },
    {
      key: "workOnHoof",
      title: translator.translate("workOnHoof"),
      selected: showNumberOfWeeksUntilNextTreatmentHoofcare,
    },
    {
      key: "numberOfWeeksUntilNextTreatmentToothcare",
      title: translator.translate("numberOfWeeksUntilNextTreatmentToothcare"),
      selected: showNumberOfWeeksUntilNextTreatmentToothcare,
    },
    {
      key: "numberOfWeeksUntilNextTreatmentHealthcare",
      title: translator.translate("numberOfWeeksUntilNextTreatmentHealthcare"),
      selected: showNumberOfWeeksUntilNextTreatmentHealthcare,
    },
    { key: "birthYear", title: "Alter", selected: true },
    {
      key: "summaryHoofCheckStatusOfLastTreatment",
      title: "Huf-Status",
      selected: true,
      sortRaw(a: IHorse, b: IHorse) {
        // Sort by SummaryHoofCheckStatusOfLastTreatment
        const aStatus = a.summaryHoofCheckStatusOfLastTreatment;
        const bStatus = b.summaryHoofCheckStatusOfLastTreatment;
        if (aStatus === "NotOkay" && bStatus !== "NotOkay") {
          return 1;
        } else if (aStatus !== "NotOkay" && bStatus === "NotOkay") {
          return -1;
        } else {
          return 0;
        }
      },
    },
    { key: "action", title: "Aktion", selected: false },
  ];

  return [...headersPart1, ...headersPart2, ...headersPart3];
};

const getIndexFromRoutineHeader = (header: string) => {
  const match = header.match(/routine_(\d+)/);
  return match ? parseInt(match[1], 10) : -1;
};

const isSpecialColumn = (header: string) => {
  if (header.startsWith("routine_")) return true;

  return [
    "name",
    "lastTimeTreated",
    "birthYear",
    "nextTreatmentDate",
    "action",
    "hoofCheckStatusTotal",
    "summaryHoofCheckStatusOfLastTreatment",
  ].includes(header);
};

const props = defineProps({
  models: {
    required: true,
    type: Object as () => IHorse[],
  },
  sortBy: {
    required: false,
    type: String,
  },
  sortByOrder: {
    required: false,
    type: String,
  },
});

const getRoutinesInSameArea = (horse: IHorse) => {
  if (!selectedTreatmentCategory.value?.name) return horse.includedRoutines;
  return horse.includedRoutines.filter(
    (routine) => routine.treatmentCategoryName === selectedTreatmentCategory.value?.name
  );
};

const numberOfMostRoutinesOfAHorse = computed(() => {
  return props.models.reduce((max, horse) => {
    const routinesInSameArea = getRoutinesInSameArea(horse);
    return Math.max(max, routinesInSameArea.length);
  }, 0);
});

const clickOnBehandelt = (horse: IHorse) => {
  emit("clickOnBehandelt", horse);
};

const clickOnDelete = (horse: IHorse) => {
  emit("clickOnDelete", horse);
};

const clickOnEdit = (horse: IHorse) => {
  emit("clickOnEdit", horse);
};

const clickOnName = (horse: IHorse) => {
  emit("clickOnName", horse);
};

const emit = defineEmits<{
  clickOnBehandelt: [model: IHorse];
  clickOnDelete: [model: IHorse];
  clickOnEdit: [model: IHorse];
  clickOnName: [model: IHorse];
}>();

const lastTimeTreatedForCategory = (horse: IHorse) => {
  if (selectedTreatmentCategory.value?.name) {
    const foundLastTreatmentDate = horse.treatmentDates.find(
      (treatmentDate) => treatmentDate.category === selectedTreatmentCategory.value?.name
    );

    if (foundLastTreatmentDate?.lastTimeTreated) {
      return dateFormatter.dddotmmdotyyyy(foundLastTreatmentDate.lastTimeTreated);
    }
  }

  return "";
};

const nextTreatmentDateForCategory = (horse: IHorse, category: string | undefined) => {
  const nextTreatmentDate = horseHelper.calculateNextTreatmentDate(horse, category);
  if (!nextTreatmentDate) return "";
  return dateFormatter.dddotmmdotyyyy(nextTreatmentDate);
};

const sortByKey = computed(() => {
  if (!props.sortBy) return [];
  let sortItem: ISortItem = {
    key: props.sortBy,
    order: props.sortByOrder === "desc" ? "desc" : "asc",
  };
  return [sortItem];
});

const sortDesc = computed(() => (props.sortBy ? [props.sortByOrder === "desc"] : []));

const getRoutineNote = (horse: IHorse, headerKey: string) => {
  const routineIndex = getIndexFromRoutineHeader(headerKey);
  if (routineIndex === -1) return "";

  const routinesInSameArea = getRoutinesInSameArea(horse);
  const routine = routinesInSameArea[routineIndex];
  return routine ? routine.note : "";
};

const getRoutineDate = (horse: IHorse, headerKey: string) => {
  const routineIndex = getIndexFromRoutineHeader(headerKey);
  if (routineIndex === -1) return "";

  const routinesInSameArea = getRoutinesInSameArea(horse);
  const routine = routinesInSameArea[routineIndex];
  if (!routine) return "";
  const nextDate = routineHelper.calculateHypotheticalNextTreatmentDate(routine);
  return nextDate ? dateFormatter.dddotmmdotyyyy(nextDate) : "";
};

const getRoutineUrgencyClass = (horse: IHorse, headerKey: string) => {
  const routineIndex = getIndexFromRoutineHeader(headerKey);
  if (routineIndex === -1) return "";

  const routinesInSameArea = getRoutinesInSameArea(horse);
  const routine = routinesInSameArea[routineIndex];
  if (!routine) return "";
  const nextDate = routineHelper.calculateHypotheticalNextTreatmentDate(routine);
  if (!nextDate) return "";
  return urgencyHelper.getClassForUrgencyWithDate(nextDate);
};
</script>

<template>
  <v-data-table
    :headers="getHeaders().filter((h) => h.selected)"
    :items="models"
    hide-default-footer
    :items-per-page="100"
    :sort-by="sortByKey"
    :sort-desc="sortDesc"
  >
    <template v-slot:item="row">
      <tr>
        <td v-for="header in getHeaders().filter((h) => h.selected)" :key="header.key">
          <div v-if="row.item && row.item.hasOwnProperty(header.key)">
            <template v-if="!isSpecialColumn(header.key)">
              {{ row.item[header.key as keyof IHorse] }}
            </template>

            <template v-if="header.key === 'birthYear'">
              {{ new Date().getFullYear() - row.item["birthYear"] }}
            </template>
            <template v-if="header.key === 'name'">
              <v-btn @click="clickOnName(row.item)">{{ row.item["name"] }}</v-btn>
            </template>
          </div>

          <template v-if="header.key.startsWith('routine_')">
            <div
              class="text-center"
              :class="getRoutineUrgencyClass(row.item, header.key)"
            >
              {{ getRoutineDate(row.item, header.key) }}<br />
            </div>
            {{ getRoutineNote(row.item, header.key) }}
          </template>

          <template v-if="header.key === 'lastTimeTreated'">
            {{ lastTimeTreatedForCategory(row.item) }}
          </template>
          <template v-if="header.key === 'nextTreatmentDate'">
            <div
              class="rounded pa-1 text-center"
              :class="
                urgencyHelper.getClassForUrgency(
                  row.item,
                  selectedTreatmentCategory?.name
                )
              "
            >
              {{
                nextTreatmentDateForCategory(row.item, selectedTreatmentCategory?.name)
              }}
            </div>
          </template>
          <template v-if="header.key === 'summaryHoofCheckStatusOfLastTreatment'">
            <template
              v-if="row.item.summaryHoofCheckStatusOfLastTreatment.includes('NotOkay')"
            >
              <v-icon> mdi-close </v-icon>
            </template>
          </template>
          <template v-if="header.key === 'action'">
            <div class="d-flex">
              <v-btn color="primary" class="me-2" @click="clickOnBehandelt(row.item)">{{
                horseHelper.getLabelForBehandeltButton(row.item)
              }}</v-btn>
              <v-btn color="green" class="me-2" @click="clickOnEdit(row.item)"
                ><v-icon> mdi-pencil </v-icon></v-btn
              >

              <v-btn color="red" @click="clickOnDelete(row.item)"
                ><v-icon> mdi-close-circle-outline </v-icon></v-btn
              >
            </div>
          </template>
        </td>
      </tr>
    </template></v-data-table
  >
</template>
