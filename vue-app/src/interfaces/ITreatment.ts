export interface ITreatment {
  id: number;
  note: string;
  noteForNextTreatment: string;
  horseId: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  fileKeysString: string;
}
