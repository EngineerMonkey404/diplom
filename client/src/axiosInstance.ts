import axios from "axios"

axios.defaults.withCredentials = true
export const httpClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001/api/"
      : "https://ibt-spb.ru/api/",
  withCredentials: true,
})
