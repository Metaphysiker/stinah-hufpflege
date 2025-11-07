import { IHorse } from "../interfaces/IHorse";
import { LocalIDFactory } from "@/helpers/LocalIDFactory";
import { IFile } from "@/interfaces/IFile";
import { IRoutine } from "@/interfaces/IRoutine";
import { ITreatmentDate } from "@/interfaces/ITreatmentDate";

export class Horse implements IHorse {
  localID?: string;
  id?: number;
  name: string;
  numberOfWeeksUntilNextTreatmentHoofcare: number;
  numberOfWeeksUntilNextTreatmentHoofcareFollowUp1: number;
  followUp1AdvanceNotice: string;
  numberOfWeeksUntilNextTreatmentHoofcareFollowUp2: number;
  followUp2AdvanceNotice: string;
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
  includedRoutines: IRoutine[];
  routineIds: number[];
  color: string;

  constructor() {
    this.localID = LocalIDFactory.createLocalID();
    this.name = "";
    this.numberOfWeeksUntilNextTreatmentHoofcare = 8;
    this.numberOfWeeksUntilNextTreatmentHoofcareFollowUp1 = 0;
    this.followUp1AdvanceNotice = "";
    this.numberOfWeeksUntilNextTreatmentHoofcareFollowUp2 = 0;
    this.followUp2AdvanceNotice = "";
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
    this.includedRoutines = [];
    this.routineIds = [];
    this.color = "#FFFFFF";
  }
}
