import { HorseHelper } from "@/helpers/HorseHelper";
import { IHorse } from "../interfaces/IHorse";
import { ITreatment } from "@/interfaces/ITreatment";

export class Horse implements IHorse {
  horseHelper = new HorseHelper();
  id: number;
  name: string;
  numberOfWeeksUntilNextTreatment: number;
  birthYear: number;
  noteForNextTreatment: string;
  createdAt: Date;
  updatedAt: Date;
  beschlagen: boolean;
  fileKeysString: string;
  treatments: ITreatment[];

  constructor() {
    this.id = 0;
    this.name = "";
    this.numberOfWeeksUntilNextTreatment = 8;
    this.birthYear = 0;
    this.noteForNextTreatment = "";
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.beschlagen = false;
    this.fileKeysString = "";
    this.treatments = [];
  }

  clone(original: IHorse): IHorse {
    const horse = new Horse();
    horse.id = original.id;
    horse.name = original.name;
    horse.numberOfWeeksUntilNextTreatment =
      original.numberOfWeeksUntilNextTreatment;
    horse.birthYear = original.birthYear;
    horse.noteForNextTreatment = original.noteForNextTreatment;
    horse.createdAt = new Date(original.createdAt);
    horse.updatedAt = new Date(original.updatedAt);
    horse.beschlagen = original.beschlagen;
    horse.fileKeysString = original.fileKeysString;
    horse.treatments = original.treatments;
    return horse;
  }

  convertToHorse(horse: IHorse): Horse {
    this.id = horse.id;
    this.name = horse.name;
    this.numberOfWeeksUntilNextTreatment =
      horse.numberOfWeeksUntilNextTreatment;
    this.birthYear = horse.birthYear;
    this.noteForNextTreatment = horse.noteForNextTreatment;
    this.createdAt = new Date(horse.createdAt);
    this.updatedAt = new Date(horse.updatedAt);
    this.beschlagen = horse.beschlagen;
    this.fileKeysString = horse.fileKeysString;
    this.treatments = horse.treatments;
    return this;
  }

  convertToHorses(horses: IHorse[]): Horse[] {
    return horses.map((horse) => {
      return new Horse().convertToHorse(horse);
    });
  }
}
