import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "@/context/AuthContext";
import type { AuthContextType, SystemState } from "@/context/authTypes";
import { systemMembers } from "@/context/systemMembers";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const stored = localStorage.getItem("isAuthenticated");
        return stored === "true";
    });

    const [username, setUsername] = useState<string | null>(() => {
        return localStorage.getItem("username");
    });

    const [systemState, setSystemState] = useState<SystemState | null>(() => {
        const stored = localStorage.getItem("systemState");
        if (stored && isAuthenticated) {
            return JSON.parse(stored);
        }

        return isAuthenticated
            ? {
                  safetyLevel: "safe",
                  mentalState: "ok",
                  frontingStatus: "single",
                  currentFronters: [systemMembers[0]],
              }
            : null;
    });

    useEffect(() => {
        localStorage.setItem("isAuthenticated", isAuthenticated.toString());
        if (username) {
            localStorage.setItem("username", username);
        } else {
            localStorage.removeItem("username");
        }
    }, [isAuthenticated, username]);

    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.removeItem("systemState");
        } else if (systemState) {
            localStorage.setItem("systemState", JSON.stringify(systemState));
        }
    }, [isAuthenticated, systemState]);

    const login = async (username: string, password: string) => {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const validCredentials = [{ user: "system", pass: "." }];

        const isValid = validCredentials.some(
            (cred) =>
                cred.user === username.toLowerCase() && cred.pass === password,
        );

        if (isValid) {
            setIsAuthenticated(true);
            setUsername(username);

            const initialState: SystemState = {
                safetyLevel: "safe",
                mentalState: "ok",
                frontingStatus: "single",
                currentFronters: [systemMembers[0]],
            };

            setSystemState(initialState);
            localStorage.setItem("systemState", JSON.stringify(initialState));

            return true;
        }

        return false;
    };

    const logout = () => {
        setTimeout(() => {
            setIsAuthenticated(false);
            setUsername(null);
            setSystemState(null);
            localStorage.removeItem("systemState");
        }, 300);
    };

    const updateSystemState = (newState: Partial<SystemState>) => {
        if (!systemState) return;

        const updatedState = { ...systemState, ...newState };
        setSystemState(updatedState);
        localStorage.setItem("systemState", JSON.stringify(updatedState));
    };

    const contextValue: AuthContextType = {
        isAuthenticated,
        username,
        systemState,
        login,
        logout,
        updateSystemState,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
