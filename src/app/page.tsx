"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import NodeGraph from "@/components/NodeGraph";
import BentoGrid from "@/components/BentoGrid";
import TerminalFooter from "@/components/TerminalFooter";

// Dynamic import for CommandPalette (uses keyboard events)
const CommandPalette = dynamic(() => import("@/components/CommandPalette"), {
  ssr: false,
});

export default function Home() {
  return (
    <SmoothScroll>
      <main className="relative">
        {/* Command Palette Navigation */}
        <CommandPalette />

        {/* Hero Section with 3D Swarm */}
        <HeroSection />

        {/* About/Intelligence Section */}
        <AboutSection />

        {/* Experience Timeline Node Graph */}
        <NodeGraph />

        {/* Projects Bento Grid */}
        <BentoGrid />

        {/* Terminal Footer with CLI */}
        <TerminalFooter />
      </main>
    </SmoothScroll>
  );
}
