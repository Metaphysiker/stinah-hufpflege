import { HorseService } from "@/services/HorseService";
import { IHorse } from "../interfaces/IHorse";
import { DateFormatter } from "./DateFormatter";
import { DateHelper } from "./DateHelper";
import { CareAreas } from "@/enum/CareAreas";
import { RoutineHelper } from "./RoutineHelper";
import { ITreatmentCategory } from "@/interfaces/ITreatmentCategory";
export class HorseHelper {
  dateHelper = new DateHelper();
  dateFormatter = new DateFormatter();
  horseService: HorseService = new HorseService(undefined);
  routineHelper = new RoutineHelper();

  constructor(horseService: HorseService) {
    this.horseService = horseService;
  }

  calculateNextTreatmentDateWithRoutines(
    horse: IHorse,
    category: ITreatmentCategory | undefined
  ): Date | undefined {
    const regularNextDate = this.calculateNextRegularTreatmentDate(
      horse,
      category
    );

    const routineNextDate = this.calculateNextRoutineDate(horse, category);

    if (regularNextDate && routineNextDate) {
      return regularNextDate < routineNextDate
        ? regularNextDate
        : routineNextDate;
    }

    if (regularNextDate) return regularNextDate;
    if (routineNextDate) return routineNextDate;
    return undefined;
  }

  calculateNextRoutineDate(
    horse: IHorse,
    category: ITreatmentCategory | undefined
  ): Date | undefined {
        const routines = this.routineHelper.getRoutinesInSameArea(horse, category);
      const routinesWithNextDate = routines
        .map(routine => ({
          ...routine,
          nextDate: this.routineHelper.calculateHypotheticalNextTreatmentDate(routine)
        }))
        .filter(routine => routine.nextDate !== undefined)
        .sort((a, b) => (a.nextDate! > b.nextDate! ? 1 : -1));

      const routineNextDate = routinesWithNextDate[0]?.nextDate;
      return routineNextDate;
  }

  calculateNextRegularTreatmentDate(
    horse: IHorse,
    category: ITreatmentCategory | undefined
  ): Date | undefined {
        const lastTimeTreated = this.getLastTimeTreatedForCategory(horse, category?.name);
    if (!lastTimeTreated) return undefined;
    if (category?.name === CareAreas.Hoofcare.toString()) {
      return this.dateHelper.addDays(
        lastTimeTreated,
        horse.numberOfWeeksUntilNextTreatmentHoofcare * 7
      );
    }

    if (category?.name === CareAreas.Toothcare.toString()) {
      return this.dateHelper.addDays(
        lastTimeTreated,
        horse.numberOfWeeksUntilNextTreatmentToothcare * 7
      );
    }

    if (category?.name === CareAreas.Healthcare.toString()) {
      return this.dateHelper.addDays(
        lastTimeTreated,
        horse.numberOfWeeksUntilNextTreatmentHealthcare * 7
      );
    }
    return undefined;
  }

  calculateNextTreatmentDate(
    horse: IHorse,
    category: string | undefined
  ): Date | undefined {
    const lastTimeTreated = this.getLastTimeTreatedForCategory(horse, category);
    if (!lastTimeTreated) return undefined;

    if (category === CareAreas.Hoofcare.toString()) {
      return this.dateHelper.addDays(
        lastTimeTreated,
        horse.numberOfWeeksUntilNextTreatmentHoofcare * 7
      );
    }

    if (category === CareAreas.Toothcare.toString()) {
      return this.dateHelper.addDays(
        lastTimeTreated,
        horse.numberOfWeeksUntilNextTreatmentToothcare * 7
      );
    }

    if (category === CareAreas.Healthcare.toString()) {
      return this.dateHelper.addDays(
        lastTimeTreated,
        horse.numberOfWeeksUntilNextTreatmentHealthcare * 7
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

    if (category === CareAreas.Hoofcare.toString()) {
      return this.dateHelper.addDays(lastTimeTreated, numberOfWeeks * 7);
    }

    if (category === CareAreas.Toothcare.toString()) {
      return this.dateHelper.addDays(lastTimeTreated, numberOfWeeks * 7);
    }

    if (category === CareAreas.Healthcare.toString()) {
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
    if (!horse.treatmentDates || horse.treatmentDates.length == 0)
      return undefined;

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
