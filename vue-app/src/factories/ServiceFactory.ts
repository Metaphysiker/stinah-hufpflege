import { HorseService } from "@/services/HorseService";
import { AxiosStatic } from "axios";
import { IModelController } from "@/interfaces/IModelController";
import { IDto } from "@/interfaces/IDto";
import { ISearch } from "@/interfaces/ISearch";

export class ServiceFactory {
  static createService(
    interfaceName: string,
    axios: AxiosStatic
  ): IModelController<IDto, ISearch> {
    switch (interfaceName) {
      case "IHorse":
        return new HorseService(axios);
      default:
        throw new Error("Unknown type");
    }
  }
}
