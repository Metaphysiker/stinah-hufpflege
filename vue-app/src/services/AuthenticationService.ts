import { AxiosInstanceFactory } from "@/factories/AxiosInstanceFactory";
import { IAuthRequest } from "@/interfaces/IAuthRequest";
import { IAuthResponse } from "@/interfaces/IAuthResponse";
import { IService } from "@/interfaces/IService";
import { AxiosStatic } from "axios";

export class AuthenticationService implements IService {
  axiosInstance: AxiosStatic;
  constructor(axios: AxiosStatic | undefined) {
    this.axiosInstance = AxiosInstanceFactory.createAxiosInstance(axios);
  }

  login(authRequest: IAuthRequest) {
    return new Promise<IAuthResponse>((resolve, reject) => {
      this.axiosInstance
        .post("api/auth/login", authRequest)
        .then((response) => {
          resolve(response.data);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  isLoggedIn() {
    return new Promise<boolean>((resolve) => {
      this.axiosInstance
        .get("api/auth/is-logged-in")
        .then(() => {
          resolve(true);
        })
        .catch((e: any) => {
          resolve(false);
        });
    });
  }
}
