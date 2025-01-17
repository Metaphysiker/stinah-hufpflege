import type { IEntityWithIdentity } from "@/interfaces/IEntityWithIdentity";

export class IdentityFinder {
  isSame<T extends IEntityWithIdentity>(entity1: T, entity2: T) {
    if (entity1.id && entity2.id) {
      return entity1.id === entity2.id;
    }

    if (entity1.localID && entity2.localID) {
      return entity1.localID === entity2.localID;
    }
    return false;
  }

  findByIdOrLocalID<T extends IEntityWithIdentity>(
    entitiesToBeSearched: T[],
    id: number | string | undefined,
    localID: string | undefined
  ): T | undefined {
    if (id) {
      const resultById = entitiesToBeSearched.find(
        (entity) => entity.id === id
      );
      if (resultById) {
        return resultById;
      }
    }

    if (localID) {
      const resultByLocalID = entitiesToBeSearched.find(
        (entity) => entity.localID === localID
      );
      if (resultByLocalID) {
        return resultByLocalID;
      }
    }

    return undefined;
  }
}
