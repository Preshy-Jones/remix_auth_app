import axios from "axios";
import { METHOD } from "types/methods";
import { getSession } from "~/sessions";

export type LoginPayload = {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
};

const Api = class Api {
  baseURL: string;
  token: string | undefined;
  constructor() {
    this.baseURL = process.env.API_BASE_URL as string;
    this.token = "";
  }

  initializeInstance = () => {
    let baseURL = this.baseURL;
    console.log(baseURL);

    const instance = axios.create({
      baseURL,
      withCredentials: false,
    });

    instance.interceptors.request.use(
      (config: any) => {
        config.headers = {
          "Content-Type": "application/json",
        };
        return config;
      },
      (error: any) => {
        console.log(error);

        return Promise.reject(error);
      }
    );

    return instance;
  };

  publicRequest = (url: string, method: string, data: any) => {
    const instance = this.initializeInstance();
    return instance({
      url,
      method,
      data,
    });
  };

  loginUser = (payload: LoginPayload) => {
    const url = "/v1/auth/login";
    return this.publicRequest(url, "post", payload);
  };
  async setToken(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("credentials")?.token;
    this.token = token;
  }
  authClient = (url: string, method: string, data: any) => {
    const instance = this.initializeInstance();
    instance.interceptors.request.use(
      (config: any) => {
        // const token = getStorage(Constants.AUTH_TOKEN);
        config.headers = {
          Authorization: `Bearer ${this.token}`,
        };

        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    return instance({
      url,
      method,
      data,
    });
  };
  getTasks = () => {
    const url = "/tasks";
    return this.authClient(url, "get", {});
  };
};

export default Api;
