export class LocalIDFactory {
  static createLocalID() {
    return "localID" + new Date().getTime();
  }
}
