import { IHorse } from "../interfaces/IHorse";
import { DateFormatter } from "./DateFormatter";
import { DateHelper } from "./DateHelper";
export class HorseHelper {
  dateHelper = new DateHelper();
  dateFormatter = new DateFormatter();

  calculateNextTreatmentDate(
    horse: IHorse,
    category: string
  ): Date | undefined {
    const lastTimeTreated = this.getLastTimeTreated(horse, category);
    if (!lastTimeTreated) return undefined;

    return this.dateHelper.addDays(
      lastTimeTreated,
      horse.numberOfWeeksUntilNextTreatment * 7
    );
  }

  getLabelForBehandeltButton(horse: IHorse) {
    if (horse.beschlagen) return "Beschlagen";
    return "Behandelt";
  }

  getLastTimeTreated(horse: IHorse, category: string): Date | undefined {
    const treatmentsInCategory = horse.treatments.filter(
      (treatment) => treatment.category === category
    );
    if (treatmentsInCategory.length === 0) return undefined;

    const lastTreatment = treatmentsInCategory.reduce((a, b) =>
      a.date > b.date ? a : b
    );

    console.log("lastTreatment", lastTreatment);
    return lastTreatment.date;
  }

  getNextTreatmentDate(horse: IHorse, category: string): Date | undefined {
    const lastTimeTreated = this.getLastTimeTreated(horse, category);
    if (!lastTimeTreated) return undefined;

    return this.dateHelper.addDays(
      lastTimeTreated,
      horse.numberOfWeeksUntilNextTreatment * 7
    );
  }
}
