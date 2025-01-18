import { AxiosStatic } from "axios";
import { AxiosInstanceFactory } from "../factories/AxiosInstanceFactory";
import { ITreatment } from "@/interfaces/ITreatment";
import { ITreatmentSearch } from "@/interfaces/ITreatmentSearch";
import { IModelController } from "@/interfaces/IModelController";
import { TreatmentConverter } from "@/converters/TreatmentConverter";
import { IPagination } from "@/interfaces/IPagination";

export class TreatmentService
  implements IModelController<ITreatment, ITreatmentSearch>
{
  treatmentConverter = new TreatmentConverter();
  axiosInstance: AxiosStatic;
  constructor(axios: AxiosStatic | undefined) {
    this.axiosInstance = AxiosInstanceFactory.createAxiosInstance(axios);
  }

  ReadAll() {
    return new Promise<ITreatment[]>((resolve, reject) => {
      this.axiosInstance
        .get("api/treatments")
        .then((response: any) => {
          const treatments = this.treatmentConverter.convertMany(response.data);
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
          const treatment = this.treatmentConverter.convert(response.data);
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
          const createdTreatment = this.treatmentConverter.convert(
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
          const updatedTreatment = this.treatmentConverter.convert(
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
    return new Promise<IPagination<ITreatment>>((resolve, reject) => {
      this.axiosInstance
        .post("api/treatments/search", treatmentSearch)
        .then((response: any) => {
          const pagination = response.data as IPagination<ITreatment>;
          pagination.data = this.treatmentConverter.convertMany(
            pagination.data
          );
          resolve(pagination);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }
}
