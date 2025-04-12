import { HoofCheckStatuses } from "@/enum/HoofCheckStates";
import { IHoofCheck } from "@/interfaces/IHoofCheck";

export class HoofCheck implements IHoofCheck {
  frontLeft: HoofCheckStatuses;
  frontRight: HoofCheckStatuses;
  backLeft: HoofCheckStatuses;
  backRight: HoofCheckStatuses;

  constructor() {
    this.frontLeft = HoofCheckStatuses.Neutral;
    this.frontRight = HoofCheckStatuses.Neutral;
    this.backLeft = HoofCheckStatuses.Neutral;
    this.backRight = HoofCheckStatuses.Neutral;
  }
}
