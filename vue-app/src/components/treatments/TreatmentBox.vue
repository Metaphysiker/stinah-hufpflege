<script setup lang="ts">
import { ref, watch } from "vue";
import { ITreatment } from "@/interfaces/ITreatment";
import { TreatmentConverter } from "@/converters/TreatmentConverter";

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
</script>

<template>
  <slot></slot>

  <div>
    <div class="d-flex align-items-center">
      <div style="white-space: break-spaces">
        {{ model.note }}
      </div>
    </div>
  </div>
</template>
