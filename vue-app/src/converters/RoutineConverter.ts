import { Routine } from "@/classes/Routine";
import { Cloner } from "@/helpers/Cloner";
import { HoofCheckHelper } from "@/helpers/HoofCheckHelper";
import { IConverter } from "@/interfaces/IConverter";
import { IRoutine } from "@/interfaces/IRoutine";

export class RoutineConverter implements IConverter<IRoutine> {
  cloner = new Cloner();
  hoofCheckHelper = new HoofCheckHelper();

  convert(input: any): IRoutine {
    let model = new Routine();
    model = this.cloner.clone(input);
    model.createdAt = new Date(input.createdAt);
    model.updatedAt = new Date(input.updatedAt);
    model.date = new Date(input.date);

    return model;
  }

  convertMany(input: any): IRoutine[] {
    let models: IRoutine[] = [];
    input.forEach((element: any) => {
      models.push(this.convert(element));
    });
    return models;
  }
}
