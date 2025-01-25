export interface IValidator<T> {
  validate(model: T): T;
}
