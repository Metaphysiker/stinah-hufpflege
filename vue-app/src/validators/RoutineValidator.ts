import { IRoutine } from "@/interfaces/IRoutine";
import { IValidationIssue } from "./IValidationIssue";
import { IValidator } from "./IValidator";

export class RoutineValidator implements IValidator<IRoutine> {
  validate(model: IRoutine): IRoutine {
    const issues: IValidationIssue[] = [];
    model.validationIssues = issues;
    return model;
  }
}
