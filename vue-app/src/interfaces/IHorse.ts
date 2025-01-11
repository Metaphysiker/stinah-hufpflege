import { IDto } from "./IDto";
import { ITreatment } from "./ITreatment";

export interface IHorse extends IDto {
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
