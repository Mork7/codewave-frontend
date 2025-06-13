import { createContext } from "react";

// API context to store our API connection to be used by all child components
const ENV = import.meta.env.VITE_MODE;
const API_HOST =
  ENV === "development"
    ? import.meta.env.VITE_DEV_HOST
    : import.meta.env.VITE_PROD_HOST;

const ApiContext = createContext();

// eslint-disable-next-line react/prop-types
export function ApiProvider({ children }) {
  return (
    <ApiContext.Provider value={{ API_HOST }}>{children}</ApiContext.Provider>
  );
}

export default ApiContext;
