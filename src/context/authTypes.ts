export interface SystemMember {
    id: string;
    name: string;
    role: string;
    color?: string;
}

export interface SystemState {
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

export interface AuthContextType {
    isAuthenticated: boolean;
    username: string | null;
    systemState: SystemState | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateSystemState: (newState: Partial<SystemState>) => void;
}
