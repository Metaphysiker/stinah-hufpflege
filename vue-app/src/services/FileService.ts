import { AxiosInstanceFactory } from "@/factories/AxiosInstanceFactory";
import { IService } from "@/interfaces/IService";
import { AxiosStatic } from "axios";

export class FileService implements IService {
  axiosInstance: AxiosStatic;
  constructor(axios: AxiosStatic | undefined) {
    this.axiosInstance = AxiosInstanceFactory.createAxiosInstance(axios);
  }

  uploadFile(file: File) {
    return new Promise<string>((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
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
