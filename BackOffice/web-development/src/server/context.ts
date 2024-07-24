import {deserializeUser} from "./auth-middleware";

export const createContext = async () => deserializeUser();

export type Context = Awaited<typeof createContext>;