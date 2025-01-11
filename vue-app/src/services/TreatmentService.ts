import { AxiosStatic } from "axios";
import { AxiosInstanceFactory } from "../factories/AxiosInstanceFactory";
import { ITreatment } from "@/interfaces/ITreatment";
import { TreatmentHelper } from "@/helpers/TreatmentHelper";
import { ITreatmentSearch } from "@/interfaces/ITreatmentSearch";
import { IModelController } from "@/interfaces/IModelController";

export class TreatmentService
  implements IModelController<ITreatment, ITreatmentSearch>
{
  treatmentHelper = new TreatmentHelper();
  axiosInstance: AxiosStatic;
  constructor(axios: AxiosStatic | undefined) {
    this.axiosInstance = AxiosInstanceFactory.createAxiosInstance(axios);
  }

  ReadAll() {
    return new Promise<ITreatment[]>((resolve, reject) => {
      this.axiosInstance
        .get("api/treatments")
        .then((response: any) => {
          const treatments = this.treatmentHelper.convertToTreatments(
            response.data
          );
          resolve(treatments);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Read(id: number) {
    return new Promise<ITreatment>((resolve, reject) => {
      this.axiosInstance
        .get("api/treatments/" + id)
        .then((response: any) => {
          const treatment = this.treatmentHelper.convertToTreatment(
            response.data
          );
          resolve(treatment);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Create(treatment: ITreatment) {
    return new Promise<ITreatment>((resolve, reject) => {
      this.axiosInstance
        .post("api/treatments", treatment)
        .then((response: any) => {
          const createdTreatment = this.treatmentHelper.convertToTreatment(
            response.data
          );
          resolve(createdTreatment);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Update(treatment: ITreatment) {
    return new Promise<ITreatment>((resolve, reject) => {
      this.axiosInstance
        .put("api/treatments", treatment)
        .then((response: any) => {
          const updatedTreatment = this.treatmentHelper.convertToTreatment(
            response.data
          );
          resolve(updatedTreatment);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      this.axiosInstance
        .delete("api/treatments/" + id)
        .then((response: any) => {
          resolve();
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Search(treatmentSearch: ITreatmentSearch) {
    return new Promise<ITreatment[]>((resolve, reject) => {
      this.axiosInstance
        .post("api/treatments/search", treatmentSearch)
        .then((response: any) => {
          const treatments = this.treatmentHelper.convertToTreatments(
            response.data
          );
          resolve(treatments);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }
}
