import { IModel } from "@/interfaces/IModel";
import { IValidator } from "@/validators/IValidator";
import { FileValidator } from "@/validators/FileValidator";
import { HorseValidator } from "@/validators/HorseValidator";
import { TreatmentValidator } from "@/validators/TreatmentValidator";

export class ValidatorFactory {
  static createValidator(interfaceName: string): IValidator<IModel> {
    switch (interfaceName) {
      case "IHorse":
        return new HorseValidator();
      case "ITreatment":
        return new TreatmentValidator();
      case "IFile":
        return new FileValidator();
      default:
        throw new Error("Unknown type");
    }
  }
}
