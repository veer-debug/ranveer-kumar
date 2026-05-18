"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Phone, Github, Linkedin, Send } from "lucide-react"
import { siteTheme } from "@/lib/site-theme"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    { icon: Phone, label: "Phone", value: "7033882318", href: "tel:7033882318" },
    { icon: Mail, label: "Email", value: "ranveep097@gmail.com", href: "mailto:ranveep097@gmail.com" },
    { icon: Github, label: "GitHub", value: "@veer-debug", href: "https://github.com/veer-debug" },
    { icon: Linkedin, label: "LinkedIn", value: "Profile", href: "https://www.linkedin.com/in/ranveer-kumar-12050a247/" },
  ]

  return (
    <section id="contact" className={`py-16 md:py-24 px-[5%] ${siteTheme.sectionAlt}`}>
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-10 md:mb-14">
          <span className="section-number absolute -top-4 left-0 pointer-events-none" aria-hidden>
            06
          </span>
          <h2 className="editorial-section-title relative pt-8 md:pt-12">Contact</h2>
          <p className="text-ink-3 font-mono text-sm mt-4">Email works best — form below or direct links.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
          <div className="lg:col-span-2 space-y-3">
            {contactInfo.map((info) => (
              <a
                key={info.label}
                href={info.href}
                target={info.href.startsWith("http") ? "_blank" : undefined}
                rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 p-4 editorial-card group"
              >
                <info.icon size={18} className="shrink-0" />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-3">{info.label}</div>
                  <div className="font-medium group-hover:underline">{info.value}</div>
                </div>
              </a>
            ))}
          </div>

          <div className="lg:col-span-3 editorial-card p-6 md:p-8">
            <p className="font-mono text-xs uppercase tracking-wider mb-6">Send a message</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className={siteTheme.formLabel}>
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={siteTheme.formInput}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className={siteTheme.formLabel}>
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={siteTheme.formInput}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-subject" className={siteTheme.formLabel}>
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={siteTheme.formInput}
                />
              </div>
              <div>
                <label htmlFor="contact-message" className={siteTheme.formLabel}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${siteTheme.formInput} form-textarea`}
                />
              </div>
              {submitStatus === "success" && (
                <p className="font-mono text-sm border-2 border-black bg-cyan/30 px-3 py-2">Sent — I&apos;ll reply soon.</p>
              )}
              {submitStatus === "error" && (
                <p className="font-mono text-sm border-2 border-black bg-paper-2 px-3 py-2">Failed — try email directly.</p>
              )}
              <button type="submit" disabled={isSubmitting} className={`${siteTheme.btnPrimary} w-full`}>
                <Send size={16} />
                {isSubmitting ? "Sending…" : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
