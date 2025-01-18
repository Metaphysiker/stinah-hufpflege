<script setup lang="ts" generic="T extends IModel">
import { computed, inject, onBeforeMount, Ref, ref } from "vue";
import StandardToolbar from "../StandardToolbar.vue";
import { IModel } from "@/interfaces/IModel";
import { IModelController } from "@/interfaces/IModelController";
import { ISearch } from "@/interfaces/ISearch";
import { ServiceFactory } from "@/factories/ServiceFactory";
import { AxiosStatic } from "axios";
import ModelBox from "./ModelBox.vue";
import { Translator } from "@/helpers/Translator";
const axios: AxiosStatic | undefined = inject("axios");
const translator = new Translator();
const service: Ref<IModelController<T, ISearch> | undefined> = ref(undefined);

const props = defineProps({
  interfaceName: {
    required: true,
    type: String,
  },
  model: {
    required: true,
    type: Object as () => IModel,
  },
});

const emit = defineEmits<{
  close: [void];
  reload: [void];
  delete: [void];
  save: [model: T];
}>();

onBeforeMount(() => {
  if (!axios) {
    throw new Error("axios not injected");
  }
  service.value = ServiceFactory.createService(
    props.interfaceName,
    axios
  ) as IModelController<T, ISearch>;
});

const toolbarTitle = computed(() => {
  return translator.translate(props.interfaceName) + " bearbeiten";
});
</script>
<template>
  <StandardToolbar
    :title="toolbarTitle"
    @close="emit('close')"
  ></StandardToolbar>

  <div class="pa-2">
    <ModelBox
      :interface-name="props.interfaceName"
      :model="model"
      @save="(savedModel: IModel) => emit('save', savedModel as T)"
      @delete="emit('delete')"
    ></ModelBox>
  </div>
</template>
