<script setup lang="ts">
import { inject } from "vue";
import type { IHorse } from "../../interfaces/IHorse";
import { DateFormatter } from "../../helpers/DateFormatter";
import { UrgencyHelper } from "../../helpers/UrgencyHelper";
import { HorseHelper } from "@/helpers/HorseHelper";
import { HorseService } from "@/services/HorseService";
import { AxiosStatic } from "axios";
import { useTreatmentCategoryStore } from "@/stores/treatmentCategoryStore";
import { storeToRefs } from "pinia";
import { Translator } from "@/helpers/Translator";
const treatmentCategoryStore = useTreatmentCategoryStore();
const { selectedTreatmentCategory } = storeToRefs(treatmentCategoryStore);
const axios: AxiosStatic | undefined = inject("axios");
const horseService = new HorseService(axios);
const horseHelper = new HorseHelper(horseService);
const urgencyHelper = new UrgencyHelper(horseHelper);
const dateFormatter = new DateFormatter();
const translator = new Translator();

const getHeaders = () => {
  const category =
    "(" + translator.translate(selectedTreatmentCategory.value?.name) + ")";
  const titleForLastTimeTreated = "Letzte Behandlung " + category;

  let showNumberOfWeeksUntilNextTreatmentHoofcare = false;
  let showNumberOfWeeksUntilNextTreatmentToothcare = false;
  let showNextTreatmentDate = false;

  if (selectedTreatmentCategory.value?.name === "hoofcare") {
    showNumberOfWeeksUntilNextTreatmentHoofcare = true;
    showNextTreatmentDate = true;
  } else if (selectedTreatmentCategory.value?.name === "toothcare") {
    showNumberOfWeeksUntilNextTreatmentToothcare = true;
    showNextTreatmentDate = true;
  } else if (!selectedTreatmentCategory.value) {
    showNumberOfWeeksUntilNextTreatmentHoofcare = true;
    showNumberOfWeeksUntilNextTreatmentToothcare = true;
    showNextTreatmentDate = true;
  }

  return [
    { key: "name", title: "Name", selected: true },
    {
      key: "lastTimeTreated",
      title: titleForLastTimeTreated,
      selected: true,
      sortRaw(a: IHorse, b: IHorse) {
        const aDate =
          horseHelper
            .getLastTimeTreatedForCategory(
              a,
              selectedTreatmentCategory.value?.name
            )
            ?.getTime() || 0;
        const bDate =
          horseHelper
            .getLastTimeTreatedForCategory(
              b,
              selectedTreatmentCategory.value?.name
            )
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
            .calculateNextTreatmentDate(
              a,
              selectedTreatmentCategory.value?.name
            )
            ?.getTime() || 0;
        const bDate =
          horseHelper
            .calculateNextTreatmentDate(
              b,
              selectedTreatmentCategory.value?.name
            )
            ?.getTime() || 0;

        return aDate - bDate;
      },
    },
    {
      key: "numberOfWeeksUntilNextTreatmentHoofcare",
      title: translator.translate("numberOfWeeksUntilNextTreatmentHoofcare"),
      selected: showNumberOfWeeksUntilNextTreatmentHoofcare,
    },
    {
      key: "numberOfWeeksUntilNextTreatmentToothcare",
      title: translator.translate("numberOfWeeksUntilNextTreatmentToothcare"),
      selected: showNumberOfWeeksUntilNextTreatmentToothcare,
    },
    { key: "birthYear", title: "Alter", selected: true },

    { key: "action", title: "Aktion", selected: false },
  ];
};

const isSpecialColumn = (header: string) => {
  return [
    "name",
    "lastTimeTreated",
    "birthYear",
    "nextTreatmentDate",
    "action",
  ].includes(header);
};

defineProps({
  models: {
    required: true,
    type: Object as () => IHorse[],
  },
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
      (treatmentDate) =>
        treatmentDate.category === selectedTreatmentCategory.value?.name
    );

    if (foundLastTreatmentDate?.lastTimeTreated) {
      return dateFormatter.dddotmmdotyyyy(
        foundLastTreatmentDate.lastTimeTreated
      );
    }
  }

  return "";
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
  <v-data-table
    :headers="getHeaders().filter((h) => h.selected)"
    :items="models"
    hide-default-footer
    :items-per-page="100"
  >
    <template v-slot:item="row">
      <tr>
        <td
          v-for="header in getHeaders().filter((h) => h.selected)"
          :key="header.key"
        >
          <div v-if="row.item && row.item.hasOwnProperty(header.key)">
            <template v-if="!isSpecialColumn(header.key)">
              {{ row.item[header.key as keyof IHorse] }}
            </template>

            <template v-if="header.key === 'birthYear'">
              {{ new Date().getFullYear() - row.item["birthYear"] }}
            </template>
            <template v-if="header.key === 'name'">
              <v-btn @click="clickOnName(row.item)">{{
                row.item["name"]
              }}</v-btn>
            </template>
          </div>
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
                nextTreatmentDateForCategory(
                  row.item,
                  selectedTreatmentCategory?.name
                )
              }}
            </div>
          </template>
          <template v-if="header.key === 'action'">
            <div class="d-flex">
              <v-btn
                color="primary"
                class="me-2"
                @click="clickOnBehandelt(row.item)"
                >{{ horseHelper.getLabelForBehandeltButton(row.item) }}</v-btn
              >
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
