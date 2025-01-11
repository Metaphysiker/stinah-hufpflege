import { AxiosStatic } from "axios";
import { IDto } from "./IDto";
import { ISearch } from "./ISearch";

export interface IModelController<dto extends IDto, search extends ISearch> {
  axiosInstance: AxiosStatic;
  ReadAll(): Promise<dto[]>;
  Read(id: number): Promise<dto>;
  Create(dto: dto): Promise<dto>;
  Update(dto: dto): Promise<dto>;
  Delete(id: number): Promise<void>;
  Search(search: search): Promise<dto[]>;
}
