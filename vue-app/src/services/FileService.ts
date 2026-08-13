import { FileConverter } from "@/converters/FileConverter";
import { AxiosInstanceFactory } from "@/factories/AxiosInstanceFactory";
import { IFile } from "@/interfaces/IFile";
import { IFileSearch } from "@/interfaces/IFileSearch";
import { IModelController } from "@/interfaces/IModelController";
import { IPagination } from "@/interfaces/IPagination";
import { IService } from "@/interfaces/IService";
import { AxiosStatic } from "axios";
import Compressor from "compressorjs";

export class FileService
  implements IService, IModelController<IFile, IFileSearch>
{
  fileConverter = new FileConverter();
  axiosInstance: AxiosStatic;
  constructor(axios: AxiosStatic | undefined) {
    this.axiosInstance = AxiosInstanceFactory.createAxiosInstance(axios);
  }

  checkIfFileIsTooBig(file: File | Blob) {
    return file.size > 2101546;
  }

  checkIfFileIsImage(file: File) {
    return file.type.includes("image");
  }

  checkIfFileIsDicom(file: File | string) {
    if (typeof file === "string") {
      const ext = file.split(".").pop()?.toLowerCase();
      return ext === "dcm" || ext === "dicom";
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    return (
      ext === "dcm" ||
      ext === "dicom" ||
      file.type.includes("dicom")
    );
  }

  compressFile(file: File) {
    var self = this;
    return new Promise<File | Blob>(function (final_resolve, final_reject) {
      if (self.checkIfFileIsDicom(file)) {
        final_resolve(file);
      } else if (!self.checkIfFileIsImage(file)) {
        final_resolve(file);
      } else if (self.checkIfFileIsTooBig(file)) {
        new Compressor(file, {
          quality: 0.7,
          maxWidth: 1024,
          maxHeight: 768,
          checkOrientation: false,
          success(result) {
            if (self.checkIfFileIsTooBig(result)) {
              final_reject("file is too big");
            } else {
              const newFile = result;
              final_resolve(newFile);
            }
          },
          error(err) {
            final_reject(err.message);
          },
        });
      } else {
        final_resolve(file);
      }
    });
  }

  uploadFile(file: File) {
    return new Promise<string>((resolve, reject) => {
      this.compressFile(file)
        .then((compressedFile: File | Blob) => {
          const formData = new FormData();
          formData.append("file", compressedFile, file.name);
          this.axiosInstance
            .post("api/files/upload", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response: any) => {
              resolve(response.data);
            })
            .catch((e: any) => {
              reject(e);
            });
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  getFileUrl(fileKey: string) {
    return (
      this.axiosInstance.defaults.baseURL +
      "api/files/get-by-key?key=" +
      fileKey
    );
  }

  downloadFileArrayBuffer(fileKey: string): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      this.axiosInstance
        .get("api/files/get-by-key?key=" + encodeURIComponent(fileKey), {
          responseType: "arraybuffer",
        })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  getPresignedUrl(fileKey: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.axiosInstance
        .get("api/files/get-presigned-url-by-key?key=" + fileKey)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Read(id: number) {
    return new Promise<IFile>((resolve, reject) => {
      this.axiosInstance
        .get("api/files/" + id)
        .then((response: any) => {
          const file = this.fileConverter.convert(response.data);
          resolve(file);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  ReadAll() {
    return new Promise<IFile[]>((resolve, reject) => {
      this.axiosInstance
        .get("api/files")
        .then((response: any) => {
          const files = this.fileConverter.convertMany(response.data);
          resolve(files);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Create(file: IFile) {
    return new Promise<IFile>((resolve, reject) => {
      this.axiosInstance
        .post("api/files", file)
        .then((response: any) => {
          const file = this.fileConverter.convert(response.data);
          resolve(file);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Update(file: IFile) {
    return new Promise<IFile>((resolve, reject) => {
      this.axiosInstance
        .put("api/files", file)
        .then((response: any) => {
          const file = this.fileConverter.convert(response.data);
          resolve(file);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      this.axiosInstance
        .delete("api/files/" + id)
        .then((response: any) => {
          resolve();
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Search(search: IFileSearch) {
    return new Promise<IPagination<IFile>>((resolve, reject) => {
      this.axiosInstance
        .post("api/files/search", search)
        .then((response: any) => {
          const pagination = response.data as IPagination<IFile>;
          pagination.data = this.fileConverter.convertMany(pagination.data);
          resolve(pagination);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }
}
