<script setup lang="ts" generic="T extends IModel">
import { IModel } from "@/interfaces/IModel";
import NewHorse from "./NewHorse.vue";
import HorsesTable from "./HorsesTable.vue";
import { HorseService } from "../../services/HorseService";
import type { AxiosStatic } from "axios";
import {
  Ref,
  ShallowRef,
  inject,
  onBeforeMount,
  onMounted,
  ref,
  shallowRef,
} from "vue";
import NewTreatment from "../treatments/NewTreatment.vue";
import HorseCard from "./HorseCard.vue";
import StandardToolbar from "../StandardToolbar.vue";
import { IHorseSearch } from "@/interfaces/IHorseSearch";
import type { IHorse } from "@/interfaces/IHorse";
import NewModelCard from "../generics/NewModelCard.vue";
import { IModelController } from "@/interfaces/IModelController";
import { ISearch } from "@/interfaces/ISearch";
import { ServiceFactory } from "@/factories/ServiceFactory";
import { ComponentFactory } from "@/factories/ComponentFactory";
const currentHorse: Ref<IHorse | undefined> = ref(undefined);
const horseForHorseCard: Ref<IHorse | undefined> = ref(undefined);
const axios: AxiosStatic | undefined = inject("axios");
const horseService = new HorseService(axios);
const horses: Ref<IHorse[]> = ref([]);
const service: Ref<IModelController<T, ISearch> | undefined> = ref(undefined);
const tableComponent: ShallowRef<any | undefined> = shallowRef(undefined);

const reload = () => {
  newHorseDialog.value = false;
  editHorseDialog.value = false;
  deleteHorseDialog.value = false;
  const horseSearch: IHorseSearch = {
    page: 0,
    pageSize: 1000,
  };

  horseService.Search(horseSearch).then((response) => {
    horses.value = response;
  });
};

const props = defineProps({
  interfaceName: {
    required: true,
    type: String,
  },
});

onMounted(() => {
  reload();
});

const horseTreated = (horse: IHorse) => {
  horseService.Update(horse).then(() => {
    reload();
  });
};
const editHorseDialog = ref(false);
const newHorseDialog = ref(false);
const deleteHorseDialog = ref(false);
const horseToDelete = ref<IHorse | undefined>(undefined);
const deleteHorse = () => {
  if (horseToDelete.value?.id) {
    horseService.Delete(horseToDelete.value.id).then(() => {
      reload();
      deleteHorseDialog.value = false;
    });
  }
};

const newTreatmentDialog = ref(false);
const horseCardDialog = ref(false);

const clickOnName = (horse: IHorse) => {
  horseForHorseCard.value = horse;
  horseCardDialog.value = true;
};

const createModelDialog = ref(false);
const create = () => {
  reload();
  createModelDialog.value = false;
};

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
</script>

<template>
  <v-container fluid>
    <tableComponent :models="horses"></tableComponent>
  </v-container>
  <v-container fluid>
    <div class="d-flex justify-end">
      <v-btn @click="createModelDialog = true"> Neues Pferd hinzufügen </v-btn>
    </div>
  </v-container>

  <v-dialog fullscreen v-model="deleteHorseDialog">
    <v-card>
      <StandardToolbar
        title="xxxxxxx entfernen"
        @close="deleteHorseDialog = false"
      ></StandardToolbar>
      <v-card-text>
        <div class="mb-5">Pferd wirklich entfernen?</div>

        <v-btn @click="deleteHorse()">Ja, entfernen</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog fullscreen v-model="createModelDialog">
    <v-card>
      <NewModelCard
        :interface-name="props.interfaceName"
        @create="create()"
        @close="createModelDialog = false"
      ></NewModelCard>
    </v-card>
  </v-dialog>
</template>
