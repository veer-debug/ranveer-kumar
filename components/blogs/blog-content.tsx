function renderLine(line: string, key: string) {
  const trimmed = line.trim()

  if (trimmed.startsWith("## ")) {
    return (
      <h2 key={key} className="text-2xl font-bold text-ink mt-8 mb-4">
        {trimmed.slice(3)}
      </h2>
    )
  }

  if (trimmed.startsWith("# ")) {
    return (
      <h1 key={key} className="text-3xl font-bold text-ink mt-8 mb-4">
        {trimmed.slice(2)}
      </h1>
    )
  }

  if (!trimmed) {
    return <div key={key} className="h-4" />
  }

  return (
    <p key={key} className="text-ink-muted leading-relaxed mb-4">
      {trimmed}
    </p>
  )
}

export default function BlogContent({ content }: { content: string }) {
  const lines = content.split("\n")

  return (
    <div className="max-w-none text-ink">
      {lines.map((line, index) => renderLine(line, `line-${index}`))}
    </div>
  )
}
