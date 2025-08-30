import { IEntityWithIdentity } from "./IEntityWithIdentity";
import { IModel } from "./IModel";

export interface IRoutine extends IModel, IEntityWithIdentity {
    name: string;
    note: string;
    rhythmInWeeks: number;
    treatmentCategoryName: string;
    createdAt: Date;
    updatedAt: Date;
    date: Date;
    horseId: number | undefined;
    horseName: string | undefined;
}
