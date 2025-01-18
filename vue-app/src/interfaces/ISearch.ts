export interface ISearch {
  page: number;
  pageSize: number;
  ids?: number[];
  sortBy?: string;
  sortOrder?: string;
}
