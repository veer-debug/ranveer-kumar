import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"

const LINKS = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact", href: "/#contact" },
]

export default function SiteFooter() {
  return (
    <footer className="bg-black text-paper border-t-2 border-black">
      <div className="w-full px-[5%] lg:px-10 xl:px-14 py-12 flex flex-col md:flex-row justify-between gap-8">
        <div>
          <p className="text-xl font-bold lowercase mb-2">ranveer.dev</p>
          <p className="font-mono text-sm text-paper/70 max-w-xs">
            AI / ML developer · Python · RAG · shipping code from India
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wider">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-cyan transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-3">
          <a
            href="https://github.com/veer-debug"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border-2 border-paper text-paper hover:bg-cyan hover:text-black hover:border-cyan transition-colors"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/ranveer-kumar-12050a247/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border-2 border-paper text-paper hover:bg-cyan hover:text-black hover:border-cyan transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="mailto:ranveep097@gmail.com"
            className="p-2 border-2 border-paper text-paper hover:bg-cyan hover:text-black hover:border-cyan transition-colors"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
      <div className="border-t border-paper/20 px-[5%] py-4 font-mono text-xs text-paper/50 text-center md:text-left">
        © {new Date().getFullYear()} Ranveer Kumar
      </div>
    </footer>
  )
}
