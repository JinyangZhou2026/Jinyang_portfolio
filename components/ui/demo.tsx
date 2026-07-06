import { Home, User, Briefcase, FileText, Sparkles } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"
import DisplayCards from "@/components/ui/display-cards"
import DigitalSerenity from "@/components/ui/digital-serenity-animated-landing-page"
import { MagicText } from "@/components/ui/magic-text"
import SocialCards from "@/components/ui/card-fan-carousel"

export function NavBarDemo() {
  const navItems = [
    { name: "Home", url: "#", icon: Home },
    { name: "About", url: "#", icon: User },
    { name: "Projects", url: "#", icon: Briefcase },
    { name: "Resume", url: "#", icon: FileText },
  ]

  return <NavBar items={navItems} />
}

const displayCards = [
  {
    icon: <Sparkles className="size-4 text-neutral-200" />,
    title: "Product Design",
    description: "Objects, systems, form",
    date: "Featured field",
    iconClassName: "bg-neutral-950 text-neutral-50",
    titleClassName: "text-foreground",
    className:
      "[grid-area:stack] grayscale-[100%] before:absolute before:left-0 before:top-0 before:h-[100%] before:w-[100%] before:rounded-xl before:bg-background/50 before:bg-blend-overlay before:outline before:outline-1 before:outline-border before:content-[''] before:transition-opacity before:duration-700 hover:-translate-y-10 hover:grayscale-0 hover:before:opacity-0",
  },
  {
    icon: <Sparkles className="size-4 text-neutral-200" />,
    title: "Communication",
    description: "Video, decks, promotion",
    date: "Narrative systems",
    iconClassName: "bg-neutral-950 text-neutral-50",
    titleClassName: "text-foreground",
    className:
      "[grid-area:stack] translate-x-12 translate-y-10 grayscale-[100%] before:absolute before:left-0 before:top-0 before:h-[100%] before:w-[100%] before:rounded-xl before:bg-background/50 before:bg-blend-overlay before:outline before:outline-1 before:outline-border before:content-[''] before:transition-opacity before:duration-700 hover:-translate-y-1 hover:grayscale-0 hover:before:opacity-0",
  },
  {
    icon: <Sparkles className="size-4 text-neutral-200" />,
    title: "Graphic Design",
    description: "Identity, posters, campaigns",
    date: "Promotion systems",
    iconClassName: "bg-neutral-950 text-neutral-50",
    titleClassName: "text-foreground",
    className: "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
  },
]

function DisplayCardsDemo() {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center py-20">
      <div className="w-full max-w-3xl">
        <DisplayCards cards={displayCards} />
      </div>
    </div>
  )
}

export { DisplayCardsDemo }

const DemoOne = () => {
  return <DigitalSerenity />
}

export { DemoOne }

const Demo = () => {
  return (
    <div className="relative mt-[70rem] flex items-center justify-center pb-[30rem]">
      <MagicText text="From product concepts to visual storytelling, this portfolio showcases projects across design, motion and communication." />
      <p className="absolute left-1/2 top-1/2 -translate-x-1/2 text-muted-foreground">
        Scroll Down
      </p>
    </div>
  )
}

const MagicTextDemo = Demo

export { Demo }
export { MagicTextDemo }

const fanCarouselCards = [
  { imgUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=700&fit=crop", alt: "Mountain landscape" },
  { imgUrl: "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=400&h=700&fit=crop", alt: "City night" },
  { imgUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=700&fit=crop", alt: "Foggy forest" },
  { imgUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=700&fit=crop", alt: "Sunlit woods" },
  { imgUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=700&fit=crop", alt: "Tropical beach" },
  { imgUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=700&fit=crop", alt: "Starry mountain" },
  { imgUrl: "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=400&h=700&fit=crop", alt: "Golden sunset" },
  { imgUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=700&fit=crop", alt: "Lake reflection" },
  { imgUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=700&fit=crop", alt: "Green valley" },
  { imgUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=700&fit=crop", alt: "Sunbeam nature" },
]

export function FanCarouselDemo() {
  return (
    <div className="flex min-h-screen items-center">
      <SocialCards cards={fanCarouselCards} />
    </div>
  )
}
