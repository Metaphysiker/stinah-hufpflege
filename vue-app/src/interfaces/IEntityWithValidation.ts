import { IValidationIssue } from "@/validators/IValidationIssue";

export interface IEntityWithValidation {
  validationIssues?: IValidationIssue[];
}
