import { ITreatment } from "./ITreatment";

export interface IHorse {
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
