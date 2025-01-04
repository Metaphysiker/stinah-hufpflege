import { IHorse } from "@/interfaces/IHorse";
import { HorseHelper } from "./HorseHelper";

export class UrgencyHelper {
  horseHelper = new HorseHelper();
  calculateUrgencyInDays(horse: IHorse) {
    const now = new Date();
    const nextTreatmentDate = this.horseHelper.calculateNextTreatmentDate(
      horse,
      "hoofcare"
    );
    if (nextTreatmentDate) {
      const difference = nextTreatmentDate.getTime() - now.getTime();
      return difference / (1000 * 60 * 60 * 24);
    }
    return 0;
  }

  isNextWeek(horse: IHorse) {
    return this.calculateUrgencyInDays(horse) < 7;
  }

  isNextMonth(horse: IHorse) {
    return this.calculateUrgencyInDays(horse) < 30;
  }

  getColorForUrgency(horse: IHorse) {
    if (this.isNextWeek(horse)) {
      return "red";
    } else if (this.isNextMonth(horse)) {
      return "yellow";
    } else {
      return "white";
    }
  }

  getClassForUrgency(horse: IHorse) {
    if (this.isNextWeek(horse)) {
      return "bg-red";
    } else if (this.isNextMonth(horse)) {
      return "bg-yellow";
    } else {
      return "bg-white";
    }
  }
}
