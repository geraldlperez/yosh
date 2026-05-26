"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export function ProjectCard({ 
  project, 
  basePath, 
  onExpand 
}: { 
  project: any, 
  basePath: string, 
  onExpand: (index: number) => void 
}) {
  const [index, setIndex] = useState(0);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (index + 1) % project.gallery.length;
    setIndex(nextIndex);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIndex = (index - 1 + project.gallery.length) % project.gallery.length;
    setIndex(prevIndex);
  };

  return (
    <motion.div 
      className="glass" 
      whileHover={{ y: -12, scale: 1.01 }} 
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ overflow: "hidden", display: "flex", flexDirection: "column", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.15)" }}
    >
      {/* LARGER Slider Header */}
      <div 
        onClick={() => onExpand(index)} // Trigger Lightbox on click
        style={{ 
          height: "clamp(250px, 40vh, 400px)", // Responsive height
          position: "relative", 
          overflow: "hidden", 
          background: "#000",
          cursor: "zoom-in"
        }} 
      >
        <AnimatePresence mode="wait">
          <motion.img 
            key={index} 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }} 
            transition={{ duration: 0.3 }} 
            src={`${basePath}${project.gallery[index]}`} 
            alt={project.title} 
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} 
          />
        </AnimatePresence>

        {/* Hover Hint */}
        <div className="hover-hint" style={{ position: "absolute", top: "15px", right: "15px", background: "rgba(0,0,0,0.5)", padding: "6px 10px", borderRadius: "8px", fontSize: "0.55rem", color: "white", backdropFilter: "blur(4px)", opacity: 0.8, pointerEvents: "none" }}>
          CLICK TO ENLARGE
        </div>

        <button onClick={prev} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", color: "white", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>‹</button>
        <button onClick={next} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", color: "white", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>›</button>

        <div style={{ position: "absolute", bottom: "15px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px", zIndex: 10 }}>
          {project.gallery.map((_: any, i: number) => (
            <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: i === index ? "white" : "rgba(255,255,255,0.3)", transition: "0.3s" }} />
          ))}
        </div>
      </div>

      <div style={{ padding: "clamp(24px, 5vw, 40px)", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "16px" }}>
          <h3 style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)", marginBottom: "4px" }}>{project.title}</h3>
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "600" }}>
            {project.role}
          </span>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "clamp(0.85rem, 2vw, 0.95rem)", lineHeight: "1.7", marginBottom: "32px" }}>{project.description}</p>
        
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {project.tech.map((t: string) => (
              <img key={t} src={`https://api.iconify.design/simple-icons:${t}.svg?color=white`} style={{ width: "18px", opacity: 0.5 }} alt={t} />
            ))}
          </div>
          <Link href={project.link} target="_blank" className="btn-secondary" style={{ padding: "10px 20px", fontSize: "0.8rem", borderRadius: "10px", flex: "1", textAlign: "center", minWidth: "120px" }}>Visit Project →</Link>
        </div>
      </div>

    </motion.div>
  );
}
