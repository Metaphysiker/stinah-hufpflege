import { IHorse } from "@/interfaces/IHorse";

export class FileHelper {
  addFileKeysToHorse(fileKeys: string[], horse: IHorse) {
    const oldFileKeysString = horse.fileKeysString;
    const oldFileKeys = oldFileKeysString.split(",");
    const newFileKeys = oldFileKeys.concat(fileKeys);
    const newFileKeysString = newFileKeys.join(",");
    horse.fileKeysString = newFileKeysString;
  }
}
