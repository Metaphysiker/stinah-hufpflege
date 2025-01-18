import { IModel } from "./IModel";

export interface ITreatmentCategory extends IModel {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
