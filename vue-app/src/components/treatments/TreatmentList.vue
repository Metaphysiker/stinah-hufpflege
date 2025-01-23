<script setup lang="ts">
import { DateFormatter } from "@/helpers/DateFormatter";
import { ITreatment } from "@/interfaces/ITreatment";
import { ITreatmentSearch } from "@/interfaces/ITreatmentSearch";
import { TreatmentService } from "@/services/TreatmentService";
import { AxiosStatic } from "axios";
import { inject, Ref, ref, watch } from "vue";
import ModelCard from "../generics/ModelCard.vue";
import { Cloner } from "@/helpers/Cloner";
import { SearchHelper } from "@/helpers/SearchHelper";
import { Translator } from "@/helpers/Translator";
const dateFormatter = new DateFormatter();
const axios: AxiosStatic | undefined = inject("axios");
const treatmentService = new TreatmentService(axios);
const treatments: Ref<ITreatment[]> = ref([]);
const cloner = new Cloner();
const props = defineProps({
  treatmentSearch: {
    required: true,
    type: Object as () => ITreatmentSearch,
  },
});

const treatmentSearch: Ref<ITreatmentSearch | undefined> = ref(undefined);

const getTreatments = () => {
  return new Promise<void>((resolve) => {
    if (!treatmentSearch.value) {
      resolve();
    } else {
      treatmentService.Search(treatmentSearch.value).then((response) => {
        treatments.value = response.data;
        resolve();
      });
    }
  });
};

watch(
  () => props.treatmentSearch,
  () => {
    treatmentSearch.value = cloner.clone(props.treatmentSearch);
    getTreatments();
  },
  { immediate: true }
);

const openTreatmentDialog = ref(false);

const openTreatment = (treatment: ITreatment) => {
  clickedOnTreatment.value = treatment;
  openTreatmentDialog.value = true;
};

const clickedOnTreatment: Ref<ITreatment | undefined> = ref(undefined);

const reload = () => {
  getTreatments().then(() => {
    const foundTreatment = treatments.value.find(
      (treatment) => treatment.id === clickedOnTreatment.value?.id
    );
    if (foundTreatment) {
      clickedOnTreatment.value = foundTreatment;
    } else {
      clickedOnTreatment.value = undefined;
      openTreatmentDialog.value = false;
    }
  });

  const treatmentSearchPageSize = treatmentSearch.value?.pageSize
    ? treatmentSearch.value.pageSize
    : 10;
  loadItems({
    page: 1,
    itemsPerPage: treatmentSearchPageSize,
    sortBy: [],
  });
};

const deleteTreatment = () => {
  openTreatmentDialog.value = false;
  reload();
};

const serverItems = ref<ITreatment[]>([]);
const totalItems = ref(0);
const loadingItems = ref(false);
const searchHelper = new SearchHelper();
const translator = new Translator();

const loadItems = ({
  page,
  itemsPerPage,
  sortBy,
}: {
  page: number;
  itemsPerPage: number;
  sortBy: string[];
}) => {
  if (treatmentSearch.value) {
    loadingItems.value = true;
    treatmentSearch.value.page = page - 1;
    treatmentSearch.value.pageSize = itemsPerPage;

    if (sortBy.length > 0) {
      treatmentSearch.value = searchHelper.updateSearch(
        sortBy,
        treatmentSearch.value
      );
    }

    treatmentService.Search(treatmentSearch.value).then((response) => {
      serverItems.value = response.data;
      totalItems.value = response.totalItems;
      loadingItems.value = false;
    });
  }
};

const availableTableDataHeaders = ref([
  { key: "date", title: "Datum", selected: true },
  { key: "category", title: "Kategorie", selected: true },
  { key: "name", title: "Name", selected: false },
  { key: "note", title: "Notiz", selected: true },
]);

const isSpecialColumn = (header: string) => {
  return ["name", "date", "note", "category"].includes(header);
};

const clickOnName = (model: ITreatment) => {
  openTreatment(model);
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
  <div v-if="treatmentSearch">
    <v-data-table-server
      v-model:items-per-page="treatmentSearch.pageSize"
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
            v-for="header in availableTableDataHeaders.filter(
              (h) => h.selected
            )"
            :key="header.key"
          >
            <div v-if="row.item && row.item.hasOwnProperty(header.key)">
              <template v-if="!isSpecialColumn(header.key)">
                {{ row.item[header.key as keyof ITreatment] }}
              </template>
              <template v-if="header.key === 'name'">
                <v-btn @click="clickOnName(row.item)">{{
                  row.item["name"]
                }}</v-btn>
              </template>
              <template v-if="header.key === 'category'">
                {{ translator.translate(row.item["category"]) }}
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
          </td>
        </tr>
      </template></v-data-table-server
    >
  </div>

  <v-dialog fullscreen v-model="openTreatmentDialog">
    <v-card v-if="clickedOnTreatment">
      <ModelCard
        @close="openTreatmentDialog = false"
        interface-name="ITreatment"
        :model="clickedOnTreatment"
        @save="reload()"
        @delete="deleteTreatment()"
      ></ModelCard>
    </v-card>
  </v-dialog>
</template>
