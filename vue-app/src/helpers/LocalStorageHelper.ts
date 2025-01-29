import { IUser } from "@/interfaces/IUser";

export class LocalStorageHelper {
  setCurrentUser(currentUser: IUser) {
    localStorage.setItem("current_user", JSON.stringify(currentUser));
  }

  clearCurrentUser() {
    localStorage.removeItem("current_user");
  }

  getCurrentUser(): IUser | null {
    var item = localStorage.getItem("current_user");
    if (item) {
      return JSON.parse(item);
    }
    return null;
  }
}
