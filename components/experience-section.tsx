"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, TrendingUp } from "lucide-react"
import { siteTheme } from "@/lib/site-theme"

export default function ExperienceSection() {
  const experiences = [
    {
      company: "Octro Inc.",
      role: "Artificial Intelligence Intern",
      duration: "Jul 2025 - Present · 6 mos",
      location: "Noida, Uttar Pradesh, India · On-site",
      description:
        "Worked on LLM-powered features, RAG pipelines and production AI components for game analytics and automation.",
      achievements: [
        "Built LLM-based analytics and RAG retrieval components",
        "Automated game testing flows using Python and vision models",
        "Integrated OCR and object-detection for in-game telemetry",
      ],
      tech: ["Python", "LLMs", "LangChain", "RAG", "YOLO", "OCR"],
    },
    {
      company: "SMA (The Program Lifecycle Company)",
      role: "Artificial Intelligence Intern",
      duration: "Apr 2025 - Jul 2025 · 4 mos",
      location: "California, United States · Remote",
      description:
        "Developed autonomous AI agents and production-ready RAG systems; implemented automated support/response pipelines using LLMs and messaging integrations.",
      achievements: [
        "Implemented agent-based automation for customer workflows",
        "Built RAG-backed support assistant reducing manual handling",
        "Worked on prompt engineering and end-to-end agent orchestration",
      ],
      tech: ["Python", "AI Agents", "LangChain", "RAG", "LLMs"],
    },
    {
      company: "Damsonic",
      role: "AI Intern",
      duration: "Jan 2025 - Jun 2025 · 6 mos",
      location: "Begusarai, Bihar, India · Remote",
      description:
        "Worked on applied ML and data science tasks including feature engineering, model training and evaluation for production use-cases.",
      achievements: [
        "Delivered improvements to model accuracy through feature engineering",
        "Built evaluation pipelines and reproducible training scripts",
      ],
      tech: ["Python", "Pandas", "NumPy", "Scikit-Learn", "TensorFlow"],
    },
    {
      company: "Sabudh Foundation",
      role: "Data Science Intern",
      duration: "Jul 2024 - Dec 2024 · 6 mos",
      location: "Punjab, India · Remote",
      description:
        "Worked on data pipelines, feature engineering and ML models for social-impact datasets; responsible for end-to-end data processing and visualization.",
      achievements: [
        "Built feature engineering pipelines for large datasets",
        "Produced visualizations and insights used by stakeholders",
      ],
      tech: [
        "Feature Engineering",
        "Machine Learning",
        "Python",
        "Pandas",
        "NumPy",
        "Scikit-Learn",
        "Matplotlib",
        "Seaborn",
      ],
    },
    {
      company: "Alphanumeric Ideas",
      role: "Web Development Intern",
      duration: "Jun 2023 - Aug 2023 · 3 mos",
      location: "Mohali district, India · On-site",
      description:
        "Worked on frontend and small backend tasks; improved UI and implemented algorithmic features.",
      achievements: ["Delivered frontend components and assisted with backend integration"],
      tech: ["HTML", "CSS", "JavaScript", "Algorithms", "Communication"],
    },
  ]

  const leadership = [
    {
      role: "NCC B Certificate Holder",
      organization: "National Cadet Corps",
      duration: "2021 - Present",
      description:
        "NCC 'B' grade certificate holder with excellence in physical training and discipline",
    },
    {
      role: "Codeforces Pupil",
      organization: "Codeforces",
      duration: "Ongoing",
      description:
        "Achieved maximum rating of 1374 (Pupil) on Codeforces competitive programming platform",
    },
  ]

  return (
    <section id="experience" className="py-16 md:py-24 px-[5%] bg-paper border-b-2 border-black">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-10 md:mb-14">
          <span className="section-number absolute -top-4 left-0 pointer-events-none" aria-hidden>
            03
          </span>
          <h2 className="editorial-section-title relative pt-8 md:pt-12">Experience</h2>
          <p className="text-ink-3 font-mono text-sm mt-4 max-w-2xl">
            Internships across AI, data science, and web — newest first.
          </p>
        </div>

        <div className="editorial-timeline-line ml-3 md:ml-4 pl-8 md:pl-10 space-y-0">
          {experiences.map((exp, index) => (
            <motion.article
              key={index}
              className="relative pb-10 last:pb-0 interactive"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              viewport={{ once: true }}
            >
              <span className="absolute -left-[41px] md:-left-[49px] top-2 editorial-timeline-dot" aria-hidden />
              <div className={siteTheme.cardEditorial}>
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-ink mb-1">{exp.role}</h4>
                    <p className="font-mono text-sm font-bold uppercase mb-3">{exp.company}</p>
                    <p className="text-ink-3 leading-relaxed">{exp.description}</p>
                  </div>
                  <div className="flex flex-col lg:items-end lg:text-right text-sm text-ink-3 shrink-0 gap-1">
                    <div className="flex items-center lg:justify-end gap-2">
                      <Calendar size={14} />
                      <span>{exp.duration}</span>
                    </div>
                    <div className="flex items-center lg:justify-end gap-2">
                      <MapPin size={14} />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-5 pt-4 border-t border-paper-3">
                  <h6 className="text-xs font-semibold text-ink mb-3 flex items-center uppercase tracking-wide">
                    <TrendingUp size={14} className="mr-2" />
                    Key achievements
                  </h6>
                  <ul className="grid md:grid-cols-2 gap-2 text-ink-3 text-sm">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono">→</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {exp.tech.map((tech) => (
                    <span key={tech} className="editorial-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 pt-12 border-t border-paper-3">
          <p className="editorial-eyebrow mb-6">Beyond work</p>
          <h3 className="text-xl font-bold text-ink mb-8 font-mono uppercase tracking-wider">Also</h3>
          <div className="grid md:grid-cols-2 gap-5">
            {leadership.map((role, index) => (
              <motion.div
                key={index}
                className={`${siteTheme.cardEditorial} interactive`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-bold text-ink mb-2">{role.role}</h4>
                <p className="font-mono text-sm font-bold uppercase mb-2">{role.organization}</p>
                <p className="text-ink-3 text-sm mb-3">{role.duration}</p>
                <p className="text-ink-3 text-sm leading-relaxed">{role.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
