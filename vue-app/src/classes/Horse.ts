import { IHorse } from "../interfaces/IHorse";
import { LocalIDFactory } from "@/helpers/LocalIDFactory";
import { IFile } from "@/interfaces/IFile";
import { ITreatmentDate } from "@/interfaces/ITreatmentDate";

export class Horse implements IHorse {
  localID?: string;
  id?: number;
  name: string;
  numberOfWeeksUntilNextTreatmentHoofcare: number;
  numberOfWeeksUntilNextTreatmentToothcare: number;
  numberOfWeeksUntilNextTreatmentHealthcare: number;
  birthYear: number;
  noteForNextTreatment: string;
  createdAt: Date;
  updatedAt: Date;
  beschlagen: boolean;
  fileKeysString: string;
  files: IFile[];
  treatmentIds: number[];
  treatmentDates: ITreatmentDate[];
  fileIds: number[];
  patenschaften: string;
  summaryHoofCheckStatusOfLastTreatment: string;
  workOnHoof: string;

  constructor() {
    this.localID = LocalIDFactory.createLocalID();
    this.name = "";
    this.numberOfWeeksUntilNextTreatmentHoofcare = 8;
    this.numberOfWeeksUntilNextTreatmentToothcare = 8;
    this.numberOfWeeksUntilNextTreatmentHealthcare = 8;
    this.birthYear = 0;
    this.noteForNextTreatment = "";
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.beschlagen = false;
    this.fileKeysString = "";
    this.treatmentIds = [];
    this.files = [];
    this.treatmentDates = [];
    this.fileIds = [];
    this.patenschaften = "";
    this.summaryHoofCheckStatusOfLastTreatment = "";
    this.workOnHoof = "";
  }
}
