"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Particle count optimized for performance
const PARTICLE_COUNT = 800;
const MOBILE_PARTICLE_COUNT = 300;

// Swarm behavior parameters
const SWARM_CONFIG = {
  separationDistance: 0.5,
  alignmentDistance: 1.0,
  cohesionDistance: 1.5,
  separationForce: 0.03,
  alignmentForce: 0.02,
  cohesionForce: 0.01,
  maxSpeed: 0.02,
  mouseInfluence: 0.5,
  boundaryForce: 0.01,
  bounds: { x: 8, y: 5, z: 4 },
};

interface ParticleSwarmProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  isMobile: boolean;
}

function ParticleSwarm({ mouse, isMobile }: ParticleSwarmProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particleCount = isMobile ? MOBILE_PARTICLE_COUNT : PARTICLE_COUNT;

  // Initialize particle positions and velocities
  const particles = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const velocities: THREE.Vector3[] = [];
    const colors: THREE.Color[] = [];

    for (let i = 0; i < particleCount; i++) {
      positions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * SWARM_CONFIG.bounds.x * 2,
          (Math.random() - 0.5) * SWARM_CONFIG.bounds.y * 2,
          (Math.random() - 0.5) * SWARM_CONFIG.bounds.z * 2
        )
      );
      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        )
      );
      
      // Gradient between cyan and purple
      const t = Math.random();
      const color = new THREE.Color();
      color.setHSL(0.5 + t * 0.2, 0.8, 0.6);
      colors.push(color);
    }

    return { positions, velocities, colors };
  }, [particleCount]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const mouseX = (mouse.current.x * viewport.width) / 2;
    const mouseY = (mouse.current.y * viewport.height) / 2;
    const mousePos = new THREE.Vector3(mouseX, mouseY, 0);

    // Update each particle
    for (let i = 0; i < particleCount; i++) {
      const pos = particles.positions[i];
      const vel = particles.velocities[i];

      // Swarm behaviors (simplified for performance)
      let separation = new THREE.Vector3();
      let alignment = new THREE.Vector3();
      let cohesion = new THREE.Vector3();
      let neighborCount = 0;

      // Sample nearby particles (sparse sampling for performance)
      const sampleStep = isMobile ? 10 : 5;
      for (let j = 0; j < particleCount; j += sampleStep) {
        if (i === j) continue;

        const other = particles.positions[j];
        const dist = pos.distanceTo(other);

        if (dist < SWARM_CONFIG.separationDistance && dist > 0) {
          const diff = pos.clone().sub(other).normalize().divideScalar(dist);
          separation.add(diff);
        }

        if (dist < SWARM_CONFIG.cohesionDistance) {
          cohesion.add(other);
          alignment.add(particles.velocities[j]);
          neighborCount++;
        }
      }

      // Apply swarm forces
      if (neighborCount > 0) {
        cohesion.divideScalar(neighborCount).sub(pos);
        alignment.divideScalar(neighborCount);
      }

      vel.add(separation.multiplyScalar(SWARM_CONFIG.separationForce));
      vel.add(alignment.multiplyScalar(SWARM_CONFIG.alignmentForce));
      vel.add(cohesion.multiplyScalar(SWARM_CONFIG.cohesionForce));

      // Mouse interaction - particles are attracted/repelled by mouse
      const mouseDir = mousePos.clone().sub(pos);
      const mouseDist = mouseDir.length();
      if (mouseDist < 3) {
        const mouseForce = mouseDir
          .normalize()
          .multiplyScalar(SWARM_CONFIG.mouseInfluence / (mouseDist + 0.5));
        vel.add(mouseForce);
      }

      // Boundary containment
      if (Math.abs(pos.x) > SWARM_CONFIG.bounds.x) {
        vel.x -= Math.sign(pos.x) * SWARM_CONFIG.boundaryForce;
      }
      if (Math.abs(pos.y) > SWARM_CONFIG.bounds.y) {
        vel.y -= Math.sign(pos.y) * SWARM_CONFIG.boundaryForce;
      }
      if (Math.abs(pos.z) > SWARM_CONFIG.bounds.z) {
        vel.z -= Math.sign(pos.z) * SWARM_CONFIG.boundaryForce;
      }

      // Limit speed
      if (vel.length() > SWARM_CONFIG.maxSpeed) {
        vel.normalize().multiplyScalar(SWARM_CONFIG.maxSpeed);
      }

      // Add organic motion
      vel.x += Math.sin(time * 0.5 + i * 0.1) * 0.0005;
      vel.y += Math.cos(time * 0.3 + i * 0.1) * 0.0005;

      // Update position
      pos.add(vel);

      // Update instance matrix
      dummy.position.copy(pos);
      
      // Pulse scale based on velocity
      const scale = 0.02 + vel.length() * 2;
      dummy.scale.setScalar(scale);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color="#22d3ee"
        transparent
        opacity={0.8}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// Connection lines between nearby particles
function ConnectionLines({ mouse, isMobile }: ParticleSwarmProps) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const particleCount = isMobile ? MOBILE_PARTICLE_COUNT : PARTICLE_COUNT;
  const maxConnections = isMobile ? 200 : 600;

  const positions = useMemo(() => {
    return new Float32Array(maxConnections * 6);
  }, [maxConnections]);

  const particles = useMemo(() => {
    const pos: THREE.Vector3[] = [];
    for (let i = 0; i < particleCount; i++) {
      pos.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * SWARM_CONFIG.bounds.x * 2,
          (Math.random() - 0.5) * SWARM_CONFIG.bounds.y * 2,
          (Math.random() - 0.5) * SWARM_CONFIG.bounds.z * 2
        )
      );
    }
    return pos;
  }, [particleCount]);

  const { viewport } = useThree();

  useFrame((state) => {
    if (!lineRef.current) return;

    const time = state.clock.getElapsedTime();
    const mouseX = (mouse.current.x * viewport.width) / 2;
    const mouseY = (mouse.current.y * viewport.height) / 2;

    // Update particle positions with flowing motion
    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];
      p.x += Math.sin(time * 0.2 + i * 0.1) * 0.005;
      p.y += Math.cos(time * 0.3 + i * 0.15) * 0.005;
      p.z += Math.sin(time * 0.1 + i * 0.2) * 0.003;

      // Mouse influence
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2) {
        p.x += dx * 0.001;
        p.y += dy * 0.001;
      }

      // Boundary wrap
      if (p.x > SWARM_CONFIG.bounds.x) p.x = -SWARM_CONFIG.bounds.x;
      if (p.x < -SWARM_CONFIG.bounds.x) p.x = SWARM_CONFIG.bounds.x;
      if (p.y > SWARM_CONFIG.bounds.y) p.y = -SWARM_CONFIG.bounds.y;
      if (p.y < -SWARM_CONFIG.bounds.y) p.y = SWARM_CONFIG.bounds.y;
    }

    // Draw connections
    let connectionIndex = 0;
    const connectionDistance = isMobile ? 1.0 : 1.2;

    for (let i = 0; i < particleCount && connectionIndex < maxConnections; i += 2) {
      for (let j = i + 1; j < particleCount && connectionIndex < maxConnections; j += 2) {
        const dist = particles[i].distanceTo(particles[j]);
        if (dist < connectionDistance) {
          const idx = connectionIndex * 6;
          positions[idx] = particles[i].x;
          positions[idx + 1] = particles[i].y;
          positions[idx + 2] = particles[i].z;
          positions[idx + 3] = particles[j].x;
          positions[idx + 4] = particles[j].y;
          positions[idx + 5] = particles[j].z;
          connectionIndex++;
        }
      }
    }

    // Clear remaining positions
    for (let i = connectionIndex * 6; i < maxConnections * 6; i++) {
      positions[i] = 0;
    }

    const geometry = lineRef.current.geometry as THREE.BufferGeometry;
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={maxConnections * 2}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#22d3ee"
        transparent
        opacity={0.15}
        toneMapped={false}
      />
    </lineSegments>
  );
}

// Ambient floating particles
function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 20;
      pos[i + 1] = (Math.random() - 0.5) * 12;
      pos[i + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#a78bfa"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

export default function SwarmCanvas() {
  const mouse = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check for mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Intersection Observer for performance
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      observer.disconnect();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
  };

  // Mobile fallback - lightweight shader gradient
  if (isMobile && !isVisible) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 bg-gradient-to-br from-cyber-black via-cyber-darker to-cyber-dark"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 canvas-container"
      onMouseMove={handleMouseMove}
    >
      {isVisible && (
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          dpr={[1, isMobile ? 1 : 2]}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <color attach="background" args={["#0a0a0b"]} />
          <fog attach="fog" args={["#0a0a0b", 5, 15]} />
          
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#22d3ee" />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#a78bfa" />
          
          <ParticleSwarm mouse={mouse} isMobile={isMobile} />
          <ConnectionLines mouse={mouse} isMobile={isMobile} />
          <AmbientParticles />
        </Canvas>
      )}
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-cyber-black/80" />
      </div>
    </div>
  );
}
