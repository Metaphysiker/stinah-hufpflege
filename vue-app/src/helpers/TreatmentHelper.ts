import { Treatment } from "@/classes/Treatment";
import { ITreatment } from "@/interfaces/ITreatment";

export class TreatmentHelper {
  convertToTreatments(data: any): ITreatment[] {
    const treatments: ITreatment[] = [];
    data.forEach((element: any) => {
      treatments.push(this.convertToTreatment(element));
    });
    return treatments;
  }

  convertToTreatment(input: ITreatment): ITreatment {
    const treatment: ITreatment = new Treatment();
    treatment.id = input.id;
    treatment.horseId = input.horseId;
    treatment.note = input.note;
    treatment.noteForNextTreatment = input.noteForNextTreatment;
    return treatment;
  }
}
