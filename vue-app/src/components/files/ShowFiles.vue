<script setup lang="ts">
import { computed } from "vue";

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
</script>
<template>
  <div v-for="fileKey of fileKeys" class="mb-2">
    <ShowFile :fileKey="fileKey" />
    <v-divider class="my-2"></v-divider>
  </div>
</template>
