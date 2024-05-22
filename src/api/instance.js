import axios from "axios";

export const instance = axios.create({
    baseURL: 'https://json-server-portfolio.vercel.app'
  });