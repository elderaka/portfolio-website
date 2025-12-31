# Lauda Dhia Raka - Portfolio Website

A high-performance, immersive portfolio website built with the "Cybernetic Brutalism" design philosophy. Features interactive 3D particle swarm visualization, node graph experience timeline, and a functional terminal interface.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Graphics**: React Three Fiber + Three.js
- **Smooth Scrolling**: Lenis

## ✨ Features

### 🌀 Swarm Hero Section
- Interactive 3D particle swarm simulation representing multi-agent systems
- Particles react to mouse movement (agentic behavior)
- Optimized with instanced meshes for performance
- Mobile-responsive with lightweight fallback

### 🎯 Neural Navigation
- Floating "Command Palette" (Cmd/Ctrl+K) style navigation
- Expands on hover to reveal all destinations
- Keyboard-accessible with proper shortcuts

### 🔗 Node Graph Experience
- Interactive visualization of work history as a node graph
- Clickable nodes expand detailed "Data Cards"
- Animated connection lines between nodes
- Type-coded nodes (Full-time, Internship, Teaching)

### 📦 Bento Grid Projects
- Interactive project cards with 3D tilt effect
- Categorized: AI & Agents, Game Development
- Hover reveals additional project details
- Responsive grid layout

### 💻 Terminal Footer
- Functional CLI interface
- Commands: `help`, `about`, `skills`, `contact`, `projects`, `exp`, `clear`
- `sudo` triggers "Access Denied" glitch effect
- Command history navigation (↑↓ keys)

## 🎨 Design System

- **Primary**: Cyan (#22d3ee)
- **Secondary**: Purple (#a78bfa)
- **Typography**: 
  - Headers: JetBrains Mono (monospace)
  - Body: Inter (sans-serif)
- **Theme**: Dark mode with subtle grid patterns and glow effects

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles & animations
│   ├── layout.tsx       # Root layout with fonts
│   └── page.tsx         # Main page component
├── components/
│   ├── SwarmCanvas.tsx      # 3D particle swarm
│   ├── CommandPalette.tsx   # Navigation system
│   ├── HeroSection.tsx      # Hero with typing effect
│   ├── AboutSection.tsx     # Skills & bio
│   ├── NodeGraph.tsx        # Experience timeline
│   ├── BentoGrid.tsx        # Projects grid
│   ├── TerminalFooter.tsx   # CLI interface
│   └── SmoothScroll.tsx     # Lenis wrapper
└── lib/
    ├── data.ts          # Portfolio content data
    └── utils.ts         # Utility functions
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development

The site will be available at `http://localhost:3000`

## ⚡ Performance Considerations

- 3D canvas unmounts when not in viewport
- Mobile devices get reduced particle count
- Instanced meshes used for particle rendering
- Dynamic imports for client-side components
- Optimized font loading with next/font

## 📝 Customization

### Updating Content

Edit `src/lib/data.ts` to update:
- Personal information
- Experience entries
- Projects
- Skills
- Terminal commands

### Styling

- Global styles in `src/app/globals.css`
- Tailwind config in `tailwind.config.ts`
- Color scheme defined in CSS variables

## 📄 License

MIT License - Feel free to use this as a template for your own portfolio!

---

Built with ❤️ by Lauda Dhia Raka
