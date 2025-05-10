import { IEntityWithFiles } from "./IEntityWithFiles";
import { IEntityWithIdentity } from "./IEntityWithIdentity";
import { IHoofCheck } from "./IHoofCheck";
import { IModel } from "./IModel";

export interface ITreatment
  extends IModel,
    IEntityWithFiles,
    IEntityWithIdentity {
  note: string;
  noteForNextTreatment: string;
  horseId: number | undefined;
  horseName: string | undefined;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  fileKeysString: string;
  treatmentIds: number[];
  hoofCheck: IHoofCheck | undefined;
  hoofCheckString: string | undefined;
  HoofCheckStringFromLastTreatment: string | undefined;
}
