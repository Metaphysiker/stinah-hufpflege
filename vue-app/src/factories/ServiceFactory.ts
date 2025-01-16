import { HorseService } from "@/services/HorseService";
import { AxiosStatic } from "axios";
import { IModelController } from "@/interfaces/IModelController";
import { ISearch } from "@/interfaces/ISearch";
import { IModel } from "@/interfaces/IModel";
import { TreatmentService } from "@/services/TreatmentService";

export class ServiceFactory {
  static createService(
    interfaceName: string,
    axios: AxiosStatic
  ): IModelController<IModel, ISearch> {
    switch (interfaceName) {
      case "IHorse":
        return new HorseService(axios);
      case "ITreatment":
        return new TreatmentService(axios);
      default:
        throw new Error("Unknown type");
    }
  }
}
