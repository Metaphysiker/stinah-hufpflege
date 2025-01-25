import { LocalIDFactory } from "@/helpers/LocalIDFactory";
import { IFile } from "@/interfaces/IFile";

export class File implements IFile {
  localID?: string;
  id?: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  fileKeyString: string;

  constructor() {
    this.localID = LocalIDFactory.createLocalID();
    this.name = "";
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.fileKeyString = "";
  }
}
