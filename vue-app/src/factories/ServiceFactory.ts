import { HorseService } from "@/services/HorseService";
import { AxiosStatic } from "axios";
import { IModelController } from "@/interfaces/IModelController";
import { ISearch } from "@/interfaces/ISearch";
import { IModel } from "@/interfaces/IModel";
import { TreatmentService } from "@/services/TreatmentService";
import { FileService } from "@/services/FileService";
import { RoutineService } from "@/services/RoutineService";

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
      case "IFile":
        return new FileService(axios);
      case "IRoutine":
        return new RoutineService(axios);
      default:
        throw new Error("Unknown type");
    }
  }
}
