import { ISearch } from "./ISearch";

export interface ITreatmentSearch extends ISearch {
  horseId?: number;
  categories?: string[];
  sortBy?: string;
  sortOrder?: string;
}
