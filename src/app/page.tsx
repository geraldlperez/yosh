"use client";

import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

// --- MODULAR IMPORTS ---
import { projects } from "@/data/projects";
import { creativeProjects } from "@/data/creative";
import { techStack } from "@/data/techStack";
import { useMousePosition } from "@/hooks/useMousePosition";
import { ProjectCard } from "@/components/ProjectCard";

import emailjs from "@emailjs/browser";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeLightbox, setActiveLightbox] = useState<{ projectId: string, index: number } | null>(null);
  const { mouseX, mouseY } = useMousePosition();

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error", message: string } | null>(null);

  // UFO Spawning Logic
  const [ufoKey, setUfoKey] = useState(0);
  const [ufoRotation, setUfoRotation] = useState(0);
  const [ufoStart, setUfoStart] = useState({ top: 30, left: -100 });

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
    const ufoInterval = setInterval(() => {
      const edge = Math.floor(Math.random() * 4);
      let top = 30, left = -150, rotation = 0;

      if (edge === 0) { // From Left
        top = Math.random() * 80 + 10;
        left = -150;
        rotation = -10 + Math.random() * 20;
      } else if (edge === 1) { // From Right
        top = Math.random() * 80 + 10;
        left = 1500; // Will animate towards negative
        rotation = 170 + Math.random() * 20;
      } else if (edge === 2) { // From Top
        top = -150;
        left = Math.random() * 80 + 10;
        rotation = 80 + Math.random() * 20;
      } else { // From Bottom
        top = 1000;
        left = Math.random() * 80 + 10;
        rotation = -80 + Math.random() * 20;
      }

      setUfoStart({ top, left });
      setUfoRotation(rotation);
      setUfoKey(prev => prev + 1);
    }, 25000);
    return () => clearInterval(ufoInterval);
  }, []);

  return (
    <main style={{ position: "relative", opacity: mounted ? 1 : 0, transition: "opacity 1.5s ease", minHeight: "100vh" }}>

      {/* --- Cosmic Background Layer --- */}
      <div className="galaxy-bg" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, background: "#020205", overflow: "hidden" }}>

        {/* Nebula Mist */}
        <motion.div style={{ x: nebulaX, y: nebulaY, width: "100%", height: "100%" }}>
          <div className="nebula" style={{ top: "-5%", left: "-5%" }} />
          <div className="nebula" style={{ bottom: "-5%", right: "-5%" }} />
        </motion.div>

        {/* Razor Omni-Stars */}
        <motion.div style={{ x: starX, y: starY }} className="stars-container">
          {mounted && [...Array(120)].map((_, i) => (
            <div key={i} className="star-dot" style={{ top: `${(i * 23.7) % 100}%`, left: `${(i * 17.3) % 100}%`, width: i % 10 === 0 ? "2px" : "1px", height: i % 10 === 0 ? "2px" : "1px", "--duration": `${2 + (i % 6)}s` } as any} />
          ))}

          {mounted && [...Array(10)].map((_, i) => {
            const edge = i % 4;
            let top = "0%", left = "0%", rotate = 0;
            if (edge === 0) { top = `${Math.random() * 100}%`; left = "-10%"; rotate = -30 + Math.random() * 60; }
            else if (edge === 1) { top = "-10%"; left = `${Math.random() * 100}%`; rotate = 60 + Math.random() * 60; }
            else if (edge === 2) { top = `${Math.random() * 100}%`; left = "110%"; rotate = 150 + Math.random() * 60; }
            else { top = "110%"; left = `${Math.random() * 100}%`; rotate = 240 + Math.random() * 60; }

            return (
              <div key={`star-rhythm-${i}`} style={{ position: "absolute", top, left, transform: `rotate(${rotate}deg)`, pointerEvents: "none" }}>
                <div className="shooting-star" style={{ "--duration": "60s", "--delay": `${i * 6}s` } as any} />
              </div>
            );
          })}
        </motion.div>

        <motion.div
          key={ufoKey}
          className="ufo-container"
          initial={{ top: `${ufoStart.top}px`, left: `${ufoStart.left}px`, rotate: ufoRotation, opacity: 0 }}
          animate={{
            x: [0, 2000], // Moves "forward" relative to its rotation
            opacity: [0, 1, 1, 0]
          }}
          transition={{ duration: 15, ease: "linear" }}
          style={{ position: "absolute" }}
        >
          <div className="ufo-dome" />
          <div className="ufo-saucer">
            <div className="ufo-lights">
              <div className="ufo-light" />
              <div className="ufo-light" />
              <div className="ufo-light" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="planet"
          style={{ top: "15%", right: "8%", x: useSpring(useTransform(mouseX, [0, 2000], [15, -15]), springConfig), y: useSpring(useTransform(mouseY, [0, 1000], [15, -15]), springConfig) }}
          animate={{ rotate: 360, y: [0, 20, 0] }}
          transition={{ rotate: { duration: 300, repeat: Infinity, ease: "linear" }, y: { duration: 30, repeat: Infinity, ease: "easeInOut" } }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 10 }}>
        <div className="noise" />

        {/* Hero Section (AESTHETIC RESTORED) */}
        <section className="section-container" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "60px", alignItems: "center" }}>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
              <span style={{ color: "white", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.75rem", opacity: 0.8 }}>Stark Cosmic // Strategic Operations</span>
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
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "140%", height: "140%", background: "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)", zIndex: 1 }} />
            </motion.div>
          </div>
        </section>

        {/* Technical Stack */}
        <section id="expertise" className="section-container" style={{ height: "800px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Technical Stack</h2>
            <div style={{ width: "100%", height: "500px", position: "relative" }}>
              <motion.div style={{ width: "100%", height: "100%", position: "absolute", rotateX, rotateY, perspective: "1000px", transformStyle: "preserve-3d", pointerEvents: "none" }}>
                <svg style={{ position: "absolute", width: "100%", height: "100%", zIndex: 1 }}>
                  {techStack.map(tech => tech.connections.map(targetId => {
                    const target = techStack.find(t => t.id === targetId);
                    return target ? <motion.line key={`${tech.id}-${targetId}`} x1={`${tech.x}%`} y1={`${tech.y}%`} x2={`${target.x}%`} y2={`${target.y}%`} stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 4, repeat: Infinity }} /> : null;
                  }))}
                </svg>
                {techStack.map((tech, i) => (
                  <ConstellationIcon key={tech.id} tech={tech} i={i} isHovered={hoveredId === tech.id} />
                ))}
              </motion.div>
              <div style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 100 }}>
                {techStack.map((tech) => (
                  <div key={`sensor-${tech.id}`} onMouseEnter={() => setHoveredId(tech.id)} onMouseLeave={() => setHoveredId(null)} style={{ position: "absolute", left: `${tech.x}%`, top: `${tech.y}%`, width: "80px", height: "80px", transform: "translate(-50%, -50%)", cursor: "pointer", pointerEvents: "auto" }} />
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Strategic Capabilities */}
        <section className="section-container">
          <h2 style={{ fontSize: "2.5rem", marginBottom: "60px" }}>Strategic Capabilities</h2>
          <div className="bento-grid">
            <motion.div className="glass bento-item" style={{ gridColumn: "span 2", background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(0,0,0,0) 100%)" }} whileHover={{ scale: 1.02 }}>
              <h4 style={{ fontSize: "1.25rem", color: "white" }}>Web Development</h4>
              <p style={{ color: "var(--text-secondary)" }}>Engineering systems using React, TypeScript, and modern API architectures.</p>
            </motion.div>
            <motion.div className="glass bento-item" whileHover={{ scale: 1.02 }}>
              <h4 style={{ fontSize: "1.25rem", color: "white" }}>Automation</h4>
              <p style={{ color: "var(--text-secondary)" }}>Architecting complex workflows to scale virtual operations.</p>
            </motion.div>
            <motion.div className="glass bento-item" whileHover={{ scale: 1.02 }}>
              <h4 style={{ fontSize: "1.25rem", color: "white" }}>Executive Strategy</h4>
              <p style={{ color: "var(--text-secondary)" }}>High-level coordination and operational leadership.</p>
            </motion.div>
            <motion.div className="glass bento-item" style={{ gridColumn: "span 2" }} whileHover={{ scale: 1.02 }}>
              <h4 style={{ fontSize: "1.25rem", color: "white" }}>Technical VA Support</h4>
              <p style={{ color: "var(--text-secondary)" }}>Technical expertise supporting founders in day-to-day operations.</p>
            </motion.div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="section-container">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "60px" }}>Projects</h2>
            <div className="projects-grid">
              {[...projects].reverse().map((project) => (
                <ProjectCard key={project.id} project={project} basePath={basePath} onExpand={(index) => setActiveLightbox({ projectId: project.id, index })} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Visual Studio (3 PER ROW, POSTER SIZE, NO SWEEP) */}
        <section id="creative" className="section-container">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Visual Studio</h2>
            <div className="creative-grid">
              {creativeProjects.map((item) => (
                <motion.div
                  key={item.id}
                  className="creative-item"
                  onClick={() => setActiveLightbox({ projectId: item.id, index: 0 })}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <img src={item.image} alt={item.title} />
                  <div className="creative-overlay">
                    <span className="creative-category">{item.category}</span>
                    <h3 className="creative-title">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Contact */}
        <section id="contact" className="section-container" style={{ paddingBottom: "160px" }}>
          <motion.div
            className="glass"
            style={{ padding: "60px", borderRadius: "40px", border: "1px solid rgba(255, 255, 255, 0.3)", background: "rgba(255, 255, 255, 0.02)" }}
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            viewport={{ once: true }}
          >
            <div className="contact-grid">
              {/* Left Pane: Professional Context */}
              <div>
                <span style={{ color: "white", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.75rem", opacity: 0.8 }}>Available for Partnership</span>
                <h2 className="hero-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginTop: "16px", marginBottom: "24px" }}>Stark <span className="gradient-text">Cosmic</span></h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "40px" }}>
                  I help high-growth teams and founders bridge the gap between complex systems and executive support. Whether you need an AI-driven workflow, a custom web solution, or strategic technical assistance—let's discuss how we can scale your operations.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "white", opacity: 0.8 }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>✉️</div>
                    <span>grldprz.yosh@gmail.com</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "white", opacity: 0.8 }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>🔗</div>
                    <span>linkedin.com/in/geraldperez</span>
                  </div>
                </div>
              </div>

              {/* Right Pane: Contact Form */}
              <form
                className="contact-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSubmitting(true);
                  setFormStatus(null);

                  const target = e.target as HTMLFormElement;

                  try {
                    const result = await emailjs.sendForm(
                      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
                      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
                      target,
                      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""
                    );

                    if (result.status === 200) {
                      setFormStatus({ type: "success", message: "Message sent! I'll get back to you shortly." });
                      target.reset();
                    } else {
                      setFormStatus({ type: "error", message: "Error sending message. Please try again." });
                    }
                  } catch (err) {
                    console.error("EmailJS Error:", err);
                    setFormStatus({ type: "error", message: "Network error. Please try again." });
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">First Name</label>
                    <input name="first_name" type="text" placeholder="John" required className="input-field" />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Last Name</label>
                    <input name="last_name" type="text" placeholder="Doe" required className="input-field" />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <input name="email" type="email" placeholder="john@example.com" required className="input-field" />
                </div>

                <div className="input-group">
                  <label className="input-label">How can I help you?</label>
                  <textarea name="message" placeholder="Describe your project or needs..." required className="textarea-field" />
                </div>

                <button type="submit" disabled={isSubmitting} className="submit-btn">
                  {isSubmitting ? "Sending Message..." : "Send Discovery Request"}
                </button>

                {formStatus && (
                  <div className={`form-status ${formStatus.type === "success" ? "form-success" : "form-error"}`}>
                    {formStatus.message}
                  </div>
                )}
              </form>
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

      <AnimatePresence>
        {activeLightbox && (
          <ProjectLightbox
            images={
              projects.find(p => p.id === activeLightbox.projectId)?.gallery ||
              creativeProjects.filter(p => p.id === activeLightbox.projectId).map(p => p.image) ||
              []
            }
            currentIndex={activeLightbox.index}
            onClose={() => setActiveLightbox(null)}
            onNext={() => {
              const project = projects.find(p => p.id === activeLightbox.projectId);
              if (project) setActiveLightbox({ ...activeLightbox, index: (activeLightbox.index + 1) % project.gallery.length });
            }}
            onPrev={() => {
              const project = projects.find(p => p.id === activeLightbox.projectId);
              if (project) setActiveLightbox({ ...activeLightbox, index: (activeLightbox.index - 1 + project.gallery.length) % project.gallery.length });
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function ConstellationIcon({ tech, i, isHovered }: { tech: any, i: number, isHovered: boolean }) {
  const iconUrl = `https://api.iconify.design/simple-icons:${tech.icon}.svg?color=white`;
  const particles = useMemo(() => [...Array(12)].map((_, j) => ({ id: j, x: (Math.random() - 0.5) * 160, y: (Math.random() - 0.5) * 160, size: Math.random() * 4 + 2 })), []);

  return (
    <motion.div style={{ position: "absolute", left: `${tech.x}%`, top: `${tech.y}%`, zIndex: isHovered ? 10 : 2, transform: "translate(-50%, -50%)" }} animate={{ y: isHovered ? 0 : [0, -10, 0] }} transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}>
      <div style={{ position: "relative" }}>
        <AnimatePresence>{isHovered && (<div style={{ position: "absolute", top: "50%", left: "50%" }}>{particles.map(p => (<motion.div key={p.id} initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ position: "absolute", width: p.size, height: p.size, background: "white", borderRadius: "50%", boxShadow: "0 0 10px white" }} />))}</div>)}</AnimatePresence>
        <motion.div animate={{ scale: isHovered ? 1.5 : 1, backgroundColor: isHovered ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.05)", borderColor: isHovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)" }} style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", border: "1px solid", backdropFilter: "blur(8px)", position: "relative", boxShadow: isHovered ? "0 0 40px rgba(255,255,255,0.5)" : "none", transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
          <img src={iconUrl} alt={tech.name} style={{ width: "24px", height: "24px", filter: isHovered ? "drop-shadow(0 0 10px rgba(255,255,255,0.9))" : "none" }} />
          <span style={{ position: "absolute", top: "120%", fontSize: "0.7rem", color: "white", opacity: isHovered ? 1 : 0.4, fontWeight: isHovered ? "600" : "400", whiteSpace: "nowrap", textShadow: isHovered ? "0 0 10px rgba(255,255,255,0.5)" : "none", transition: "all 0.3s ease" }}>{tech.name}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProjectLightbox({ images, currentIndex, onClose, onNext, onPrev }: { images: string[], currentIndex: number, onClose: () => void, onNext: () => void, onPrev: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
      <button onClick={onClose} style={{ position: "absolute", top: "40px", right: "40px", color: "white", fontSize: "2rem", background: "none", border: "none", cursor: "pointer" }}>×</button>
      <div style={{ position: "relative", maxWidth: "1200px", width: "100%", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <button onClick={onPrev} style={{ position: "absolute", left: "-60px", color: "white", fontSize: "3rem", background: "none", border: "none", cursor: "pointer" }}>‹</button>
        <img src={images[currentIndex]} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
        <button onClick={onNext} style={{ position: "absolute", right: "-60px", color: "white", fontSize: "3rem", background: "none", border: "none", cursor: "pointer" }}>›</button>
      </div>
    </motion.div>
  );
}
