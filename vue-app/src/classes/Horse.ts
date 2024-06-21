import { IHorse } from "../interfaces/IHorse";

export class Horse implements IHorse {
  id: number;
  name: string;
  lastTimeTreated: Date;
  numberOfWeeksUntilNextTreatment: number;
  birthYear: number;
  noteForNextTreatment: string;
  createdAt: Date;
  updatedAt: Date;
  beschlagen: boolean;
  fileKeys: string[];

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
    this.fileKeys = [];
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
    horse.fileKeys = original.fileKeys;
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
    this.fileKeys = horse.fileKeys;
    return this;
  }

  convertToHorses(horses: IHorse[]): Horse[] {
    return horses.map((horse) => {
      return new Horse().convertToHorse(horse);
    });
  }
}
