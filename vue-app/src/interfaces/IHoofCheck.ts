import { HoofCheckStatuses } from "@/enum/HoofCheckStates";

export interface IHoofCheck {
  frontLeft: HoofCheckStatuses;
  frontLeftTask: string;
  frontRight: HoofCheckStatuses;
  frontRightTask: string;
  backLeft: HoofCheckStatuses;
  backLeftTask: string;
  backRight: HoofCheckStatuses;
  backRightTask: string;
}
