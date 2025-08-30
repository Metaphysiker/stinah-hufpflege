import HorseCard from "@/components/horses/HorseCard.vue";
import HorseForm from "@/components/horses/HorseForm.vue";
import HorsesTable from "@/components/horses/HorsesTable.vue";
import HorseBox from "@/components/horses/HorseBox.vue";
import { Component } from "vue";
import TreatmentCard from "@/components/treatments/TreatmentCard.vue";
import TreatmentForm from "@/components/treatments/TreatmentForm.vue";
import TreatmentBox from "@/components/treatments/TreatmentBox.vue";
import TreatmentsTable from "@/components/treatments/TreatmentsTable.vue";
import RoutineBox from "@/components/routines/RoutineBox.vue";
import RoutineForm from "@/components/routines/RoutineForm.vue";
import RoutineCard from "@/components/routines/RoutineCard.vue";
import RoutinesTable from "@/components/routines/RoutinesTable.vue";
import FileBox from "@/components/files/FileBox.vue";
import FileForm from "@/components/files/FileForm.vue";
import FilesTable from "@/components/files/FilesTable.vue";
export class ComponentFactory {
  static createComponent(
    interfaceName: string,
    componentName: string
  ): Component {
    switch (interfaceName) {
      case "IHorse":
        if (componentName) {
          switch (componentName) {
            case "Box":
              return HorseBox;
            case "Card":
              return HorseCard;
            case "Form":
              return HorseForm;
            case "Table":
              return HorsesTable;
            default:
              throw new Error("Unknown component");
          }
        }
      case "ITreatment":
        if (componentName) {
          switch (componentName) {
            case "Box":
              return TreatmentBox;
            case "Card":
              return TreatmentCard;
            case "Form":
              return TreatmentForm;
            case "Table":
              return TreatmentsTable;
            default:
              throw new Error("Unknown component");
          }
        }
      case "IRoutine":
        if (componentName) {
          switch (componentName) {
            case "Box":
              return RoutineBox;
            case "Card":
              return RoutineCard;
            case "Form":
              return RoutineForm;
            case "Table":
              return RoutinesTable;
            default:
              throw new Error("Unknown component");
          }
        }
      case "IFile":
        if (componentName) {
          switch (componentName) {
            case "Box":
              return FileBox;
            case "Card":
              throw new Error("FileCard not implemented");
            case "Form":
              return FileForm;
            case "Table":
              return FilesTable;
            default:
              throw new Error("Unknown component");
          }
        }

      default:
        throw new Error("Unknown type");
    }
  }
}
