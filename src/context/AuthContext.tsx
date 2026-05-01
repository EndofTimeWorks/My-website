import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";

interface SystemMember {
    id: string;
    name: string;
    role: string;
    color?: string;
}

interface SystemState {
    safetyLevel: "safe" | "unsafe" | "sorta-safe" | "unknown";
    mentalState:
        | "ok"
        | "bad"
        | "very-bad"
        | "panic"
        | "spiraling"
        | "unstable"
        | "delusional";
    frontingStatus: "single" | "co-fronting" | "switching" | "unknown";
    currentFronters: SystemMember[];
}

interface AuthContextType {
    isAuthenticated: boolean;
    username: string | null;
    systemState: SystemState | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateSystemState: (newState: Partial<SystemState>) => void;
}

// System members data
const systemMembers: SystemMember[] = [
    { id: "1", name: "Aurora", role: "Host", color: "#9d4edd" },
    { id: "2", name: "Alex", role: "Younger", color: "#4ea8de" },
    { id: "3", name: "Psy", role: "Protector", color: "#5e548e" },
    { id: "4", name: "Xander", role: "Caretaker", color: "#219ebc" },
    { id: "5", name: "Unknown", role: "Fragment", color: "#6c757d" },
    { id: "6", name: "The thing", role: "Persecutor", color: "#e63946" },
    { id: "7", name: "Unknown 2", role: "Fragment", color: "#6c757d" },
];

// Creating the context with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const stored = sessionStorage.getItem("isAuthenticated");
        return stored === "true";
    });

    const [username, setUsername] = useState<string | null>(() => {
        return sessionStorage.getItem("username");
    });

    const [systemState, setSystemState] = useState<SystemState | null>(() => {
        const stored = sessionStorage.getItem("systemState");
        if (stored && isAuthenticated) {
            try {
                return JSON.parse(stored) as SystemState;
            } catch {
                sessionStorage.removeItem("systemState");
            }
        }

        return isAuthenticated
            ? {
                  safetyLevel: "safe",
                  mentalState: "ok",
                  frontingStatus: "single",
                  currentFronters: [systemMembers[0]], // Default to Aurora as fronter
              }
            : null;
    });

    useEffect(() => {
        sessionStorage.setItem("isAuthenticated", isAuthenticated.toString());
        if (username) {
            sessionStorage.setItem("username", username);
        } else {
            sessionStorage.removeItem("username");
        }
    }, [isAuthenticated, username]);

    useEffect(() => {
        if (!isAuthenticated) {
            sessionStorage.removeItem("systemState");
        } else if (systemState) {
            sessionStorage.setItem("systemState", JSON.stringify(systemState));
        }
    }, [isAuthenticated, systemState]);

    const login = async (username: string, password: string) => {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password }),
        });

        if (!response.ok) {
            return false;
        }

        const data = (await response.json()) as { success?: boolean };

        if (data.success) {
            setIsAuthenticated(true);
            setUsername(username);

            const initialState: SystemState = {
                safetyLevel: "safe",
                mentalState: "ok",
                frontingStatus: "single",
                currentFronters: [systemMembers[0]],
            };

            setSystemState(initialState);
            sessionStorage.setItem("systemState", JSON.stringify(initialState));

            return true;
        }

        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUsername(null);
        setSystemState(null);
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("systemState");
    };

    const updateSystemState = (newState: Partial<SystemState>) => {
        if (!systemState) return;

        const updatedState = { ...systemState, ...newState };
        setSystemState(updatedState);
        sessionStorage.setItem("systemState", JSON.stringify(updatedState));
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

// Custom hook for easier context consumption
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// Export system members data for use in other components
export { systemMembers };
