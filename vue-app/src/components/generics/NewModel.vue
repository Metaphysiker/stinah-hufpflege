<script setup lang="ts" generic="T extends IModel">
import { inject, onBeforeMount, Ref, ref, shallowRef, ShallowRef } from "vue";
import { ComponentFactory } from "@/factories/ComponentFactory";
import { IModelController } from "@/interfaces/IModelController";
import { ISearch } from "@/interfaces/ISearch";
import { ServiceFactory } from "@/factories/ServiceFactory";
import { AxiosStatic } from "axios";
import { IModel } from "@/interfaces/IModel";
import { ClassFactory } from "@/factories/ClassFactory";
const axios: AxiosStatic | undefined = inject("axios");
const editModelDialog = ref(false);
const service: Ref<IModelController<T, ISearch> | undefined> = ref(undefined);
const formComponent: ShallowRef<any | undefined> = shallowRef(undefined);

const props = defineProps({
  interfaceName: {
    required: true,
    type: String,
  },
});

const modelClone: ShallowRef<T> = shallowRef(
  ClassFactory.createClassInstance(props.interfaceName) as T
);

onBeforeMount(() => {
  if (!axios) {
    throw new Error("axios not injected");
  }
  service.value = ServiceFactory.createService(
    props.interfaceName,
    axios
  ) as IModelController<T, ISearch>;

  formComponent.value = ComponentFactory.createComponent(
    props.interfaceName,
    "Form"
  );
});

const emit = defineEmits(["create"]);

const createModel = () => {
  if (modelClone.value) {
    service.value?.Create(modelClone.value).then(() => {
      editModelDialog.value = false;
      emit("create");
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
