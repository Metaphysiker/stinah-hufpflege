import { IEntityWithFiles } from "./IEntityWithFiles";
import { IModel } from "./IModel";
import { IRoutine } from "./IRoutine";
import { ITreatmentDate } from "./ITreatmentDate";

export interface IHorse extends IModel, IEntityWithFiles {
  name: string;
  numberOfWeeksUntilNextTreatmentHoofcare: number;
  numberOfWeeksUntilNextTreatmentHoofcareFollowUp1: number;
  followUp1AdvanceNotice: string;
  numberOfWeeksUntilNextTreatmentHoofcareFollowUp2: number;
  followUp2AdvanceNotice: string;
  numberOfWeeksUntilNextTreatmentToothcare: number;
  numberOfWeeksUntilNextTreatmentHealthcare: number;
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
  includedRoutines: IRoutine[];
  routineIds: number[];
  color: string;
}
