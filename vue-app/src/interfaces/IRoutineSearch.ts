import { ISearch } from "./ISearch";

export interface IRoutineSearch extends ISearch {
  horseId?: number;
  categories?: string[];
  sortBy?: string;
  sortOrder?: string;
}
