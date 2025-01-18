import HorseCard from "@/components/horses/HorseCard.vue";
import HorseForm from "@/components/horses/HorseForm.vue";
import HorsesTable from "@/components/horses/HorsesTable.vue";
import HorseBox from "@/components/horses/HorseBox.vue";
import { Component } from "vue";
import TreatmentCard from "@/components/treatments/TreatmentCard.vue";
import TreatmentForm from "@/components/treatments/TreatmentForm.vue";
import TreatmentBox from "@/components/treatments/TreatmentBox.vue";
import TreatmentsTable from "@/components/treatments/TreatmentsTable.vue";
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
      default:
        throw new Error("Unknown type");
    }
  }
}
