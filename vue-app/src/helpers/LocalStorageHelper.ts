import { IUser } from "@/interfaces/IUser";

export class LocalStorageHelper {
  setCurrentUser(currentUser: IUser) {
    localStorage.setItem("current_user", JSON.stringify(currentUser));
  }

  getCurrentUser(): IUser | null {
    var item = localStorage.getItem("current_user");
    console.log(item);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  }
}
