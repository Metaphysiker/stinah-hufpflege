import { IRoutine } from "@/interfaces/IRoutine";
import { DateHelper } from "./DateHelper";
import { IHorse } from "@/interfaces/IHorse";
import { ITreatmentCategory } from "@/interfaces/ITreatmentCategory";

export class RoutineHelper {
  dateHelper = new DateHelper();

  calculateHypotheticalNextTreatmentDate(routine: IRoutine): Date | undefined {
    if (routine.date) {
      return this.dateHelper.addDays(routine.date, routine.rhythmInWeeks * 7);
    }

    return undefined;
  }

  getRoutinesInSameArea = (
    horse: IHorse,
    selectedTreatmentCategory: ITreatmentCategory | undefined
  ): IRoutine[] => {
    if (!selectedTreatmentCategory?.name) return horse.includedRoutines;
    return horse.includedRoutines.filter(
      (routine) =>
        routine.treatmentCategoryName === selectedTreatmentCategory.name
    );
  };
}
