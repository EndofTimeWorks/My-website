import {
    FormEvent,
    KeyboardEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Terminal } from "lucide-react";
import "@/styles/MiniTerminal.css";

type TerminalLine = {
    id: number;
    kind: "system" | "input" | "output" | "error";
    text: string;
};

const bootLines = ["foxterm 0.3.7", "motd: type help if you get lost"];

const commandNames = [
    "help",
    "about",
    "ls",
    "projects",
    "links",
    "skills",
    "theme",
    "whoami",
    "date",
    "clear",
];

const MiniTerminal = () => {
    const [lines, setLines] = useState<TerminalLine[]>(() =>
        bootLines.map((text, index) => ({
            id: index,
            kind: "system",
            text,
        })),
    );
    const [value, setValue] = useState("");
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const [nextId, setNextId] = useState(bootLines.length);
    const inputRef = useRef<HTMLInputElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);

    const commands = useMemo<Record<string, () => string[]>>(
        () => ({
            help: () => ["available commands:", `  ${commandNames.join("  ")}`],
            about: () => [
                "End / they-them",
                "writes code, breaks hardware, streams sometimes",
            ],
            ls: () => ["about.txt", "projects/", "links/", "music.now"],
            projects: () => [
                "cd /projects",
                "recent: web stuff, game experiments, robotics, school builds",
            ],
            links: () => [
                "twitch: twitch.tv/EndofTimee",
                "github: github.com/EndofTimee",
            ],
            skills: () => [
                "typescript  react  linux  robotics  cybersecurity",
                "also: taking things apart to see why they worked",
            ],
            theme: () => ["term: dark, amber, green", "theme daemon says: yip"],
            whoami: () => ["visitor@endos"],
            date: () => [new Date().toLocaleString()],
        }),
        [],
    );

    useEffect(() => {
        outputRef.current?.scrollTo({
            top: outputRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [lines]);

    const appendLines = (newLines: Omit<TerminalLine, "id">[]) => {
        setLines((current) => [
            ...current,
            ...newLines.map((line, index) => ({
                ...line,
                id: nextId + index,
            })),
        ]);
        setNextId((current) => current + newLines.length);
    };

    const runCommand = (rawCommand: string) => {
        const command = rawCommand.trim();
        if (!command) return;

        setHistory((current) =>
            [command, ...current.filter((item) => item !== command)].slice(
                0,
                12,
            ),
        );
        setHistoryIndex(null);

        if (command === "clear") {
            setLines([]);
            return;
        }

        const commandOutput = commands[command.toLowerCase()];

        appendLines([
            { kind: "input", text: command },
            ...(commandOutput
                ? commandOutput().map((text) => ({
                      kind: "output" as const,
                      text,
                  }))
                : [
                      {
                          kind: "error" as const,
                          text: `command not found: ${command}`,
                      },
                      {
                          kind: "output" as const,
                          text: "run help for available commands",
                      },
                  ]),
        ]);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        runCommand(value);
        setValue("");
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            event.preventDefault();
            const nextIndex =
                historyIndex === null
                    ? 0
                    : Math.min(historyIndex + 1, history.length - 1);
            setHistoryIndex(nextIndex);
            setValue(history[nextIndex] ?? "");
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            if (historyIndex === null) return;

            const nextIndex = historyIndex - 1;
            if (nextIndex < 0) {
                setHistoryIndex(null);
                setValue("");
                return;
            }

            setHistoryIndex(nextIndex);
            setValue(history[nextIndex] ?? "");
        }

        if (event.key === "Tab") {
            event.preventDefault();
            const match = commandNames.find((command) =>
                command.startsWith(value.toLowerCase()),
            );
            if (match) setValue(match);
        }
    };

    return (
        <section
            className="mini-terminal"
            aria-label="Mini terminal"
            onClick={() => inputRef.current?.focus()}
        >
            <div className="mini-terminal__titlebar">
                <div className="mini-terminal__controls" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                </div>
                <div className="mini-terminal__title">
                    <Terminal size={16} />
                    <span>endOS:/home/end</span>
                </div>
                <div className="mini-terminal__status">tty1</div>
            </div>

            <div className="mini-terminal__screen" ref={outputRef}>
                {lines.map((line) => (
                    <div
                        className={`mini-terminal__line mini-terminal__line--${line.kind}`}
                        key={line.id}
                    >
                        {line.kind === "input" && (
                            <span className="mini-terminal__prompt">
                                end@site:~$
                            </span>
                        )}
                        <span>{line.text}</span>
                    </div>
                ))}

                <form className="mini-terminal__form" onSubmit={handleSubmit}>
                    <label className="sr-only" htmlFor="mini-terminal-input">
                        Terminal command
                    </label>
                    <span className="mini-terminal__prompt">end@site:~$</span>
                    <input
                        autoComplete="off"
                        id="mini-terminal-input"
                        onChange={(event) => setValue(event.target.value)}
                        onKeyDown={handleKeyDown}
                        ref={inputRef}
                        spellCheck={false}
                        value={value}
                    />
                </form>
            </div>
        </section>
    );
};

export default MiniTerminal;
