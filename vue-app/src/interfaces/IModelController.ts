import { AxiosStatic } from "axios";
import { ISearch } from "./ISearch";
import { IModel } from "./IModel";

export interface IModelController<dto extends IModel, search extends ISearch> {
  axiosInstance: AxiosStatic;
  ReadAll(): Promise<dto[]>;
  Read(id: number): Promise<dto>;
  Create(dto: dto): Promise<dto>;
  Update(dto: dto): Promise<dto>;
  Delete(id: number): Promise<void>;
  Search(search: search): Promise<dto[]>;
}
