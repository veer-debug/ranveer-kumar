"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import HeroSection from "@/components/hero-section"
import ExperienceSection from "@/components/experience-section"
import SkillsSection from "@/components/skills-section"
import ProjectsSection from "@/components/projects-section"
import AboutSection from "@/components/about-section"
import ContactSection from "@/components/contact-section"
import ResumeSection from "@/components/resume-section"
import AnimatedCursor from "@/components/animated-cursor"
import SmoothScrollProvider from "@/components/smooth-scroll-provider"
import Chatbot from "@/components/chatbot"


export default function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"])

  useEffect(() => {
    // Register GSAP plugin on client side only
    gsap.registerPlugin(ScrollTrigger)
    
    // GSAP ScrollTrigger animations
    const ctx = gsap.context(() => {
      // Parallax background elements
      gsap.utils.toArray(".parallax-bg").forEach((element: any) => {
        gsap.to(element, {
          yPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        })
      })

      // Section fade-ins
      gsap.utils.toArray(".fade-in-section").forEach((element: any) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          },
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <SmoothScrollProvider>
      <div ref={containerRef} className="relative min-h-screen bg-black text-white overflow-hidden">
        <AnimatedCursor />

        {/* Animated Background */}
        <motion.div className="fixed inset-0 z-0" style={{ y: backgroundY }}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        </motion.div>

        {/* Floating Particles */}
        <div className="fixed inset-0 z-10 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              initial={{
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
              }}
              animate={{
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-20">
          <HeroSection />
          <ExperienceSection />
          <SkillsSection />
          <ProjectsSection />
          <AboutSection />
          <ContactSection />
          <ResumeSection />
        </div>

        {/* Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 z-50"
          style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
        />

        {/* Chatbot */}
        <Chatbot />
      </div>
    </SmoothScrollProvider>
  )
}
