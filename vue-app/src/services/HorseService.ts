import { AxiosStatic } from "axios";
import { AxiosInstanceFactory } from "../factories/AxiosInstanceFactory";
import { IHorse } from "../interfaces/IHorse";
import { Horse } from "../classes/Horse";
import { IHorseSearch } from "@/interfaces/IHorseSearch";
import { IModelController } from "@/interfaces/IModelController";
import { HorseConverter } from "@/converters/HorseConverter";
import { IPagination } from "@/interfaces/IPagination";

export class HorseService implements IModelController<IHorse, IHorseSearch> {
  horse: Horse = new Horse();
  horseConverter = new HorseConverter();
  axiosInstance: AxiosStatic;
  constructor(axios: AxiosStatic | undefined) {
    this.axiosInstance = AxiosInstanceFactory.createAxiosInstance(axios);
  }

  Read(id: number) {
    return new Promise<IHorse>((resolve, reject) => {
      this.axiosInstance
        .get("api/horses/" + id)
        .then((response: any) => {
          const horse = this.horseConverter.convert(response.data);
          resolve(horse);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  ReadAll() {
    return new Promise<IHorse[]>((resolve, reject) => {
      this.axiosInstance
        .get("api/horses")
        .then((response: any) => {
          const horses = this.horseConverter.convertMany(response.data);
          resolve(horses);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Create(horse: IHorse) {
    return new Promise<IHorse>((resolve, reject) => {
      this.axiosInstance
        .post("api/horses", horse)
        .then((response: any) => {
          const horse = this.horseConverter.convert(response.data);
          resolve(horse);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Update(horse: IHorse) {
    return new Promise<IHorse>((resolve, reject) => {
      this.axiosInstance
        .put("api/horses", horse)
        .then((response: any) => {
          const horse = this.horseConverter.convert(response.data);
          resolve(horse);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      this.axiosInstance
        .delete("api/horses/" + id)
        .then((response: any) => {
          resolve();
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  Search(search: IHorseSearch) {
    return new Promise<IPagination<IHorse>>((resolve, reject) => {
      this.axiosInstance
        .post("api/horses/search", search)
        .then((response: any) => {
          const pagination = response.data as IPagination<IHorse>;
          pagination.data = this.horseConverter.convertMany(pagination.data);
          resolve(pagination);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }
}
