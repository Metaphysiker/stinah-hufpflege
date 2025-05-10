import { Treatment } from "@/classes/Treatment";
import { Cloner } from "@/helpers/Cloner";
import { HoofCheckHelper } from "@/helpers/HoofCheckHelper";
import { IConverter } from "@/interfaces/IConverter";
import { ITreatment } from "@/interfaces/ITreatment";

export class TreatmentConverter implements IConverter<ITreatment> {
  cloner = new Cloner();
  hoofCheckHelper = new HoofCheckHelper();

  convert(input: any): ITreatment {
    let model = new Treatment();
    model = this.cloner.clone(input);
    model.createdAt = new Date(input.createdAt);
    model.updatedAt = new Date(input.updatedAt);
    model.date = new Date(input.date);
    if (input.hoofCheckString) {
      model.hoofCheck = this.hoofCheckHelper.parseJson(input.hoofCheckString);
    }
    return model;
  }

  convertMany(input: any): ITreatment[] {
    let models: ITreatment[] = [];
    input.forEach((element: any) => {
      models.push(this.convert(element));
    });
    return models;
  }
}
