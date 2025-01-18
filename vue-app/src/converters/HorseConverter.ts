import { Horse } from "@/classes/Horse";
import { Cloner } from "@/helpers/Cloner";
import { IHorse } from "@/interfaces/IHorse";

export class HorseConverter {
  cloner = new Cloner();

  convert(input: any): IHorse {
    let horse = new Horse();
    horse = this.cloner.clone(input);
    horse.createdAt = new Date(input.createdAt);
    horse.updatedAt = new Date(input.updatedAt);
    return horse;
  }

  convertMany(input: any): IHorse[] {
    let horses: IHorse[] = [];
    input.forEach((element: any) => {
      horses.push(this.convert(element));
    });
    return horses;
  }
}
