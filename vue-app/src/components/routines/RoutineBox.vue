<script setup lang="ts">
import { ref, watch } from "vue";
import { IRoutine } from "@/interfaces/IRoutine";
import { DateFormatter } from "@/helpers/DateFormatter";
import { Translator } from "@/helpers/Translator";
import { RoutineConverter } from "@/converters/RoutineConverter";

const dateFormatter = new DateFormatter();
const props = defineProps({
  model: {
    required: true,
    type: Object as () => IRoutine,
  },
});

const modelClone = ref<IRoutine | undefined>(undefined);
const routineConverter = new RoutineConverter();

watch(
  () => props.model,
  (model) => {
    modelClone.value = routineConverter.convert(model);
  },
  { immediate: true }
);

defineEmits<{
  edit: [void];
  reload: [void];
  deleted: [void];
  saved: [model: IRoutine];
}>();
const translator = new Translator();
</script>

<template>
  <slot></slot>

  <div>
    <p><strong>Datum: </strong> {{ dateFormatter.dddotmmdotyyyy(model.date) }}</p>
    <p>
      <strong>Kategorie: </strong> {{ translator.translate(model.treatmentCategoryName) }}
    </p>
    <p><strong>Rhythmus in Wochen: </strong> {{ model.rhythmInWeeks }}</p>
    <div style="white-space: break-spaces">
      <strong>Notiz: </strong><br />
      {{ model.note }}
    </div>
  </div>
</template>
