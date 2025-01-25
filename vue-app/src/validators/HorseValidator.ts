import { IValidator } from "./IValidator";
import { IValidationIssue } from "./IValidationIssue";
import { IHorse } from "@/interfaces/IHorse";

export class HorseValidator implements IValidator<IHorse> {
  validate(model: IHorse): IHorse {
    const issues: IValidationIssue[] = [];
    model.validationIssues = issues;
    return model;
  }
}
