interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: "center" | "left"
  className?: string
  number?: string
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className = "",
  number,
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left"

  if (number) {
    return (
      <header className={`mb-10 md:mb-14 relative ${className}`}>
        <span className="section-number absolute -top-4 left-0 pointer-events-none" aria-hidden>
          {number}
        </span>
        {eyebrow && <p className="editorial-eyebrow mb-2 relative pt-8">{eyebrow}</p>}
        <h2 className="editorial-section-title relative">{title}</h2>
        {subtitle && <p className={`mt-4 ${siteThemeSubtitle()} ${alignClass}`}>{subtitle}</p>}
      </header>
    )
  }

  return (
    <header className={`mb-10 md:mb-12 max-w-3xl ${alignClass} ${className}`}>
      {eyebrow && <p className="editorial-eyebrow mb-2">{eyebrow}</p>}
      <h2 className="editorial-section-title">{title}</h2>
      {subtitle && <p className={`mt-4 ${siteThemeSubtitle()} ${align === "center" ? "mx-auto" : ""}`}>{subtitle}</p>}
    </header>
  )
}

function siteThemeSubtitle() {
  return "text-ink-3 font-mono text-sm md:text-base leading-relaxed"
}
