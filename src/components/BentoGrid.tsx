"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { projects, type Project } from "@/lib/data";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index: number;
  size?: "large" | "medium" | "small";
}

function ProjectCard({ project, index, size = "medium" }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const getCategoryColor = (category: Project["category"]) => {
    switch (category) {
      case "ai-agents":
        return "#22d3ee";
      case "game-dev":
        return "#a78bfa";
      case "web":
        return "#4ade80";
      default:
        return "#fbbf24";
    }
  };

  const getCategoryLabel = (category: Project["category"]) => {
    switch (category) {
      case "ai-agents":
        return "AI & Agents";
      case "game-dev":
        return "Game Dev";
      case "web":
        return "Web";
      default:
        return "Other";
    }
  };

  const sizeStyles = {
    large: { gridColumn: 'span 1', minHeight: '400px' },
    medium: { gridColumn: 'span 1', minHeight: '350px' },
    small: { gridColumn: 'span 1', minHeight: '280px' },
  };

  const colorClass = getCategoryColor(project.category);

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer bento-item"
      style={{
        perspective: 1000,
        ...sizeStyles[size],
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-full min-h-[280px] rounded-2xl overflow-hidden"
        style={{
          backgroundColor: '#0d0d0f',
          border: '1px solid rgba(39, 39, 42, 0.3)',
          transition: 'all 0.3s',
          borderColor: isHovered ? 'rgba(34, 211, 238, 0.5)' : 'rgba(39, 39, 42, 0.3)',
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          maxWidth: '100%',
        }}
      >
        {/* Gradient background */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            "bg-gradient-to-br from-cyber-accent/5 via-transparent to-cyber-accent2/5"
          )}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-bg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

        {/* Content */}
        <div className="relative z-10 h-full p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="px-3 py-1 rounded-full text-xs font-mono"
              style={{
                backgroundColor: `${colorClass}33`,
                color: colorClass,
              }}
            >
              {getCategoryLabel(project.category)}
            </div>
            {project.featured && (
              <motion.div
                className="w-2 h-2 rounded-full bg-cyber-success"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>

          {/* Title & Description */}
          <div className="flex-1">
            <h3 className="font-mono text-xl md:text-2xl text-cyber-white mb-2 group-hover:text-cyber-accent transition-colors">
              {project.title}
            </h3>
            <p className="text-cyber-light text-sm mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Highlights - visible on hover for larger cards */}
            {size !== "small" && (
              <motion.div
                className={cn(
                  "space-y-2 overflow-hidden",
                  isHovered ? "max-h-40" : "max-h-0"
                )}
                animate={{ maxHeight: isHovered ? 160 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {project.highlights.slice(0, 3).map((highlight, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2 text-xs text-cyber-light"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isHovered ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="text-cyber-accent">▹</span>
                    {highlight}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Technologies */}
          <div className="mt-auto">
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 bg-cyber-gray/30 rounded text-[10px] font-mono text-cyber-muted"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-2 py-0.5 text-[10px] font-mono text-cyber-muted">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Links */}
          {project.links && (
            <div className="mt-4 flex items-center gap-3">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyber-muted hover:text-cyber-accent transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              )}
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyber-muted hover:text-cyber-accent transition-colors"
                  onClick={(e) => e.stopPropagation()}
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Hover border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${(x.get() + 0.5) * 100}% ${(y.get() + 0.5) * 100}%, rgba(34, 211, 238, 0.15), transparent 50%)`,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function BentoGrid() {
  const aiProjects = projects.filter((p) => p.category === "ai-agents");
  const gameProjects = projects.filter((p) => p.category === "game-dev");

  return (
    <section id="archives" className="relative py-32 w-full">
      {/* Background */}
      <div className="absolute inset-0 bg-cyber-darker">
        <div className="absolute inset-0 grid-bg opacity-10" />
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
              Project Archives
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyber-accent" />
          </div>
          <h2 className="font-mono text-4xl md:text-5xl font-bold text-cyber-white mb-4">
            Featured <span className="text-cyber-accent">Work</span>
          </h2>
          <p className="text-cyber-light max-w-2xl mx-auto">
            Explore my projects spanning AI systems, multi-agent architectures,
            and game development.
          </p>
        </motion.div>

        {/* AI & Agents Section */}
        <div className="mb-16">
          <motion.h3
            className="font-mono text-xl text-cyber-accent mb-8 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-2xl">◈</span>
            AI & Agent Systems
          </motion.h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(1, 1fr)',
              gap: '1.5rem',
            }}
            className="grid-ai-projects"
          >
            <style jsx>{`
              @media (min-width: 768px) {
                .grid-ai-projects {
                  grid-template-columns: repeat(2, 1fr) !important;
                }
              }
              @media (min-width: 1024px) {
                .grid-ai-projects {
                  grid-template-columns: repeat(3, 1fr) !important;
                }
              }
            `}</style>
            {aiProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                size={project.featured ? "large" : "medium"}
              />
            ))}
          </div>
        </div>

        {/* Game Development Section */}
        <div>
          <motion.h3
            className="font-mono text-xl text-cyber-accent2 mb-8 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-2xl">◇</span>
            Game Development
          </motion.h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(1, 1fr)',
              gap: '1.5rem',
            }}
            className="grid-game-projects"
          >
            <style jsx>{`
              @media (min-width: 768px) {
                .grid-game-projects {
                  grid-template-columns: repeat(2, 1fr) !important;
                }
              }
            `}</style>
            {gameProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                size="large"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
