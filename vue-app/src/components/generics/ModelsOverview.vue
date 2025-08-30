<script setup lang="ts" generic="T extends IModel">
import { IModel } from "@/interfaces/IModel";
import type { AxiosStatic } from "axios";
import {
  Ref,
  ShallowRef,
  computed,
  inject,
  onBeforeMount,
  onMounted,
  ref,
  shallowRef,
} from "vue";
import NewModelCard from "../generics/NewModelCard.vue";
import { IModelController } from "@/interfaces/IModelController";
import { ISearch } from "@/interfaces/ISearch";
import { ServiceFactory } from "@/factories/ServiceFactory";
import { ComponentFactory } from "@/factories/ComponentFactory";
import ModelCard from "./ModelCard.vue";
import { EntityFinder } from "@/helpers/EntityFinder";
import { useWaitingStore } from "@/stores/waitingStore";
import { storeToRefs } from "pinia";
import { Translator } from "@/helpers/Translator";
import { useApiErrorHandlerStore } from "@/stores/apiErrorHandlerStore";
const apiErrorHanlderStore = useApiErrorHandlerStore();
const { showDialog, message } = storeToRefs(apiErrorHanlderStore);
const axios: AxiosStatic | undefined = inject("axios");
const models: Ref<T[]> = ref([]);
const service: Ref<IModelController<T, ISearch> | undefined> = ref(undefined);
const tableComponent: ShallowRef<any | undefined> = shallowRef(undefined);
const entityFinder = new EntityFinder();
const waitingStore = useWaitingStore();
const { waiting } = storeToRefs(waitingStore);
const translator = new Translator();

const reload = () => {
  return new Promise<void>((resolve) => {
    let search;
    if (props.search) {
      search = props.search;
    } else {
      search = {
        page: 0,
        pageSize: 200,
      };
    }

    waiting.value = true;
    service.value
      ?.Search(search)
      .then((response) => {
        models.value = response.data;
        waiting.value = false;
        resolve();
      })
      .catch((error) => {
        waiting.value = false;
        console.error("Error saving model:", error);
        showDialog.value = true;
        message.value = "Fehler beim Suchen: " + error.message;
      });
  });
};

const props = defineProps({
  interfaceName: {
    required: true,
    type: String,
  },
  search: {
    required: false,
    type: Object as () => ISearch,
  },
  sortBy: {
    required: false,
    type: String,
  },
  sortByOrder: {
    required: false,
    type: String,
  },
});

onMounted(() => {
  reload();
});

const createModelDialog = ref(false);
const create = () => {
  reload();
  createModelDialog.value = false;
};

const editModelDialog = ref(false);

onBeforeMount(() => {
  if (!axios) {
    throw new Error("axios not injected");
  }
  service.value = ServiceFactory.createService(
    props.interfaceName,
    axios
  ) as IModelController<T, ISearch>;

  tableComponent.value = ComponentFactory.createComponent(props.interfaceName, "Table");
});

const modelToEdit: Ref<T | undefined> = ref(undefined);

const clickOnName = (model: T) => {
  modelToEdit.value = model;
  editModelDialog.value = true;
};

const deleted = () => {
  editModelDialog.value = false;
  reload();
};

const save = (savedModel: T) => {
  reload().then(() => {
    const found = entityFinder.findByIdOrLocalID<T>(
      models.value,
      savedModel.id,
      savedModel.localID
    );

    if (found) {
      modelToEdit.value = found;
    } else {
      editModelDialog.value = false;
    }
  });
};

const reloadAndSetModelToEdit = () => {
  reload().then(() => {
    if (modelToEdit.value) {
      const found = entityFinder.findByIdOrLocalID<T>(
        models.value,
        modelToEdit.value.id,
        modelToEdit.value.localID
      );

      if (found) {
        modelToEdit.value = found;
      } else {
        modelToEdit.value = undefined;
        editModelDialog.value = false;
      }
    }
  });
};

const createModelText = computed(() => {
  const translat = translator.translate(props.interfaceName);
  return `${translat} hinzufügen`;
});
</script>

<template>
  <tableComponent
    :models="models"
    @clickOnName="(model: T) => clickOnName(model)"
    :sortBy="props.sortBy"
    :sortByOrder="props.sortByOrder"
  ></tableComponent>
  <v-container fluid>
    <div class="d-flex justify-end">
      <v-btn @click="createModelDialog = true"> {{ createModelText }} </v-btn>
    </div>
  </v-container>

  <v-dialog fullscreen v-model="createModelDialog">
    <v-card>
      <NewModelCard
        :interface-name="props.interfaceName"
        @created="create()"
        @close="createModelDialog = false"
      ></NewModelCard>
    </v-card>
  </v-dialog>

  <v-dialog fullscreen v-model="editModelDialog">
    <v-card v-if="modelToEdit">
      <ModelCard
        @close="editModelDialog = false"
        :interface-name="props.interfaceName"
        :model="modelToEdit"
        @saved="(savedModel: IModel) => save(savedModel as T)"
        @deleted="deleted()"
        @reload="reloadAndSetModelToEdit()"
      ></ModelCard>
    </v-card>
  </v-dialog>
</template>
