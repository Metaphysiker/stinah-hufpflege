import { IEntityWithIdentity } from "./IEntityWithIdentity";
import { IEntityWithValidation } from "./IEntityWithValidation";

export interface IModel extends IEntityWithIdentity, IEntityWithValidation {
  name: string;
}
