<script setup lang="ts">
import { ref } from "vue";
import { DateFormatter } from "../../helpers/DateFormatter";
import { ITreatment } from "@/interfaces/ITreatment";
const dateFormatter = new DateFormatter();
const availableTableDataHeaders = ref([
  { key: "name", title: "Name", selected: true },
  { key: "date", title: "Datum", selected: true },
  { key: "note", title: "Notiz", selected: true },
]);

const isSpecialColumn = (header: string) => {
  return ["name", "date"].includes(header);
};

defineProps({
  models: {
    required: true,
    type: Object as () => ITreatment[],
  },
});

const clickOnName = (model: ITreatment) => {
  emit("clickOnName", model);
};

const emit = defineEmits<{
  clickOnName: [model: ITreatment];
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
              {{ row.item[header.key as keyof ITreatment] }}
            </template>
            <template v-if="header.key === 'name'">
              <v-btn @click="clickOnName(row.item)">{{
                row.item["name"]
              }}</v-btn>
            </template>
            <template v-if="header.key === 'date'">
              {{ dateFormatter.dddotmmdotyyyy(row.item["date"]) }}
            </template>
          </div>
        </td>
      </tr>
    </template></v-data-table
  >
</template>
