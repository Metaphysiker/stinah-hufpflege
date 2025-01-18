<script setup lang="ts" generic="T extends IModel">
import { inject, onBeforeMount, Ref, ref, shallowRef, ShallowRef } from "vue";
import { ComponentFactory } from "@/factories/ComponentFactory";
import { IModelController } from "@/interfaces/IModelController";
import { ISearch } from "@/interfaces/ISearch";
import { ServiceFactory } from "@/factories/ServiceFactory";
import { AxiosStatic } from "axios";
import { IModel } from "@/interfaces/IModel";
import { useWaitingStore } from "@/stores/waitingStore";
import { storeToRefs } from "pinia";
import { IConverter } from "@/interfaces/IConverter";
import { ConverterFactory } from "@/factories/ConverterFactory";
import { ClassFactory } from "@/factories/ClassFactory";
const axios: AxiosStatic | undefined = inject("axios");
const editModelDialog = ref(false);
const service: Ref<IModelController<T, ISearch> | undefined> = ref(undefined);
const formComponent: ShallowRef<any | undefined> = shallowRef(undefined);
const converter: Ref<IConverter<T> | undefined> = ref(undefined);
const waitingStore = useWaitingStore();
const { waiting } = storeToRefs(waitingStore);
const props = defineProps({
  interfaceName: {
    required: true,
    type: String,
  },
  modelBlueprint: {
    required: false,
    type: Object as () => IModel,
  },
});

const modelClone: Ref<T | undefined> = ref(undefined);

onBeforeMount(() => {
  if (!axios) {
    throw new Error("axios not injected");
  }
  service.value = ServiceFactory.createService(
    props.interfaceName,
    axios
  ) as IModelController<T, ISearch>;

  converter.value = ConverterFactory.createConverter(
    props.interfaceName
  ) as IConverter<T>;

  formComponent.value = ComponentFactory.createComponent(
    props.interfaceName,
    "Form"
  );

  if (props.modelBlueprint) {
    modelClone.value = converter.value.convert(props.modelBlueprint);
  } else {
    modelClone.value = ClassFactory.createClassInstance(
      props.interfaceName
    ) as T;
  }
});

const emit = defineEmits<{
  create: [model: T];
}>();

const createModel = () => {
  if (modelClone.value) {
    waiting.value = true;
    service.value?.Create(modelClone.value).then((createdModel) => {
      editModelDialog.value = false;
      emit("create", createdModel);
      waiting.value = false;
    });
  }
};
</script>
<template>
  <div class="" v-if="modelClone">
    <formComponent v-model="modelClone"> </formComponent>
    <v-divider class="mt-3"></v-divider>
    <div>
      <v-btn @click="createModel()">Speichern</v-btn>
    </div>
  </div>
</template>
