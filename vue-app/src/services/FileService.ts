import { AxiosInstanceFactory } from "@/factories/AxiosInstanceFactory";
import { IService } from "@/interfaces/IService";
import { AxiosStatic } from "axios";
import Compressor from "compressorjs";

export class FileService implements IService {
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

  compressFile(file: File) {
    var self = this;
    return new Promise<File | Blob>(function (final_resolve, final_reject) {
      if (!self.checkIfFileIsImage(file)) {
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
}
