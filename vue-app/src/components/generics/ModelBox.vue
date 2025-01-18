<script setup lang="ts" generic="T extends IModel">
import {
  computed,
  inject,
  onBeforeMount,
  Ref,
  ref,
  shallowRef,
  ShallowRef,
  watch,
} from "vue";
import StandardToolbar from "../StandardToolbar.vue";
import { IModel } from "@/interfaces/IModel";
import { ComponentFactory } from "@/factories/ComponentFactory";
import { IModelController } from "@/interfaces/IModelController";
import { ISearch } from "@/interfaces/ISearch";
import { ServiceFactory } from "@/factories/ServiceFactory";
import { AxiosStatic } from "axios";
import { Translator } from "@/helpers/Translator";
import { Cloner } from "@/helpers/Cloner";
import { useWaitingStore } from "@/stores/waitingStore";
import { storeToRefs } from "pinia";
const axios: AxiosStatic | undefined = inject("axios");
const editModelDialog = ref(false);
const translator = new Translator();
const service: Ref<IModelController<T, ISearch> | undefined> = ref(undefined);
const boxComponent: ShallowRef<any | undefined> = shallowRef(undefined);
const formComponent: ShallowRef<any | undefined> = shallowRef(undefined);

const waitingStore = useWaitingStore();
const { waiting } = storeToRefs(waitingStore);

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

const modelClone: Ref<T | undefined> = ref(undefined);

onBeforeMount(() => {
  if (!axios) {
    throw new Error("axios not injected");
  }
  service.value = ServiceFactory.createService(
    props.interfaceName,
    axios
  ) as IModelController<T, ISearch>;

  boxComponent.value = ComponentFactory.createComponent(
    props.interfaceName,
    "Box"
  );

  formComponent.value = ComponentFactory.createComponent(
    props.interfaceName,
    "Form"
  );
});

const emit = defineEmits<{
  reload: [void];
  delete: [void];
  save: [model: T];
}>();

const cloner = new Cloner();

const clickOnEdit = () => {
  modelClone.value = cloner.clone<T>(props.model as T);
  editModelDialog.value = true;
};

const toolbarTitle = computed(() => {
  return translator.translate(props.interfaceName) + " bearbeiten";
});

const toolbarTitleForDelete = computed(() => {
  return translator.translate(props.interfaceName) + " entfernen";
});

const textForDeletingModel = computed(() => {
  if (props.model.name) {
    return (
      translator.translate(props.interfaceName) +
      " " +
      `"${props.model.name}"` +
      " wirklich entfernen?"
    );
  }
  return translator.translate(props.interfaceName) + " wirklich entfernen?";
});

const deleteModelDialog = ref(false);

const deleteModel = () => {
  if (props.model.id) {
    waiting.value = true;
    service.value?.Delete(props.model.id).then(() => {
      waiting.value = false;
      emit("delete");
      deleteModelDialog.value = false;
    });
  }
};

const saveModel = () => {
  if (modelClone.value) {
    waiting.value = true;
    service.value?.Update(modelClone.value).then((updatedModel) => {
      waiting.value = false;
      editModelDialog.value = false;
      emit("save", updatedModel);
    });
  }
};

watch(
  () => props.model,
  () => {
    modelClone.value = cloner.clone<T>(props.model as T);
  },
  { immediate: true }
);
</script>
<template>
  <div class="">
    <boxComponent :model="model" @edit="clickOnEdit">
      <v-row class="mb-1">
        <v-col @click="clickOnEdit()">
          <v-btn color="green" class="me-2"
            ><v-icon> mdi-pencil </v-icon></v-btn
          >
        </v-col>
        <v-col class="d-flex justify-end">
          <v-btn color="red" class="me-2" @click="deleteModelDialog = true"
            ><v-icon> mdi-close-circle-outline </v-icon></v-btn
          >
        </v-col>
      </v-row>
    </boxComponent>
    <v-divider class="mt-3"></v-divider>
  </div>

  <v-dialog fullscreen v-model="editModelDialog">
    <v-card>
      <StandardToolbar
        :title="toolbarTitle"
        @close="editModelDialog = false"
      ></StandardToolbar>
      <v-card-text v-if="modelClone">
        <formComponent v-model="modelClone"></formComponent>
        <div>
          <v-btn @click="saveModel()">Speichern</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog fullscreen v-model="deleteModelDialog">
    <v-card>
      <StandardToolbar
        :title="toolbarTitleForDelete"
        @close="deleteModelDialog = false"
      ></StandardToolbar>
      <v-card-text>
        <div class="mb-5">{{ textForDeletingModel }}</div>
        <v-btn @click="deleteModel()">Ja, entfernen</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
