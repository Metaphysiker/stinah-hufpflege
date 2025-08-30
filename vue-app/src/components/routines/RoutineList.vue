<script setup lang="ts">
import { DateFormatter } from "@/helpers/DateFormatter";
import { IRoutine } from "@/interfaces/IRoutine";
import { IRoutineSearch } from "@/interfaces/IRoutineSearch";
import { AxiosStatic } from "axios";
import { inject, Ref, ref, watch } from "vue";
import ModelCard from "../generics/ModelCard.vue";
import { Cloner } from "@/helpers/Cloner";
import { SearchHelper } from "@/helpers/SearchHelper";
import { Translator } from "@/helpers/Translator";
import { RoutineService } from "@/services/RoutineService";
import { RoutineHelper } from "@/helpers/RoutineHelper";
const dateFormatter = new DateFormatter();
const axios: AxiosStatic | undefined = inject("axios");
const routineService = new RoutineService(axios);
const routines: Ref<IRoutine[]> = ref([]);
const cloner = new Cloner();
const routineHelper = new RoutineHelper();
const props = defineProps({
  routineSearch: {
    required: true,
    type: Object as () => IRoutineSearch,
  },
});

const routineSearch: Ref<IRoutineSearch | undefined> = ref(undefined);

const getRoutines = () => {
  return new Promise<void>((resolve) => {
    if (!routineSearch.value) {
      resolve();
    } else {
      routineService.Search(routineSearch.value).then((response) => {
        routines.value = response.data;
        resolve();
      });
    }
  });
};

watch(
  () => props.routineSearch,
  () => {
    routineSearch.value = cloner.clone(props.routineSearch);
    getRoutines();
  },
  { immediate: true }
);

const openRoutineDialog = ref(false);

const openRoutine = (routine: IRoutine) => {
  clickedOnRoutine.value = routine;
  openRoutineDialog.value = true;
};

const clickedOnRoutine: Ref<IRoutine | undefined> = ref(undefined);

const reload = () => {
  getRoutines().then(() => {
    const foundRoutine = routines.value.find(
      (routine) => routine.id === clickedOnRoutine.value?.id
    );
    if (foundRoutine) {
      clickedOnRoutine.value = foundRoutine;
    } else {
      clickedOnRoutine.value = undefined;
      openRoutineDialog.value = false;
    }
    emits("reload");
  });

  const routineSearchPageSize = routineSearch.value?.pageSize
    ? routineSearch.value.pageSize
    : 10;
  loadItems({
    page: 1,
    itemsPerPage: routineSearchPageSize,
    sortBy: [],
  });
};

const deleteRoutine = () => {
  openRoutineDialog.value = false;
  reload();
};

const emits = defineEmits<{
  reload: [void];
}>();
const serverItems = ref<IRoutine[]>([]);
const totalItems = ref(0);
const loadingItems = ref(false);
const searchHelper = new SearchHelper();
const translator = new Translator();

const nextTreatmentDateForCategory = (routine: IRoutine) => {
  if (routine) {
    const lastTimeTreated = routineHelper.calculateHypotheticalNextTreatmentDate(routine);
    if (!lastTimeTreated) return "";
    return dateFormatter.dddotmmdotyyyy(lastTimeTreated);
  }
  return "";
};

const loadItems = ({
  page,
  itemsPerPage,
  sortBy,
}: {
  page: number;
  itemsPerPage: number;
  sortBy: string[];
}) => {
  if (routineSearch.value) {
    loadingItems.value = true;
    routineSearch.value.page = page - 1;
    routineSearch.value.pageSize = itemsPerPage;

    if (sortBy.length > 0) {
      routineSearch.value = searchHelper.updateSearch(sortBy, routineSearch.value);
    }

    routineService.Search(routineSearch.value).then((response) => {
      serverItems.value = response.data;
      totalItems.value = response.totalItems;
      loadingItems.value = false;
    });
  }
};

const availableTableDataHeaders = ref([
  { key: "nextDate", title: "Nächster Termin", selected: true },
  { key: "date", title: "Datum", selected: false },
  { key: "category", title: "Kategorie", selected: false },
  { key: "name", title: "Name", selected: false },
  { key: "note", title: "Notiz", selected: true },
]);

const isSpecialColumn = (header: string) => {
  return ["name", "date", "note", "category", "nextDate"].includes(header);
};

const clickOnName = (model: IRoutine) => {
  openRoutine(model);
};

const truncateString = (inputString: string, maximumLength: number) => {
  if (inputString.length <= maximumLength) {
    return inputString;
  }
  return inputString.slice(0, maximumLength) + "...";
};

const itemsPerPageOptions = [
  { value: 5, title: "5" },
  { value: 10, title: "10" },
  { value: 25, title: "25" },
  { value: 50, title: "50" },
  { value: 100, title: "100" },
];
</script>

<template>
  <div v-if="routineSearch">
    <v-data-table-server
      v-model:items-per-page="routineSearch.pageSize"
      :headers="availableTableDataHeaders.filter((h) => h.selected)"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loadingItems"
      item-value="name"
      :items-per-page-options="itemsPerPageOptions"
      @update:options="loadItems"
    >
      <template v-slot:item="row">
        <tr>
          <td
            v-for="header in availableTableDataHeaders.filter((h) => h.selected)"
            :key="header.key"
          >
            <div v-if="row.item && row.item.hasOwnProperty(header.key)">
              <template v-if="!isSpecialColumn(header.key)">
                {{ row.item[header.key as keyof IRoutine] }}
              </template>
              <template v-if="header.key === 'name'">
                <v-btn @click="clickOnName(row.item)">{{ row.item["name"] }}</v-btn>
              </template>
              <template v-if="header.key === 'treatmentCategoryName'">
                {{ translator.translate(row.item["treatmentCategoryName"]) }}
              </template>
              <template v-if="header.key === 'date'">
                <v-btn @click="clickOnName(row.item)">
                  {{ dateFormatter.dddotmmdotyyyy(row.item["date"]) }}
                </v-btn>
              </template>

              <template v-if="header.key === 'note'">
                {{ truncateString(row.item["note"], 100) }}
              </template>
            </div>
            <div v-if="row.item && !row.item.hasOwnProperty(header.key)">
              <template v-if="header.key === 'nextDate'">
                <v-btn @click="clickOnName(row.item)">
                  {{ nextTreatmentDateForCategory(row.item) }}
                </v-btn>
              </template>
            </div>
          </td>
        </tr>
      </template></v-data-table-server
    >
  </div>

  <v-dialog fullscreen v-model="openRoutineDialog">
    <v-card v-if="clickedOnRoutine">
      <ModelCard
        @close="openRoutineDialog = false"
        interface-name="IRoutine"
        :model="clickedOnRoutine"
        @saved="reload()"
        @deleted="deleteRoutine()"
      ></ModelCard>
    </v-card>
  </v-dialog>
</template>
