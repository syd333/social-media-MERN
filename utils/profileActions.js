import axios from "axios";
import catchErrors from "./catchErrors";
import cookie from "js-cookie";

export const Axios = axios.create({
  baseURL: "http://localhost:3000/api/profile",
  headers: { Authorization: cookie.get("token") },
});
