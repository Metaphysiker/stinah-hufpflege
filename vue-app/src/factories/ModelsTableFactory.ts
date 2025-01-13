import HorsesTable from "@/components/horses/HorsesTable.vue";
import { Component } from "vue";

export class ModelsTableFactory {
  static createComponent(interfaceName: string): Component {
    switch (interfaceName) {
      case "IHorse":
        return HorsesTable;
      default:
        throw new Error("Unknown type");
    }
  }
}
