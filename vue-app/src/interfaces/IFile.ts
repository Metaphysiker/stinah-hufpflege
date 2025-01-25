import { IModel } from "./IModel";

export interface IFile extends IModel {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  fileKeyString: string;
}
