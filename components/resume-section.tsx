"use client"

import { Download, Eye, GraduationCap, Briefcase, Award } from "lucide-react"
import { siteTheme } from "@/lib/site-theme"

const SKILLS = {
  programming: ["Python", "JavaScript", "C/C++", "TypeScript"],
  data: ["NumPy", "Pandas", "PySpark", "MLflow"],
  ml: ["Machine Learning", "Deep Learning", "Scikit-Learn", "TensorFlow", "YOLO", "Computer Vision"],
  infra: ["FastAPI", "Flask", "Streamlit", "Celery", "Docker"],
  database: ["PostgreSQL", "MySQL", "MongoDB"],
  frontend: ["React", "Next.js", "Tailwind CSS", "HTML", "CSS"],
  tools: ["Git", "GitHub", "Linux", "VS Code", "Jupyter"],
}

const STATS = [
  { label: "Years of experience", value: "1+" },
  { label: "Projects completed", value: "6+" },
  { label: "Technologies", value: "15+" },
]

export default function ResumeSection() {
  return (
    <section id="resume" className="py-16 md:py-24 px-[5%] bg-paper-2 border-t-2 border-black">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-10 md:mb-14">
          <span className="section-number absolute -top-4 left-0 pointer-events-none" aria-hidden>
            07
          </span>
          <h2 className="editorial-section-title relative pt-8 md:pt-12">Resume</h2>
          <p className="text-ink-3 font-mono text-sm mt-4">PDF download or preview on Google Drive.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 editorial-card p-6 md:p-8">
            <div className="text-center mb-8 pb-8 border-b border-paper-3">
              <h3 className="text-2xl font-bold text-ink">Ranveer Kumar</h3>
              <p className="text-ink-3 mt-1 font-mono text-sm">AI / Machine Learning Developer</p>
              <p className="text-sm text-ink-3 mt-3 font-mono">
                7033882318 · ranveep097@gmail.com
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="shrink-0" size={22} />
                <h4 className="text-lg font-bold text-ink">Education</h4>
              </div>
              <div className="pl-1 md:pl-9">
                <h5 className="font-semibold text-ink">Shaheed Bhagat Singh State University</h5>
                <p className="text-ink-3 text-sm">B.Tech — Computer Science</p>
                <p className="text-ink-3 text-sm mt-1 font-mono">Sep 2021 – May 2025 · CGPA 7.0 · Ferozepur, Punjab</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Award className="shrink-0" size={22} />
                <h4 className="text-lg font-bold text-ink">Technical skills</h4>
              </div>
              <div className="space-y-3 pl-1 md:pl-9">
                {Object.entries(SKILLS).map(([category, items]) => (
                  <p key={category} className="text-sm text-ink-3">
                    <span className="font-semibold text-ink capitalize">
                      {category.replace(/([A-Z])/g, " $1").trim()}:
                    </span>{" "}
                    {items.join(", ")}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="shrink-0" size={22} />
                <h4 className="text-lg font-bold text-ink">Experience highlights</h4>
              </div>
              <ul className="space-y-2 text-sm text-ink-3 pl-1 md:pl-9">
                <li className="flex gap-2"><span className="font-mono">→</span>1+ year building LLM, RAG, and computer vision systems in production</li>
                <li className="flex gap-2"><span className="font-mono">→</span>Member of technical staff at Octro Inc.; AI internships at TOD-SMA (US), Damsonic, and Sabudh Foundation</li>
                <li className="flex gap-2"><span className="font-mono">→</span>End-to-end pipelines: data → model → API → deployment</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`${siteTheme.cardEditorial}`}>
              <h4 className="text-lg font-bold text-ink mb-2">Download resume</h4>
              <p className="text-ink-3 text-sm mb-6">
                Full PDF with projects, internships, and technical detail.
              </p>
              <div className="space-y-3">
                <a href="/api/download-resume" download="Ranveer_Kumar_Resume.pdf" className={`${siteTheme.btnPrimary} w-full text-center`}>
                  <Download size={18} className="inline mr-2" />
                  Download PDF
                </a>
                <a
                  href="https://drive.google.com/file/d/1OOO6zi8kWjvAuuSPpozG4crjfaXY-Yhi/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${siteTheme.btnSecondary} w-full text-center inline-flex items-center justify-center gap-2`}
                >
                  <Eye size={18} />
                  Preview online
                </a>
              </div>
            </div>

            <div className={siteTheme.cardEditorial}>
              <h4 className="text-lg font-bold text-ink mb-4">Quick stats</h4>
              <ul className="space-y-4">
                {STATS.map((stat) => (
                  <li key={stat.label} className="flex justify-between items-center text-sm">
                    <span className="text-ink-3 font-mono text-xs uppercase">{stat.label}</span>
                    <span className="font-bold">{stat.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
