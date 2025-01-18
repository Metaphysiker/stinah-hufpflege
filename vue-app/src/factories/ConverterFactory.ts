import { HorseConverter } from "@/converters/HorseConverter";
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
      default:
        throw new Error("Unknown type");
    }
  }
}
