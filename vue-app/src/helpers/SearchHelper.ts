import { ISearch } from "@/interfaces/ISearch";

export class SearchHelper {
  updateSearch(sortBy: any, search: ISearch): ISearch {
    console.log(sortBy);
    const firstSortBy = sortBy[0] as unknown as {
      key: string;
      order: string;
    };
    search.sortBy = this.capitalize(firstSortBy.key);
    search.sortOrder = this.getSortOrder(firstSortBy.order);
    return search;
  }

  capitalize = (s: string) =>
    s && String(s[0]).toUpperCase() + String(s).slice(1);

  getSortOrder(order: string): string {
    return order === "asc" ? "ascending" : "descending";
  }
}
