import { IEntityWithFiles } from "./IEntityWithFiles";
import { IModel } from "./IModel";

export interface IHorse extends IModel, IEntityWithFiles {
  name: string;
  numberOfWeeksUntilNextTreatment: number;
  birthYear: number;
  noteForNextTreatment: string;
  createdAt: Date;
  updatedAt: Date;
  beschlagen: boolean;
  fileKeysString: string;
  treatmentIds: number[];
  lastTimeTreated: Date | undefined;
}
