import { LocalIDFactory } from "@/helpers/LocalIDFactory";
import { IFile } from "@/interfaces/IFile";

export class File implements IFile {
  localID?: string;
  id?: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  horseId?: number;
  fileKeysString: string;

  constructor() {
    this.localID = LocalIDFactory.createLocalID();
    this.name = "Datei";
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.fileKeysString = "";
  }
}
