export class LocalStorageHelper {
  setJWTToken(jwt_token: string) {
    localStorage.setItem("jwt_token", jwt_token);
  }

  getJWTToken() {
    return localStorage.getItem("jwt_token");
  }
}
