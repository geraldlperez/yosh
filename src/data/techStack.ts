export const techStack = [
  { id: "py", name: "Python", icon: "python", x: 20, y: 30, connections: ["zap", "n8n", "pd"] },
  { id: "js", name: "JavaScript", icon: "javascript", x: 50, y: 40, connections: ["react", "node"] },
  { id: "react", name: "React", icon: "react", x: 70, y: 35, connections: ["next", "js", "fra"] },
  { id: "next", name: "Next.js", icon: "nextdotjs", x: 85, y: 50, connections: ["react", "ver", "fra", "fir", "sup"] },
  { id: "fra", name: "Framer Motion", icon: "framer", x: 80, y: 20, connections: ["react", "next"] },
  { id: "zap", name: "Zapier", icon: "zapier", x: 35, y: 15, connections: ["py", "n8n"] },
  { id: "n8n", name: "n8n", icon: "n8n", x: 10, y: 10, connections: ["py", "zap"] },
  { id: "node", name: "Node.js", icon: "nodedotjs", x: 45, y: 60, connections: ["js", "off"] },
  { id: "ts", name: "TypeScript", icon: "typescript", x: 75, y: 65, connections: ["next", "react"] },
  { id: "pd", name: "Pandas", icon: "pandas", x: 30, y: 45, connections: ["py", "sql"] },
  { id: "sql", name: "SQL", icon: "sqlite", x: 25, y: 70, connections: ["pd", "pg", "fir"] },
  { id: "pg", name: "PostgreSQL", icon: "postgresql", x: 15, y: 85, connections: ["sql", "sup"] },
  { id: "fir", name: "Firebase", icon: "firebase", x: 5, y: 60, connections: ["sql", "next"] }, // <--- ADDED
  { id: "sup", name: "Supabase", icon: "supabase", x: 35, y: 90, connections: ["pg", "next"] }, // <--- ADDED
  { id: "ver", name: "Vercel", icon: "vercel", x: 90, y: 80, connections: ["next"] },
  { id: "fig", name: "Figma", icon: "figma", x: 60, y: 85, connections: ["can"] },
  { id: "can", name: "Canva", icon: "canva", x: 80, y: 90, connections: ["fig"] },
  { id: "off", name: "Microsoft Office", icon: "microsoftoffice", x: 55, y: 15, connections: ["node"] },
];
