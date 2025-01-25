import { Cloner } from "@/helpers/Cloner";
import { IConverter } from "@/interfaces/IConverter";
import { IFile } from "@/interfaces/IFile";
import { File } from "@/classes/File";

export class FileConverter implements IConverter<IFile> {
  cloner = new Cloner();

  convert(input: any): IFile {
    let file = new File();
    file = this.cloner.clone(input);
    file.createdAt = new Date(input.createdAt);
    file.updatedAt = new Date(input.updatedAt);
    return file;
  }

  convertMany(input: any): IFile[] {
    let files: IFile[] = [];
    input.forEach((element: any) => {
      files.push(this.convert(element));
    });
    return files;
  }
}
