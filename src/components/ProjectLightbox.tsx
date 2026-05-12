"use client";

import { motion, AnimatePresence } from "framer-motion";

export function ProjectLightbox({ 
  images, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev 
}: { 
  images: string[], 
  currentIndex: number, 
  onClose: () => void,
  onNext: () => void,
  onPrev: () => void
}) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      style={{ 
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
        zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.9)", backdropFilter: "blur(20px)"
      }}
    >
      {/* Close Area */}
      <div onClick={onClose} style={{ position: "absolute", width: "100%", height: "100%", cursor: "zoom-out" }} />

      {/* Main Image Container */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }}
        style={{ position: "relative", maxWidth: "90vw", maxHeight: "85vh", zIndex: 10000 }}
      >
        <img 
          src={images[currentIndex]} 
          alt="Full Screen View" 
          style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "12px", boxShadow: "0 0 100px rgba(255,255,255,0.1)" }} 
        />

        {/* Navigation Overlays */}
        <button 
          onClick={onPrev}
          style={{ position: "absolute", left: "-60px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", color: "white", width: "50px", height: "50px", borderRadius: "50%", cursor: "pointer", fontSize: "1.5rem" }}
        >
          ‹
        </button>
        <button 
          onClick={onNext}
          style={{ position: "absolute", right: "-60px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", color: "white", width: "50px", height: "50px", borderRadius: "50%", cursor: "pointer", fontSize: "1.5rem" }}
        >
          ›
        </button>

        {/* Close Button Top Right */}
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: "-50px", right: "0", background: "none", border: "none", color: "white", fontSize: "2rem", cursor: "pointer", opacity: 0.7 }}
        >
          ✕
        </button>

        {/* Counter */}
        <div style={{ position: "absolute", bottom: "-40px", left: "50%", transform: "translateX(-50%)", color: "white", opacity: 0.5, fontSize: "0.8rem", letterSpacing: "0.2em" }}>
          {currentIndex + 1} / {images.length}
        </div>
      </motion.div>
    </motion.div>
  );
}
