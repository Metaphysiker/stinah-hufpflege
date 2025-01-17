import { IEntityWithFiles } from "./IEntityWithFiles";
import { IEntityWithIdentity } from "./IEntityWithIdentity";
import { IModel } from "./IModel";

export interface ITreatment
  extends IModel,
    IEntityWithFiles,
    IEntityWithIdentity {
  note: string;
  noteForNextTreatment: string;
  horseId: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  fileKeysString: string;
}
