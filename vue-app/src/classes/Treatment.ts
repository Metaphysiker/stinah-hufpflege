import { LocalIDFactory } from "@/helpers/LocalIDFactory";
import { IFile } from "@/interfaces/IFile";
import { IHoofCheck } from "@/interfaces/IHoofCheck";
import { ITreatment } from "@/interfaces/ITreatment";

export class Treatment implements ITreatment {
  localID?: string;
  note: string;
  noteForNextTreatment: string;
  horseId: number | undefined;
  horseName: string | undefined;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  fileKeysString: string;
  category: string;
  name: string;
  files: IFile[];
  treatmentIds: number[];
  hoofCheck: IHoofCheck | undefined;
  hoofCheckString: string | undefined;

  constructor() {
    this.localID = LocalIDFactory.createLocalID();
    this.note = "";
    this.noteForNextTreatment = "";
    this.date = new Date();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.fileKeysString = "";
    this.category = "";
    this.name = "";
    this.files = [];
    this.treatmentIds = [];
  }
}
