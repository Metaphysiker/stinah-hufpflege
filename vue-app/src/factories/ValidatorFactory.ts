import { IModel } from "@/interfaces/IModel";
import { IValidator } from "@/validators/IValidator";
import { FileValidator } from "@/validators/FileValidator";
import { HorseValidator } from "@/validators/HorseValidator";
import { TreatmentValidator } from "@/validators/TreatmentValidator";
import { RoutineValidator } from "@/validators/RoutineValidator";

export class ValidatorFactory {
  static createValidator(interfaceName: string): IValidator<IModel> {
    switch (interfaceName) {
      case "IHorse":
        return new HorseValidator();
      case "ITreatment":
        return new TreatmentValidator();
      case "IFile":
        return new FileValidator();
      case "IRoutine":
        return new RoutineValidator();
      default:
        throw new Error("Unknown type");
    }
  }
}
