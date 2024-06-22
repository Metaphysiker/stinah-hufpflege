<script setup lang="ts">
import { ref } from "vue";
import type { IHorse } from "../../interfaces/IHorse";
import { DateFormatter } from "../../helpers/DateFormatter";
import { UrgencyHelper } from "../../helpers/UrgencyHelper";
import { HorseHelper } from "@/helpers/HorseHelper";
const horseHelper = new HorseHelper();
const urgencyHelper = new UrgencyHelper();
const dateFormatter = new DateFormatter();
const availableTableDataHeaders = ref([
  { key: "name", title: "Name", selected: true },
  {
    key: "lastTimeTreated",
    title: "Letze Behandlung",
    selected: true,
    sortRaw(a: IHorse, b: IHorse) {
      return a.lastTimeTreated.getTime() - b.lastTimeTreated.getTime();
    },
  },
  {
    key: "nextTreatmentDate",
    title: "nächstes Mal",
    selected: true,
    sortRaw(a: IHorse, b: IHorse) {
      return a.nextTreatmentDate().getTime() - b.nextTreatmentDate().getTime();
    },
  },
  { key: "birthYear", title: "Alter", selected: true },
  {
    key: "numberOfWeeksUntilNextTreatment",
    title: "Hufpflegerhythmus in Wochen",
    selected: true,
  },
  { key: "action", title: "Aktion", selected: true },
]);

const isSpecialColumn = (header: string) => {
  return ["name", "lastTimeTreated", "birthYear", "nextTreatmentDate", "action"].includes(
    header
  );
};

defineProps({
  horses: {
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

const emit = defineEmits([
  "clickOnBehandelt",
  "clickOnDelete",
  "clickOnEdit",
  "clickOnName",
]);
</script>

<template>
  <v-data-table
    :headers="availableTableDataHeaders.filter((h) => h.selected)"
    :items="horses"
    hide-default-footer
    :items-per-page="100"
  >
    <template v-slot:item="row">
      <tr>
        <td
          v-for="header in availableTableDataHeaders.filter((h) => h.selected)"
          :key="header.key"
        >
          <div v-if="row.item && row.item.hasOwnProperty(header.key)">
            <template v-if="!isSpecialColumn(header.key)">
              {{ row.item[header.key as keyof IHorse] }}
            </template>
            <template v-if="header.key === 'lastTimeTreated'">
              {{ dateFormatter.dddotmmdotyyyy(row.item["lastTimeTreated"]) }}
            </template>
            <template v-if="header.key === 'birthYear'">
              {{ new Date().getFullYear() - row.item["birthYear"] }}
            </template>
            <template v-if="header.key === 'name'">
              <v-btn @click="clickOnName(row.item)">{{ row.item["name"] }}</v-btn>
            </template>
          </div>
          <template v-if="header.key === 'nextTreatmentDate'">
            <div
              class="rounded pa-1 text-center"
              :class="urgencyHelper.getClassForUrgency(row.item)"
            >
              {{ row.item.nextTreatmentDateString() }}
            </div>
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
