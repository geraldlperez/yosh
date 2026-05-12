"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

// Hook for mouse position parallax
function useMousePosition() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return { mouseX, mouseY };
}

const techStack = [
  { id: "py", name: "Python", icon: "python", x: 20, y: 30, connections: ["zap", "n8n", "pd"] },
  { id: "js", name: "JavaScript", icon: "javascript", x: 50, y: 40, connections: ["react", "node"] },
  { id: "react", name: "React", icon: "react", x: 70, y: 35, connections: ["next", "js"] },
  { id: "next", name: "Next.js", icon: "nextdotjs", x: 85, y: 50, connections: ["react", "ver"] },
  { id: "zap", name: "Zapier", icon: "zapier", x: 35, y: 15, connections: ["py", "n8n"] },
  { id: "n8n", name: "n8n", icon: "n8n", x: 10, y: 10, connections: ["py", "zap"] },
  { id: "node", name: "Node.js", icon: "nodedotjs", x: 45, y: 60, connections: ["js", "off"] },
  { id: "ts", name: "TypeScript", icon: "typescript", x: 75, y: 65, connections: ["next", "react"] },
  { id: "pd", name: "Pandas", icon: "pandas", x: 30, y: 45, connections: ["py", "sql"] },
  { id: "sql", name: "SQL", icon: "sqlite", x: 25, y: 70, connections: ["pd", "pg"] },
  { id: "pg", name: "PostgreSQL", icon: "postgresql", x: 15, y: 85, connections: ["sql"] },
  { id: "ver", name: "Vercel", icon: "vercel", x: 90, y: 80, connections: ["next"] },
  { id: "fig", name: "Figma", icon: "figma", x: 60, y: 85, connections: ["can"] },
  { id: "can", name: "Canva", icon: "canva", x: 80, y: 90, connections: ["fig"] },
  { id: "off", name: "Microsoft Office", icon: "microsoftoffice", x: 55, y: 15, connections: ["node"] },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { mouseX, mouseY } = useMousePosition();

  const springConfig = { damping: 50, stiffness: 100 };
  const starX = useSpring(useTransform(mouseX, [0, 2000], [20, -20]), springConfig);
  const starY = useSpring(useTransform(mouseY, [0, 1000], [20, -20]), springConfig);
  const nebulaX = useSpring(useTransform(mouseX, [0, 2000], [40, -40]), springConfig);
  const nebulaY = useSpring(useTransform(mouseY, [0, 1000], [40, -40]), springConfig);

  const rotateX = useSpring(useTransform(mouseY, [0, 1000], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 2000], [-10, 10]), springConfig);

  const basePath = process.env.NODE_ENV === "production" ? "/yosh" : "";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main style={{ position: "relative", opacity: mounted ? 1 : 0, transition: "opacity 1.5s ease", minHeight: "100vh" }}>
      
      {/* Background Layer */}
      <div className="galaxy-bg" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, background: "#020205", overflow: "hidden" }}>
        <motion.div style={{ x: nebulaX, y: nebulaY, width: "100%", height: "100%" }}>
          <div className="nebula" style={{ top: "-5%", left: "-5%" }} />
          <div className="nebula" style={{ bottom: "-5%", right: "-5%" }} />
        </motion.div>

        <motion.div style={{ x: starX, y: starY }} className="stars-container">
          {mounted && [...Array(120)].map((_, i) => (
            <div key={i} className="star-dot" style={{ top: `${(i * 23.7) % 100}%`, left: `${(i * 17.3) % 100}%`, width: i % 10 === 0 ? "2px" : "1px", height: i % 10 === 0 ? "2px" : "1px", "--duration": `${2 + (i % 6)}s` } as any} />
          ))}
        </motion.div>

        <motion.div className="planet" style={{ top: "15%", right: "8%", x: useSpring(useTransform(mouseX, [0, 2000], [15, -15]), springConfig), y: useSpring(useTransform(mouseY, [0, 1000], [15, -15]), springConfig) }} animate={{ rotate: 360, y: [0, 20, 0] }} transition={{ rotate: { duration: 300, repeat: Infinity, ease: "linear" }, y: { duration: 30, repeat: Infinity, ease: "easeInOut" } }} />
      </div>

      <div style={{ position: "relative", zIndex: 10 }}>
        <div className="noise" />

        {/* Hero Section */}
        <section className="section-container" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "60px", alignItems: "center" }}>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
              <span style={{ color: "white", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.75rem", opacity: 0.8 }}>Technical Executive Operations</span>
              <h1 className="hero-title mt-4" style={{ marginBottom: "20px" }}>Gerald <span className="gradient-text">Perez</span></h1>
              <p className="subtitle" style={{ fontSize: "1.5rem", marginBottom: "32px" }}>The <strong>Technical Partner</strong> for High-Growth Teams. Bridging the gap between <strong>Systems Building</strong> and <strong>Executive Support</strong>.</p>
              <div style={{ display: "flex", gap: "16px" }}>
                <Link href="#projects" className="btn-primary">View Solutions</Link>
                <Link href="#contact" className="glass" style={{ padding: "12px 24px", fontWeight: "600" }}>Partner with Me</Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.2 }} style={{ position: "relative" }}>
              <div className="float">
                <div className="glass light-sweep" style={{ padding: "12px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <img src={`${basePath}/test-3.png`} alt="Gerald Perez" style={{ width: "100%", borderRadius: "16px", filter: "brightness(95%) contrast(105%) grayscale(20%)" }} />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* RE-ENGINEERED: Technical Constellation Section */}
        <section id="expertise" className="section-container" style={{ height: "800px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Technical Constellation</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "60px" }}>An interconnected map of specialized expertise and systems.</p>
            
            <div style={{ width: "100%", height: "500px", position: "relative" }}>
              
              {/* LAYER 1: 3D Visuals Layer (Does NOT handle mouse events) */}
              <motion.div 
                style={{ 
                  width: "100%", height: "100%", position: "absolute", 
                  rotateX, rotateY, perspective: "1000px", transformStyle: "preserve-3d",
                  pointerEvents: "none" // Crucial: Mouse ignores this tilted layer
                }}
              >
                {/* SVG Connections */}
                <svg style={{ position: "absolute", width: "100%", height: "100%", zIndex: 1 }}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0)" /><stop offset="50%" stopColor="rgba(255,255,255,0.2)" /><stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                  </defs>
                  {techStack.map(tech => tech.connections.map(targetId => {
                    const target = techStack.find(t => t.id === targetId);
                    return target ? <motion.line key={`${tech.id}-${targetId}`} x1={`${tech.x}%`} y1={`${tech.y}%`} x2={`${target.x}%`} y2={`${target.y}%`} stroke="url(#lineGrad)" strokeWidth="1" animate={{ opacity: [0.05, 0.2, 0.05] }} transition={{ duration: 4, repeat: Infinity }} /> : null;
                  }))}
                </svg>

                {techStack.map((tech, i) => (
                  <ConstellationIcon key={tech.id} tech={tech} i={i} isHovered={hoveredId === tech.id} />
                ))}
              </motion.div>

              {/* LAYER 2: 2D Stable Sensor Layer (Handles all mouse events) */}
              <div style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 100 }}>
                {techStack.map((tech) => (
                  <div
                    key={`sensor-${tech.id}`}
                    onMouseEnter={() => setHoveredId(tech.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      position: "absolute",
                      left: `${tech.x}%`,
                      top: `${tech.y}%`,
                      width: "80px", // Perfectly stable hitbox
                      height: "80px",
                      transform: "translate(-50%, -50%)",
                      cursor: "pointer",
                      // background: "rgba(255,0,0,0.1)", // Uncomment to see sensors during debugging
                      pointerEvents: "auto"
                    }}
                  />
                ))}
              </div>

            </div>
          </motion.div>
        </section>

        {/* Selected Solutions */}
        <section id="projects" className="section-container">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "60px" }}>Selected Solutions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "40px" }}>
              <ProjectCard title="Intelligent Automation" desc="Building autonomous workflows that eliminate manual data entry and executive overhead." img={`${basePath}/automation-suite.png`} icons={["python", "zapier", "n8n"]} />
              <ProjectCard title="Full-Stack Ops Hub" desc="Custom internal tools and dashboards for high-level executive decision making." img={`${basePath}/ecommerce-hub.png`} icons={["nextdotjs", "react", "typescript"]} />
            </div>
          </motion.div>
        </section>

        <footer className="section-container" style={{ borderTop: "1px solid var(--glass-border)", padding: "40px 24px", color: "var(--text-secondary)", fontSize: "0.875rem", display: "flex", justifyContent: "space-between" }}>
          <p>© 2026 Gerald Perez</p>
          <div style={{ display: "flex", gap: "24px" }}>
            <Link href="https://linkedin.com" target="_blank" className="hover-text">LinkedIn</Link>
            <Link href="https://github.com" target="_blank" className="hover-text">GitHub</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

function ConstellationIcon({ tech, i, isHovered }: { tech: any, i: number, isHovered: boolean }) {
  const [error, setError] = useState(false);
  const iconUrl = `https://api.iconify.design/simple-icons:${tech.icon}.svg?color=white`;

  const particles = useMemo(() => {
    return [...Array(12)].map((_, j) => ({
      id: j,
      x: (Math.random() - 0.5) * 160,
      y: (Math.random() - 0.5) * 160,
      size: Math.random() * 4 + 2
    }));
  }, []);

  return (
    <motion.div
      style={{ position: "absolute", left: `${tech.x}%`, top: `${tech.y}%`, zIndex: isHovered ? 10 : 2, transform: "translate(-50%, -50%)" }}
      animate={{ y: isHovered ? 0 : [0, -10, 0] }}
      transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
    >
      <div style={{ position: "relative" }}>
        {/* Explosion Layer */}
        <AnimatePresence>
          {isHovered && (
            <div style={{ position: "absolute", top: "50%", left: "50%" }}>
              {particles.map(p => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ position: "absolute", width: p.size, height: p.size, background: "white", borderRadius: "50%", boxShadow: "0 0 10px white" }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        <motion.div 
          animate={{ 
            scale: isHovered ? 1.5 : 1, // Increased scale for impact
            backgroundColor: isHovered ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.03)",
            borderColor: isHovered ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.1)"
          }}
          style={{ 
            width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "12px", border: "1px solid",
            backdropFilter: "blur(8px)", position: "relative",
            boxShadow: isHovered ? "0 0 40px rgba(255,255,255,0.5)" : "none",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" // Snappy pop
          }}
        >
          {!error ? (
            <img 
              src={iconUrl} 
              alt={tech.name} 
              style={{ width: "24px", height: "24px", filter: isHovered ? "drop-shadow(0 0 10px rgba(255,255,255,0.9))" : "none" }}
              onError={() => setError(true)}
            />
          ) : (
            <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "white", opacity: 0.8 }}>{tech.name.charAt(0)}</span>
          )}
          
          <span 
            style={{ 
              position: "absolute", top: "120%", fontSize: "0.7rem", color: "white", 
              opacity: isHovered ? 1 : 0.4, fontWeight: isHovered ? "600" : "400",
              whiteSpace: "nowrap", textShadow: isHovered ? "0 0 10px rgba(255,255,255,0.5)" : "none",
              transition: "all 0.3s ease"
            }}
          >
            {tech.name}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProjectCard({ title, desc, img, icons }: { title: string, desc: string, img: string, icons: string[] }) {
  return (
    <motion.div className="glass" whileHover={{ y: -10 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
      <div style={{ height: "300px", overflow: "hidden" }}>
        <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
      </div>
      <div style={{ padding: "32px" }}>
        <h3 style={{ fontSize: "1.75rem", marginBottom: "16px" }}>{title}</h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px", lineHeight: "1.6" }}>{desc}</p>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          {icons.map(icon => (
            <img key={icon} src={`https://api.iconify.design/simple-icons:${icon}.svg?color=white`} style={{ width: "24px", opacity: 0.6 }} alt={icon} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
