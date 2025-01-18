import { AxiosStatic } from "axios";
import { AxiosInstanceFactory } from "../factories/AxiosInstanceFactory";
import { IService } from "@/interfaces/IService";
import { ITreatmentCategory } from "@/interfaces/ITreatmentCategory";

export class TreatmentCategoryService implements IService {
  axiosInstance: AxiosStatic;
  constructor(axios: AxiosStatic | undefined) {
    this.axiosInstance = AxiosInstanceFactory.createAxiosInstance(axios);
  }

  ReadAll() {
    return new Promise<ITreatmentCategory[]>((resolve, reject) => {
      this.axiosInstance
        .get("api/treatmentcategories")
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }
}
