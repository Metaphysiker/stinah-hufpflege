import { AxiosStatic } from "axios";
import { AxiosInstanceFactory } from "../factories/AxiosInstanceFactory";
import { IHorse } from "../interfaces/IHorse";
import { Horse } from "../classes/Horse";
import { IHorseSearch } from "@/interfaces/IHorseSearch";
import { IModelController } from "@/interfaces/IModelController";

export class HorseService implements IModelController<IHorse, IHorseSearch> {
  horse: Horse = new Horse();
  axiosInstance: AxiosStatic;
  constructor(axios: AxiosStatic | undefined) {
    this.axiosInstance = AxiosInstanceFactory.createAxiosInstance(axios);
  }

  Read(id: number) {
    return new Promise<IHorse>((resolve, reject) => {
      this.axiosInstance
        .get("api/horses/" + id)
        .then((response: any) => {
          const horse = this.horse.convertToHorse(response.data);
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
          const horses = this.horse.convertToHorses(response.data);
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
          const horse = this.horse.convertToHorse(response.data);
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
          const horse = this.horse.convertToHorse(response.data);
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
    return new Promise<IHorse[]>((resolve, reject) => {
      this.axiosInstance
        .post("api/horses/search", search)
        .then((response: any) => {
          const horses = this.horse.convertToHorses(response.data);
          resolve(horses);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }
}
