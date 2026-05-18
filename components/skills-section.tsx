import { siteTheme } from "@/lib/site-theme"

const SKILLS = [
  "Python",
  "JavaScript",
  "C/C++",
  "SQL",
  "Linux",
  "VS Code",
  "Jupyter",
  "Colab",
  "RAG",
  "LangChain",
  "LangGraph",
  "AI Agents",
  "Computer Vision",
  "YOLO",
  "Scikit-Learn",
  "PySpark",
  "NumPy",
  "Pandas",
  "FastAPI",
  "Flask",
  "Streamlit",
  "Authentication",
  "JWT",
  "MySQL",
  "Git",
  "MCP Server",
  "A2A",
  "GitHub",
  "Matplotlib",
  "Seaborn",
  "Plotly",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Machine Learning",
  "Deep Learning",
  "API Development",
  "Data Visualization",
  "Data Processing",
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
          Skills &amp; tools — languages, ML/AI stack, backends, and data workflows.
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
