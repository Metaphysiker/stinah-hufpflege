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
    console.log("reload");
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
    service.value?.Search(search).then((response) => {
      models.value = response.data;
      waiting.value = false;
      resolve();
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

  tableComponent.value = ComponentFactory.createComponent(
    props.interfaceName,
    "Table"
  );
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
  console.log("save");
  reload().then(() => {
    const found = entityFinder.findByIdOrLocalID<T>(
      models.value,
      savedModel.id,
      savedModel.localID
    );

    if (found) {
      modelToEdit.value = savedModel;
    } else {
      editModelDialog.value = false;
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
        @create="create()"
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
        @save="(savedModel: IModel) => save(savedModel as T)"
        @delete="deleted()"
      ></ModelCard>
    </v-card>
  </v-dialog>
</template>
