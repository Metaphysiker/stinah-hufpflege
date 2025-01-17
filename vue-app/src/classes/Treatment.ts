import { LocalIDFactory } from "@/helpers/LocalIDFactory";
import { IFile } from "@/interfaces/IFile";
import { ITreatment } from "@/interfaces/ITreatment";

export class Treatment implements ITreatment {
  localID?: string;
  note: string;
  noteForNextTreatment: string;
  horseId: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  fileKeysString: string;
  category: string;
  name: string;
  files: IFile[];

  constructor() {
    this.localID = LocalIDFactory.createLocalID();
    this.note = "";
    this.noteForNextTreatment = "";
    this.horseId = 0;
    this.date = new Date();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.fileKeysString = "";
    this.category = "";
    this.name = "";
    this.files = [];
  }
}
