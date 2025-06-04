import { IEntityWithFiles } from "./IEntityWithFiles";
import { IModel } from "./IModel";
import { ITreatmentDate } from "./ITreatmentDate";

export interface IHorse extends IModel, IEntityWithFiles {
  name: string;
  numberOfWeeksUntilNextTreatmentHoofcare: number;
  numberOfWeeksUntilNextTreatmentToothcare: number;
  birthYear: number;
  noteForNextTreatment: string;
  createdAt: Date;
  updatedAt: Date;
  beschlagen: boolean;
  fileKeysString: string;
  treatmentIds: number[];
  treatmentDates: ITreatmentDate[];
  fileIds: number[];
  patenschaften: string;
  summaryHoofCheckStatusOfLastTreatment: string;
  workOnHoof: string;
}
