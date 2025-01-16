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

const emits = defineEmits(["close", "reload", "delete"]);

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

const reload = () => {
  emits("reload");
};
</script>
<template>
  <StandardToolbar
    :title="toolbarTitle"
    @close="emits('close')"
  ></StandardToolbar>

  <div class="pa-2">
    <ModelBox
      :interface-name="props.interfaceName"
      :model="model"
      @reload="reload()"
      @delete="emits('delete')"
    ></ModelBox>
  </div>
</template>
