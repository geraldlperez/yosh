"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { mouseX, mouseY } = useMousePosition();

  // Parallax transforms - keep subtle
  const springConfig = { damping: 40, stiffness: 80 };
  const starX = useSpring(useTransform(mouseX, [0, 2000], [20, -20]), springConfig);
  const starY = useSpring(useTransform(mouseY, [0, 1000], [20, -20]), springConfig);
  
  const nebulaX = useSpring(useTransform(mouseX, [0, 2000], [40, -40]), springConfig);
  const nebulaY = useSpring(useTransform(mouseY, [0, 1000], [40, -40]), springConfig);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main style={{ position: "relative", opacity: mounted ? 1 : 0, transition: "opacity 1.5s ease", minHeight: "100vh" }}>
      
      {/* Immersive White/Silver Galaxy Background */}
      <div className="galaxy-bg" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, background: "#020205", overflow: "hidden" }}>
        
        {/* White Nebula Mist */}
        <motion.div style={{ x: nebulaX, y: nebulaY, width: "100%", height: "100%" }}>
          <div className="nebula" style={{ top: "-5%", left: "-5%" }} />
          <div className="nebula" style={{ bottom: "-5%", right: "-5%" }} />
        </motion.div>

        {/* Dynamic Starfield & Sequential "Rhythm" Shooting Stars */}
        <motion.div style={{ x: starX, y: starY }} className="stars-container">
          {mounted && [...Array(120)].map((_, i) => (
            <div 
              key={i} 
              className="star-dot" 
              style={{ 
                top: `${(i * 23.7) % 100}%`, 
                left: `${(i * 17.3) % 100}%`,
                width: i % 10 === 0 ? "2px" : "1px",
                height: i % 10 === 0 ? "2px" : "1px",
                // @ts-ignore
                "--duration": `${2 + (i % 6)}s`
              }} 
            />
          ))}

          {/* SEQUENTIAL RHYTHM: One star at a time with 5s gaps */}
          {mounted && [...Array(10)].map((_, i) => {
            const edge = i % 4;
            let top = "0%", left = "0%", rotate = 0;
            
            if (edge === 0) { // Left Edge
              top = `${Math.random() * 100}%`;
              left = "-15%";
              rotate = -30 + Math.random() * 60;
            } else if (edge === 1) { // Top Edge
              top = "-15%";
              left = `${Math.random() * 100}%`;
              rotate = 60 + Math.random() * 60;
            } else if (edge === 2) { // Right Edge
              top = `${Math.random() * 100}%`;
              left = "115%";
              rotate = 150 + Math.random() * 60;
            } else { // Bottom Edge
              top = "115%";
              left = `${Math.random() * 100}%`;
              rotate = 240 + Math.random() * 60;
            }

            return (
              <div 
                key={`star-rhythm-${i}`}
                style={{
                  position: "absolute",
                  top,
                  left,
                  transform: `rotate(${rotate}deg)`,
                  pointerEvents: "none"
                }}
              >
                <div 
                  className="shooting-star" 
                  style={{ 
                    width: `${80 + Math.random() * 80}px`,
                    // @ts-ignore
                    "--duration": "60s",
                    "--delay": `${i * 6}s` 
                  }} 
                />
              </div>
            );
          })}
        </motion.div>

        {/* The Silver Moon */}
        <motion.div 
          className="planet"
          style={{ top: "15%", right: "8%", x: useSpring(useTransform(mouseX, [0, 2000], [15, -15]), springConfig), y: useSpring(useTransform(mouseY, [0, 1000], [15, -15]), springConfig) }}
          animate={{ rotate: 360, y: [0, 20, 0] }}
          transition={{ rotate: { duration: 300, repeat: Infinity, ease: "linear" }, y: { duration: 30, repeat: Infinity, ease: "easeInOut" } }}
        />
      </div>

      {/* Content Layer */}
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
              <div className="float" style={{ position: "relative", zIndex: 2 }}>
                <div className="glass light-sweep" style={{ padding: "12px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <img src="/test-3.png" alt="Gerald Perez" style={{ width: "100%", borderRadius: "16px", filter: "brightness(95%) contrast(105%) grayscale(20%)" }} />
                </div>
              </div>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "140%", height: "140%", background: "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)", zIndex: 1 }} />
            </motion.div>
          </div>
        </section>

        {/* Selected Solutions */}
        <section id="projects" className="section-container">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "60px" }}>Selected Solutions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "40px" }}>
              <motion.div className="glass" whileHover={{ y: -10 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
                <div style={{ height: "300px", overflow: "hidden" }}>
                  <img src="/automation-suite.png" alt="Automation Suite" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
                </div>
                <div style={{ padding: "32px" }}>
                  <h3 style={{ fontSize: "1.75rem", marginBottom: "16px" }}>Intelligent Automation</h3>
                  <p style={{ color: "var(--text-secondary)", marginBottom: "24px", lineHeight: "1.6" }}>Building autonomous workflows that eliminate manual data entry and executive overhead.</p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <span className="glass" style={{ padding: "6px 14px", fontSize: "0.75rem", fontWeight: "600" }}>Python</span>
                    <span className="glass" style={{ padding: "6px 14px", fontSize: "0.75rem", fontWeight: "600" }}>Zapier/Make</span>
                  </div>
                </div>
              </motion.div>

              <motion.div className="glass" whileHover={{ y: -10 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
                <div style={{ height: "300px", overflow: "hidden" }}>
                  <img src="/ecommerce-hub.png" alt="E-commerce Hub" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
                </div>
                <div style={{ padding: "32px" }}>
                  <h3 style={{ fontSize: "1.75rem", marginBottom: "16px" }}>Full-Stack Ops Hub</h3>
                  <p style={{ color: "var(--text-secondary)", marginBottom: "24px", lineHeight: "1.6" }}>Custom internal tools and dashboards for high-level executive decision making.</p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <span className="glass" style={{ padding: "6px 14px", fontSize: "0.75rem", fontWeight: "600" }}>Next.js</span>
                    <span className="glass" style={{ padding: "6px 14px", fontSize: "0.75rem", fontWeight: "600" }}>Dashboards</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Expertise Grid */}
        <section id="expertise" className="section-container">
          <h2 style={{ fontSize: "2.5rem", marginBottom: "60px" }}>Strategic Capabilities</h2>
          <div className="bento-grid">
            <motion.div className="glass bento-item" style={{ gridColumn: "span 2", background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(0,0,0,0) 100%)" }} whileHover={{ scale: 1.02 }}>
              <h4 style={{ fontSize: "1.25rem", color: "white" }}>Web Development</h4>
              <p style={{ color: "var(--text-secondary)" }}>Engineering robust front-end and back-end systems using React, TypeScript, and modern API architectures.</p>
            </motion.div>
            <motion.div className="glass bento-item" whileHover={{ scale: 1.02 }}>
              <h4 style={{ fontSize: "1.25rem", color: "white" }}>Automation Architecture</h4>
              <p style={{ color: "var(--text-secondary)" }}>Architecting complex multi-step workflows to scale virtual operations.</p>
            </motion.div>
            <motion.div className="glass bento-item" whileHover={{ scale: 1.02 }}>
              <h4 style={{ fontSize: "1.25rem", color: "white" }}>Executive Strategy</h4>
              <p style={{ color: "var(--text-secondary)" }}>High-level coordination, project management, and operational leadership.</p>
            </motion.div>
            <motion.div className="glass bento-item" style={{ gridColumn: "span 2" }} whileHover={{ scale: 1.02 }}>
              <h4 style={{ fontSize: "1.25rem", color: "white" }}>Technical VA Support</h4>
              <p style={{ color: "var(--text-secondary)" }}>Providing deep technical expertise to support founders and C-suite executives in their day-to-day operations.</p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section-container" style={{ textAlign: "center", paddingBottom: "160px" }}>
          <motion.div className="glass" style={{ padding: "80px 40px", borderRadius: "40px", border: "1px solid rgba(255, 255, 255, 0.3)", background: "rgba(255, 255, 255, 0.02)" }} whileInView={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.95 }} viewport={{ once: true }}>
            <h2 className="hero-title" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>Scale your <span className="gradient-text">operations</span>.</h2>
            <p className="subtitle" style={{ margin: "24px auto" }}>Ready to hire a Technical Partner for your next phase of growth?</p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "40px" }}>
              <a href="mailto:hello@gerald.dev" className="btn-primary">Book a Strategy Call</a>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
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
