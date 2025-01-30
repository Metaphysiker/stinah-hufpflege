import { CareAreas } from "@/enum/CareAreas";
import { ITreatmentCategory } from "@/interfaces/ITreatmentCategory";
export class TreatmentCategoryHelper {
  getPropertyNameFromTreatmentCategory(
    treatmentCategory: ITreatmentCategory
  ): string | undefined {
    if (treatmentCategory.name === CareAreas.Hoofcare.toString()) {
      return "numberOfWeeksUntilNextTreatmentHoofcare";
    }

    if (treatmentCategory.name === CareAreas.Toothcare.toString()) {
      return "numberOfWeeksUntilNextTreatmentToothcare";
    }

    return undefined;
  }
}
