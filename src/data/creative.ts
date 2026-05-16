export interface CreativeProject {
  id: string;
  title: string;
  category: string;
  image: string;
}

export const creativeProjects: CreativeProject[] = [
  {
    id: "creative-1",
    title: "Minimalist",
    category: "Corporate Presentation Design",
    image: "/creative/creative-1.png",
  },
  {
    id: "creative-2",
    title: "Neomorphism",
    category: "Mobile App & UI/UX Design",
    image: "/creative/creative-2.png",
  },
  {
    id: "creative-3",
    title: "Brutalism",
    category: "Event & Campaign Visuals",
    image: "/creative/creative-3.png",
  },
  {
    id: "creative-4",
    title: "Y2K / Neo-Grit",
    category: "Trend-Driven Social Creative",
    image: "/creative/creative-4.png",
  },
  {
    id: "creative-5",
    title: "High-Fashion Editorial",
    category: "Brand Lookbook & Digital Editorial",
    image: "/creative/creative-5.png",
  },
  {
    id: "creative-6",
    title: "Surrealism",
    category: "Creative Campaign & Key Visuals",
    image: "/creative/creative-6.png",
  },
];
