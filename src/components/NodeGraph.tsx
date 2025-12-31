"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { experiences } from "@/lib/data";
import { cn } from "@/lib/utils";

interface NodePosition {
  x: number;
  y: number;
}

export default function NodeGraph() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({});

  // Calculate node positions based on container size
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(rect.width, rect.height) * 0.35;

      const positions: Record<string, NodePosition> = {};
      experiences.forEach((exp, index) => {
        const angle = (index * (2 * Math.PI)) / experiences.length - Math.PI / 2;
        positions[exp.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        };
      });
      
      setNodePositions(positions);
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);
    return () => window.removeEventListener("resize", updatePositions);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "fulltime":
        return "#22d3ee";
      case "internship":
        return "#a78bfa";
      case "teaching":
        return "#4ade80";
      default:
        return "#22d3ee";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "fulltime":
        return "Full-time";
      case "internship":
        return "Internship";
      case "teaching":
        return "Teaching";
      default:
        return type;
    }
  };

  return (
    <section id="architecture" className="relative py-32 overflow-hidden w-full">
      {/* Background */}
      <div className="absolute inset-0 bg-cyber-black">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-black via-transparent to-cyber-black" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyber-accent" />
            <span className="font-mono text-sm text-cyber-accent uppercase tracking-widest">
              System Architecture
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyber-accent" />
          </div>
          <h2 className="font-mono text-4xl md:text-5xl font-bold text-cyber-white mb-4">
            Experience <span className="text-cyber-accent">Timeline</span>
          </h2>
          <p className="text-cyber-light max-w-2xl mx-auto">
            Navigate through my professional journey. Click on nodes to explore
            detailed information about each role.
          </p>
        </motion.div>

        {/* Node Graph Container */}
        <div
          ref={containerRef}
          className="relative h-[600px] md:h-[700px] mx-auto max-w-4xl"
        >
          {/* SVG for connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* Draw connections between nodes */}
            {Object.keys(nodePositions).length > 0 &&
              experiences.map((exp, index) => {
                const nextExp = experiences[(index + 1) % experiences.length];
                const start = nodePositions[exp.id];
                const end = nodePositions[nextExp.id];
                if (!start || !end) return null;

                return (
                  <motion.line
                    key={`line-${exp.id}-${nextExp.id}`}
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke="url(#lineGradient)"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 0.3 } : {}}
                    transition={{ duration: 1.5, delay: index * 0.2 }}
                  />
                );
              })}

            {/* Central hub */}
            {Object.keys(nodePositions).length > 0 && (
              <>
                {experiences.map((exp, index) => {
                  const pos = nodePositions[exp.id];
                  if (!pos) return null;
                  const centerX = containerRef.current?.getBoundingClientRect().width! / 2;
                  const centerY = containerRef.current?.getBoundingClientRect().height! / 2;

                  return (
                    <motion.line
                      key={`hub-${exp.id}`}
                      x1={centerX}
                      y1={centerY}
                      x2={pos.x}
                      y2={pos.y}
                      stroke="#22d3ee"
                      strokeWidth="1"
                      strokeOpacity="0.15"
                      initial={{ pathLength: 0 }}
                      animate={isInView ? { pathLength: 1 } : {}}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  );
                })}
              </>
            )}
          </svg>

          {/* Central Hub Node */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative">
              <motion.div
                className="w-20 h-20 rounded-full bg-cyber-darker border-2 border-cyber-accent/50 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(34, 211, 238, 0.3)",
                    "0 0 40px rgba(34, 211, 238, 0.5)",
                    "0 0 20px rgba(34, 211, 238, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="font-mono text-2xl text-cyber-accent">◈</span>
              </motion.div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="font-mono text-xs text-cyber-muted">
                  CORE_SYSTEM
                </span>
              </div>
            </div>
          </motion.div>

          {/* Experience Nodes */}
          {Object.keys(nodePositions).length > 0 &&
            experiences.map((exp, index) => {
              const pos = nodePositions[exp.id];
              if (!pos) return null;
              const isActive = activeNode === exp.id;
              const isHovered = hoveredNode === exp.id;
              const colorClass = getTypeColor(exp.type);

              return (
                <motion.div
                  key={exp.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                  style={{ left: pos.x, top: pos.y }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                  onMouseEnter={() => setHoveredNode(exp.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setActiveNode(isActive ? null : exp.id)}
                >
                  {/* Node */}
                  <motion.div
                    className={cn(
                      "relative w-16 h-16 md:w-20 md:h-20 rounded-xl",
                      "bg-cyber-darker border-2 transition-all duration-300",
                      "flex items-center justify-center",
                      isActive || isHovered
                        ? "glow-accent"
                        : "border-cyber-gray/50"
                    )}
                    style={{
                      borderColor: isActive || isHovered ? colorClass : undefined,
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={
                      isActive
                        ? {
                            borderColor: colorClass,
                            boxShadow: `0 0 30px ${colorClass}80`,
                          }
                        : {}
                    }
                  >
                    {/* Pulse effect */}
                    {(isActive || isHovered) && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{ backgroundColor: `${colorClass}33` }}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}

                    {/* Icon based on type */}
                    <span className="text-2xl" style={{ color: colorClass }}>
                      {exp.type === "fulltime" && "◆"}
                      {exp.type === "internship" && "◇"}
                      {exp.type === "teaching" && "○"}
                    </span>
                  </motion.div>

                  {/* Label */}
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                    <div className="font-mono text-xs text-cyber-white truncate max-w-[120px]">
                      {exp.company}
                    </div>
                    <div className="font-mono text-[10px] text-cyber-muted">
                      {exp.period.split(" - ")[0]}
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>

        {/* Data Card */}
        <AnimatePresence>
          {activeNode && (
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 30, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 30, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              {experiences
                .filter((exp) => exp.id === activeNode)
                .map((exp) => (
                  <div
                    key={exp.id}
                    className="max-w-3xl mx-auto bg-cyber-darker border border-cyber-gray/30 rounded-xl overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="px-6 py-4 border-b border-cyber-gray/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="px-3 py-1 rounded-full text-xs font-mono"
                          style={{
                            backgroundColor: `${getTypeColor(exp.type)}33`,
                            color: getTypeColor(exp.type),
                          }}
                        >
                          {getTypeLabel(exp.type)}
                        </div>
                        <span className="text-cyber-muted text-sm">
                          {exp.period}
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveNode(null)}
                        className="text-cyber-muted hover:text-cyber-white transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="font-mono text-2xl text-cyber-white mb-1">
                        {exp.company}
                      </h3>
                      <p className="text-cyber-accent font-mono mb-4">
                        {exp.role}
                      </p>
                      <p className="text-cyber-light mb-6">{exp.description}</p>

                      {/* Highlights */}
                      <div className="mb-6">
                        <h4 className="font-mono text-sm text-cyber-muted uppercase tracking-wider mb-3">
                          Key Highlights
                        </h4>
                        <div className="grid gap-2">
                          {exp.highlights.map((highlight, i) => (
                            <motion.div
                              key={i}
                              className="flex items-center gap-3 text-cyber-light"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <span className="text-cyber-accent text-xs">▹</span>
                              <span className="text-sm">{highlight}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h4 className="font-mono text-sm text-cyber-muted uppercase tracking-wider mb-3">
                          Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, i) => (
                            <motion.span
                              key={tech}
                              className="px-3 py-1 bg-cyber-gray/30 rounded-full text-xs font-mono text-cyber-light"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <motion.div
          className="flex items-center justify-center gap-8 mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-cyber-accent">◆</span>
            <span className="font-mono text-xs text-cyber-muted">Full-time</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyber-accent2">◇</span>
            <span className="font-mono text-xs text-cyber-muted">Internship</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyber-success">○</span>
            <span className="font-mono text-xs text-cyber-muted">Teaching</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
