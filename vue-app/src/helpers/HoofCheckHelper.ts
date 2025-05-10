import { HoofCheck } from "@/classes/HoofCheck";
import { IHoofCheck } from "@/interfaces/IHoofCheck";

export class HoofCheckHelper {
  parseJson(input: string): IHoofCheck {
    const json = JSON.parse(input);
    const hoofCheck: IHoofCheck = new HoofCheck();

    if (json.frontLeft) {
      hoofCheck.frontLeft = json.frontLeft;
    }
    if (json.frontLeftTask) {
      hoofCheck.frontLeftTask = json.frontLeftTask;
    }
    if (json.frontRight) {
      hoofCheck.frontRight = json.frontRight;
    }
    if (json.frontRightTask) {
      hoofCheck.frontRightTask = json.frontRightTask;
    }
    if (json.backLeft) {
      hoofCheck.backLeft = json.backLeft;
    }
    if (json.backLeftTask) {
      hoofCheck.backLeftTask = json.backLeftTask;
    }
    if (json.backRight) {
      hoofCheck.backRight = json.backRight;
    }
    if (json.backRightTask) {
      hoofCheck.backRightTask = json.backRightTask;
    }
    return hoofCheck;
  }
}
