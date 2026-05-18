import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import ExperienceSection from "@/components/experience-section"
import ProjectsSection from "@/components/projects-section"
import SkillsSection from "@/components/skills-section"
import ContactSection from "@/components/contact-section"
import ResumeSection from "@/components/resume-section"
import SiteFooter from "@/components/site-footer"
import Chatbot from "@/components/chatbot"
import { siteTheme } from "@/lib/site-theme"

export default function Portfolio() {
  return (
    <div className={`min-h-screen ${siteTheme.page} pb-20`}>
      <HeroSection />

      <main>
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
        <ResumeSection />
      </main>

      <SiteFooter />
      <Chatbot autoOpen />
    </div>
  )
}
