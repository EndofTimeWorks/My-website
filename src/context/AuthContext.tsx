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
    // Initialize authentication state from localStorage if available
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const stored = localStorage.getItem("isAuthenticated");
        return stored === "true";
    });

    const [username, setUsername] = useState<string | null>(() => {
        return localStorage.getItem("username");
    });

    // Initialize system state from localStorage or set defaults
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
                  currentFronters: [systemMembers[0]], // Default to Aurora as fronter
              }
            : null;
    });

    // Sync auth state to localStorage
    useEffect(() => {
        localStorage.setItem("isAuthenticated", isAuthenticated.toString());
        if (username) {
            localStorage.setItem("username", username);
        } else {
            localStorage.removeItem("username");
        }
    }, [isAuthenticated, username]);

    // Sync system state to localStorage
    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.removeItem("systemState");
        } else if (systemState) {
            localStorage.setItem("systemState", JSON.stringify(systemState));
        }
    }, [isAuthenticated, systemState]);

    const login = async (username: string, password: string) => {
        // For security, add a slight delay to prevent rapid brute force attempts
        await new Promise((resolve) => setTimeout(resolve, 800));

        // We use credential verification with multiple allowed passwords for different contexts
        const validCredentials = [{ user: "system", pass: "." }];

        const isValid = validCredentials.some(
            (cred) =>
                cred.user === username.toLowerCase() && cred.pass === password,
        );

        if (isValid) {
            setIsAuthenticated(true);
            setUsername(username);

            // Initialize system state on login
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
        // Add a short delay for better UX
        setTimeout(() => {
            setIsAuthenticated(false);
            setUsername(null);
            setSystemState(null);

            // Clear sensitive data from localStorage
            localStorage.removeItem("systemState");
        }, 300);
    };

    const updateSystemState = (newState: Partial<SystemState>) => {
        if (!systemState) return;

        const updatedState = { ...systemState, ...newState };
        setSystemState(updatedState);
        localStorage.setItem("systemState", JSON.stringify(updatedState));
    };

    // Construct the context value
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
