import { IFile } from "@/interfaces/IFile";
import { IValidator } from "./IValidator";
import { IValidationIssue } from "./IValidationIssue";

export class FileValidator implements IValidator<IFile> {
  validate(model: IFile): IFile {
    const issues: IValidationIssue[] = [];
    if (model.fileKeyStrings.length === 0) {
      issues.push({ message: "No file key strings provided." });
    }
    model.validationIssues = issues;
    return model;
  }
}
