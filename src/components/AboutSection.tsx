"use client";

import { motion } from "framer-motion";
import { personalInfo, skills, getSkillsByCategory } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function AboutSection() {
  const languages = getSkillsByCategory("languages");
  const frameworks = getSkillsByCategory("frameworks");
  const tools = getSkillsByCategory("tools");
  const concepts = getSkillsByCategory("concepts");

  const skillCategories = [
    { name: "Languages", skills: languages, color: "cyber-accent" },
    { name: "Frameworks", skills: frameworks, color: "cyber-accent2" },
    { name: "Tools", skills: tools, color: "cyber-success" },
    { name: "Concepts", skills: concepts, color: "cyber-warning" },
  ];

  return (
    <section id="intelligence" className="relative py-32 overflow-hidden w-full">
      {/* Background */}
      <div className="absolute inset-0 bg-cyber-darker">
        <div className="absolute inset-0 grid-bg opacity-15" />
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
              Intelligence Module
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyber-accent" />
          </div>
          <h2 className="font-mono text-4xl md:text-5xl font-bold text-cyber-white mb-4">
            About <span className="text-cyber-accent">Me</span>
          </h2>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full">
          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* Terminal-style bio card */}
              <div className="bg-cyber-dark rounded-xl border border-cyber-gray/30 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-cyber-darker border-b border-cyber-gray/30">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-cyber-error/80" />
                    <div className="w-3 h-3 rounded-full bg-cyber-warning/80" />
                    <div className="w-3 h-3 rounded-full bg-cyber-success/80" />
                  </div>
                  <span className="font-mono text-xs text-cyber-muted ml-2">
                    profile.json
                  </span>
                </div>
                <div className="p-6 font-mono text-sm">
                  <pre className="text-cyber-light">
                    <span className="text-cyber-muted">{"{"}</span>
                    {"\n  "}
                    <span className="text-cyber-accent2">"name"</span>
                    <span className="text-cyber-muted">:</span>{" "}
                    <span className="text-cyber-success">
                      "{personalInfo.name}"
                    </span>
                    <span className="text-cyber-muted">,</span>
                    {"\n  "}
                    <span className="text-cyber-accent2">"role"</span>
                    <span className="text-cyber-muted">:</span>{" "}
                    <span className="text-cyber-success">
                      "{personalInfo.title}"
                    </span>
                    <span className="text-cyber-muted">,</span>
                    {"\n  "}
                    <span className="text-cyber-accent2">"location"</span>
                    <span className="text-cyber-muted">:</span>{" "}
                    <span className="text-cyber-success">
                      "{personalInfo.location}"
                    </span>
                    <span className="text-cyber-muted">,</span>
                    {"\n  "}
                    <span className="text-cyber-accent2">"specialization"</span>
                    <span className="text-cyber-muted">: [</span>
                    {"\n    "}
                    <span className="text-cyber-success">"Multi-Agent Systems"</span>
                    <span className="text-cyber-muted">,</span>
                    {"\n    "}
                    <span className="text-cyber-success">"Applied AI"</span>
                    <span className="text-cyber-muted">,</span>
                    {"\n    "}
                    <span className="text-cyber-success">"Game Development"</span>
                    {"\n  "}
                    <span className="text-cyber-muted">],</span>
                    {"\n  "}
                    <span className="text-cyber-accent2">"status"</span>
                    <span className="text-cyber-muted">:</span>{" "}
                    <span className="text-cyber-success">"Available"</span>
                    {"\n"}
                    <span className="text-cyber-muted">{"}"}</span>
                  </pre>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8 space-y-4">
                <p className="text-cyber-light leading-relaxed">
                  A passionate Full-Stack Engineer with a focus on building
                  intelligent systems. I specialize in designing and implementing
                  multi-agent architectures, applying machine learning solutions to
                  real-world problems, and creating immersive gaming experiences.
                </p>
                <p className="text-cyber-light leading-relaxed">
                  My approach combines technical excellence with creative
                  problem-solving, always pushing the boundaries of what's possible
                  with modern technology.
                </p>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { label: "Years Exp.", value: "3+" },
                  { label: "Projects", value: "15+" },
                  { label: "Technologies", value: "25+" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="text-center p-4 bg-cyber-darker rounded-lg border border-cyber-gray/20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="font-mono text-2xl text-cyber-accent mb-1">
                      {stat.value}
                    </div>
                    <div className="font-mono text-xs text-cyber-muted uppercase">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-8">
              {skillCategories.map((category, catIndex) => {
                const categoryColorMap: Record<string, string> = {
                  "cyber-accent": "#22d3ee",
                  "cyber-accent2": "#a78bfa",
                  "cyber-success": "#4ade80",
                  "cyber-warning": "#fbbf24",
                };
                const categoryColor = categoryColorMap[category.color] || "#22d3ee";
                
                return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIndex * 0.1 }}
                >
                  <h3
                    className="font-mono text-sm uppercase tracking-wider mb-4"
                    style={{ color: categoryColor }}
                  >
                    {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        className="group relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: catIndex * 0.1 + skillIndex * 0.03 }}
                      >
                        <div
                          className={cn(
                            "px-3 py-2 rounded-lg",
                            "bg-cyber-darker border border-cyber-gray/30",
                            "hover:border-cyber-accent/50 transition-all duration-300",
                            "cursor-default"
                          )}
                        >
                          <span className="font-mono text-sm text-cyber-light group-hover:text-cyber-white transition-colors">
                            {skill.name}
                          </span>
                        </div>

                        {/* Skill level indicator */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="w-1 h-1 rounded-full transition-colors"
                              style={{
                                backgroundColor: i < skill.level ? categoryColor : "#27272a"
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )})}
            </div>

            {/* Additional Info */}
            <motion.div
              className="mt-12 p-6 bg-cyber-dark rounded-xl border border-cyber-gray/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="font-mono text-sm text-cyber-accent mb-4 flex items-center gap-2">
                <span className="text-lg">◈</span>
                Current Focus
              </h4>
              <ul className="space-y-2">
                {[
                  "Multi-Agent System Orchestration",
                  "AI-Powered Enterprise Solutions",
                  "Emergent Behavior Simulation",
                  "Creative Game Mechanics",
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    className="flex items-center gap-3 text-cyber-light text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <span className="text-cyber-accent text-xs">▹</span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
