import { IRoutine } from "@/interfaces/IRoutine";
import { DateHelper } from "./DateHelper";

export class RoutineHelper {
    dateHelper = new DateHelper();

    calculateHypotheticalNextTreatmentDate(
        routine: IRoutine,
      ): Date | undefined {
        if (routine.date) {
          return this.dateHelper.addDays(routine.date, routine.rhythmInWeeks * 7);
        }

        return undefined;
      }
}
