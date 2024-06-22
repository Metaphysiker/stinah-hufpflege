export interface IHorse {
  id: number;
  name: string;
  lastTimeTreated: Date;
  numberOfWeeksUntilNextTreatment: number;
  birthYear: number;
  noteForNextTreatment: string;
  createdAt: Date;
  updatedAt: Date;
  beschlagen: boolean;
  fileKeysString: string;
  nextTreatmentDate: () => Date;
  nextTreatmentDateString: () => string;
}
