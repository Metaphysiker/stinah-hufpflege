import { Horse } from "@/classes/Horse";
import { Treatment } from "@/classes/Treatment";
import { IModel } from "@/interfaces/IModel";

export class ClassFactory {
  static createClassInstance(interfaceName: string): IModel {
    switch (interfaceName) {
      case "IHorse":
        return new Horse();
      case "ITreatment":
        return new Treatment();
      default:
        throw new Error("Unknown type");
    }
  }
}
