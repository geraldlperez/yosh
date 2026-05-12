"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

export function ConstellationIcon({ tech, i, isHovered }: { tech: any, i: number, isHovered: boolean }) {
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
            scale: isHovered ? 1.5 : 1, 
            backgroundColor: isHovered ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.05)", 
            borderColor: isHovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)" 
          }} 
          style={{ 
            width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", 
            borderRadius: "12px", border: "1px solid", backdropFilter: "blur(8px)", position: "relative", 
            boxShadow: isHovered ? "0 0 40px rgba(255,255,255,0.5)" : "none", 
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" 
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
