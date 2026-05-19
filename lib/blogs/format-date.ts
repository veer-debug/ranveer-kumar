/** Parse YYYY-MM-DD as local calendar date (avoids UTC timezone shift in UI). */
export function formatBlogDate(
  isoDate: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
): string {
  const [year, month, day] = isoDate.split("-").map(Number)
  if (!year || !month || !day) return isoDate
  return new Date(year, month - 1, day).toLocaleDateString("en-US", options)
}
