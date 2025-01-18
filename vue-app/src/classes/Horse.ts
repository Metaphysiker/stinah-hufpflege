import { IHorse } from "../interfaces/IHorse";
import { LocalIDFactory } from "@/helpers/LocalIDFactory";
import { IFile } from "@/interfaces/IFile";

export class Horse implements IHorse {
  localID?: string;
  id?: number;
  name: string;
  numberOfWeeksUntilNextTreatment: number;
  birthYear: number;
  noteForNextTreatment: string;
  createdAt: Date;
  updatedAt: Date;
  beschlagen: boolean;
  fileKeysString: string;
  files: IFile[];
  treatmentIds: number[];
  lastTimeTreated: Date | undefined;

  constructor() {
    this.localID = LocalIDFactory.createLocalID();
    this.name = "";
    this.numberOfWeeksUntilNextTreatment = 8;
    this.birthYear = 0;
    this.noteForNextTreatment = "";
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.beschlagen = false;
    this.fileKeysString = "";
    this.treatmentIds = [];
    this.files = [];
  }
}
