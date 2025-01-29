export class EnumHelper {
  getEnumKeyByEnumValue(myEnum: any, enumValue: any): string {
    const keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : "";
  }

  getEnumValues(myEnum: any): any[] {
    return Object.values(myEnum).filter((v) => isNaN(Number(v)));
  }
}
