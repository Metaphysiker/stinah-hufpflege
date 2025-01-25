import { IValidator } from "./IValidator";
import { IValidationIssue } from "./IValidationIssue";
import { ITreatment } from "@/interfaces/ITreatment";

export class TreatmentValidator implements IValidator<ITreatment> {
  validate(model: ITreatment): ITreatment {
    const issues: IValidationIssue[] = [];
    model.validationIssues = issues;
    return model;
  }
}
