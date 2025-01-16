import { IEntityWithFiles } from "./IEntityWithFiles";
import { IModel } from "./IModel";

export interface ITreatment extends IModel, IEntityWithFiles {
  id: number;
  note: string;
  noteForNextTreatment: string;
  horseId: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  fileKeysString: string;
}
