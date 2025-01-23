import { HorseService } from "@/services/HorseService";
import { IHorse } from "../interfaces/IHorse";
import { DateFormatter } from "./DateFormatter";
import { DateHelper } from "./DateHelper";
export class HorseHelper {
  dateHelper = new DateHelper();
  dateFormatter = new DateFormatter();
  horseService: HorseService = new HorseService(undefined);

  constructor(horseService: HorseService) {
    this.horseService = horseService;
  }

  calculateNextTreatmentDate(
    horse: IHorse,
    category: string | undefined
  ): Date | undefined {
    const lastTimeTreated = this.getLastTimeTreatedForCategory(horse, category);
    if (!lastTimeTreated) return undefined;

    if (category === "hoofcare") {
      return this.dateHelper.addDays(
        lastTimeTreated,
        horse.numberOfWeeksUntilNextTreatmentHoofcare * 7
      );
    }

    if (category === "toothcare") {
      return this.dateHelper.addDays(
        lastTimeTreated,
        horse.numberOfWeeksUntilNextTreatmentToothcare * 7
      );
    }

    return undefined;
  }

  calculateHypotheticalNextTreatmentDate(
    horse: IHorse,
    category: string | undefined,
    numberOfWeeks: number
  ): Date | undefined {
    const lastTimeTreated = this.getLastTimeTreatedForCategory(horse, category);
    if (!lastTimeTreated) return undefined;

    if (category === "hoofcare") {
      return this.dateHelper.addDays(lastTimeTreated, numberOfWeeks * 7);
    }

    if (category === "toothcare") {
      return this.dateHelper.addDays(lastTimeTreated, numberOfWeeks * 7);
    }

    return undefined;
  }

  getLabelForBehandeltButton(horse: IHorse) {
    if (horse.beschlagen) return "Beschlagen";
    return "Behandelt";
  }

  getLastTimeTreatedForCategory = (
    horse: IHorse,
    category: string | undefined
  ): Date | undefined => {
    if (!category) {
      const foundLastTreatmentDate = horse.treatmentDates.reduce((a, b) => {
        if (!a.lastTimeTreated) return b;
        if (!b.lastTimeTreated) return a;
        return a.lastTimeTreated > b.lastTimeTreated ? a : b;
      });

      if (foundLastTreatmentDate?.lastTimeTreated) {
        return foundLastTreatmentDate.lastTimeTreated;
      } else {
        return undefined;
      }
    }

    const foundLastTreatmentDate = horse.treatmentDates.find(
      (treatmentDate) => treatmentDate.category === category
    );

    if (foundLastTreatmentDate?.lastTimeTreated) {
      return foundLastTreatmentDate.lastTimeTreated;
    }

    return undefined;
  };
}
