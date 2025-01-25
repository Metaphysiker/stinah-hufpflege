<script setup lang="ts">
import { AxiosStatic } from "axios";
import { inject, Ref, ref, watch } from "vue";
import ModelCard from "../generics/ModelCard.vue";
import { Cloner } from "@/helpers/Cloner";
import { SearchHelper } from "@/helpers/SearchHelper";
import { IFile } from "@/interfaces/IFile";
import { IFileSearch } from "@/interfaces/IFileSearch";
import { FileService } from "@/services/FileService";
import { DateFormatter } from "@/helpers/DateFormatter";
const axios: AxiosStatic | undefined = inject("axios");
const fileService = new FileService(axios);
const files: Ref<IFile[]> = ref([]);
const cloner = new Cloner();
const props = defineProps({
  fileSearch: {
    required: true,
    type: Object as () => IFileSearch,
  },
});

const fileSearch: Ref<IFileSearch | undefined> = ref(undefined);

const getFiles = () => {
  return new Promise<void>((resolve) => {
    if (!fileSearch.value) {
      resolve();
    } else {
      fileService.Search(fileSearch.value).then((response) => {
        files.value = response.data;
        resolve();
      });
    }
  });
};

watch(
  () => props.fileSearch,
  () => {
    fileSearch.value = cloner.clone(props.fileSearch);
    getFiles();
  },
  { immediate: true }
);

const openFileDialog = ref(false);

const openFile = (file: IFile) => {
  clickedOnFile.value = file;
  openFileDialog.value = true;
};

const clickedOnFile: Ref<IFile | undefined> = ref(undefined);

const reload = () => {
  getFiles().then(() => {
    const found = files.value.find(
      (file) => file.id === clickedOnFile.value?.id
    );
    if (found) {
      clickedOnFile.value = found;
    } else {
      clickedOnFile.value = undefined;
      openFileDialog.value = false;
    }
    emits("reload");
  });

  const fileSearchPageSize = fileSearch.value?.pageSize
    ? fileSearch.value.pageSize
    : 10;
  loadItems({
    page: 1,
    itemsPerPage: fileSearchPageSize,
    sortBy: [],
  });
};

const deleteTreatment = () => {
  openFileDialog.value = false;
  reload();
};

const emits = defineEmits<{
  reload: [void];
}>();
const serverItems = ref<IFile[]>([]);
const totalItems = ref(0);
const loadingItems = ref(false);
const searchHelper = new SearchHelper();
const dateFormatter = new DateFormatter();

const loadItems = ({
  page,
  itemsPerPage,
  sortBy,
}: {
  page: number;
  itemsPerPage: number;
  sortBy: string[];
}) => {
  if (fileSearch.value) {
    loadingItems.value = true;
    fileSearch.value.page = page - 1;
    fileSearch.value.pageSize = itemsPerPage;

    if (sortBy.length > 0) {
      fileSearch.value = searchHelper.updateSearch(sortBy, fileSearch.value);
    }

    fileService.Search(fileSearch.value).then((response) => {
      serverItems.value = response.data;
      totalItems.value = response.totalItems;
      loadingItems.value = false;
    });
  }
};

const availableTableDataHeaders = ref([
  { key: "name", title: "Name", selected: true },
  { key: "createdAt", title: "Erstellt am", selected: true },
  { key: "fileKeyString", title: "Datei", selected: true },
]);

const isSpecialColumn = (header: string) => {
  return ["name", "createdAt"].includes(header);
};

const clickOnName = (model: IFile) => {
  openFile(model);
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
  <div v-if="fileSearch">
    <v-data-table-server
      v-model:items-per-page="fileSearch.pageSize"
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
                {{ row.item[header.key as keyof IFile] }}
              </template>
              <template v-if="header.key === 'name'">
                <v-btn @click="clickOnName(row.item)">{{
                  row.item["name"]
                }}</v-btn>
              </template>
              <template v-if="header.key === 'createdAt'">
                {{
                  row.item["createdAt"]
                    ? dateFormatter.dddotmmdotyyyy(row.item["createdAt"])
                    : ""
                }}
              </template>
            </div>
          </td>
        </tr>
      </template></v-data-table-server
    >
  </div>

  <v-dialog fullscreen v-model="openFileDialog">
    <v-card v-if="clickedOnFile">
      <ModelCard
        @close="openFileDialog = false"
        interface-name="ITreatment"
        :model="clickedOnFile"
        @saved="reload()"
        @deleted="deleteTreatment()"
      ></ModelCard>
    </v-card>
  </v-dialog>
</template>
