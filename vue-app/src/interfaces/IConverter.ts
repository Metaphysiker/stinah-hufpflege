export interface IConverter<T> {
  convert(input: any): T;
  convertMany(input: any): T[];
}
