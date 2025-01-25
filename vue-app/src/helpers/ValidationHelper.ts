import { IEntityWithValidation } from "@/interfaces/IEntityWithValidation";

export class ValidationHelper {
  hasValidationIssues(model: IEntityWithValidation): boolean {
    if (model.validationIssues && model.validationIssues.length > 0) {
      return true;
    }
    return false;
  }
}
