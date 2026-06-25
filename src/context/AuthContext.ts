import { createContext } from "react";
import type { AuthContextType } from "@/context/authTypes";

export const AuthContext = createContext<AuthContextType | null>(null);
