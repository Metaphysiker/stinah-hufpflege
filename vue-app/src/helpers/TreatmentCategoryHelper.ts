import { ITreatmentCategory } from "@/interfaces/ITreatmentCategory";

export class TreatmentCategoryHelper {
  getPropertyNameFromTreatmentCategory(
    treatmentCategory: ITreatmentCategory
  ): string | undefined {
    if (treatmentCategory.name === "hoofcare") {
      return "numberOfWeeksUntilNextTreatmentHoofcare";
    }

    if (treatmentCategory.name === "toothcare") {
      return "numberOfWeeksUntilNextTreatmentToothcare";
    }

    return undefined;
  }
}
