import { RevealProjectCategories } from "@/components/ui/reveal-project-categories"

function ProjectCategoriesSection() {
  return (
    <section className="bg-background px-6 py-24 text-foreground sm:px-8 md:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 md:grid-cols-[0.34fr_0.66fr] md:gap-20">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Selected Fields
          </p>
        </div>

        <div>
          <h2 className="max-w-4xl text-6xl font-semibold leading-[0.9] tracking-normal text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
            Explore My Work
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            A collection of product design, visualization, motion, video and graphic communication
            projects.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl md:mt-28">
        <RevealProjectCategories />
      </div>
    </section>
  )
}

export { ProjectCategoriesSection }
