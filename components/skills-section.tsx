import { siteTheme } from "@/lib/site-theme"

const SKILLS = [
  "Python", "LangChain", "RAG", "LLMs", "FastAPI", "Flask", "TensorFlow", "YOLO",
  "PostgreSQL", "Docker", "React", "Next.js", "OpenCV", "Git",
]

export default function SkillsSection() {
  return (
    <section id="skills" className="py-16 md:py-24 px-[5%] bg-paper border-b-2 border-black">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-10 md:mb-14">
          <span className="section-number absolute -top-4 left-0 pointer-events-none" aria-hidden>
            05
          </span>
          <h2 className="editorial-section-title relative pt-8 md:pt-12">Skills</h2>
        </div>

        <p className={`${siteTheme.sectionSubtitle} mb-10 max-w-2xl`}>
          Tools I reach for weekly — not a certification laundry list.
        </p>

        <div className="flex flex-wrap gap-2 md:gap-3">
          {SKILLS.map((skill) => (
            <span key={skill} className={siteTheme.tag}>
              #{skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
