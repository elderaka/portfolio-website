"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { terminalCommands, personalInfo } from "@/lib/data";
import { cn } from "@/lib/utils";

interface TerminalLine {
  id: number;
  type: "input" | "output" | "error" | "system";
  content: string;
}

export default function TerminalFooter() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 0,
      type: "system",
      content: `Portfolio Terminal v2.0.25 | Type 'help' for available commands`,
    },
  ]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isGlitching, setIsGlitching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const lineIdRef = useRef(1);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = useCallback(
    (type: TerminalLine["type"], content: string) => {
      const newLine: TerminalLine = {
        id: lineIdRef.current++,
        type,
        content,
      };
      setLines((prev) => [...prev, newLine]);
    },
    []
  );

  const handleCommand = useCallback(
    (cmd: string) => {
      const trimmedCmd = cmd.trim().toLowerCase();

      // Add input line
      addLine("input", cmd);

      // Add to history
      setCommandHistory((prev) => [...prev, cmd]);
      setHistoryIndex(-1);

      // Find command
      const command = terminalCommands.find(
        (c) => c.command === trimmedCmd
      );

      if (!command) {
        addLine(
          "error",
          `Command not found: ${trimmedCmd}. Type 'help' for available commands.`
        );
        return;
      }

      // Handle special commands
      if (command.command === "sudo") {
        setIsGlitching(true);
        setTimeout(() => {
          addLine("error", "⚠️ ACCESS DENIED ⚠️");
          addLine("error", "Unauthorized access attempt logged.");
          addLine("system", "Nice try. 😏");
          setIsGlitching(false);
        }, 500);
        return;
      }

      if (command.command === "clear") {
        setLines([
          {
            id: lineIdRef.current++,
            type: "system",
            content: "Terminal cleared.",
          },
        ]);
        return;
      }

      // Output response
      if (typeof command.response === "string") {
        command.response.split("\n").forEach((line) => {
          addLine("output", line);
        });
      } else {
        addLine("output", JSON.stringify(command.response, null, 2));
      }
    },
    [addLine]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "input":
        return "text-cyber-white";
      case "output":
        return "text-cyber-accent";
      case "error":
        return "text-cyber-error";
      case "system":
        return "text-cyber-muted";
      default:
        return "text-cyber-light";
    }
  };

  return (
    <footer id="synapse" className="relative py-16 bg-cyber-black w-full">
      <div className="w-full max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyber-accent" />
            <span className="font-mono text-sm text-cyber-accent uppercase tracking-widest">
              Synapse Interface
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyber-accent" />
          </div>
          <h2 className="font-mono text-4xl md:text-5xl font-bold text-cyber-white mb-4">
            Initialize <span className="text-cyber-accent">Contact</span>
          </h2>
          <p className="text-cyber-light max-w-xl mx-auto">
            Interact with the terminal below or reach out directly.
          </p>
        </motion.div>

        {/* Terminal */}
        <motion.div
          className={cn(
            "relative rounded-xl overflow-hidden",
            "bg-cyber-darker border border-cyber-gray/30",
            "shadow-2xl",
            isGlitching && "glitch"
          )}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-cyber-dark border-b border-cyber-gray/30">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-cyber-error/80" />
              <div className="w-3 h-3 rounded-full bg-cyber-warning/80" />
              <div className="w-3 h-3 rounded-full bg-cyber-success/80" />
            </div>
            <div className="flex-1 text-center">
              <span className="font-mono text-xs text-cyber-muted">
                lauda@portfolio:~
              </span>
            </div>
            <div className="w-12" />
          </div>

          {/* Terminal Content */}
          <div
            ref={terminalRef}
            className="h-80 overflow-y-auto p-4 terminal-text"
            onClick={() => inputRef.current?.focus()}
          >
            <AnimatePresence>
              {lines.map((line) => (
                <motion.div
                  key={line.id}
                  className={cn("mb-1", getLineColor(line.type))}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {line.type === "input" && (
                    <span className="text-cyber-accent mr-2">❯</span>
                  )}
                  <span className="whitespace-pre-wrap">{line.content}</span>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Input Line */}
            <form onSubmit={handleSubmit} className="flex items-center">
              <span className="text-cyber-accent mr-2">❯</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-cyber-white font-mono"
                placeholder="Type a command..."
                autoComplete="off"
                spellCheck={false}
              />
              <motion.span
                className="w-2 h-5 bg-cyber-accent ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </form>
          </div>

          {/* Hint */}
          <div className="px-4 py-2 border-t border-cyber-gray/30 bg-cyber-dark/50">
            <div className="flex items-center justify-between text-xs font-mono text-cyber-muted">
              <span>
                Try:{" "}
                <code className="text-cyber-accent">help</code>,{" "}
                <code className="text-cyber-accent">skills</code>,{" "}
                <code className="text-cyber-accent">contact</code>
              </span>
              <span className="hidden sm:block">
                ↑↓ history • enter execute
              </span>
            </div>
          </div>

          {/* Glitch overlay */}
          {isGlitching && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-cyber-error/10 animate-pulse" />
              <div className="absolute top-0 left-0 right-0 h-px bg-cyber-error animate-scan" />
            </div>
          )}
        </motion.div>

        {/* Direct Contact */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-cyber-muted mb-4 font-mono text-sm">
            Or reach out directly:
          </p>
          <div className="flex items-center justify-center gap-6">
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-cyber-light hover:text-cyber-accent transition-colors font-mono text-sm"
            >
              {personalInfo.email}
            </a>
            <span className="text-cyber-gray">|</span>
            <a
              href={personalInfo.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-light hover:text-cyber-accent transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href={personalInfo.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-light hover:text-cyber-accent transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Footer Bottom */}
        <motion.div
          className="mt-16 pt-8 border-t border-cyber-gray/20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-xs text-cyber-muted">
            <span className="text-cyber-accent">©</span> 2025 {personalInfo.name}.{" "}
            <span className="text-cyber-accent">Architected</span> with precision.
          </p>
          <p className="font-mono text-[10px] text-cyber-gray mt-2">
            Next.js • Three.js • Framer Motion • TypeScript
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
