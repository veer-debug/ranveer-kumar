export type ExperienceDate = {
  year: number
  /** 1–12 */
  month: number
}

export type ExperienceType = "fulltime" | "internship"

export type ProfessionalExperience = {
  id: string
  type: ExperienceType
  company: string
  role: string
  start: ExperienceDate
  /** `null` = current role */
  end: ExperienceDate | null
  location: string
  description: string
  achievements: string[]
  tech: string[]
}

export const PROFESSIONAL_EXPERIENCES: ProfessionalExperience[] = [
  {
    id: "curetx",
    type: "fulltime",
    company: "Curetx",
    role: "AI Engineer",
    start: { year: 2025, month: 12 },
    end: null,
    location: "United States · Remote",
    description:
      "Working on context engineering, optimization, and prompt/evaluation harness for production LLM systems.",
    achievements: [
      "Designed context engineering strategies to improve LLM answer quality",
      "Optimized inference and retrieval pipelines for latency and cost",
      "Built and maintained a prompt/evaluation harness for production AI systems",
    ],
    tech: ["Python", "LLMs", "Context Engineering", "Prompt Engineering", "RAG", "Optimization"],
  },
  {
    id: "octro",
    type: "fulltime",
    company: "Octro Inc.",
    role: "Member of Technical Staff",
    start: { year: 2025, month: 7 },
    end: null,
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
    id: "sma",
    type: "internship",
    company: "SMA (The Program Lifecycle Company)",
    role: "Artificial Intelligence Intern",
    start: { year: 2025, month: 4 },
    end: { year: 2025, month: 7 },
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
    id: "damsonic",
    type: "internship",
    company: "Damsonic",
    role: "AI Intern",
    start: { year: 2025, month: 1 },
    end: { year: 2025, month: 6 },
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
    id: "sabudh",
    type: "internship",
    company: "Sabudh Foundation",
    role: "Data Science Intern",
    start: { year: 2024, month: 7 },
    end: { year: 2024, month: 12 },
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
    id: "alphanumeric",
    type: "internship",
    company: "Alphanumeric Ideas",
    role: "Web Development Intern",
    start: { year: 2023, month: 6 },
    end: { year: 2023, month: 8 },
    location: "Mohali district, India · On-site",
    description:
      "Worked on frontend and small backend tasks; improved UI and implemented algorithmic features.",
    achievements: ["Delivered frontend components and assisted with backend integration"],
    tech: ["HTML", "CSS", "JavaScript", "Algorithms", "Communication"],
  },
]

function toDate({ year, month }: ExperienceDate): Date {
  return new Date(year, month - 1, 1)
}

export function formatMonthYear(date: ExperienceDate): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(toDate(date))
}

/** Inclusive calendar months between start and end (or today for current roles). */
export function countExperienceMonths(
  start: ExperienceDate,
  end: ExperienceDate | null,
  referenceDate: Date = new Date(),
): number {
  const endPoint =
    end ??
    ({
      year: referenceDate.getFullYear(),
      month: referenceDate.getMonth() + 1,
    } satisfies ExperienceDate)

  const months = (endPoint.year - start.year) * 12 + (endPoint.month - start.month) + 1
  return Math.max(1, months)
}

export function formatExperienceMonths(count: number): string {
  return count === 1 ? "1 mo" : `${count} mos`
}

/** e.g. "Jul 2025 - Present · 11 mos" — recalculates whenever called (updates monthly). */
export function getExperienceDurationLabel(
  experience: ProfessionalExperience,
  referenceDate: Date = new Date(),
): string {
  const rangeEnd = experience.end ? formatMonthYear(experience.end) : "Present"
  const months = countExperienceMonths(experience.start, experience.end, referenceDate)
  return `${formatMonthYear(experience.start)} - ${rangeEnd} · ${formatExperienceMonths(months)}`
}

function getEarliestExperienceStart(): ExperienceDate | null {
  if (PROFESSIONAL_EXPERIENCES.length === 0) return null

  return PROFESSIONAL_EXPERIENCES.reduce<ExperienceDate>((earliest, exp) => {
    if (exp.start.year < earliest.year) return exp.start
    if (exp.start.year === earliest.year && exp.start.month < earliest.month) return exp.start
    return earliest
  }, PROFESSIONAL_EXPERIENCES[0].start)
}

/** Months from first role start through today (updates monthly). */
export function getTotalProfessionalExperienceMonths(referenceDate: Date = new Date()): number {
  const earliest = getEarliestExperienceStart()
  if (!earliest) return 0
  return countExperienceMonths(earliest, null, referenceDate)
}

export function formatTotalExperienceSpan(months: number): string {
  if (months >= 24) {
    const years = Math.floor(months / 12)
    return `${years}+ years`
  }
  if (months >= 12) {
    return "1+ year"
  }
  return formatExperienceMonths(months)
}

/** e.g. "3+ years of professional experience" */
export function getTotalProfessionalExperienceLabel(referenceDate: Date = new Date()): string {
  const months = getTotalProfessionalExperienceMonths(referenceDate)
  return `${formatTotalExperienceSpan(months)} of professional experience`
}

export function getExperiencesByType(type: ExperienceType): ProfessionalExperience[] {
  return PROFESSIONAL_EXPERIENCES.filter((exp) => exp.type === type)
}

/** Sum of months across roles in a category (each role counted separately). */
export function sumExperienceMonthsByType(
  type: ExperienceType,
  referenceDate: Date = new Date(),
): number {
  return getExperiencesByType(type).reduce(
    (total, exp) => total + countExperienceMonths(exp.start, exp.end, referenceDate),
    0,
  )
}

export function getFulltimeExperienceLabel(referenceDate: Date = new Date()): string {
  const months = sumExperienceMonthsByType("fulltime", referenceDate)
  return `${formatTotalExperienceSpan(months)} full-time`
}

export function getInternshipExperienceLabel(referenceDate: Date = new Date()): string {
  const months = sumExperienceMonthsByType("internship", referenceDate)
  return `${formatTotalExperienceSpan(months)} internship`
}

export interface ExperienceSummary {
  total: string
  fulltime: string
  internship: string
}

export function getExperienceSummary(referenceDate: Date = new Date()): ExperienceSummary {
  return {
    total: getTotalProfessionalExperienceLabel(referenceDate),
    fulltime: getFulltimeExperienceLabel(referenceDate),
    internship: getInternshipExperienceLabel(referenceDate),
  }
}
