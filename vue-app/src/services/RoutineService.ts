import { AxiosStatic } from "axios";
import { AxiosInstanceFactory } from "../factories/AxiosInstanceFactory";
import { IModelController } from "@/interfaces/IModelController";
import { IPagination } from "@/interfaces/IPagination";
import { IRoutine } from "@/interfaces/IRoutine";
import { IRoutineSearch } from "@/interfaces/IRoutineSearch";
import { RoutineConverter } from "@/converters/RoutineConverter";

export class RoutineService
  implements IModelController<IRoutine, IRoutineSearch>
{
  routineConverter = new RoutineConverter();
  axiosInstance: AxiosStatic;
  constructor(axios: AxiosStatic | undefined) {
    this.axiosInstance = AxiosInstanceFactory.createAxiosInstance(axios);
  }

  ReadAll() {
    return new Promise<IRoutine[]>((resolve, reject) => {
      this.axiosInstance
        .get("api/routines")
        .then((response: any) => {
          const routines = this.routineConverter.convertMany(response.data);
          resolve(routines);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Read(id: number) {
    return new Promise<IRoutine>((resolve, reject) => {
      this.axiosInstance
        .get("api/routines/" + id)
        .then((response: any) => {
          const routine = this.routineConverter.convert(response.data);
          resolve(routine);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Create(treatment: IRoutine) {
    return new Promise<IRoutine>((resolve, reject) => {
      this.axiosInstance
        .post("api/routines", treatment)
        .then((response: any) => {
          const createdRoutine = this.routineConverter.convert(
            response.data
          );
          resolve(createdRoutine);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Update(treatment: IRoutine) {
    return new Promise<IRoutine>((resolve, reject) => {
      this.axiosInstance
        .put("api/routines", treatment)
        .then((response: any) => {
          const updatedRoutine = this.routineConverter.convert(
            response.data
          );
          resolve(updatedRoutine);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      this.axiosInstance
        .delete("api/routines/" + id)
        .then((response: any) => {
          resolve();
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Search(treatmentSearch: IRoutineSearch) {
    return new Promise<IPagination<IRoutine>>((resolve, reject) => {
      this.axiosInstance
        .post("api/routines/search", treatmentSearch)
        .then((response: any) => {
          const pagination = response.data as IPagination<IRoutine>;
          pagination.data = this.routineConverter.convertMany(
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
