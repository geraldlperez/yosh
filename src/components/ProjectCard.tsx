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
      whileHover={{ y: -10 }} 
      style={{ overflow: "hidden", display: "flex", flexDirection: "column", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.15)" }}
    >
      {/* LARGER Slider Header */}
      <div 
        onClick={() => onExpand(index)} // Trigger Lightbox on click
        style={{ 
          height: "400px", // Increased from 300px
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
        <div className="hover-hint" style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(0,0,0,0.5)", padding: "8px 12px", borderRadius: "10px", fontSize: "0.6rem", color: "white", backdropFilter: "blur(4px)", opacity: 0.8, pointerEvents: "none" }}>
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

      <div style={{ padding: "40px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "16px" }}>
          <h3 style={{ fontSize: "1.75rem", marginBottom: "4px" }}>{project.title}</h3>
          <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "600" }}>
            {project.role}
          </span>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.7", marginBottom: "32px" }}>{project.description}</p>
        
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {project.tech.map((t: string) => (
              <img key={t} src={`https://api.iconify.design/simple-icons:${t}.svg?color=white`} style={{ width: "20px", opacity: 0.5 }} alt={t} />
            ))}
          </div>
          <Link href={project.link} target="_blank" className="btn-secondary" style={{ padding: "10px 20px", fontSize: "0.85rem", borderRadius: "10px" }}>Visit Project →</Link>
        </div>
      </div>
    </motion.div>
  );
}
