"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { personalInfo } from "@/lib/data";
import { cn } from "@/lib/utils";

// Dynamic import for SwarmCanvas to avoid SSR issues
const SwarmCanvas = dynamic(() => import("./SwarmCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-cyber-black via-cyber-darker to-cyber-dark">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
    </div>
  ),
});

const taglines = personalInfo.taglines;

export default function HeroSection() {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing effect
  useEffect(() => {
    const currentText = taglines[currentTagline];
    const typingSpeed = isDeleting ? 30 : 50;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentTagline((prev) => (prev + 1) % taglines.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTagline]);

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {/* 3D Swarm Background */}
      <SwarmCanvas />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Content */}
      <div 
        className="relative z-10 px-6"
        style={{
          textAlign: 'center',
          width: '100%',
          maxWidth: '80rem',
          margin: '0 auto',
        }}
      >
        {/* Status indicator */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-cyber-success"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="font-mono text-xs text-cyber-light uppercase tracking-widest">
            System Online • Available for Projects
          </span>
        </motion.div>

        {/* Main title */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h1 className="font-mono text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="text-cyber-white">{personalInfo.name.split(" ")[0]}</span>
            <span className="text-cyber-accent"> {personalInfo.name.split(" ").slice(1).join(" ")}</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="font-sans text-xl md:text-2xl text-cyber-light mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {personalInfo.title}
        </motion.p>

        {/* Typing tagline */}
        <motion.div
          className="h-12 mb-12"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div 
            className="px-6 py-3 bg-cyber-darker/50 backdrop-blur-sm rounded-lg border border-cyber-gray/30"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span className="text-cyber-accent font-mono text-sm">//</span>
            <span className="font-mono text-lg md:text-xl text-cyber-white">
              {displayText}
            </span>
            <motion.span
              className="w-0.5 h-6 bg-cyber-accent"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="gap-4"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.a
            href="#archives"
            className="group relative px-8 py-4 font-mono text-sm uppercase tracking-wider rounded-lg overflow-hidden"
            style={{
              backgroundColor: '#22d3ee',
              color: '#0a0a0b',
              transition: 'all 0.3s',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">View Archives</span>
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to right, #22d3ee, #a78bfa)',
              }}
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>

          <motion.a
            href="#synapse"
            className="group px-8 py-4 font-mono text-sm uppercase tracking-wider rounded-lg"
            style={{
              border: '1px solid rgba(34, 211, 238, 0.5)',
              color: '#22d3ee',
              transition: 'all 0.3s',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Initialize Contact</span>
              <span className="text-xs">→</span>
            </span>
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12"
          style={{
            position: 'absolute',
            bottom: '3rem',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
        </motion.div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 font-mono text-xs hidden md:block" style={{ color: '#71717a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#22d3ee' }}>◈</span>
          <span>LAT: -6.9175° | LNG: 107.6191°</span>
        </div>
      </div>

      <div className="absolute top-8 right-8 font-mono text-xs hidden md:block" style={{ color: '#71717a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>v2.0.25</span>
          <span style={{ color: '#22d3ee' }}>◈</span>
        </div>
      </div>
    </section>
  );
}
