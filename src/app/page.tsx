"use client";

import { motion, useSpring, useTransform, AnimatePresence, useScroll } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

// --- MODULAR IMPORTS ---
import { projects } from "@/data/projects";
import { creativeProjects } from "@/data/creative";
import { techStack } from "@/data/techStack";
import { useMousePosition } from "@/hooks/useMousePosition";
import { ProjectCard } from "@/components/ProjectCard";
import { ThemeToggle } from "@/components/ThemeToggle";

import emailjs from "@emailjs/browser";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeLightbox, setActiveLightbox] = useState<{ projectId: string, index: number } | null>(null);
  const { mouseX, mouseY } = useMousePosition();

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error", message: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error", message: string } | null>(null);
  const [pendingForm, setPendingForm] = useState<HTMLFormElement | null>(null);

  // Planet Spawning Logic (Keeping stars and planets)
  const springConfig = { damping: 50, stiffness: 100 };
  const starX = useSpring(useTransform(mouseX, [0, 2000], [20, -20]), springConfig);
  const starY = useSpring(useTransform(mouseY, [0, 1000], [20, -20]), springConfig);
  const nebulaX = useSpring(useTransform(mouseX, [0, 2000], [40, -40]), springConfig);
  const nebulaY = useSpring(useTransform(mouseY, [0, 1000], [40, -40]), springConfig);

  const rotateX = useSpring(useTransform(mouseY, [0, 1000], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 2000], [-10, 10]), springConfig);

  // Dynamic Scroll Parallax for deep space flow (anime.js / high-end inspiration)
  const { scrollY } = useScroll();
  const starsYFar = useTransform(scrollY, [0, 5000], [0, -150]);
  const starsYMid = useTransform(scrollY, [0, 5000], [0, -300]);
  const starsYNear = useTransform(scrollY, [0, 5000], [0, -450]);
  const nebulaYScroll = useTransform(scrollY, [0, 5000], [0, -100]);

  // Hero Parallax Scroll
  const heroScrollConfig = { damping: 40, stiffness: 90 };
  const heroLeftXRaw = useTransform(scrollY, [0, 800], [0, -300]);
  const heroRightXRaw = useTransform(scrollY, [0, 800], [0, 300]);
  const heroLeftX = useSpring(heroLeftXRaw, heroScrollConfig);
  const heroRightX = useSpring(heroRightXRaw, heroScrollConfig);

  // Custom Cursor Transforms
  const cursorX = useTransform(mouseX, val => val - 4);
  const cursorY = useTransform(mouseY, val => val - 4);
  const ringX = useSpring(useTransform(mouseX, val => val - 20), { damping: 25, stiffness: 150 });
  const ringY = useSpring(useTransform(mouseY, val => val - 20), { damping: 25, stiffness: 150 });

  const basePath = process.env.NODE_ENV === "production" ? "/yosh" : "";

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id.replace("#", ""));
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.history.pushState(null, "", id);
    }
  };

  return (
    <main id="top" style={{ position: "relative", minHeight: "100vh" }}>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="preloader-container"
          >
            <div className="loader-text">Initializing_System</div>
            <div className="loader-bar-bg">
              <div className="loader-bar-fill" />
            </div>
            <div className="loader-status">GERALD_PEREZ // OPS_CORE_V1.0</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ opacity: loading ? 0 : 1, transition: "opacity 1.5s ease" }}>

        {/* --- Cosmic Background Layer --- */}
        <div className="galaxy-bg" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, background: "var(--bg-color)", overflow: "hidden" }}>

          {/* Nebula Mist */}
          <motion.div style={{ x: nebulaX, y: nebulaY, width: "100%", height: "100%" }}>
            <motion.div style={{ x: nebulaYScroll, y: nebulaYScroll, position: "absolute", inset: 0, willChange: "transform" }}>
              <div className="nebula" style={{ top: "-5%", left: "-5%" }} />
              <div className="nebula" style={{ bottom: "-5%", right: "-5%" }} />
            </motion.div>
          </motion.div>

          {/* Razor Omni-Stars */}
          <motion.div style={{ x: starX, y: starY, willChange: "transform" }} className="stars-container">
            {/* Layer 1: Far Stars (Moves slowest on scroll diagonally \) */}
            <motion.div style={{ x: starsYFar, y: starsYFar, position: "absolute", inset: 0, willChange: "transform" }}>
              {mounted && [...Array(40)].map((_, i) => {
                const idx = i * 3;
                return (
                  <div key={`far-${idx}`} className="star-dot" style={{ top: `${(idx * 23.7) % 100}%`, left: `${(idx * 17.3) % 100}%`, width: "1px", height: "1px", opacity: 0.3, "--duration": `${4 + (idx % 4)}s` } as any} />
                );
              })}
            </motion.div>

            {/* Layer 2: Mid Stars (Moves at medium speed on scroll diagonally \) */}
            <motion.div style={{ x: starsYMid, y: starsYMid, position: "absolute", inset: 0, willChange: "transform" }}>
              {mounted && [...Array(40)].map((_, i) => {
                const idx = i * 3 + 1;
                return (
                  <div key={`mid-${idx}`} className="star-dot" style={{ top: `${(idx * 23.7) % 100}%`, left: `${(idx * 17.3) % 100}%`, width: "1.5px", height: "1.5px", opacity: 0.6, "--duration": `${3 + (idx % 4)}s` } as any} />
                );
              })}
            </motion.div>

            {/* Layer 3: Near Stars & Shooting Stars (Moves fastest on scroll diagonally \) */}
            <motion.div style={{ x: starsYNear, y: starsYNear, position: "absolute", inset: 0, willChange: "transform" }}>
              {mounted && [...Array(40)].map((_, i) => {
                const idx = i * 3 + 2;
                const isLarge = idx % 10 === 0;
                return (
                  <div key={`near-${idx}`} className="star-dot" style={{ top: `${(idx * 23.7) % 100}%`, left: `${(idx * 17.3) % 100}%`, width: isLarge ? "3px" : "2px", height: isLarge ? "3px" : "2px", opacity: 0.9, boxShadow: isLarge ? "0 0 8px var(--text-color)" : "none", "--duration": `${2 + (idx % 4)}s` } as any} />
                );
              })}

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
          </motion.div>

          {/* Light Mode Birds Layer */}
          <div className="birds-container">
            {mounted && [...Array(8)].map((_, i) => (
              <motion.div
                key={`bird-${i}`}
                style={{ position: "absolute", top: `${20 + (i * 10)}%`, left: "-10%" }}
                animate={{ left: ["-10%", "110%"], top: [`${20 + (i * 10)}%`, `${10 + (i * 5)}%`] }}
                transition={{ duration: 25 + Math.random() * 15, delay: i * 4.2, repeat: Infinity, ease: "linear" }}
              >
                <motion.svg
                  width="32" height="32" viewBox="0 0 24 24" fill="var(--text-color)" opacity={0.6 + Math.random() * 0.4}
                  style={{ transform: `scale(${0.5 + Math.random() * 0.5})` }}
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path d="M12 15.5c-2-2.5-5-5-9-5.5 4.5 0 7.5 2 9 5.5zm0 0c2-2.5 5-5 9-5.5-4.5 0-7.5 2-9 5.5z" />
                </motion.svg>
              </motion.div>
            ))}
          </div>

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
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 0.8fr", gap: isMobile ? "40px" : "60px", alignItems: "center" }}>
              <motion.div style={{ x: isMobile ? 0 : heroLeftX, willChange: "transform" }}>
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }}>
                  <span style={{ color: "var(--accent-color)", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", fontSize: "0.75rem" }}>Technical VA | Automation, Full-Stack Dev & Design</span>
                  <h1 className="hero-title mt-4" style={{ marginBottom: "20px" }}>Gerald <span className="gradient-text">Perez</span></h1>
                  <p className="subtitle" style={{ marginBottom: "40px", fontSize: "1.2rem" }}>Providing high-level technical support, managing complex workflows, and streamlining daily operations for busy founders.</p>
                  <div className="hero-buttons" style={{ display: "flex", gap: "20px" }}>
                    <Link href="/resume.pdf" target="_blank" className="btn-primary" style={{ flex: 1, textAlign: "center" }}>View Resume</Link>
                    <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="btn-secondary" style={{ flex: 1 }}>Get in Touch</button>
                  </div>
                </motion.div>
              </motion.div>
              <motion.div style={{ x: isMobile ? 0 : heroRightX, willChange: "transform" }}>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.2 }} style={{ position: "relative" }}>
                  <div className="float">
                    <div className="glass light-sweep" style={{ padding: "12px", borderRadius: "24px", border: "1px solid var(--glass-border)" }}>
                      <img src={`${basePath}/white.png`} alt="Gerald Perez" style={{ width: "100%", borderRadius: "16px", filter: "brightness(95%) contrast(105%) grayscale(20%)" }} />
                    </div>
                  </div>
                  <div style={{ position: "absolute", top: "50%", left: "50%", width: "140%", height: "140%", zIndex: 1 }} />
                </motion.div>
              </motion.div>
            </div>
          </section>


          {/* Technical Stack */}
          <section id="expertise" className="section-container" style={{ height: isMobile ? "auto" : "800px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: isMobile ? "hidden" : "visible" }}>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 style={{ fontSize: isMobile ? "2rem" : "2.5rem", marginBottom: isMobile ? "40px" : "20px" }}>Technical Stack</h2>

              {!isMobile ? (
                <div style={{ width: "100%", height: "500px", position: "relative" }}>
                  <motion.div style={{ width: "100%", height: "100%", position: "absolute", rotateX, rotateY, perspective: "1000px", transformStyle: "preserve-3d", pointerEvents: "none" }}>
                    <svg style={{ position: "absolute", width: "100%", height: "100%", zIndex: 1 }}>
                      {techStack.map(tech => tech.connections.map(targetId => {
                        const target = techStack.find(t => t.id === targetId);
                        return target ? <motion.line key={`${tech.id}-${targetId}`} x1={`${tech.x}%`} y1={`${tech.y}%`} x2={`${target.x}%`} y2={`${target.y}%`} stroke="var(--glass-border)" strokeWidth="1.2" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 4, repeat: Infinity }} /> : null;
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
              ) : (
                <div style={{ width: "100vw", marginLeft: "-20px", overflow: "hidden", position: "relative", padding: "40px 0" }}>
                  <motion.div
                    style={{ display: "flex", gap: "20px", width: "fit-content" }}
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  >
                    {[...techStack, ...techStack].map((tech, i) => (
                      <div
                        key={`${tech.id}-${i}`}
                        className={`mobile-wave mobile-wave-delay-${i % 4}`}
                        style={{
                          width: "100px", height: "100px", flexShrink: 0,
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                          background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
                          borderRadius: "20px"
                        }}
                      >
                        <div style={{ width: "32px", height: "32px", marginBottom: "8px", backgroundColor: "var(--text-color)", WebkitMaskImage: `url(https://api.iconify.design/simple-icons:${tech.icon}.svg)`, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
                        <span style={{ fontSize: "0.6rem", color: "var(--text-color)", opacity: 0.8, fontWeight: "600" }}>{tech.name}</span>
                      </div>
                    ))}
                  </motion.div>
                </div>
              )}
            </motion.div>
          </section>


          {/* Strategic Capabilities */}
          <section id="capabilities" className="section-container">
            <h2 style={{ fontSize: "2.5rem", marginBottom: "60px" }}>Strategic Capabilities</h2>
            <div className="bento-grid">
              <motion.div className="glass bento-item" style={{ gridColumn: "span 2" }} whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.3 }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h4 style={{ fontSize: "1.35rem", color: "var(--text-color)", fontWeight: "700" }}>Full-Stack Development</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>Engineering scalable systems using React, TypeScript, and modern API architectures.</p>
              </motion.div>
              <motion.div className="glass bento-item" whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.3 }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}>
                <h4 style={{ fontSize: "1.35rem", color: "var(--text-color)", fontWeight: "700" }}>Automation</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>Architecting complex workflows to scale operations.</p>
              </motion.div>
              <motion.div className="glass bento-item" whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.3 }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h4 style={{ fontSize: "1.35rem", color: "var(--text-color)", fontWeight: "700" }}>Creative Design</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>Graphic design, brand identities, posters, and high-converting social media collateral.</p>
              </motion.div>
              <motion.div className="glass bento-item" style={{ gridColumn: "span 2" }} whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.3 }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}>
                <h4 style={{ fontSize: "1.35rem", color: "var(--text-color)", fontWeight: "700" }}>Technical Operations</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>High-impact systems organization, execution, and technical support.</p>
              </motion.div>
              <motion.div className="glass bento-item" style={{ gridColumn: "span 3" }} whileHover={{ scale: 1.01, y: -5 }} transition={{ duration: 0.3 }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h4 style={{ fontSize: "1.5rem", color: "var(--accent-color)", fontWeight: "800" }}>Executive Technical Support</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>End-to-end technical assistance and systems organization to help you scale without operational bottlenecks.</p>
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
              <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Creative</h2>
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
                    <img src={`${basePath}${item.image}`} alt={item.title} />
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
              style={{ padding: isMobile ? "30px" : "60px", borderRadius: "40px", border: "1px solid var(--glass-border)", background: "var(--glass-bg)" }}
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.95 }}
              viewport={{ once: true }}
            >
              <div className="contact-grid">
                {/* Left Pane: Professional Context */}
                <div>
                  <span style={{ color: "var(--text-color)", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.75rem", opacity: 0.8 }}>Available for Partnership</span>
                  <h2 className="hero-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginTop: "16px", marginBottom: "24px" }}>Let's <span className="gradient-text">Connect</span></h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "40px" }}>
                    I help high-growth teams and founders bridge the gap between complex systems and executive support. Whether you need an AI-driven workflow, a custom web solution, or targeted digital marketing—let's discuss how we can scale your operations.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-color)", opacity: 0.8 }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>✉️</div>
                      <span>grldprz.yosh@gmail.com</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-color)", opacity: 0.8 }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>🔗</div>
                      <span>linkedin.com/in/geraldperez</span>
                    </div>
                  </div>
                </div>

                {/* Right Pane: Contact Form */}
                <form
                  className="contact-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const target = e.target as HTMLFormElement;
                    const email = (target.elements.namedItem("email") as HTMLInputElement).value;

                    // Owner Email Validation
                    if (email.toLowerCase().trim() === "grldprz.yosh@gmail.com") {
                      setNotification({ type: "error", message: "Sorry, you cannot use this email address." });
                      setTimeout(() => setNotification(null), 5000);
                      return;
                    }

                    // Rate Limiting Logic (30 minutes)
                    const LAST_SUBMIT_KEY = "stark_cosmic_last_submit";
                    const cooldown = 30 * 60 * 1000;
                    const lastSubmit = localStorage.getItem(LAST_SUBMIT_KEY);

                    if (lastSubmit) {
                      const timePassed = Date.now() - parseInt(lastSubmit);
                      if (timePassed < cooldown) {
                        const minutesLeft = Math.ceil((cooldown - timePassed) / 60000);
                        setNotification({
                          type: "error",
                          message: `System cooldown active. Please wait ${minutesLeft} minutes.`
                        });
                        setTimeout(() => setNotification(null), 5000);
                        return;
                      }
                    }

                    setPendingForm(target);
                    setShowConfirmModal(true);
                  }}
                >
                  <div className="form-row">
                    <div className="input-group">
                      <input name="first_name" type="text" placeholder="First Name" required className="input-field" />
                    </div>
                    <div className="input-group">
                      <input name="last_name" type="text" placeholder="Last Name" required className="input-field" />
                    </div>
                  </div>

                  <div className="input-group">
                    <input name="email" type="email" placeholder="Email Address" required className="input-field" />
                  </div>

                  <div className="input-group">
                    <textarea name="message" placeholder="How can I help you?" required className="textarea-field" />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="submit-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    {isSubmitting ? (
                      "Sending Message..."
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </section>

          {/* Confirmation Modal */}
          <AnimatePresence>
            {showConfirmModal && (
              <div className="modal-overlay">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="glass confirm-modal"
                >
                  <h3 className="modal-title">Confirm Submission</h3>
                  <p className="modal-desc">Are you sure you want to send this inquiry? I'll get back to you as soon as possible.</p>
                  <div className="modal-actions">
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className="btn-secondary"
                      style={{ flex: 1, padding: "14px", borderRadius: "12px" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        if (!pendingForm) return;
                        setShowConfirmModal(false);
                        setIsSubmitting(true);

                        try {
                          const result = await emailjs.sendForm(
                            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
                            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
                            pendingForm,
                            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""
                          );

                          if (result.status === 200) {
                            setNotification({ type: "success", message: "Message sent successfully!" });
                            localStorage.setItem("stark_cosmic_last_submit", Date.now().toString());
                            pendingForm.reset();
                            setPendingForm(null);
                          } else {
                            setNotification({ type: "error", message: "Error sending message." });
                          }
                        } catch (err) {
                          console.error("EmailJS Error:", err);
                          setNotification({ type: "error", message: "Network error. Please try again." });
                        } finally {
                          setIsSubmitting(false);
                          setTimeout(() => setNotification(null), 5000);
                        }
                      }}
                      className="btn-primary"
                      style={{ flex: 1, padding: "14px", borderRadius: "12px", background: "var(--text-color)", color: "var(--bg-color)", border: "none", fontWeight: "700" }}
                    >
                      Confirm & Send
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Global Notifications */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, x: 50, y: isMobile ? 50 : 0 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}
                className={`notification-toast ${notification.type === "success" ? "form-success" : "form-error"}`}
                style={{ paddingLeft: "16px", borderLeft: `4px solid ${notification.type === "success" ? "#4ade80" : "#ef4444"}` }}
              >
                <div style={{ fontSize: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: "700" }}>
                  {notification.message}
                </div>
              </motion.div>
            )}
          </AnimatePresence>


          <footer className="section-container" style={{ borderTop: "1px solid var(--glass-border)", padding: "40px 24px", color: "var(--text-secondary)", fontSize: "0.875rem", display: "flex", justifyContent: "space-between" }}>
            <p>© 2026 Gerald Perez</p>
            <div style={{ display: "flex", gap: "24px" }}>
              <Link href="https://www.linkedin.com/in/geraldperez/" target="_blank" className="hover-text">LinkedIn</Link>
              <Link href="https://github.com/geraldlperez" target="_blank" className="hover-text">GitHub</Link>
            </div>
          </footer>

          <ThemeToggle />
        </div>
      </div>

      {/* Precision Sidebar (Right) */}
      <div className="precision-sidebar">
        <Link href="#top" className="sidebar-item" onClick={(e) => handleSmoothScroll(e, "#top")}>
          <span className="sidebar-tooltip">Top</span>
          <div className="sidebar-icon" style={{ backgroundColor: "var(--text-color)", WebkitMaskImage: "url(https://api.iconify.design/lucide:home.svg)", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
        </Link>
        <Link href="#expertise" className="sidebar-item" onClick={(e) => handleSmoothScroll(e, "#expertise")}>
          <span className="sidebar-tooltip">Expertise</span>
          <div className="sidebar-icon" style={{ backgroundColor: "var(--text-color)", WebkitMaskImage: "url(https://api.iconify.design/lucide:zap.svg)", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
        </Link>
        <Link href="#capabilities" className="sidebar-item" onClick={(e) => handleSmoothScroll(e, "#capabilities")}>
          <span className="sidebar-tooltip">Capabilities</span>
          <div className="sidebar-icon" style={{ backgroundColor: "var(--text-color)", WebkitMaskImage: "url(https://api.iconify.design/lucide:layout-grid.svg)", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
        </Link>
        <Link href="#projects" className="sidebar-item" onClick={(e) => handleSmoothScroll(e, "#projects")}>
          <span className="sidebar-tooltip">Projects</span>
          <div className="sidebar-icon" style={{ backgroundColor: "var(--text-color)", WebkitMaskImage: "url(https://api.iconify.design/lucide:briefcase.svg)", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
        </Link>
        <Link href="#creative" className="sidebar-item" onClick={(e) => handleSmoothScroll(e, "#creative")}>
          <span className="sidebar-tooltip">Creative</span>
          <div className="sidebar-icon" style={{ backgroundColor: "var(--text-color)", WebkitMaskImage: "url(https://api.iconify.design/lucide:palette.svg)", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
        </Link>
        <Link href="#contact" className="sidebar-item" onClick={(e) => handleSmoothScroll(e, "#contact")}>
          <span className="sidebar-tooltip">Contact</span>
          <div className="sidebar-icon" style={{ backgroundColor: "var(--text-color)", WebkitMaskImage: "url(https://api.iconify.design/lucide:mail.svg)", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
        </Link>
      </div>

      <AnimatePresence>
        {activeLightbox && (
          <ProjectLightbox
            images={(
              projects.find(p => p.id === activeLightbox.projectId)?.gallery ||
              creativeProjects.filter(p => p.id === activeLightbox.projectId).map(p => p.image) ||
              []
            ).map(img => `${basePath}${img}`)}
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
  const iconUrl = `url(https://api.iconify.design/simple-icons:${tech.icon}.svg)`;
  const particles = useMemo(() => [...Array(12)].map((_, j) => ({ id: j, x: (Math.random() - 0.5) * 160, y: (Math.random() - 0.5) * 160, size: Math.random() * 4 + 2 })), []);

  return (
    <motion.div style={{ position: "absolute", left: `${tech.x}%`, top: `${tech.y}%`, zIndex: isHovered ? 10 : 2, transform: "translate(-50%, -50%)" }} animate={{ y: isHovered ? 0 : [0, -10, 0] }} transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}>
      <div style={{ position: "relative" }}>
        <AnimatePresence>{isHovered && (<div style={{ position: "absolute", top: "50%", left: "50%" }}>{particles.map(p => (<motion.div key={p.id} initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ position: "absolute", width: p.size, height: p.size, background: "var(--text-color)", borderRadius: "50%", boxShadow: "0 0 10px var(--text-color)" }} />))}</div>)}</AnimatePresence>
        <motion.div animate={{ scale: isHovered ? 1.5 : 1, backgroundColor: isHovered ? "var(--glass-bg)" : "rgba(255,255,255,0.05)", borderColor: isHovered ? "var(--text-color)" : "var(--glass-border)" }} style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", border: "1px solid", backdropFilter: "blur(8px)", position: "relative", boxShadow: isHovered ? "0 0 40px var(--glow-primary)" : "none", transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
          <div style={{ width: "24px", height: "24px", backgroundColor: "var(--text-color)", WebkitMaskImage: iconUrl, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center", filter: isHovered ? "drop-shadow(0 0 10px var(--text-color))" : "none" }} />
          <span style={{ position: "absolute", top: "120%", fontSize: "0.7rem", color: "var(--text-color)", opacity: isHovered ? 1 : 0.4, fontWeight: isHovered ? "600" : "400", whiteSpace: "nowrap", textShadow: isHovered ? "0 0 10px var(--text-color)" : "none", transition: "all 0.3s ease" }}>{tech.name}</span>
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
