import { HoofCheckStatuses } from "@/enum/HoofCheckStates";
import { ISearch } from "./ISearch";

export interface IHorseSearch extends ISearch {
  onlyWithHoofCheckStatus?: HoofCheckStatuses;
}
