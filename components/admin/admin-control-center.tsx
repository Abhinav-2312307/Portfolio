"use client"

import type React from "react"

import { LogOut, RefreshCw, Save, ShieldCheck, Upload } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import type { PortfolioContent } from "@/lib/portfolio/schema"

type AdminControlCenterProps = {
  accessKey: string
}

type TabId = "overview" | "hero" | "education" | "projects" | "wins" | "contact" | "assistant" | "raw"

function cloneContent(content: PortfolioContent) {
  return structuredClone(content)
}

function SectionCard({
  action,
  children,
  description,
  title,
}: {
  action?: React.ReactNode
  children: React.ReactNode
  description?: string
  title: string
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,15,24,0.95),rgba(8,12,20,0.88))] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.25)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.04em] text-white">{title}</h2>
          {description ? <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  value: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-400/50 focus:bg-white/[0.06]"
      />
    </label>
  )
}

function TextAreaField({
  label,
  onChange,
  placeholder,
  rows = 4,
  value,
}: {
  label: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  value: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-7 text-white outline-none transition-all focus:border-cyan-400/50 focus:bg-white/[0.06]"
      />
    </label>
  )
}

function SmallButton({
  children,
  onClick,
  tone = "default",
  type = "button",
}: {
  children: React.ReactNode
  onClick?: () => void
  tone?: "danger" | "default"
  type?: "button" | "submit"
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] transition-all ${
        tone === "danger"
          ? "border border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/20"
          : "border border-cyan-400/20 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/20"
      }`}
    >
      {children}
    </button>
  )
}

function StringListEditor({
  addLabel,
  label,
  onAdd,
  onChange,
  onRemove,
  values,
}: {
  addLabel: string
  label: string
  onAdd: () => void
  onChange: (index: number, value: string) => void
  onRemove: (index: number) => void
  values: string[]
}) {
  return (
    <div className="space-y-3 rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-white">{label}</p>
        <SmallButton onClick={onAdd}>{addLabel}</SmallButton>
      </div>
      <div className="space-y-3">
        {values.map((value, index) => (
          <div key={`${label}-${index}`} className="flex gap-3">
            <input
              value={value}
              onChange={(event) => onChange(index, event.target.value)}
              className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
            />
            <SmallButton onClick={() => onRemove(index)} tone="danger">
              Remove
            </SmallButton>
          </div>
        ))}
      </div>
    </div>
  )
}

function AssetUploader({
  accessKey,
  accept,
  folder,
  kind,
  label,
  onUploaded,
  value,
}: {
  accessKey: string
  accept: string
  folder: string
  kind: string
  label: string
  onUploaded: (value: string) => void
  value: string
}) {
  const [isUploading, setIsUploading] = useState(false)

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)
      formData.append("kind", kind)

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "x-admin-access-key": accessKey,
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed.")
      }

      onUploaded(data.asset.secureUrl)
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Upload failed.")
    } finally {
      setIsUploading(false)
      event.target.value = ""
    }
  }

  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="mt-1 break-all text-xs leading-6 text-slate-400">{value || "No file uploaded yet."}</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100 transition-all hover:bg-cyan-500/20">
          <Upload size={14} />
          {isUploading ? "Uploading" : "Upload"}
          <input type="file" accept={accept} className="hidden" onChange={uploadFile} />
        </label>
      </div>
    </div>
  )
}

function emptyProject() {
  return {
    category: "web",
    description: "",
    details: "",
    github: "",
    highlights: [""],
    image: "",
    live: "",
    period: "",
    stack: [""],
    status: "",
    summary: "",
    title: "New Project",
  }
}

function emptySkillCard(order: number) {
  return {
    accent: "#7dd3fc",
    category: "Frontend",
    iconName: "react",
    name: "New Skill",
    order: String(order).padStart(2, "0"),
  }
}

export default function AdminControlCenter({ accessKey }: AdminControlCenterProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview")
  const [draft, setDraft] = useState<PortfolioContent | null>(null)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isBusy, setIsBusy] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [loginForm, setLoginForm] = useState({ password: "", username: "" })
  const [rawJson, setRawJson] = useState("")
  const [statusMessage, setStatusMessage] = useState("")

  const tabs = useMemo(
    () =>
      [
        { id: "overview", label: "Overview" },
        { id: "hero", label: "Hero + About" },
        { id: "education", label: "Education + Skills" },
        { id: "projects", label: "Projects" },
        { id: "wins", label: "Wins + Hobbies" },
        { id: "contact", label: "Contact" },
        { id: "assistant", label: "AI Brain" },
        { id: "raw", label: "Raw JSON" },
      ] as const,
    [],
  )

  const loadContent = async () => {
    setIsBusy(true)
    setError("")

    try {
      const response = await fetch("/api/admin/content", {
        headers: {
          "x-admin-access-key": accessKey,
        },
      })

      const data = await response.json()

      if (response.status === 401) {
        setIsAuthenticated(false)
        setDraft(null)
        return
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to load content.")
      }

      setDraft(data.content)
      setRawJson(JSON.stringify(data.content, null, 2))
      setIsAuthenticated(true)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load content.")
    } finally {
      setIsBusy(false)
    }
  }

  useEffect(() => {
    void loadContent()
  }, [])

  const mutateDraft = (updater: (content: PortfolioContent) => void) => {
    setDraft((current) => {
      const base = current ? cloneContent(current) : cloneContent(defaultPortfolioContent)
      updater(base)
      setRawJson(JSON.stringify(base, null, 2))
      return base
    })
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setStatusMessage("")
    setIsBusy(true)

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-access-key": accessKey,
        },
        body: JSON.stringify(loginForm),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed.")
      }

      setLoginForm({ password: "", username: "" })
      setStatusMessage("Access granted. Loading your content workspace.")
      await loadContent()
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.")
      setIsAuthenticated(false)
    } finally {
      setIsBusy(false)
    }
  }

  const handleSave = async () => {
    if (!draft) {
      return
    }

    setIsSaving(true)
    setError("")
    setStatusMessage("")

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-access-key": accessKey,
          "x-admin-username": loginForm.username || "admin",
        },
        body: JSON.stringify({ content: draft }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Unable to save content.")
      }

      setDraft(data.content)
      setRawJson(JSON.stringify(data.content, null, 2))
      setStatusMessage("Portfolio content saved successfully.")
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save content.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", {
      method: "POST",
      headers: {
        "x-admin-access-key": accessKey,
      },
    })

    setDraft(null)
    setIsAuthenticated(false)
    setStatusMessage("Signed out.")
  }

  const handleRebuildKnowledge = async () => {
    setIsSaving(true)
    setError("")

    try {
      const response = await fetch("/api/admin/rebuild-knowledge", {
        method: "POST",
        headers: {
          "x-admin-access-key": accessKey,
          "x-admin-username": loginForm.username || "admin",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Unable to rebuild the AI knowledge index.")
      }

      setDraft(data.content)
      setRawJson(JSON.stringify(data.content, null, 2))
      setStatusMessage(`AI knowledge refreshed with ${data.chunkCount} indexed chunks.`)
    } catch (rebuildError) {
      setError(rebuildError instanceof Error ? rebuildError.message : "Unable to rebuild the AI knowledge index.")
    } finally {
      setIsSaving(false)
    }
  }

  const applyRawJson = () => {
    try {
      const parsed = JSON.parse(rawJson) as PortfolioContent
      setDraft(parsed)
      setStatusMessage("Raw JSON loaded into the editor. Save to publish it.")
      setError("")
    } catch (jsonError) {
      setError(jsonError instanceof Error ? jsonError.message : "Invalid JSON.")
    }
  }

  if (isBusy && !draft && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#050814,#07101d)] px-6 text-white">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] px-8 py-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <p className="text-sm uppercase tracking-[0.38em] text-cyan-200">Control Center</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">Loading secure workspace...</h1>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !draft) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#040711,#071321)] px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[34px] border border-cyan-400/14 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_35%),linear-gradient(180deg,rgba(7,12,22,0.96),rgba(5,9,18,0.94))] p-6 shadow-[0_34px_100px_rgba(0,0,0,0.42)] md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/18 bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-cyan-100">
                  <ShieldCheck size={16} />
                  Private Surface
                </div>

                <div>
                  <p className="text-sm uppercase tracking-[0.36em] text-cyan-200">Owner Console</p>
                  <h1 className="mt-4 text-[clamp(2.8rem,6vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-white">
                    Manage every byte without touching the public UI.
                  </h1>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                    This route is gated by a secret path, credential check, signed session cookie, and request-level access key.
                    Once you enter, you can update hero content, projects, resume, media, contact details, and the AI knowledge base from one place.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    "Private login with signed session cookies",
                    "Content, assets, and AI context handled centrally",
                    "Cloudinary-ready media upload flow",
                    "Raw JSON fallback for total control",
                  ].map((item) => (
                    <div key={item} className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-200">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleLogin} className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Authenticate</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">Owner Login</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Fill the admin credentials from your env file. This panel stays invisible unless the exact secret route is used.
                </p>

                <div className="mt-6 space-y-4">
                  <Field
                    label="Admin Username"
                    value={loginForm.username}
                    onChange={(value) => setLoginForm((current) => ({ ...current, username: value }))}
                  />
                  <Field
                    label="Admin Password"
                    type="password"
                    value={loginForm.password}
                    onChange={(value) => setLoginForm((current) => ({ ...current, password: value }))}
                  />
                </div>

                {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
                {statusMessage ? <p className="mt-4 text-sm text-cyan-200">{statusMessage}</p> : null}

                <button
                  type="submit"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(34,211,238,0.92),rgba(59,130,246,0.88))] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-950 transition-all hover:-translate-y-0.5"
                >
                  Enter Control Center
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#040711,#07101c)] px-4 py-6 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-6 overflow-hidden rounded-[34px] border border-cyan-400/14 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_28%),linear-gradient(180deg,rgba(7,12,22,0.96),rgba(6,10,18,0.92))] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.4)] md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/18 bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.34em] text-cyan-100">
                <ShieldCheck size={16} />
                Secured Editing Surface
              </div>
              <h1 className="mt-5 text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-white">
                Portfolio Control Center
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">
                Edit the live portfolio data model, manage assets, refresh the AI knowledge index, and keep the public UI unchanged while the content underneath becomes fully manageable.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleRebuildKnowledge}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition-all hover:border-cyan-400/26 hover:text-cyan-100"
              >
                <RefreshCw size={16} />
                Refresh AI Knowledge
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,rgba(34,211,238,0.92),rgba(59,130,246,0.88))] px-5 py-3 text-sm font-semibold text-slate-950 transition-all hover:-translate-y-0.5 disabled:opacity-70"
              >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-100 transition-all hover:bg-rose-500/18"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
          {statusMessage ? <p className="mt-4 text-sm text-cyan-200">{statusMessage}</p> : null}
        </div>

        <div className="grid gap-6 xl:grid-cols-[17rem_minmax(0,1fr)]">
          <aside className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,21,0.95),rgba(6,10,18,0.92))] p-4 shadow-[0_26px_80px_rgba(0,0,0,0.35)]">
            <div className="rounded-[22px] border border-cyan-400/14 bg-cyan-500/8 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.34em] text-cyan-200">Editing Target</p>
              <h2 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">{draft.identity.fullName}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">{draft.identity.currentRole}</p>
            </div>

            <div className="mt-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(59,130,246,0.14))] text-white"
                      : "bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`h-2.5 w-2.5 rounded-full ${activeTab === tab.id ? "bg-cyan-300" : "bg-white/10"}`} />
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            {activeTab === "overview" ? (
              <>
                <SectionCard title="Identity" description="Core person details used across the navbar, footer, hero, metadata, and contact surface.">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Full Name" value={draft.identity.fullName} onChange={(value) => mutateDraft((next) => { next.identity.fullName = value })} />
                    <Field label="Short Name" value={draft.identity.shortName} onChange={(value) => mutateDraft((next) => { next.identity.shortName = value })} />
                    <Field label="Initials" value={draft.identity.initials} onChange={(value) => mutateDraft((next) => { next.identity.initials = value })} />
                    <Field label="Role Tagline" value={draft.identity.roleTagline} onChange={(value) => mutateDraft((next) => { next.identity.roleTagline = value })} />
                    <Field label="Current Role" value={draft.identity.currentRole} onChange={(value) => mutateDraft((next) => { next.identity.currentRole = value })} />
                    <Field label="Location" value={draft.identity.location} onChange={(value) => mutateDraft((next) => { next.identity.location = value })} />
                    <Field label="Primary Email" value={draft.identity.primaryEmail} onChange={(value) => mutateDraft((next) => { next.identity.primaryEmail = value })} />
                    <Field label="Resume URL" value={draft.identity.resumeUrl} onChange={(value) => mutateDraft((next) => { next.identity.resumeUrl = value })} />
                  </div>
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <AssetUploader
                      accessKey={accessKey}
                      accept="image/*"
                      folder="portfolio/profile"
                      kind="profile-image"
                      label="Profile Image"
                      value={draft.identity.profileImageUrl}
                      onUploaded={(value) =>
                        mutateDraft((next) => {
                          next.identity.profileImageUrl = value
                          next.meta.ogImageUrl = value
                        })
                      }
                    />
                    <AssetUploader
                      accessKey={accessKey}
                      accept=".pdf"
                      folder="portfolio/resume"
                      kind="resume"
                      label="Resume File"
                      value={draft.identity.resumeUrl}
                      onUploaded={(value) =>
                        mutateDraft((next) => {
                          next.identity.resumeUrl = value
                        })
                      }
                    />
                  </div>
                </SectionCard>

                <SectionCard title="Navigation + Socials" description="These links feed the navbar, hero socials, contact section, and footer.">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-4 rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">Navigation Items</p>
                        <SmallButton
                          onClick={() =>
                            mutateDraft((next) => {
                              next.navigation.items.push({ id: "new-section", label: "New Section" })
                            })
                          }
                        >
                          Add Nav
                        </SmallButton>
                      </div>
                      {draft.navigation.items.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                          <Field
                            label="Section ID"
                            value={item.id}
                            onChange={(value) => mutateDraft((next) => { next.navigation.items[index].id = value })}
                          />
                          <Field
                            label="Label"
                            value={item.label}
                            onChange={(value) => mutateDraft((next) => { next.navigation.items[index].label = value })}
                          />
                          <div className="pt-8">
                            <SmallButton
                              onClick={() =>
                                mutateDraft((next) => {
                                  next.navigation.items.splice(index, 1)
                                })
                              }
                              tone="danger"
                            >
                              Remove
                            </SmallButton>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">Social Links</p>
                        <SmallButton
                          onClick={() =>
                            mutateDraft((next) => {
                              next.socialLinks.push({ href: "", iconClass: "fas fa-link", label: "New Link" })
                            })
                          }
                        >
                          Add Social
                        </SmallButton>
                      </div>
                      {draft.socialLinks.map((link, index) => (
                        <div key={`${link.label}-${index}`} className="grid gap-3 md:grid-cols-3">
                          <Field
                            label="Label"
                            value={link.label}
                            onChange={(value) => mutateDraft((next) => { next.socialLinks[index].label = value })}
                          />
                          <Field
                            label="Href"
                            value={link.href}
                            onChange={(value) => mutateDraft((next) => { next.socialLinks[index].href = value })}
                          />
                          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                            <Field
                              label="Icon Class"
                              value={link.iconClass}
                              onChange={(value) => mutateDraft((next) => { next.socialLinks[index].iconClass = value })}
                            />
                            <div className="pt-8">
                              <SmallButton
                                onClick={() =>
                                  mutateDraft((next) => {
                                    next.socialLinks.splice(index, 1)
                                  })
                                }
                                tone="danger"
                              >
                                Remove
                              </SmallButton>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Metadata" description="SEO and sharing information used by the Next.js metadata generator.">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Page Title" value={draft.meta.title} onChange={(value) => mutateDraft((next) => { next.meta.title = value })} />
                    <Field label="Site URL" value={draft.meta.siteUrl} onChange={(value) => mutateDraft((next) => { next.meta.siteUrl = value })} />
                  </div>
                  <div className="mt-4">
                    <TextAreaField label="Meta Description" value={draft.meta.description} onChange={(value) => mutateDraft((next) => { next.meta.description = value })} />
                  </div>
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <AssetUploader
                      accessKey={accessKey}
                      accept="image/*"
                      folder="portfolio/meta"
                      kind="og-image"
                      label="Open Graph Image"
                      value={draft.meta.ogImageUrl}
                      onUploaded={(value) =>
                        mutateDraft((next) => {
                          next.meta.ogImageUrl = value
                        })
                      }
                    />
                    <StringListEditor
                      label="Meta Keywords"
                      addLabel="Add Keyword"
                      values={draft.meta.keywords}
                      onAdd={() =>
                        mutateDraft((next) => {
                          next.meta.keywords.push("new-keyword")
                        })
                      }
                      onChange={(index, value) =>
                        mutateDraft((next) => {
                          next.meta.keywords[index] = value
                        })
                      }
                      onRemove={(index) =>
                        mutateDraft((next) => {
                          next.meta.keywords.splice(index, 1)
                        })
                      }
                    />
                  </div>
                </SectionCard>

                <SectionCard title="Footer" description="Footer branding and closing copy used at the bottom of the public site.">
                  <div className="space-y-4">
                    <TextAreaField
                      label="Footer Description"
                      rows={4}
                      value={draft.footer.description}
                      onChange={(value) =>
                        mutateDraft((next) => {
                          next.footer.description = value
                        })
                      }
                    />
                    <Field
                      label="Copyright Label"
                      value={draft.footer.copyrightLabel}
                      onChange={(value) =>
                        mutateDraft((next) => {
                          next.footer.copyrightLabel = value
                        })
                      }
                    />
                  </div>
                </SectionCard>
              </>
            ) : null}

            {activeTab === "hero" ? (
              <>
                <SectionCard title="Hero Surface" description="Update the primary above-the-fold story without changing any of the public UI composition.">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Badge" value={draft.hero.badge} onChange={(value) => mutateDraft((next) => { next.hero.badge = value })} />
                    <Field label="Background Word" value={draft.hero.backgroundWord} onChange={(value) => mutateDraft((next) => { next.hero.backgroundWord = value })} />
                    <Field label="Eyebrow" value={draft.hero.eyebrow} onChange={(value) => mutateDraft((next) => { next.hero.eyebrow = value })} />
                    <Field label="Typing Prefix" value={draft.hero.typingPrefix} onChange={(value) => mutateDraft((next) => { next.hero.typingPrefix = value })} />
                    <Field label="Primary CTA" value={draft.hero.primaryCtaLabel} onChange={(value) => mutateDraft((next) => { next.hero.primaryCtaLabel = value })} />
                    <Field label="Secondary CTA" value={draft.hero.secondaryCtaLabel} onChange={(value) => mutateDraft((next) => { next.hero.secondaryCtaLabel = value })} />
                    <Field label="Featured Profile Label" value={draft.hero.featuredProfileLabel} onChange={(value) => mutateDraft((next) => { next.hero.featuredProfileLabel = value })} />
                    <Field label="Availability Text" value={draft.hero.availabilityText} onChange={(value) => mutateDraft((next) => { next.hero.availabilityText = value })} />
                    <Field label="Current Focus Label" value={draft.hero.currentFocusLabel} onChange={(value) => mutateDraft((next) => { next.hero.currentFocusLabel = value })} />
                    <Field label="Primary Stack Label" value={draft.hero.primaryStackLabel} onChange={(value) => mutateDraft((next) => { next.hero.primaryStackLabel = value })} />
                    <Field label="Building Label" value={draft.hero.buildingLabel} onChange={(value) => mutateDraft((next) => { next.hero.buildingLabel = value })} />
                    <Field label="Capability Title" value={draft.hero.capabilitySectionTitle} onChange={(value) => mutateDraft((next) => { next.hero.capabilitySectionTitle = value })} />
                  </div>
                  <div className="mt-4 space-y-4">
                    <TextAreaField label="Headline" rows={3} value={draft.hero.headline} onChange={(value) => mutateDraft((next) => { next.hero.headline = value })} />
                    <TextAreaField label="Intro Paragraph" rows={4} value={draft.hero.intro} onChange={(value) => mutateDraft((next) => { next.hero.intro = value })} />
                    <TextAreaField label="Current Focus Text" rows={3} value={draft.hero.currentFocusText} onChange={(value) => mutateDraft((next) => { next.hero.currentFocusText = value })} />
                    <TextAreaField label="Currently Building Text" rows={3} value={draft.hero.buildingText} onChange={(value) => mutateDraft((next) => { next.hero.buildingText = value })} />
                  </div>
                  <div className="mt-5 grid gap-4 lg:grid-cols-3">
                    <StringListEditor
                      label="Typing Roles"
                      addLabel="Add Role"
                      values={draft.hero.roles}
                      onAdd={() => mutateDraft((next) => { next.hero.roles.push("New role") })}
                      onChange={(index, value) => mutateDraft((next) => { next.hero.roles[index] = value })}
                      onRemove={(index) => mutateDraft((next) => { next.hero.roles.splice(index, 1) })}
                    />
                    <StringListEditor
                      label="Capability Rows"
                      addLabel="Add Row"
                      values={draft.hero.capabilityRows}
                      onAdd={() => mutateDraft((next) => { next.hero.capabilityRows.push("New capability") })}
                      onChange={(index, value) => mutateDraft((next) => { next.hero.capabilityRows[index] = value })}
                      onRemove={(index) => mutateDraft((next) => { next.hero.capabilityRows.splice(index, 1) })}
                    />
                    <StringListEditor
                      label="Primary Stack"
                      addLabel="Add Stack"
                      values={draft.hero.primaryStack}
                      onAdd={() => mutateDraft((next) => { next.hero.primaryStack.push("New tech") })}
                      onChange={(index, value) => mutateDraft((next) => { next.hero.primaryStack[index] = value })}
                      onRemove={(index) => mutateDraft((next) => { next.hero.primaryStack.splice(index, 1) })}
                    />
                  </div>
                  <div className="mt-5 rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">Hero Stats</p>
                      <SmallButton onClick={() => mutateDraft((next) => { next.hero.stats.push({ label: "New Stat", value: "0" }) })}>Add Stat</SmallButton>
                    </div>
                    <div className="mt-4 space-y-3">
                      {draft.hero.stats.map((item, index) => (
                        <div key={`${item.label}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                          <Field label="Label" value={item.label} onChange={(value) => mutateDraft((next) => { next.hero.stats[index].label = value })} />
                          <Field label="Value" value={item.value} onChange={(value) => mutateDraft((next) => { next.hero.stats[index].value = value })} />
                          <div className="pt-8">
                            <SmallButton onClick={() => mutateDraft((next) => { next.hero.stats.splice(index, 1) })} tone="danger">Remove</SmallButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="About Section" description="This powers the narrative and stat cards in the About block.">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Section Label" value={draft.about.sectionLabel} onChange={(value) => mutateDraft((next) => { next.about.sectionLabel = value })} />
                    <Field label="CTA Label" value={draft.about.ctaLabel} onChange={(value) => mutateDraft((next) => { next.about.ctaLabel = value })} />
                    <Field label="Story Section Title" value={draft.about.storySectionTitle} onChange={(value) => mutateDraft((next) => { next.about.storySectionTitle = value })} />
                  </div>
                  <div className="mt-4 space-y-4">
                    <TextAreaField label="Title" rows={3} value={draft.about.title} onChange={(value) => mutateDraft((next) => { next.about.title = value })} />
                    <TextAreaField label="Primary Paragraph" rows={4} value={draft.about.primaryParagraph} onChange={(value) => mutateDraft((next) => { next.about.primaryParagraph = value })} />
                    <TextAreaField label="Secondary Paragraph" rows={4} value={draft.about.secondaryParagraph} onChange={(value) => mutateDraft((next) => { next.about.secondaryParagraph = value })} />
                  </div>
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <StringListEditor
                      label="Story Points"
                      addLabel="Add Point"
                      values={draft.about.storyPoints}
                      onAdd={() => mutateDraft((next) => { next.about.storyPoints.push("New point") })}
                      onChange={(index, value) => mutateDraft((next) => { next.about.storyPoints[index] = value })}
                      onRemove={(index) => mutateDraft((next) => { next.about.storyPoints.splice(index, 1) })}
                    />
                    <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">About Stats</p>
                        <SmallButton onClick={() => mutateDraft((next) => { next.about.stats.push({ label: "New Stat", value: "0" }) })}>Add Stat</SmallButton>
                      </div>
                      <div className="mt-4 space-y-3">
                        {draft.about.stats.map((item, index) => (
                          <div key={`${item.label}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                            <Field label="Label" value={item.label} onChange={(value) => mutateDraft((next) => { next.about.stats[index].label = value })} />
                            <Field label="Value" value={item.value} onChange={(value) => mutateDraft((next) => { next.about.stats[index].value = value })} />
                            <div className="pt-8">
                              <SmallButton onClick={() => mutateDraft((next) => { next.about.stats.splice(index, 1) })} tone="danger">Remove</SmallButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </>
            ) : null}

            {activeTab === "education" ? (
              <>
                <SectionCard title="Education" description="Timeline cards, taglines, and detail points shown in the education journey section.">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Section Label" value={draft.education.sectionLabel} onChange={(value) => mutateDraft((next) => { next.education.sectionLabel = value })} />
                    <Field label="Title" value={draft.education.title} onChange={(value) => mutateDraft((next) => { next.education.title = value })} />
                    <Field label="Tagline Badge" value={draft.education.taglineBadge} onChange={(value) => mutateDraft((next) => { next.education.taglineBadge = value })} />
                  </div>
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">Education Items</p>
                      <SmallButton onClick={() => mutateDraft((next) => { next.education.items.push({ iconName: "university", meta: "", points: [""], title: "New Institute" }) })}>Add Education</SmallButton>
                    </div>
                    {draft.education.items.map((item, index) => (
                      <div key={`${item.title}-${index}`} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          <Field label="Title" value={item.title} onChange={(value) => mutateDraft((next) => { next.education.items[index].title = value })} />
                          <Field label="Meta" value={item.meta} onChange={(value) => mutateDraft((next) => { next.education.items[index].meta = value })} />
                          <Field label="Icon Name" value={item.iconName} onChange={(value) => mutateDraft((next) => { next.education.items[index].iconName = value })} />
                        </div>
                        <div className="mt-4">
                          <StringListEditor
                            label="Points"
                            addLabel="Add Point"
                            values={item.points}
                            onAdd={() => mutateDraft((next) => { next.education.items[index].points.push("New point") })}
                            onChange={(pointIndex, value) => mutateDraft((next) => { next.education.items[index].points[pointIndex] = value })}
                            onRemove={(pointIndex) => mutateDraft((next) => { next.education.items[index].points.splice(pointIndex, 1) })}
                          />
                        </div>
                        <div className="mt-4">
                          <SmallButton onClick={() => mutateDraft((next) => { next.education.items.splice(index, 1) })} tone="danger">Remove Education</SmallButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Skills" description="Cards, categories, color accents, and supporting rails for the stack section.">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Section Label" value={draft.skills.sectionLabel} onChange={(value) => mutateDraft((next) => { next.skills.sectionLabel = value })} />
                    <Field label="Title" value={draft.skills.title} onChange={(value) => mutateDraft((next) => { next.skills.title = value })} />
                  </div>
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <StringListEditor
                      label="Category Pills"
                      addLabel="Add Category"
                      values={draft.skills.categories}
                      onAdd={() => mutateDraft((next) => { next.skills.categories.push("New Category") })}
                      onChange={(index, value) => mutateDraft((next) => { next.skills.categories[index] = value })}
                      onRemove={(index) => mutateDraft((next) => { next.skills.categories.splice(index, 1) })}
                    />
                    <StringListEditor
                      label="Skill Rails"
                      addLabel="Add Rail"
                      values={draft.skills.rails}
                      onAdd={() => mutateDraft((next) => { next.skills.rails.push("New rail") })}
                      onChange={(index, value) => mutateDraft((next) => { next.skills.rails[index] = value })}
                      onRemove={(index) => mutateDraft((next) => { next.skills.rails.splice(index, 1) })}
                    />
                  </div>
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">Skill Cards</p>
                      <SmallButton onClick={() => mutateDraft((next) => { next.skills.cards.push(emptySkillCard(next.skills.cards.length + 1)) })}>Add Skill Card</SmallButton>
                    </div>
                    {draft.skills.cards.map((card, index) => (
                      <div key={`${card.order}-${index}`} className="grid gap-4 rounded-[24px] border border-white/8 bg-white/[0.03] p-4 md:grid-cols-5">
                        <Field label="Order" value={card.order} onChange={(value) => mutateDraft((next) => { next.skills.cards[index].order = value })} />
                        <Field label="Name" value={card.name} onChange={(value) => mutateDraft((next) => { next.skills.cards[index].name = value })} />
                        <Field label="Category" value={card.category} onChange={(value) => mutateDraft((next) => { next.skills.cards[index].category = value })} />
                        <Field label="Icon Name" value={card.iconName} onChange={(value) => mutateDraft((next) => { next.skills.cards[index].iconName = value })} />
                        <label className="block">
                          <span className="mb-2 block text-sm font-medium text-slate-200">Accent</span>
                          <input
                            type="color"
                            value={card.accent}
                            onChange={(event) => mutateDraft((next) => { next.skills.cards[index].accent = event.target.value })}
                            className="h-12 w-full rounded-2xl border border-white/10 bg-transparent"
                          />
                        </label>
                        <div className="md:col-span-5">
                          <SmallButton onClick={() => mutateDraft((next) => { next.skills.cards.splice(index, 1) })} tone="danger">Remove Skill Card</SmallButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </>
            ) : null}

            {activeTab === "projects" ? (
              <SectionCard title="Projects" description="Add, remove, and update every project card and sidebar detail without touching the public layout.">
                <div className="grid gap-4 lg:grid-cols-2">
                  <Field label="Section Label" value={draft.projects.sectionLabel} onChange={(value) => mutateDraft((next) => { next.projects.sectionLabel = value })} />
                  <Field label="Title" value={draft.projects.title} onChange={(value) => mutateDraft((next) => { next.projects.title = value })} />
                </div>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">Project Filters</p>
                      <SmallButton onClick={() => mutateDraft((next) => { next.projects.filters.push({ label: "New Filter", value: "new-filter" }) })}>Add Filter</SmallButton>
                    </div>
                    <div className="mt-4 space-y-3">
                      {draft.projects.filters.map((filter, index) => (
                        <div key={`${filter.value}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                          <Field label="Label" value={filter.label} onChange={(value) => mutateDraft((next) => { next.projects.filters[index].label = value })} />
                          <Field label="Value" value={filter.value} onChange={(value) => mutateDraft((next) => { next.projects.filters[index].value = value })} />
                          <div className="pt-8">
                            <SmallButton onClick={() => mutateDraft((next) => { next.projects.filters.splice(index, 1) })} tone="danger">Remove</SmallButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">Project Items</p>
                    <SmallButton onClick={() => mutateDraft((next) => { next.projects.items.push(emptyProject()) })}>Add Project</SmallButton>
                  </div>
                  {draft.projects.items.map((project, index) => (
                    <div key={`${project.title}-${index}`} className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Field label="Title" value={project.title} onChange={(value) => mutateDraft((next) => { next.projects.items[index].title = value })} />
                        <Field label="Category" value={project.category} onChange={(value) => mutateDraft((next) => { next.projects.items[index].category = value })} />
                        <Field label="Status" value={project.status || ""} onChange={(value) => mutateDraft((next) => { next.projects.items[index].status = value })} />
                        <Field label="Period" value={project.period || ""} onChange={(value) => mutateDraft((next) => { next.projects.items[index].period = value })} />
                        <Field label="GitHub URL" value={project.github || ""} onChange={(value) => mutateDraft((next) => { next.projects.items[index].github = value })} />
                        <Field label="Live URL" value={project.live || ""} onChange={(value) => mutateDraft((next) => { next.projects.items[index].live = value })} />
                        <Field label="Image URL" value={project.image} onChange={(value) => mutateDraft((next) => { next.projects.items[index].image = value })} />
                      </div>
                      <div className="mt-4">
                        <AssetUploader
                          accessKey={accessKey}
                          accept="image/*"
                          folder="portfolio/projects"
                          kind={`project-${index + 1}`}
                          label={`Project Image for ${project.title || `Project ${index + 1}`}`}
                          value={project.image}
                          onUploaded={(value) => mutateDraft((next) => { next.projects.items[index].image = value })}
                        />
                      </div>
                      <div className="mt-4 space-y-4">
                        <TextAreaField label="Summary" rows={3} value={project.summary} onChange={(value) => mutateDraft((next) => { next.projects.items[index].summary = value })} />
                        <TextAreaField label="Description" rows={3} value={project.description} onChange={(value) => mutateDraft((next) => { next.projects.items[index].description = value })} />
                        <TextAreaField label="Detailed Sidebar Copy" rows={4} value={project.details} onChange={(value) => mutateDraft((next) => { next.projects.items[index].details = value })} />
                      </div>
                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <StringListEditor
                          label="Highlights"
                          addLabel="Add Highlight"
                          values={project.highlights}
                          onAdd={() => mutateDraft((next) => { next.projects.items[index].highlights.push("New highlight") })}
                          onChange={(highlightIndex, value) => mutateDraft((next) => { next.projects.items[index].highlights[highlightIndex] = value })}
                          onRemove={(highlightIndex) => mutateDraft((next) => { next.projects.items[index].highlights.splice(highlightIndex, 1) })}
                        />
                        <StringListEditor
                          label="Tech Stack"
                          addLabel="Add Tech"
                          values={project.stack}
                          onAdd={() => mutateDraft((next) => { next.projects.items[index].stack.push("New tech") })}
                          onChange={(stackIndex, value) => mutateDraft((next) => { next.projects.items[index].stack[stackIndex] = value })}
                          onRemove={(stackIndex) => mutateDraft((next) => { next.projects.items[index].stack.splice(stackIndex, 1) })}
                        />
                      </div>
                      <div className="mt-4">
                        <SmallButton onClick={() => mutateDraft((next) => { next.projects.items.splice(index, 1) })} tone="danger">Remove Project</SmallButton>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            ) : null}

            {activeTab === "wins" ? (
              <>
                <SectionCard title="Achievements" description="Awards, competition wins, milestone stats, and supporting copy.">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Section Label" value={draft.achievements.sectionLabel} onChange={(value) => mutateDraft((next) => { next.achievements.sectionLabel = value })} />
                    <TextAreaField label="Title" rows={3} value={draft.achievements.title} onChange={(value) => mutateDraft((next) => { next.achievements.title = value })} />
                  </div>
                  <div className="mt-4">
                    <TextAreaField label="Description" rows={4} value={draft.achievements.description} onChange={(value) => mutateDraft((next) => { next.achievements.description = value })} />
                  </div>
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">Achievement Items</p>
                      <SmallButton onClick={() => mutateDraft((next) => { next.achievements.items.push({ category: "Recognition", description: "", iconName: "trophy", subtitle: "", title: "New Achievement", year: "2026" }) })}>Add Achievement</SmallButton>
                    </div>
                    {draft.achievements.items.map((item, index) => (
                      <div key={`${item.title}-${index}`} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          <Field label="Title" value={item.title} onChange={(value) => mutateDraft((next) => { next.achievements.items[index].title = value })} />
                          <Field label="Subtitle" value={item.subtitle} onChange={(value) => mutateDraft((next) => { next.achievements.items[index].subtitle = value })} />
                          <Field label="Year" value={item.year} onChange={(value) => mutateDraft((next) => { next.achievements.items[index].year = value })} />
                          <Field label="Category" value={item.category} onChange={(value) => mutateDraft((next) => { next.achievements.items[index].category = value })} />
                          <Field label="Icon Name" value={item.iconName} onChange={(value) => mutateDraft((next) => { next.achievements.items[index].iconName = value })} />
                        </div>
                        <div className="mt-4">
                          <TextAreaField label="Description" rows={4} value={item.description} onChange={(value) => mutateDraft((next) => { next.achievements.items[index].description = value })} />
                        </div>
                        <div className="mt-4">
                          <SmallButton onClick={() => mutateDraft((next) => { next.achievements.items.splice(index, 1) })} tone="danger">Remove Achievement</SmallButton>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">Achievement Stats</p>
                      <SmallButton onClick={() => mutateDraft((next) => { next.achievements.stats.push({ label: "New Stat", value: "0" }) })}>Add Stat</SmallButton>
                    </div>
                    <div className="mt-4 space-y-3">
                      {draft.achievements.stats.map((item, index) => (
                        <div key={`${item.label}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                          <Field label="Label" value={item.label} onChange={(value) => mutateDraft((next) => { next.achievements.stats[index].label = value })} />
                          <Field label="Value" value={item.value} onChange={(value) => mutateDraft((next) => { next.achievements.stats[index].value = value })} />
                          <div className="pt-8">
                            <SmallButton onClick={() => mutateDraft((next) => { next.achievements.stats.splice(index, 1) })} tone="danger">Remove</SmallButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Hobbies + Interests" description="Everything shown in the beyond-the-build section.">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Section Label" value={draft.hobbies.sectionLabel} onChange={(value) => mutateDraft((next) => { next.hobbies.sectionLabel = value })} />
                    <Field label="Title" value={draft.hobbies.title} onChange={(value) => mutateDraft((next) => { next.hobbies.title = value })} />
                    <Field label="Highlight Text" value={draft.hobbies.highlight} onChange={(value) => mutateDraft((next) => { next.hobbies.highlight = value })} />
                  </div>
                  <div className="mt-4">
                    <TextAreaField label="Description" rows={4} value={draft.hobbies.description} onChange={(value) => mutateDraft((next) => { next.hobbies.description = value })} />
                  </div>
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">Hobby Cards</p>
                      <SmallButton onClick={() => mutateDraft((next) => { next.hobbies.items.push({ description: "", eyebrow: "Personal energy source", iconName: "rocket", title: "New Interest" }) })}>Add Hobby</SmallButton>
                    </div>
                    {draft.hobbies.items.map((item, index) => (
                      <div key={`${item.title}-${index}`} className="grid gap-4 rounded-[24px] border border-white/8 bg-white/[0.03] p-4 md:grid-cols-2 lg:grid-cols-4">
                        <Field label="Title" value={item.title} onChange={(value) => mutateDraft((next) => { next.hobbies.items[index].title = value })} />
                        <Field label="Icon Name" value={item.iconName} onChange={(value) => mutateDraft((next) => { next.hobbies.items[index].iconName = value })} />
                        <Field label="Eyebrow" value={item.eyebrow} onChange={(value) => mutateDraft((next) => { next.hobbies.items[index].eyebrow = value })} />
                        <div className="lg:col-span-4">
                          <TextAreaField label="Description" rows={3} value={item.description} onChange={(value) => mutateDraft((next) => { next.hobbies.items[index].description = value })} />
                        </div>
                        <div className="lg:col-span-4">
                          <SmallButton onClick={() => mutateDraft((next) => { next.hobbies.items.splice(index, 1) })} tone="danger">Remove Hobby</SmallButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </>
            ) : null}

            {activeTab === "contact" ? (
              <SectionCard title="Contact Surface" description="Manage the contact form copy, contact cards, and the recipient email used by EmailJS.">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Section Label" value={draft.contact.sectionLabel} onChange={(value) => mutateDraft((next) => { next.contact.sectionLabel = value })} />
                  <Field label="Form Recipient Email" value={draft.contact.formRecipientEmail} onChange={(value) => mutateDraft((next) => { next.contact.formRecipientEmail = value })} />
                  <Field label="Form Badge" value={draft.contact.formBadge} onChange={(value) => mutateDraft((next) => { next.contact.formBadge = value })} />
                  <Field label="Form Title" value={draft.contact.formTitle} onChange={(value) => mutateDraft((next) => { next.contact.formTitle = value })} />
                  <Field label="Info Title" value={draft.contact.infoTitle} onChange={(value) => mutateDraft((next) => { next.contact.infoTitle = value })} />
                  <Field label="Social Title" value={draft.contact.socialTitle} onChange={(value) => mutateDraft((next) => { next.contact.socialTitle = value })} />
                  <Field label="Submit Label" value={draft.contact.submitLabel} onChange={(value) => mutateDraft((next) => { next.contact.submitLabel = value })} />
                  <Field label="Submitting Label" value={draft.contact.submittingLabel} onChange={(value) => mutateDraft((next) => { next.contact.submittingLabel = value })} />
                </div>
                <div className="mt-4 space-y-4">
                  <TextAreaField label="Section Title" rows={3} value={draft.contact.title} onChange={(value) => mutateDraft((next) => { next.contact.title = value })} />
                  <TextAreaField label="Description" rows={4} value={draft.contact.description} onChange={(value) => mutateDraft((next) => { next.contact.description = value })} />
                  <TextAreaField label="Social Description" rows={3} value={draft.contact.socialDescription} onChange={(value) => mutateDraft((next) => { next.contact.socialDescription = value })} />
                </div>
                <div className="mt-5 rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">Contact Info Cards</p>
                    <SmallButton onClick={() => mutateDraft((next) => { next.contact.infoItems.push({ iconName: "mail", label: "New Item", value: "" }) })}>Add Info Item</SmallButton>
                  </div>
                  <div className="mt-4 space-y-3">
                    {draft.contact.infoItems.map((item, index) => (
                      <div key={`${item.label}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                        <Field label="Label" value={item.label} onChange={(value) => mutateDraft((next) => { next.contact.infoItems[index].label = value })} />
                        <Field label="Value" value={item.value} onChange={(value) => mutateDraft((next) => { next.contact.infoItems[index].value = value })} />
                        <Field label="Icon Name" value={item.iconName} onChange={(value) => mutateDraft((next) => { next.contact.infoItems[index].iconName = value })} />
                        <div className="pt-8">
                          <SmallButton onClick={() => mutateDraft((next) => { next.contact.infoItems.splice(index, 1) })} tone="danger">Remove</SmallButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>
            ) : null}

            {activeTab === "assistant" ? (
              <SectionCard
                title="AI Assistant Brain"
                description="Tune the assistant's personality, welcome state, RAG notes, and follow-up prompts. Rebuild the knowledge index after uploading a new resume."
                action={
                  <button
                    type="button"
                    onClick={handleRebuildKnowledge}
                    className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100 transition-all hover:bg-cyan-500/20"
                  >
                    <RefreshCw size={14} />
                    Rebuild Index
                  </button>
                }
              >
                <div className="space-y-4">
                  <TextAreaField label="Welcome Message" rows={4} value={draft.assistant.welcomeMessage} onChange={(value) => mutateDraft((next) => { next.assistant.welcomeMessage = value })} />
                  <TextAreaField label="System Preamble" rows={5} value={draft.assistant.systemPreamble} onChange={(value) => mutateDraft((next) => { next.assistant.systemPreamble = value })} />
                  <TextAreaField label="Tone Guidance" rows={4} value={draft.assistant.tone} onChange={(value) => mutateDraft((next) => { next.assistant.tone = value })} />
                </div>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <StringListEditor
                    label="Suggested Questions"
                    addLabel="Add Suggestion"
                    values={draft.assistant.suggestedQuestions}
                    onAdd={() => mutateDraft((next) => { next.assistant.suggestedQuestions.push("New suggested question") })}
                    onChange={(index, value) => mutateDraft((next) => { next.assistant.suggestedQuestions[index] = value })}
                    onRemove={(index) => mutateDraft((next) => { next.assistant.suggestedQuestions.splice(index, 1) })}
                  />
                  <StringListEditor
                    label="Knowledge Notes"
                    addLabel="Add Note"
                    values={draft.assistant.knowledgeNotes}
                    onAdd={() => mutateDraft((next) => { next.assistant.knowledgeNotes.push("New knowledge note") })}
                    onChange={(index, value) => mutateDraft((next) => { next.assistant.knowledgeNotes[index] = value })}
                    onRemove={(index) => mutateDraft((next) => { next.assistant.knowledgeNotes.splice(index, 1) })}
                  />
                </div>
                <div className="mt-5">
                  <TextAreaField label="Indexed Resume Text" rows={10} value={draft.assistant.resumeText} onChange={(value) => mutateDraft((next) => { next.assistant.resumeText = value })} />
                </div>
              </SectionCard>
            ) : null}

            {activeTab === "raw" ? (
              <SectionCard title="Raw JSON Mode" description="Advanced fallback for anything you want to adjust directly in the stored document. Apply here, then save to persist.">
                <textarea
                  rows={28}
                  value={rawJson}
                  onChange={(event) => setRawJson(event.target.value)}
                  className="w-full rounded-[26px] border border-white/10 bg-black/30 px-5 py-5 font-mono text-sm leading-7 text-cyan-50 outline-none focus:border-cyan-400/40"
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={applyRawJson}
                    className="rounded-full border border-white/12 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition-all hover:border-cyan-400/24 hover:text-cyan-100"
                  >
                    Apply JSON to Editor
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-full bg-[linear-gradient(135deg,rgba(34,211,238,0.92),rgba(59,130,246,0.88))] px-5 py-3 text-sm font-semibold text-slate-950 transition-all hover:-translate-y-0.5"
                  >
                    Save Applied JSON
                  </button>
                </div>
              </SectionCard>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
