import axios from "axios"

axios.defaults.withCredentials = true
export const httpClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001/api/"
      : "http://diplom.wex-web.ru/api",
  withCredentials: true,
})
