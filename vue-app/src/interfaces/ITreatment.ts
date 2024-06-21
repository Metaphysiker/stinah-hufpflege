export interface ITreatment {
  id: number;
  note: string;
  noteForNextTreatment: string;
  horseId: number;
  createdAt: Date;
  updatedAt: Date;
  fileKeysString: string;
}
