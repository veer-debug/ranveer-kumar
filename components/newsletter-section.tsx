import Link from "next/link"

export default function NewsletterSection() {
  return (
    <section className="px-[5%] py-16 md:py-20 border-t border-paper-3 bg-paper-2">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-2xl md:text-3xl text-ink mb-3">
          Get in touch
        </h2>
        <p className="text-ink-muted text-base leading-relaxed mb-6">
          Questions, feedback, or just saying hi — email or the contact form below. I usually reply within a
          day or two.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="#contact" className="btn-gradient">
            Open contact form
          </a>
          <a href="mailto:ranveep097@gmail.com" className="btn-outline-glow">
            ranveep097@gmail.com
          </a>
        </div>
        <p className="mt-6 text-sm text-ink-faint">
          Or read longer thoughts on{" "}
          <Link href="/blogs" className="text-green underline underline-offset-2">
            the blog
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
