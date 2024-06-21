import { ITreatment } from "@/interfaces/ITreatment";

export class Treatment implements ITreatment {
  id: number;
  note: string;
  noteForNextTreatment: string;
  horseId: number;
  createdAt: Date;
  updatedAt: Date;
  fileKeysString: string;

  constructor() {
    this.id = 0;
    this.note = "";
    this.noteForNextTreatment = "";
    this.horseId = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.fileKeysString = "";
  }
}
