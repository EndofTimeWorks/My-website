import { MonitorPlay, RotateCcw, Settings2 } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

type BootPreference = "session" | "always";

interface BootSettingsProps {
    bootPreference: BootPreference;
    onPreferenceChange: (preference: BootPreference) => void;
    onReplay: () => void;
}

const BootSettings = ({
    bootPreference,
    onPreferenceChange,
    onReplay,
}: BootSettingsProps) => {
    const [open, setOpen] = useState(false);
    const bootSummary = bootPreference === "always" ? "Always" : "Once";

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="flex items-center gap-2 rounded-xl border border-accent-primary/20 bg-background-secondary/90 px-3 py-2 text-sm text-text-primary shadow-lg backdrop-blur transition-colors hover:border-accent-primary/35 hover:bg-background-secondary"
                aria-expanded={open}
                aria-haspopup="dialog"
            >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary/15 text-accent-primary">
                    <Settings2 size={15} />
                </span>
                <span className="font-medium">Settings</span>
                <span className="rounded-full bg-background-primary/70 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-text-primary/65">
                    {bootSummary}
                </span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-[240px] rounded-2xl border border-accent-primary/20 bg-background-secondary/95 p-3 text-sm text-text-primary shadow-2xl backdrop-blur">
                    <div className="mb-4 rounded-xl border border-accent-primary/15 bg-background-primary/30 p-3">
                        <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-text-primary/60">
                            Theme
                        </div>
                        <ThemeToggle className="compact w-full justify-start" />
                    </div>

                    <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-text-primary/60">
                        <MonitorPlay size={14} className="text-accent-primary" />
                        Boot
                    </div>

                    <div className="space-y-1.5">
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-transparent px-3 py-2 hover:border-accent-primary/20 hover:bg-background-primary/40">
                            <input
                                type="radio"
                                name="boot-preference"
                                checked={bootPreference === "session"}
                                onChange={() => onPreferenceChange("session")}
                                className="mt-1"
                            />
                            <span>
                                <span className="block font-medium">Once per session</span>
                            </span>
                        </label>

                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-transparent px-3 py-2 hover:border-accent-primary/20 hover:bg-background-primary/40">
                            <input
                                type="radio"
                                name="boot-preference"
                                checked={bootPreference === "always"}
                                onChange={() => onPreferenceChange("always")}
                                className="mt-1"
                            />
                            <span>
                                <span className="block font-medium">Every visit</span>
                            </span>
                        </label>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onReplay();
                        }}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-primary/15 px-4 py-2.5 font-medium text-accent-primary transition-colors hover:bg-accent-primary/25"
                    >
                        <RotateCcw size={14} />
                        Replay Boot
                    </button>
                </div>
            )}
        </div>
    );
};

export default BootSettings;
