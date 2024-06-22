<script setup lang="ts">
import ShowFile from "./ShowFile.vue";
import { computed } from "vue";

const emit = defineEmits(["remove-file-key"]);

const props = defineProps({
  fileKeysString: {
    required: true,
    type: String,
  },
  reverse: {
    default: false,
    type: Boolean,
  },
});

const fileKeys = computed(() => {
  if (props.reverse) {
    return props.fileKeysString.split(",").reverse();
  } else {
    return props.fileKeysString.split(",");
  }
});

const removeFileKey = (fileKey: string) => {
  emit("remove-file-key", fileKey);
};
</script>
<template>
  <div v-for="fileKey of fileKeys" class="mb-2">
    <template v-if="fileKey">
      <ShowFile
        :fileKey="fileKey"
        @remove-file-key="(fileKey) => removeFileKey(fileKey)"
      />
      <v-divider class="my-2"></v-divider>
    </template>
  </div>
</template>
