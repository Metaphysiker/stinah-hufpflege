<script setup lang="ts">
import { ref, watch } from "vue";
import { IFile } from "@/interfaces/IFile";
import { FileConverter } from "@/converters/FileConverter";

const props = defineProps({
  model: {
    required: true,
    type: Object as () => IFile,
  },
});

const modelClone = ref<IFile | undefined>(undefined);
const fileConverter = new FileConverter();

watch(
  () => props.model,
  (model) => {
    modelClone.value = fileConverter.convert(model);
  },
  { immediate: true }
);

defineEmits<{
  edit: [void];
  reload: [void];
  deleted: [void];
  saved: [model: IFile];
}>();
</script>

<template>
  <slot></slot>

  <div>
    <div class="d-flex align-items-center">
      <div style="white-space: break-spaces">
        {{ model.name }}
      </div>
    </div>
  </div>
</template>
