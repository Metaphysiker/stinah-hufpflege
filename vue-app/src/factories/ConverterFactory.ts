import { FileConverter } from "@/converters/FileConverter";
import { HorseConverter } from "@/converters/HorseConverter";
import { RoutineConverter } from "@/converters/RoutineConverter";
import { TreatmentConverter } from "@/converters/TreatmentConverter";
import { IConverter } from "@/interfaces/IConverter";
import { IModel } from "@/interfaces/IModel";

export class ConverterFactory {
  static createConverter(interfaceName: string): IConverter<IModel> {
    switch (interfaceName) {
      case "IHorse":
        return new HorseConverter();
      case "ITreatment":
        return new TreatmentConverter();
      case "IFile":
        return new FileConverter();
      case "IRoutine":
        return new RoutineConverter();
      default:
        throw new Error("Unknown type");
    }
  }
}
