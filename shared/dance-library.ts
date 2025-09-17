export type DanceVideoCategory = "hip-hop" | "latin" | "k-pop" | "urban" | "ballet";

export interface DanceVideo {
  id: string;
  title: string;
  choreographer: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  category: DanceVideoCategory;
  description: string;
  previewUrl: string;
  coverImage: string;
  r2ObjectKey: string;
}

export const DANCE_VIDEOS: DanceVideo[] = [
  {
    id: "urban-electric",
    title: "Urban Electric Groove",
    choreographer: "Nova Chen",
    difficulty: "Intermediate",
    duration: "1:12",
    category: "urban",
    description:
      "A high-energy routine that blends locking, popping, and modern urban grooves. Perfect for performers who love bold musicality.",
    previewUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    coverImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    r2ObjectKey: "videos/urban-electric-groove.mp4",
  },
  {
    id: "latin-sunrise",
    title: "Latin Sunrise Flow",
    choreographer: "Camila Reyes",
    difficulty: "Beginner",
    duration: "0:58",
    category: "latin",
    description:
      "A vibrant reggaeton-inspired combo with smooth isolations and plenty of room for personal flair.",
    previewUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    coverImage:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    r2ObjectKey: "videos/latin-sunrise-flow.mp4",
  },
  {
    id: "kpop-nebula",
    title: "Nebula Pop Sequence",
    choreographer: "Ji-eun Park",
    difficulty: "Advanced",
    duration: "1:26",
    category: "k-pop",
    description:
      "A polished K-pop routine with precise angles, synchronized footwork, and cinematic transitions.",
    previewUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    coverImage:
      "https://images.unsplash.com/photo-1533109721029-5048e1b6b002?auto=format&fit=crop&w=1200&q=80",
    r2ObjectKey: "videos/nebula-pop-sequence.mp4",
  },
  {
    id: "ballet-lumina",
    title: "Lumina Ballet Variation",
    choreographer: "Elena Morozova",
    difficulty: "Intermediate",
    duration: "1:05",
    category: "ballet",
    description:
      "A neoclassical ballet phrase featuring sweeping adagios and delicate footwork inspired by moonlit performances.",
    previewUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    coverImage:
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80",
    r2ObjectKey: "videos/lumina-ballet-variation.mp4",
  },
  {
    id: "hiphop-stratos",
    title: "Stratos Hip-Hop Routine",
    choreographer: "Dante Miles",
    difficulty: "Advanced",
    duration: "1:18",
    category: "hip-hop",
    description:
      "An explosive hip-hop set with athletic floorwork, sharp dynamics, and glitched-out beats for dramatic stage moments.",
    previewUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    coverImage:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1200&q=80",
    r2ObjectKey: "videos/stratos-hiphop-routine.mp4",
  },
];
