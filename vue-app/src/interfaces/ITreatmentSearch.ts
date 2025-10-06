import { ISearch } from "./ISearch";

export interface ITreatmentSearch extends ISearch {
  horseId?: number;
  categories?: string[];
  subCategories?: string[];
  sortBy?: string;
  sortOrder?: string;
}
