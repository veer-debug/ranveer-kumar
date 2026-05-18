import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import Chatbot from "@/components/chatbot"
import { siteTheme } from "@/lib/site-theme"

interface BlogLayoutProps {
  children: React.ReactNode
  backHref?: string
  backLabel?: string
}

export default function BlogLayout({
  children,
  backHref = "/blogs",
  backLabel = "Back",
}: BlogLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${siteTheme.page}`}>
      <SiteHeader />

      {backHref && (
        <div className="w-full border-b-2 border-black bg-paper-2">
          <div className="w-full px-[5%] lg:px-10 xl:px-14 py-3">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-bold hover:underline"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              {backLabel}
            </Link>
          </div>
        </div>
      )}

      <main className="flex-1 w-full">{children}</main>

      <SiteFooter />
      <Chatbot />
    </div>
  )
}
