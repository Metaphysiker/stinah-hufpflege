import { IEntityWithFiles } from "./IEntityWithFiles";
import { IModel } from "./IModel";
import { ITreatment } from "./ITreatment";

export interface IHorse extends IModel, IEntityWithFiles {
  id: number;
  name: string;
  numberOfWeeksUntilNextTreatment: number;
  birthYear: number;
  noteForNextTreatment: string;
  createdAt: Date;
  updatedAt: Date;
  beschlagen: boolean;
  fileKeysString: string;
  treatments: ITreatment[];
}
