<script setup lang="ts">
import { ref } from "vue";
import { DateFormatter } from "../../helpers/DateFormatter";
import { IFile } from "@/interfaces/IFile";
const dateFormatter = new DateFormatter();
const availableTableDataHeaders = ref([
  { key: "name", title: "Name", selected: true },
  { key: "createdAt", title: "Erstellt am", selected: true },
]);

const isSpecialColumn = (header: string) => {
  return ["name", "createdAt"].includes(header);
};

defineProps({
  models: {
    required: true,
    type: Object as () => IFile[],
  },
});

const clickOnName = (model: IFile) => {
  emit("clickOnName", model);
};

const emit = defineEmits<{
  clickOnName: [model: IFile];
}>();
</script>

<template>
  <v-data-table
    :headers="availableTableDataHeaders.filter((h) => h.selected)"
    :items="models"
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
              {{ row.item[header.key as keyof IFile] }}
            </template>
            <template v-if="header.key === 'name'">
              <v-btn @click="clickOnName(row.item)">{{
                row.item["name"]
              }}</v-btn>
            </template>
            <template v-if="header.key === 'createdAt'">
              {{ dateFormatter.dddotmmdotyyyy(row.item["createdAt"]) }}
            </template>
          </div>
        </td>
      </tr>
    </template></v-data-table
  >
</template>
