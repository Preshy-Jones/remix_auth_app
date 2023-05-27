import { getSession } from "~/sessions";
import Api from "../api";

// export const apiWithToken = async (request: Request) => {
//   const session = await getSession(request.headers.get("Cookie"));
//   const token = session.get("token");
//   const api = new Api();
//   api.setToken(token);
//   return api;
// };


export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}