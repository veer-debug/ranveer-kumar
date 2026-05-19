import { blogAuthor } from "@/lib/blogs/author"
import AboutTotalExperience from "@/components/about-total-experience"

const HIGHLIGHTS = [
  "Ships AI projects that solve real problems — RAG, agents, vision",
  "Owns the path from notebook to deployed API",
  "Enjoys clean interfaces and clean APIs equally",
]

export default function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 px-[5%] bg-paper border-b-2 border-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[minmax(280px,420px)_1fr] gap-10 lg:gap-16 items-start mb-12 md:mb-16">
          <div className="about-photo-wrap mx-auto lg:mx-0 w-full">
            <div className="about-photo-shadow" aria-hidden />
            <div className="about-photo-frame">
              <img
                src={blogAuthor.image}
                alt={blogAuthor.name}
                width={480}
                height={520}
                className="w-full aspect-[4/5] object-cover object-top contrast-[1.05] saturate-[0.9]"
              />
            </div>
          </div>

          <div className="min-w-0">
            <div className="relative mb-8 md:mb-10">
              <span className="section-number absolute -top-2 left-0 pointer-events-none" aria-hidden>
                02
              </span>
              <h2 className="editorial-section-title relative pt-6 md:pt-10">About</h2>
            </div>

            <div className="space-y-5 text-base md:text-lg text-ink leading-relaxed max-w-2xl">
              <p>
                I&apos;m an AI engineer focused on production systems — LLM features, RAG pipelines, and
                computer vision. I care about reliability, not demos: models that work when traffic hits.
              </p>
              <p>
                Currently member of technical staff at Octro; previously built agents and retrieval systems for US startups,
                plus data science and web work. I like owning the path from notebook to deployed API.
              </p>
              <p>
                Outside work: competitive programming, NCC sport shooting, and side projects where the stack
                is Python, FastAPI, LangChain, and React when a UI is needed.
              </p>
            </div>

            <AboutTotalExperience />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {HIGHLIGHTS.map((text) => (
            <p key={text} className="about-highlight">
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
