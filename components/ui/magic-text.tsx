"use client"

import * as React from "react"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"

export interface MagicTextProps {
  text: string
}

interface WordProps {
  children: string
  progress: MotionValue<number>
  range: [number, number]
}

const Word: React.FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1])

  return (
    <span className="relative mr-2 mt-3 inline-block text-3xl font-semibold leading-none md:text-5xl">
      <span className="absolute opacity-20">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  )
}

export const MagicText: React.FC<MagicTextProps> = ({ text }) => {
  const container = React.useRef<HTMLParagraphElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.25"],
  })

  const words = text.split(" ")

  return (
    <p ref={container} className="flex flex-wrap p-4 leading-[0.85] text-foreground">
      {words.map((word, index) => {
        const start = index / words.length
        const end = start + 1 / words.length

        return (
          <Word key={`${word}-${index}`} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        )
      })}
    </p>
  )
}
