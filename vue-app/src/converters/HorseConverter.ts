import { Horse } from "@/classes/Horse";
import { Cloner } from "@/helpers/Cloner";
import { IConverter } from "@/interfaces/IConverter";
import { IHorse } from "@/interfaces/IHorse";
import { ITreatmentDate } from "@/interfaces/ITreatmentDate";

export class HorseConverter implements IConverter<IHorse> {
  cloner = new Cloner();

  convert(input: any): IHorse {
    let horse = new Horse();
    horse = this.cloner.clone(input);
    horse.createdAt = new Date(input.createdAt);
    horse.updatedAt = new Date(input.updatedAt);
    horse.treatmentDates = [];
    for (let treatmentDate of input.treatmentDates) {
      const treatmentDateDate = new Date(treatmentDate.lastTimeTreated);
      const newTreatmentDate: ITreatmentDate = {
        category: treatmentDate.category,
        lastTimeTreated: treatmentDateDate,
      };
      horse.treatmentDates.push(newTreatmentDate);
    }
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
