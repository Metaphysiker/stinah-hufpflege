import { HorseHelper } from "@/helpers/HorseHelper";
import { IHorse } from "../interfaces/IHorse";

export class Horse implements IHorse {
  horseHelper = new HorseHelper();
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

  nextTreatmentDate(): Date {
    return this.horseHelper.calculateNextTreatmentDate(this);
  }

  nextTreatmentDateString(): string {
    return this.horseHelper.getNextTreatmentDateString(this);
  }

  constructor() {
    this.id = 0;
    this.name = "";
    this.lastTimeTreated = new Date();
    this.numberOfWeeksUntilNextTreatment = 8;
    this.birthYear = 0;
    this.noteForNextTreatment = "";
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.beschlagen = false;
    this.fileKeysString = "";
  }

  clone(original: IHorse): IHorse {
    const horse = new Horse();
    horse.id = original.id;
    horse.name = original.name;
    horse.lastTimeTreated = new Date(original.lastTimeTreated);
    horse.numberOfWeeksUntilNextTreatment =
      original.numberOfWeeksUntilNextTreatment;
    horse.birthYear = original.birthYear;
    horse.noteForNextTreatment = original.noteForNextTreatment;
    horse.createdAt = new Date(original.createdAt);
    horse.updatedAt = new Date(original.updatedAt);
    horse.beschlagen = original.beschlagen;
    horse.fileKeysString = original.fileKeysString;
    return horse;
  }

  convertToHorse(horse: IHorse): Horse {
    this.id = horse.id;
    this.name = horse.name;
    this.numberOfWeeksUntilNextTreatment =
      horse.numberOfWeeksUntilNextTreatment;
    this.lastTimeTreated = new Date(horse.lastTimeTreated);
    this.birthYear = horse.birthYear;
    this.noteForNextTreatment = horse.noteForNextTreatment;
    this.createdAt = new Date(horse.createdAt);
    this.updatedAt = new Date(horse.updatedAt);
    this.beschlagen = horse.beschlagen;
    this.fileKeysString = horse.fileKeysString;
    return this;
  }

  convertToHorses(horses: IHorse[]): Horse[] {
    return horses.map((horse) => {
      return new Horse().convertToHorse(horse);
    });
  }
}
