<script setup lang="ts">
import { ref, watch } from "vue";
import { ITreatment } from "@/interfaces/ITreatment";
import { TreatmentConverter } from "@/converters/TreatmentConverter";
import { DateFormatter } from "@/helpers/DateFormatter";
import { Translator } from "@/helpers/Translator";
import HoofChecker from "../hoofCheck/HoofChecker.vue";
import { CareAreas } from "@/enum/CareAreas";

const dateFormatter = new DateFormatter();
const props = defineProps({
  model: {
    required: true,
    type: Object as () => ITreatment,
  },
});

const modelClone = ref<ITreatment | undefined>(undefined);
const treatmentConverter = new TreatmentConverter();

watch(
  () => props.model,
  (model) => {
    modelClone.value = treatmentConverter.convert(model);
  },
  { immediate: true }
);

defineEmits<{
  edit: [void];
  reload: [void];
  deleted: [void];
  saved: [model: ITreatment];
}>();
const translator = new Translator();
</script>

<template>
  <slot></slot>

  <div>
    <p><strong>Datum: </strong> {{ dateFormatter.dddotmmdotyyyy(model.date) }}</p>
    <p><strong>Kategorie: </strong> {{ translator.translate(model.category) }}</p>
    <div style="white-space: break-spaces">
      <strong>Notiz: </strong><br />
      {{ model.note }}
    </div>
    <template v-if="model.category === CareAreas.Hoofcare.toString()">
      <HoofChecker :readonly="true" :model-value="model"></HoofChecker>
    </template>
  </div>
</template>
