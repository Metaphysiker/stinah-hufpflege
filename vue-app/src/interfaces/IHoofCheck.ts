import { HoofCheckStatuses } from "@/enum/HoofCheckStates";

export interface IHoofCheck {
  frontLeft: HoofCheckStatuses;
  frontRight: HoofCheckStatuses;
  backLeft: HoofCheckStatuses;
  backRight: HoofCheckStatuses;
}
