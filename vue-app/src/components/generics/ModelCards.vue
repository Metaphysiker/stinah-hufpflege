<script setup lang="ts" generic="T extends IDto">
import { ModelCardFactory } from "@/factories/ModelCardFactory";
import { ServiceFactory } from "@/factories/ServiceFactory";
import { IDto } from "@/interfaces/IDto";
import { IModelController } from "@/interfaces/IModelController";
import { ISearch } from "@/interfaces/ISearch";
import { AxiosStatic } from "axios";
import { inject, onBeforeMount, onMounted, Ref, ref } from "vue";
const axios: AxiosStatic | undefined = inject("axios");
const service: Ref<IModelController<T, ISearch> | undefined> = ref(undefined);
const component: Ref<any | undefined> = ref(undefined);

const props = defineProps({
  interfaceName: {
    required: true,
    type: String,
  },
});

const models: Ref<T[]> = ref([]);

const getModels = () => {
  return new Promise<T[]>((resolve) => {
    if (service.value) {
      service.value.ReadAll().then((response) => {
        models.value = response;
        resolve(response);
      });
    }
    resolve([]);
  });
};

onBeforeMount(() => {
  if (!axios) {
    throw new Error("axios not injected");
  }
  service.value = ServiceFactory.createService(
    props.interfaceName,
    axios
  ) as IModelController<T, ISearch>;

  component.value = ModelCardFactory.createComponent(props.interfaceName);
});

onMounted(() => {
  getModels();
});
</script>
<template>
  <div v-for="(model, index) of models" class="mb-3" :key="model.id">
    <component v-model="models[index]"></component>
  </div>
</template>
