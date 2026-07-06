"use client"

import { cn } from "@/lib/utils"

type ProjectCategory = {
  title: string
  description: string
  images: [string, string]
}

interface RevealProjectCategoriesProps {
  categories?: ProjectCategory[]
  className?: string
}

const defaultCategories: ProjectCategory[] = [
  {
    title: "Product Design",
    description: "Form exploration, product systems, ergonomics, prototyping, and object storytelling.",
    images: [
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    title: "Video Editing",
    description: "Rhythm, pacing, sequencing, color, and edited narratives for design communication.",
    images: [
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    title: "Graphic & Promotion Design",
    description: "Editorial systems, campaign visuals, presentation graphics, and promotional layouts.",
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80",
    ],
  },
]

function RevealProjectCategories({
  categories = defaultCategories,
  className,
}: RevealProjectCategoriesProps) {
  return (
    <div className={cn("w-full border-y border-foreground/10", className)}>
      {categories.map((category, index) => (
        <article
          key={category.title}
          className="group relative grid min-h-[9.5rem] grid-cols-1 items-center overflow-hidden border-b border-foreground/10 py-8 last:border-b-0 md:min-h-[12rem] md:grid-cols-[minmax(0,1fr)_18rem] md:gap-10 md:py-10 lg:min-h-[14rem] lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16 lg:py-12"
        >
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-4 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span className="h-px w-10 bg-foreground/20" />
              <span>Selected Field</span>
            </div>
            <h3 className="max-w-[13ch] text-5xl font-semibold leading-[0.92] tracking-normal text-foreground transition-opacity duration-500 group-hover:opacity-45 sm:text-6xl md:text-7xl lg:text-8xl">
              {category.title}
            </h3>
            <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground opacity-100 transition-opacity duration-500 group-hover:opacity-70 sm:text-base md:max-w-md">
              {category.description}
            </p>
          </div>

          <div className="pointer-events-none relative mt-8 h-44 w-full max-w-[24rem] justify-self-end sm:h-52 md:mt-0 md:h-56 lg:h-64">
            <img
              src={category.images[0]}
              alt={`${category.title} preview one`}
              className="absolute right-12 top-5 h-32 w-44 rotate-[-4deg] object-cover grayscale opacity-100 shadow-2xl transition-all duration-500 ease-out sm:h-40 sm:w-56 md:right-20 md:translate-x-6 md:rotate-0 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:rotate-[-5deg] md:group-hover:opacity-100 lg:h-48 lg:w-64"
            />
            <img
              src={category.images[1]}
              alt={`${category.title} preview two`}
              className="absolute right-0 top-16 h-32 w-44 rotate-[5deg] object-cover grayscale opacity-100 shadow-2xl transition-all duration-700 ease-out sm:h-40 sm:w-56 md:top-20 md:rotate-0 md:opacity-0 md:group-hover:-translate-y-3 md:group-hover:rotate-[7deg] md:group-hover:opacity-100 lg:h-48 lg:w-64"
            />
          </div>
        </article>
      ))}
    </div>
  )
}

export { RevealProjectCategories }
