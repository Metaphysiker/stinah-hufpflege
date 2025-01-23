import { IHorse } from "@/interfaces/IHorse";
import { HorseHelper } from "./HorseHelper";
import { HorseService } from "@/services/HorseService";

export class UrgencyHelper {
  horseService: HorseService = new HorseService(undefined);
  horseHelper = new HorseHelper(this.horseService);

  constructor(horseHelper: HorseHelper) {
    this.horseHelper = horseHelper;
  }

  calculateUrgencyInDays(horse: IHorse, category: string | undefined) {
    const now = new Date();
    const nextTreatmentDate = this.horseHelper.calculateNextTreatmentDate(
      horse,
      category
    );
    if (nextTreatmentDate) {
      const difference = nextTreatmentDate.getTime() - now.getTime();
      return difference / (1000 * 60 * 60 * 24);
    }
    return 0;
  }

  isNextWeek(horse: IHorse, category: string | undefined) {
    return this.calculateUrgencyInDays(horse, category) < 7;
  }

  isNextMonth(horse: IHorse, category: string | undefined) {
    return this.calculateUrgencyInDays(horse, category) < 30;
  }

  getColorForUrgency(horse: IHorse, category: string | undefined) {
    if (this.isNextWeek(horse, category)) {
      return "red";
    } else if (this.isNextMonth(horse, category)) {
      return "yellow";
    } else {
      return "white";
    }
  }

  getClassForUrgency(horse: IHorse, category: string | undefined) {
    if (this.isNextWeek(horse, category)) {
      return "bg-red";
    } else if (this.isNextMonth(horse, category)) {
      return "bg-yellow";
    } else {
      return "bg-white";
    }
  }
}
