<script setup lang="ts">
import { IHorse } from "@/interfaces/IHorse";
import { ref, watch } from "vue";
import { ITreatment } from "@/interfaces/ITreatment";

const props = defineProps({
  model: {
    required: true,
    type: Object as () => ITreatment,
  },
});

const emit = defineEmits(["edit"]);

const modelClone = ref<IHorse | undefined>(undefined);

watch(
  () => props.model,
  (model) => {
    modelClone.value = JSON.parse(JSON.stringify(props.model));
  },
  { immediate: true }
);
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
