import { HoofCheckStatuses } from "@/enum/HoofCheckStates";
import { IHoofCheck } from "@/interfaces/IHoofCheck";

export class HoofCheck implements IHoofCheck {
  frontLeft: HoofCheckStatuses;
  frontLeftTask: string;
  frontRight: HoofCheckStatuses;
  frontRightTask: string;
  backLeft: HoofCheckStatuses;
  backLeftTask: string;
  backRight: HoofCheckStatuses;
  backRightTask: string;

  constructor() {
    this.frontLeft = HoofCheckStatuses.Neutral;
    this.frontLeftTask = "";
    this.frontRight = HoofCheckStatuses.Neutral;
    this.frontRightTask = "";
    this.backLeft = HoofCheckStatuses.Neutral;
    this.backLeftTask = "";
    this.backRight = HoofCheckStatuses.Neutral;
    this.backRightTask = "";
  }
}
