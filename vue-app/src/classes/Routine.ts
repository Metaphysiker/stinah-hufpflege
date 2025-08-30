import { LocalIDFactory } from "@/helpers/LocalIDFactory";
import { IRoutine } from "@/interfaces/IRoutine";

export class Routine implements IRoutine {
    localID?: string;
    name: string;
    note: string;
    rhythmInWeeks: number;
    treatmentCategoryName: string;
    createdAt: Date;
    updatedAt: Date;
    date: Date;
    horseId: number | undefined;
    horseName: string | undefined;

    constructor(){
        this.localID = LocalIDFactory.createLocalID();
        this.name = "";
        this.note = "";
        this.rhythmInWeeks = 0;
        this.treatmentCategoryName = "";
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.date = new Date();
        this.horseId = undefined;
        this.horseName = undefined;
    }

}
