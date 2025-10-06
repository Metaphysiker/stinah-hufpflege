import { IHorse } from "@/interfaces/IHorse";
import { HorseHelper } from "./HorseHelper";
import { HorseService } from "@/services/HorseService";

export class UrgencyHelper {
  horseService: HorseService = new HorseService(undefined);
  horseHelper = new HorseHelper(this.horseService);

  constructor(horseHelper: HorseHelper) {
    this.horseHelper = horseHelper;
  }

  calculateUrgencyInDays(horse: IHorse, category: string | undefined, subCategory: string | undefined) {
    const now = new Date();
    const nextTreatmentDate = this.horseHelper.calculateNextTreatmentDate(
      horse,
      category,
      subCategory
    );
    if (nextTreatmentDate) {
      const difference = nextTreatmentDate.getTime() - now.getTime();
      return difference / (1000 * 60 * 60 * 24);
    }
    return 0;
  }

  isNextWeek(horse: IHorse, category: string | undefined, subCategory: string | undefined) {
    return this.calculateUrgencyInDays(horse, category, subCategory) < 7;
  }

  isNextMonth(horse: IHorse, category: string | undefined, subCategory: string | undefined) {
    return this.calculateUrgencyInDays(horse, category, subCategory) < 30;
  }

    getClassForUrgency(horse: IHorse, category: string | undefined, subCategory: string | undefined) {

    if(subCategory === "followUp1") {
      if(horse.numberOfWeeksUntilNextTreatmentHoofcareFollowUp1 == 0){
        return "bg-white";
      }
    }

    if(subCategory === "followUp2") {
      if(horse.numberOfWeeksUntilNextTreatmentHoofcareFollowUp2 == 0){
        return "bg-white";
      }
    }

    if (this.isNextWeek(horse, category, subCategory)) {
      return "bg-red";
    } else if (this.isNextMonth(horse, category, subCategory)) {
      return "bg-yellow";
    } else {
      return "bg-white";
    }
  }

getClassForUrgencyWithDate(date: Date) {
  const now = new Date();
  // If the date is in the past or today, return bg-red
  if (date.getTime() <= now.setHours(0,0,0,0)) {
    return "bg-red"; // urgent - past or today
  } else if (this.isNextWeekWithDate(date)) {
    return "bg-red"; // urgent - within a week
  } else if (this.isNextMonthWithDate(date)) {
    return "bg-yellow"; // less urgent - within a month
  } else {
    return "bg-white"; // not urgent
  }
}

isNextWeekWithDate(date: Date) {
  const now = new Date();
  const difference = date.getTime() - now.getTime();
  return difference > 0 && difference / (1000 * 60 * 60 * 24) < 7;
}

isNextMonthWithDate(date: Date) {
  const now = new Date();
  const difference = date.getTime() - now.getTime();
  return difference > 0 && difference / (1000 * 60 * 60 * 24) < 30;
}
}
