import { TreatmentCategoryNames } from "@/enum/TreatmentCategoryNames";
import { ITreatmentCategory } from "@/interfaces/ITreatmentCategory";
export class TreatmentCategoryHelper {
  getPropertyNameFromTreatmentCategory(
    treatmentCategory: ITreatmentCategory
  ): string | undefined {
    if (treatmentCategory.name === TreatmentCategoryNames.Hoofcare.toString()) {
      return "numberOfWeeksUntilNextTreatmentHoofcare";
    }

    if (
      treatmentCategory.name === TreatmentCategoryNames.Toothcare.toString()
    ) {
      return "numberOfWeeksUntilNextTreatmentToothcare";
    }

    return undefined;
  }
}
