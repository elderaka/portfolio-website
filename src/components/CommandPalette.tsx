"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function CommandPalette() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Floating Command Button */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.button
          className={cn(
            "relative group flex items-center gap-3 px-6 py-3",
            "bg-cyber-darker/80 backdrop-blur-xl",
            "border border-cyber-gray/50 rounded-full",
            "hover:border-cyber-accent/50 transition-all duration-300",
            "shadow-lg shadow-black/20"
          )}
          onHoverStart={() => setIsExpanded(true)}
          onHoverEnd={() => setIsExpanded(false)}
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyber-accent/10 to-cyber-accent2/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />

          {/* Command icon */}
          <div className="relative flex items-center justify-center w-6 h-6">
            <motion.span
              className="absolute text-cyber-accent font-mono text-sm"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⌘
            </motion.span>
          </div>

          {/* Collapsed state */}
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <motion.span
                key="collapsed"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-mono text-sm text-cyber-light whitespace-nowrap overflow-hidden"
              >
                Navigate
              </motion.span>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center gap-4 overflow-hidden"
              >
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1 rounded-md",
                      "text-cyber-light hover:text-cyber-accent",
                      "hover:bg-cyber-accent/10 transition-all duration-200",
                      "font-mono text-xs uppercase tracking-wider whitespace-nowrap"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavClick(item.href);
                    }}
                    onMouseEnter={() => setActiveItem(item.id)}
                    onMouseLeave={() => setActiveItem(null)}
                    whileHover={{ y: -2 }}
                  >
                    <span className="text-cyber-accent">{item.icon}</span>
                    <span>{item.codeName}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keyboard hint */}
          <div className="flex items-center gap-1 ml-2 pl-3 border-l border-cyber-gray/30">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-cyber-gray/50 rounded text-cyber-muted">
              ⌘
            </kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-cyber-gray/50 rounded text-cyber-muted">
              K
            </kbd>
          </div>
        </motion.button>
      </motion.div>

      {/* Full Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-cyber-black/80 backdrop-blur-sm z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-lg"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="bg-cyber-darker border border-cyber-gray/50 rounded-xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="px-4 py-3 border-b border-cyber-gray/30 flex items-center gap-3">
                  <div className="flex items-center gap-2 text-cyber-muted">
                    <span className="text-cyber-accent">❯</span>
                    <span className="font-mono text-sm">navigation://</span>
                  </div>
                  <div className="flex-1" />
                  <kbd className="px-2 py-1 text-xs font-mono bg-cyber-gray/30 rounded text-cyber-muted">
                    ESC
                  </kbd>
                </div>

                {/* Navigation Items */}
                <div className="p-2">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      className={cn(
                        "w-full flex items-center gap-4 px-4 py-4 rounded-lg",
                        "text-left transition-all duration-200",
                        "hover:bg-cyber-accent/10 group"
                      )}
                      onClick={() => handleNavClick(item.href)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyber-gray/30 text-cyber-accent group-hover:bg-cyber-accent/20 transition-colors">
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-mono text-sm text-cyber-white group-hover:text-cyber-accent transition-colors">
                          {item.codeName}
                        </div>
                        <div className="text-xs text-cyber-muted">
                          {item.label}
                        </div>
                      </div>
                      <div className="text-cyber-muted group-hover:text-cyber-accent transition-colors">
                        →
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-cyber-gray/30 flex items-center justify-between text-xs text-cyber-muted">
                  <span className="font-mono">
                    <span className="text-cyber-accent">4</span> destinations
                    available
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-cyber-gray/30 rounded">
                        ↑↓
                      </kbd>
                      navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-cyber-gray/30 rounded">
                        ↵
                      </kbd>
                      select
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
