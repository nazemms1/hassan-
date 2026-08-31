import React, { useState, useEffect } from 'react'
import { usePortfolio } from '../../context/PortfolioContext'
import { uploadPortfolioImage } from '../../firebase'
import type { Certification, Discipline, Project, Role } from '../../data/portfolio'
import {
  User,
  FolderKanban,
  Briefcase,
  Award,
  Database,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Upload,
  Save,
  RefreshCw,
  Download,
  UploadCloud,
  Globe,
  Sparkles,
  Image as ImageIcon,
  Check,
  Search,
  X,
  FileCode,
  Building,
  ChevronRight,
  Edit3,
  Layers,
  Tag,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  ShieldCheck,
  Menu,
  Wrench,
  Palette,
  Layout,
  Share2,
  CheckCircle,
  Copy,
} from 'lucide-react'

type MainTab = 'projects' | 'disciplines' | 'profile' | 'experience' | 'skills' | 'system'
type DrawerType = 'project' | 'role' | 'discipline' | 'certification' | null

export default function AdminDashboard() {
  const { data, updatePortfolio, syncStatus, lastSynced, user, logout, exportJson, importJson, seedDefaultData } =
    usePortfolio()

  const [activeTab, setActiveTab] = useState<MainTab>('projects')
  const [formData, setFormData] = useState(data)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Aside Drawer Panel States
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerType, setDrawerType] = useState<DrawerType>(null)
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null)

  // Drawer Draft Item States
  const [draftProject, setDraftProject] = useState<Project | null>(null)
  const [draftRole, setDraftRole] = useState<Role | null>(null)
  const [draftDiscipline, setDraftDiscipline] = useState<Discipline | null>(null)
  const [draftCertification, setDraftCertification] = useState<Certification | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [newTagInput, setNewTagInput] = useState('')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Keep local form in sync
  useEffect(() => {
    setFormData(data)
  }, [data])

  // Keyboard shortcut Ctrl+S / Cmd+S for saving
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [formData, drawerOpen])

  const handleSave = async (dataToSave = formData) => {
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      await updatePortfolio(dataToSave)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2500)
    } catch (err: any) {
      console.error('Save error:', err)
      alert(
        `فشل حفظ التعديلات على Firestore: ${err?.message || 'خطأ غير معروف'}\n\n` +
          `التعديلات محفوظة مؤقتاً بمتصفحك فقط ولن تظهر لباقي الزوار أو على باقي الأجهزة حتى تتم مزامنتها بنجاح. حاول الحفظ مرة أخرى.`
      )
    } finally {
      setIsSaving(false)
    }
  }

  /* ── Aside Drawer Openers ────────────────────────────────────────────────── */
  const openProjectDrawer = (proj?: Project, index?: number) => {
    setDrawerType('project')
    if (proj && index !== undefined) {
      setDraftProject({ ...proj })
      setEditingItemIndex(index)
    } else {
      setDraftProject({
        id: 'proj_' + Date.now(),
        title: 'New Case Study',
        client: 'Client Name',
        year: new Date().getFullYear().toString(),
        discipline: 'UI/UX Design',
        description: 'Describe the project scope, background, and user experience...',
        contribution: ['User Research', 'UI Design', 'Wireframing'],
        images: [],
        hidden: false,
      })
      setEditingItemIndex(null)
    }
    setDrawerOpen(true)
  }

  const openRoleDrawer = (role?: Role, index?: number) => {
    setDrawerType('role')
    if (role && index !== undefined) {
      setDraftRole({ ...role })
      setEditingItemIndex(index)
    } else {
      setDraftRole({
        id: 'role_' + Date.now(),
        title: 'Senior UI/UX Designer',
        company: 'Company Name',
        location: 'Damascus, Syria',
        period: '2025 — Present',
        current: false,
        points: ['Lead user experience initiatives across digital products.'],
      })
      setEditingItemIndex(null)
    }
    setDrawerOpen(true)
  }

  const openDisciplineDrawer = (disc?: Discipline, index?: number) => {
    setDrawerType('discipline')
    if (disc && index !== undefined) {
      setDraftDiscipline({ ...disc })
      setEditingItemIndex(index)
    } else {
      setDraftDiscipline({
        name: 'New Practice',
        note: 'End to end digital design service',
      })
      setEditingItemIndex(null)
    }
    setDrawerOpen(true)
  }

  const openCertDrawer = (cert?: Certification, index?: number) => {
    setDrawerType('certification')
    if (cert && index !== undefined) {
      setDraftCertification({ ...cert })
      setEditingItemIndex(index)
    } else {
      setDraftCertification({
        id: 'cert_' + Date.now(),
        title: 'UX Design Professional Certificate',
        issuer: 'GOOGLE',
        date: new Date().getFullYear().toString(),
        description: 'Professional certificate covering user research and prototyping.',
        image: '',
        imageAlt: '',
      })
      setEditingItemIndex(null)
    }
    setDrawerOpen(true)
  }

  /* ── Save Aside Drawer Item ──────────────────────────────────────────────── */
  const saveDrawerItem = () => {
    if (drawerType === 'project' && draftProject) {
      const nextProjects = [...formData.projects]
      if (editingItemIndex !== null) {
        nextProjects[editingItemIndex] = draftProject
      } else {
        nextProjects.unshift(draftProject)
      }
      const nextData = { ...formData, projects: nextProjects }
      setFormData(nextData)
      handleSave(nextData)
    } else if (drawerType === 'role' && draftRole) {
      const nextExperience = [...formData.experience]
      if (editingItemIndex !== null) {
        nextExperience[editingItemIndex] = draftRole
      } else {
        nextExperience.unshift(draftRole)
      }
      const nextData = { ...formData, experience: nextExperience }
      setFormData(nextData)
      handleSave(nextData)
    } else if (drawerType === 'discipline' && draftDiscipline) {
      const nextDisciplines = [...formData.disciplines]
      if (editingItemIndex !== null) {
        nextDisciplines[editingItemIndex] = draftDiscipline
      } else {
        nextDisciplines.push(draftDiscipline)
      }
      const nextData = { ...formData, disciplines: nextDisciplines }
      setFormData(nextData)
      handleSave(nextData)
    } else if (drawerType === 'certification' && draftCertification) {
      const nextCerts = [...formData.certifications]
      if (editingItemIndex !== null) {
        nextCerts[editingItemIndex] = draftCertification
      } else {
        nextCerts.unshift(draftCertification)
      }
      const nextData = { ...formData, certifications: nextCerts }
      setFormData(nextData)
      handleSave(nextData)
    }
    setDrawerOpen(false)
  }

  // Filtered projects
  const filteredProjects = formData.projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.discipline.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const navItems = [
    { id: 'projects', label: 'Projects Showcase', icon: FolderKanban, color: 'text-sky-400', count: formData.projects.length },
    { id: 'disciplines', label: 'Services & Practices', icon: Palette, color: 'text-purple-400', count: formData.disciplines.length },
    { id: 'profile', label: 'Profile & Hero', icon: User, color: 'text-emerald-400', count: null },
    { id: 'experience', label: 'Work Experience', icon: Briefcase, color: 'text-amber-400', count: formData.experience.length },
    { id: 'skills', label: 'Skills & Credentials', icon: Award, color: 'text-indigo-400', count: formData.certifications.length },
    { id: 'system', label: 'System & Backup', icon: Database, color: 'text-rose-400', count: null },
  ]

  return (
    <div className="min-h-screen w-full bg-[#060812] text-ink flex font-body selection:bg-accent/30 overflow-x-hidden antialiased">
      {/* ─────────────────────────────────────────────────────────────────
          LEFT FIXED VERTICAL SIDEBAR
         ───────────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#090d1a] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Studio Branding */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center text-ground font-bold shadow-lg shadow-sky-500/20">
              <Sparkles className="w-5 h-5 text-ground" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base text-ink tracking-tight flex items-center gap-2">
                Portfolio CMS
              </span>
              <span className="text-[0.65rem] font-mono text-sky-400 uppercase">Studio Engine</span>
            </div>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1.5 rounded-lg border border-white/10 text-faint hover:text-ink md:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items with Colorful Icons */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          <div className="label px-3 text-[0.65rem] text-faint mb-1 tracking-wider uppercase">CMS Modules</div>

          {navItems.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as MainTab)
                  setMobileSidebarOpen(false)
                }}
                className={`group flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-ink border border-white/20 shadow-xl shadow-black/50 ring-1 ring-sky-400/40'
                    : 'text-muted hover:text-ink hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                      isActive ? 'bg-white/10 border-white/20' : 'bg-black/30 border-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${tab.color}`} />
                  </div>
                  <span className="font-medium">{tab.label}</span>
                </div>
                {tab.count !== null && (
                  <span
                    className={`text-[0.65rem] font-mono px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-sky-400/20 text-sky-300 font-bold' : 'bg-white/10 text-muted'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Session Card */}
        <div className="p-4 border-t border-white/10 bg-black/30 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-ink truncate">{user?.email || 'Administrator'}</span>
              <span
                className={`text-[0.625rem] font-mono flex items-center gap-1 ${
                  syncStatus === 'error' ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    syncStatus === 'error' ? 'bg-red-400' : 'bg-emerald-400'
                  }`}
                />
                {syncStatus === 'live'
                  ? 'Live Firestore'
                  : syncStatus === 'error'
                  ? 'Sync Failed — Not Saved'
                  : 'Local Storage Mode'}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="btn btn-ghost text-xs py-2.5 px-3 gap-2 justify-center hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 font-mono uppercase"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      {/* ─────────────────────────────────────────────────────────────────
          MAIN WORKSPACE
         ───────────────────────────────────────────────────────────────── */}
      <div className="flex-1 md:pl-72 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#060812]/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl border border-white/10 text-muted hover:text-ink md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h1 className="font-display font-bold text-lg text-ink capitalize flex items-center gap-2">
                {activeTab === 'projects' && <FolderKanban className="w-5 h-5 text-sky-400" />}
                {activeTab === 'disciplines' && <Palette className="w-5 h-5 text-purple-400" />}
                {activeTab === 'profile' && <User className="w-5 h-5 text-emerald-400" />}
                {activeTab === 'experience' && <Briefcase className="w-5 h-5 text-amber-400" />}
                {activeTab === 'skills' && <Award className="w-5 h-5 text-indigo-400" />}
                {activeTab === 'system' && <Database className="w-5 h-5 text-rose-400" />}
                <span>
                  {activeTab === 'projects'
                    ? 'Projects Showcase'
                    : activeTab === 'disciplines'
                    ? 'Services & Practices'
                    : activeTab === 'profile'
                    ? 'Profile & Hero Details'
                    : activeTab === 'experience'
                    ? 'Work Experience Timeline'
                    : activeTab === 'skills'
                    ? 'Skills & Credentials'
                    : 'System Status & Data Backup'}
                </span>
              </h1>
              <span className="text-xs text-muted">
                Manage and edit content across your portfolio site
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave()}
              disabled={isSaving}
              className="btn btn-primary text-xs py-2.5 px-4 gap-2 font-mono uppercase tracking-wider shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02]"
            >
              {isSaving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-3.5 h-3.5 text-ground" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isSaving ? 'Saving' : saveSuccess ? 'Saved' : 'Save (Ctrl+S)'}</span>
            </button>

            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost text-xs py-2.5 px-3.5 gap-1.5 text-muted hover:text-ink font-mono uppercase hidden sm:flex"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview</span>
            </a>
          </div>
        </header>

        {/* Workspace Body */}
        <div className="p-6 sm:p-8 flex-1">
          {/* =================================================================
              TAB 1: PROJECTS SHOWCASE
             ================================================================= */}
          {activeTab === 'projects' && (
            <div className="flex flex-col gap-6">
              {/* Header & New Project Trigger */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-black/40 p-5 rounded-3xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base text-ink">Projects Library ({formData.projects.length})</h2>
                    <p className="text-xs text-muted">Manage case studies, reorder positions, and toggle visibility</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
                    <input
                      type="text"
                      placeholder="Filter projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-ink placeholder:text-faint/50 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => openProjectDrawer()}
                    className="btn btn-primary text-xs py-2.5 px-4 gap-2 font-mono uppercase shadow-lg shadow-sky-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                </div>
              </div>

              {/* Projects Grid / Cards View */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((proj, idx) => {
                  const originalIndex = formData.projects.findIndex((p) => p === proj)

                  return (
                    <div
                      key={proj.id || idx}
                      className="panel p-5 border border-white/10 hover:border-sky-400/40 rounded-3xl bg-black/40 flex flex-col justify-between gap-4 group transition-all"
                    >
                      {/* Image Preview & Badges */}
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
                        {proj.images?.[0] ? (
                          <img src={proj.images[0]} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-faint/30" />
                        )}

                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="chip text-[0.6rem] bg-black/80 backdrop-blur-md border-white/20 text-sky-300">
                            {proj.discipline}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3 flex items-center gap-1">
                          {proj.hidden ? (
                            <span className="px-2 py-1 rounded-full bg-amber-500/90 text-black text-[0.6rem] font-mono font-bold flex items-center gap-1 shadow-md">
                              <EyeOff className="w-3 h-3" /> Hidden
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full bg-emerald-500/90 text-black text-[0.6rem] font-mono font-bold flex items-center gap-1 shadow-md">
                              <Eye className="w-3 h-3" /> Visible
                            </span>
                          )}
                        </div>

                        {proj.images && proj.images.length > 1 && (
                          <span className="absolute bottom-3 right-3 text-[0.6rem] font-mono px-2 py-0.5 rounded-full bg-black/80 text-white border border-white/20">
                            {proj.images.length} Images
                          </span>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-bold text-base text-ink truncate">{proj.title}</h3>
                          <span className="text-xs font-mono text-faint">{proj.year}</span>
                        </div>
                        <p className="text-xs text-muted truncate">{proj.client}</p>
                        {proj.contribution && proj.contribution.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {proj.contribution.slice(0, 3).map((tag, tIdx) => (
                              <span key={tIdx} className="text-[0.6rem] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted font-mono">
                                {tag}
                              </span>
                            ))}
                            {proj.contribution.length > 3 && (
                              <span className="text-[0.6rem] px-1.5 py-0.5 text-faint font-mono">
                                +{proj.contribution.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Bar (Reorder Up/Down, Hide/Show, Edit via Aside, Delete) */}
                      <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-auto">
                        <div className="flex items-center gap-1">
                          {/* Move Up */}
                          <button
                            disabled={originalIndex === 0}
                            onClick={() => {
                              if (originalIndex === 0) return
                              const nextArr = [...formData.projects]
                              const temp = nextArr[originalIndex - 1]
                              nextArr[originalIndex - 1] = nextArr[originalIndex]
                              nextArr[originalIndex] = temp
                              const nextData = { ...formData, projects: nextArr }
                              setFormData(nextData)
                              handleSave(nextData)
                            }}
                            className="p-2 rounded-xl border border-white/10 hover:bg-white/10 text-sky-400 disabled:opacity-20 transition-colors"
                            title="Move Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>

                          {/* Move Down */}
                          <button
                            disabled={originalIndex === formData.projects.length - 1}
                            onClick={() => {
                              if (originalIndex === formData.projects.length - 1) return
                              const nextArr = [...formData.projects]
                              const temp = nextArr[originalIndex + 1]
                              nextArr[originalIndex + 1] = nextArr[originalIndex]
                              nextArr[originalIndex] = temp
                              const nextData = { ...formData, projects: nextArr }
                              setFormData(nextData)
                              handleSave(nextData)
                            }}
                            className="p-2 rounded-xl border border-white/10 hover:bg-white/10 text-sky-400 disabled:opacity-20 transition-colors"
                            title="Move Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Hide / Show Toggle */}
                          <button
                            onClick={() => {
                              const nextArr = [...formData.projects]
                              nextArr[originalIndex].hidden = !nextArr[originalIndex].hidden
                              const nextData = { ...formData, projects: nextArr }
                              setFormData(nextData)
                              handleSave(nextData)
                            }}
                            className="p-2 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                            title={proj.hidden ? 'Show Project' : 'Hide Project'}
                          >
                            {proj.hidden ? (
                              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <Eye className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`Delete project "${proj.title}"?`)) {
                                const nextArr = formData.projects.filter((_, i) => i !== originalIndex)
                                const nextData = { ...formData, projects: nextArr }
                                setFormData(nextData)
                                handleSave(nextData)
                              }
                            }}
                            className="p-2 rounded-xl border border-white/10 hover:bg-red-500/20 text-muted hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => openProjectDrawer(proj, originalIndex)}
                            className="btn btn-ghost text-xs py-1.5 px-3 gap-1 text-sky-400 hover:bg-sky-500/10 font-mono"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 2: SERVICES & PRACTICES (DISCIPLINES)
           ================================================================= */}
          {activeTab === 'disciplines' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-black/40 p-5 rounded-3xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base text-ink">Services & Disciplines ({formData.disciplines.length})</h2>
                    <p className="text-xs text-muted">The core practices displayed in hero & profile sections</p>
                  </div>
                </div>

                <button
                  onClick={() => openDisciplineDrawer()}
                  className="btn btn-primary text-xs py-2.5 px-4 gap-2 font-mono uppercase shadow-lg shadow-purple-500/20"
                >
                  <Plus className="w-4 h-4" />
                  Add Practice
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {formData.disciplines.map((disc, idx) => (
                  <div key={idx} className="panel p-5 border border-white/10 rounded-3xl bg-black/40 flex flex-col justify-between gap-4">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono text-xs font-bold">
                        #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return
                            const nextArr = [...formData.disciplines]
                            const temp = nextArr[idx - 1]
                            nextArr[idx - 1] = nextArr[idx]
                            nextArr[idx] = temp
                            const nextData = { ...formData, disciplines: nextArr }
                            setFormData(nextData)
                            handleSave(nextData)
                          }}
                          className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-muted disabled:opacity-20"
                        >
                          <MoveUp className="w-3.5 h-3.5 text-purple-400" />
                        </button>
                        <button
                          disabled={idx === formData.disciplines.length - 1}
                          onClick={() => {
                            if (idx === formData.disciplines.length - 1) return
                            const nextArr = [...formData.disciplines]
                            const temp = nextArr[idx + 1]
                            nextArr[idx + 1] = nextArr[idx]
                            nextArr[idx] = temp
                            const nextData = { ...formData, disciplines: nextArr }
                            setFormData(nextData)
                            handleSave(nextData)
                          }}
                          className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-muted disabled:opacity-20"
                        >
                          <MoveDown className="w-3.5 h-3.5 text-purple-400" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-base text-ink">{disc.name}</h3>
                      <p className="text-xs text-muted mt-1 leading-relaxed">{disc.note}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-auto">
                      <button
                        onClick={() => {
                          const nextArr = formData.disciplines.filter((_, i) => i !== idx)
                          const nextData = { ...formData, disciplines: nextArr }
                          setFormData(nextData)
                          handleSave(nextData)
                        }}
                        className="p-1.5 text-faint hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openDisciplineDrawer(disc, idx)}
                        className="btn btn-ghost text-xs py-1 px-3 gap-1 text-purple-400 font-mono"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 3: PROFILE & HERO
           ================================================================= */}
          {activeTab === 'profile' && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="panel p-6 sm:p-8 flex flex-col gap-5 border border-white/10 rounded-3xl bg-black/40">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-ink">Personal Identity</h3>
                    <p className="text-xs text-muted">Primary name, role title, tagline, and location</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="label text-[0.65rem] text-muted">Full Name</label>
                    <input
                      type="text"
                      value={formData.profile.name}
                      onChange={(e) =>
                        setFormData({ ...formData, profile: { ...formData.profile, name: e.target.value } })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-ink"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="label text-[0.65rem] text-muted">Professional Role Title</label>
                    <input
                      type="text"
                      value={formData.profile.role}
                      onChange={(e) =>
                        setFormData({ ...formData, profile: { ...formData.profile, role: e.target.value } })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-ink"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="label text-[0.65rem] text-muted">Hero Tagline</label>
                    <input
                      type="text"
                      value={formData.profile.tagline}
                      onChange={(e) =>
                        setFormData({ ...formData, profile: { ...formData.profile, tagline: e.target.value } })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-ink"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="label text-[0.65rem] text-muted">Location</label>
                    <input
                      type="text"
                      value={formData.profile.location}
                      onChange={(e) =>
                        setFormData({ ...formData, profile: { ...formData.profile, location: e.target.value } })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-ink"
                    />
                  </div>
                </div>
              </div>

              <div className="panel p-6 sm:p-8 flex flex-col gap-5 border border-white/10 rounded-3xl bg-black/40">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-ink">Contact & Social Links</h3>
                    <p className="text-xs text-muted">Direct contact channels and CV URL</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="label text-[0.65rem] text-muted">Email Address</label>
                    <input
                      type="email"
                      value={formData.profile.email}
                      onChange={(e) =>
                        setFormData({ ...formData, profile: { ...formData.profile, email: e.target.value } })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-ink"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="label text-[0.65rem] text-muted">Phone Number</label>
                    <input
                      type="text"
                      value={formData.profile.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, profile: { ...formData.profile, phone: e.target.value } })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-ink"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="label text-[0.65rem] text-muted">WhatsApp Number</label>
                    <input
                      type="text"
                      value={formData.profile.whatsapp}
                      onChange={(e) =>
                        setFormData({ ...formData, profile: { ...formData.profile, whatsapp: e.target.value } })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-ink"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="label text-[0.65rem] text-muted">CV Download Link</label>
                    <input
                      type="text"
                      value={formData.profile.cvUrl || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, profile: { ...formData.profile, cvUrl: e.target.value } })
                      }
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-ink"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 4: WORK EXPERIENCE
           ================================================================= */}
          {activeTab === 'experience' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-black/40 p-5 rounded-3xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base text-ink">Career Timeline ({formData.experience.length})</h2>
                    <p className="text-xs text-muted">Reorder roles, update achievements, and manage positions</p>
                  </div>
                </div>

                <button
                  onClick={() => openRoleDrawer()}
                  className="btn btn-primary text-xs py-2.5 px-4 gap-2 font-mono uppercase shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  Add Role
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {formData.experience.map((role, idx) => (
                  <div key={role.id || idx} className="panel p-6 border border-white/10 rounded-3xl bg-black/40 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                          <Building className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display font-bold text-base text-ink">{role.company}</h3>
                            {role.current && <span className="chip text-[0.55rem] uppercase">Current</span>}
                          </div>
                          <p className="text-xs text-muted">{role.title} • <span className="font-mono">{role.period}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Move Up */}
                        <button
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return
                            const nextArr = [...formData.experience]
                            const temp = nextArr[idx - 1]
                            nextArr[idx - 1] = nextArr[idx]
                            nextArr[idx] = temp
                            const nextData = { ...formData, experience: nextArr }
                            setFormData(nextData)
                            handleSave(nextData)
                          }}
                          className="p-2 rounded-xl border border-white/10 hover:bg-white/10 text-amber-400 disabled:opacity-20"
                          title="Move Up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          disabled={idx === formData.experience.length - 1}
                          onClick={() => {
                            if (idx === formData.experience.length - 1) return
                            const nextArr = [...formData.experience]
                            const temp = nextArr[idx + 1]
                            nextArr[idx + 1] = nextArr[idx]
                            nextArr[idx] = temp
                            const nextData = { ...formData, experience: nextArr }
                            setFormData(nextData)
                            handleSave(nextData)
                          }}
                          className="p-2 rounded-xl border border-white/10 hover:bg-white/10 text-amber-400 disabled:opacity-20"
                          title="Move Down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (confirm(`Delete role at ${role.company}?`)) {
                              const nextArr = formData.experience.filter((_, i) => i !== idx)
                              const nextData = { ...formData, experience: nextArr }
                              setFormData(nextData)
                              handleSave(nextData)
                            }
                          }}
                          className="p-2 rounded-xl border border-white/10 hover:bg-red-500/20 text-muted hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openRoleDrawer(role, idx)}
                          className="btn btn-ghost text-xs py-1.5 px-3 gap-1 text-amber-400 font-mono"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                      </div>
                    </div>

                    <ul className="flex flex-col gap-2 pl-2">
                      {role.points.map((pt, ptIdx) => (
                        <li key={ptIdx} className="text-xs text-muted flex items-start gap-2">
                          <span className="text-amber-400 font-mono">•</span>
                          <span className="leading-relaxed">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 5: SKILLS & CREDENTIALS
           ================================================================= */}
          {activeTab === 'skills' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-black/40 p-5 rounded-3xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base text-ink">Certifications ({formData.certifications.length})</h2>
                    <p className="text-xs text-muted">Degrees and professional awards</p>
                  </div>
                </div>

                <button
                  onClick={() => openCertDrawer()}
                  className="btn btn-primary text-xs py-2.5 px-4 gap-2 font-mono uppercase shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-4 h-4" />
                  Add Certification
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {formData.certifications.map((cert, idx) => (
                  <div key={cert.id || idx} className="panel p-5 border border-white/10 rounded-3xl bg-black/40 flex flex-col justify-between gap-4 group hover:border-indigo-500/40 transition-all">
                    {/* Certificate Image Preview */}
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
                      {cert.image ? (
                        <img src={cert.image} alt={cert.imageAlt || cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-faint">
                          <ImageIcon className="w-7 h-7 opacity-40" />
                          <span className="text-[0.65rem] font-mono">No Certificate Image</span>
                        </div>
                      )}

                      <div className="absolute top-2.5 left-2.5">
                        <span className="chip text-[0.55rem] bg-black/80 backdrop-blur-md border-indigo-500/30 text-indigo-300">
                          {cert.issuer}
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[0.65rem] font-mono px-2 py-0.5 rounded-full bg-black/80 text-faint border border-white/10">
                          {cert.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <h3 className="font-display font-bold text-base text-ink">{cert.title}</h3>
                      <p className="text-xs text-muted leading-relaxed line-clamp-3">{cert.description}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-auto">
                      <div className="flex items-center gap-1">
                        {/* Move Up */}
                        <button
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return
                            const nextArr = [...formData.certifications]
                            const temp = nextArr[idx - 1]
                            nextArr[idx - 1] = nextArr[idx]
                            nextArr[idx] = temp
                            const nextData = { ...formData, certifications: nextArr }
                            setFormData(nextData)
                            handleSave(nextData)
                          }}
                          className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-indigo-400 disabled:opacity-20 transition-colors"
                          title="Move Up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          disabled={idx === formData.certifications.length - 1}
                          onClick={() => {
                            if (idx === formData.certifications.length - 1) return
                            const nextArr = [...formData.certifications]
                            const temp = nextArr[idx + 1]
                            nextArr[idx + 1] = nextArr[idx]
                            nextArr[idx] = temp
                            const nextData = { ...formData, certifications: nextArr }
                            setFormData(nextData)
                            handleSave(nextData)
                          }}
                          className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-indigo-400 disabled:opacity-20 transition-colors"
                          title="Move Down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (confirm(`Delete certification "${cert.title}"?`)) {
                              const nextArr = formData.certifications.filter((_, i) => i !== idx)
                              const nextData = { ...formData, certifications: nextArr }
                              setFormData(nextData)
                              handleSave(nextData)
                            }
                          }}
                          className="p-1.5 text-faint hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openCertDrawer(cert, idx)}
                          className="btn btn-ghost text-xs py-1 px-3 gap-1 text-indigo-400 font-mono"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 6: SYSTEM & BACKUP
           ================================================================= */}
          {activeTab === 'system' && (
            <div className="grid gap-6 lg:grid-cols-2 items-start">
              <div className="panel p-6 sm:p-8 flex flex-col gap-5 border border-white/10 rounded-3xl bg-black/40">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-ink">System Diagnostics</h3>
                    <p className="text-xs text-muted">Realtime synchronization health</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-2xl border border-white/10 bg-black/50 flex flex-col gap-1">
                    <span className="label text-[0.6rem] text-faint">Realtime Connection</span>
                    <span
                      className={`text-sm font-semibold font-mono mt-1 uppercase ${
                        syncStatus === 'error' ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {syncStatus === 'live'
                        ? 'Live Synced'
                        : syncStatus === 'error'
                        ? 'Sync Failed — Not Saved'
                        : 'Local Storage Mode'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl border border-white/10 bg-black/50 flex flex-col gap-1">
                    <span className="label text-[0.6rem] text-faint">Last Sync</span>
                    <span className="text-sm font-semibold font-mono text-ink mt-1">
                      {lastSynced ? lastSynced.toLocaleTimeString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="panel p-6 sm:p-8 flex flex-col gap-5 border border-white/10 rounded-3xl bg-black/40">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-ink">JSON Backup & Restore</h3>
                    <p className="text-xs text-muted">Export full dataset or upload a backup file</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button onClick={exportJson} className="btn btn-primary justify-center py-3 text-xs font-mono uppercase">
                    <Download className="w-4 h-4" /> Download .json Backup
                  </button>

                  <label className="btn btn-ghost justify-center py-3 text-xs cursor-pointer font-mono uppercase border border-white/10">
                    <UploadCloud className="w-4 h-4 text-rose-400" /> Restore from JSON Backup
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = async (evt) => {
                            try {
                              const content = evt.target?.result as string
                              await importJson(content)
                              alert('JSON Backup restored successfully!')
                            } catch (err: any) {
                              alert(`Failed to restore backup: ${err?.message || 'invalid JSON file or Firestore write failed.'}`)
                            }
                          }
                          reader.readAsText(file)
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          ASIDE SLIDING DRAWER PANEL (الـ Aside للاضافة والتعديل التفاعلي)
         ───────────────────────────────────────────────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md animate-[fade-in_200ms_ease-out]"
          />

          {/* Sliding Aside Drawer Content Panel */}
          <aside className="relative w-full sm:w-[460px] h-full bg-[#080c18] border-l border-white/10 shadow-2xl flex flex-col justify-between z-10 animate-[slide-left_250ms_ease-out] overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 border-b border-white/10 bg-[#050711] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-display font-bold text-sm text-ink">
                    {editingItemIndex !== null ? `Edit ${drawerType}` : `Add ${drawerType}`}
                  </h3>
                  <span className="text-[0.65rem] font-mono text-faint">Studio Editor</span>
                </div>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-muted hover:text-ink transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body Forms */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-4">
              {/* 1. PROJECT DRAWER FORM */}
              {drawerType === 'project' && draftProject && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="label text-[0.65rem] text-muted">Project Title</label>
                    <input
                      type="text"
                      value={draftProject.title}
                      onChange={(e) => setDraftProject({ ...draftProject, title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-ink focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div className="grid gap-3 grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="label text-[0.65rem] text-muted">Client</label>
                      <input
                        type="text"
                        value={draftProject.client}
                        onChange={(e) => setDraftProject({ ...draftProject, client: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-ink focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="label text-[0.65rem] text-muted">Year</label>
                      <input
                        type="text"
                        value={draftProject.year}
                        onChange={(e) => setDraftProject({ ...draftProject, year: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-ink focus:outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="label text-[0.65rem] text-muted">Discipline / Category</label>
                    <input
                      type="text"
                      value={draftProject.discipline}
                      onChange={(e) => setDraftProject({ ...draftProject, discipline: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-ink focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="label text-[0.65rem] text-muted">Narrative Description</label>
                    <textarea
                      rows={4}
                      value={draftProject.description}
                      onChange={(e) => setDraftProject({ ...draftProject, description: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-ink leading-relaxed focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  {/* Image Manager in Aside */}
                  <div className="flex flex-col gap-2.5 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="label text-[0.65rem] text-sky-400 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5" /> Gallery ({draftProject.images?.length || 0})
                      </label>
                      <label className={`btn btn-ghost text-[0.65rem] py-1 px-2.5 gap-1 font-mono ${uploadingImage ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}>
                        <Upload className="w-3 h-3 text-sky-400" />
                        {uploadingImage ? 'Uploading...' : 'Upload'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingImage}
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            setUploadingImage(true)
                            try {
                              const url = await uploadPortfolioImage(file, 'projects')
                              setDraftProject((prev) =>
                                prev ? { ...prev, images: [...(prev.images || []), url] } : prev
                              )
                            } catch (err: any) {
                              alert(`فشل رفع الصورة إلى Firebase Storage: ${err?.message || 'خطأ غير معروف'}`)
                            } finally {
                              setUploadingImage(false)
                              e.target.value = ''
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {(draftProject.images || []).map((img, i) => (
                        <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-black/60 group">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() =>
                              setDraftProject({
                                ...draftProject,
                                images: draftProject.images?.filter((_, idx) => idx !== i),
                              })
                            }
                            className="absolute top-1 right-1 p-1 rounded-full bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contribution Tags Editor */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                    <label className="label text-[0.65rem] text-sky-400 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> Project Contributions & Tags ({draftProject.contribution?.length || 0})
                    </label>

                    {/* Chips */}
                    <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-black/40 border border-white/10 min-h-[46px]">
                      {(draftProject.contribution || []).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="chip flex items-center gap-1.5 py-1 px-2.5 text-[0.7rem] bg-white/10 border-white/20 text-ink rounded-full"
                        >
                          <span>{tag}</span>
                          <button
                            onClick={() =>
                              setDraftProject({
                                ...draftProject,
                                contribution: draftProject.contribution.filter((_, i) => i !== tIdx),
                              })
                            }
                            className="hover:text-red-400 text-faint"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Add Tag Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type tag (e.g. Wireframing) and press Enter..."
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTagInput.trim()) {
                            e.preventDefault()
                            setDraftProject({
                              ...draftProject,
                              contribution: [...(draftProject.contribution || []), newTagInput.trim()],
                            })
                            setNewTagInput('')
                          }
                        }}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-ink focus:outline-none focus:border-sky-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newTagInput.trim()) {
                            setDraftProject({
                              ...draftProject,
                              contribution: [...(draftProject.contribution || []), newTagInput.trim()],
                            })
                            setNewTagInput('')
                          }
                        }}
                        className="btn btn-ghost text-xs py-1 px-3 font-mono"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. ROLE DRAWER FORM */}
              {drawerType === 'role' && draftRole && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="label text-[0.65rem] text-muted">Company Name</label>
                    <input
                      type="text"
                      value={draftRole.company}
                      onChange={(e) => setDraftRole({ ...draftRole, company: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-ink"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="label text-[0.65rem] text-muted">Role Title</label>
                    <input
                      type="text"
                      value={draftRole.title}
                      onChange={(e) => setDraftRole({ ...draftRole, title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-ink"
                    />
                  </div>

                  <div className="grid gap-3 grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="label text-[0.65rem] text-muted">Location</label>
                      <input
                        type="text"
                        value={draftRole.location}
                        onChange={(e) => setDraftRole({ ...draftRole, location: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-ink"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <label className="label text-[0.65rem] text-muted">Period</label>
                        <label className="flex items-center gap-1 text-[0.65rem] text-amber-400 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={draftRole.current || false}
                            onChange={(e) => setDraftRole({ ...draftRole, current: e.target.checked })}
                            className="rounded accent-amber-400"
                          />
                          Current Job
                        </label>
                      </div>
                      <input
                        type="text"
                        value={draftRole.period}
                        onChange={(e) => setDraftRole({ ...draftRole, period: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-ink"
                      />
                    </div>
                  </div>

                  {/* Responsibilities & Achievements List */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="label text-[0.65rem] text-amber-400">
                        Responsibilities & Achievements ({draftRole.points?.length || 0})
                      </label>
                      <button
                        onClick={() =>
                          setDraftRole({
                            ...draftRole,
                            points: [...(draftRole.points || []), 'New responsibility or achievement...'],
                          })
                        }
                        className="btn btn-ghost text-[0.65rem] py-1 px-2 gap-1 font-mono text-amber-400"
                      >
                        <Plus className="w-3 h-3" /> Add Point
                      </button>
                    </div>

                    {(draftRole.points || []).map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2">
                        <span className="text-amber-400 font-mono text-xs">•</span>
                        <input
                          type="text"
                          value={pt}
                          onChange={(e) => {
                            const newPoints = [...(draftRole.points || [])]
                            newPoints[pIdx] = e.target.value
                            setDraftRole({ ...draftRole, points: newPoints })
                          }}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-ink focus:outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={() => {
                            const newPoints = (draftRole.points || []).filter((_, i) => i !== pIdx)
                            setDraftRole({ ...draftRole, points: newPoints })
                          }}
                          className="p-1 text-faint hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. DISCIPLINE DRAWER FORM */}
              {drawerType === 'discipline' && draftDiscipline && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="label text-[0.65rem] text-muted">Practice Name</label>
                    <input
                      type="text"
                      value={draftDiscipline.name}
                      onChange={(e) => setDraftDiscipline({ ...draftDiscipline, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-ink"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="label text-[0.65rem] text-muted">Practice Scope / Note</label>
                    <input
                      type="text"
                      value={draftDiscipline.note}
                      onChange={(e) => setDraftDiscipline({ ...draftDiscipline, note: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-ink"
                    />
                  </div>
                </div>
              )}

              {/* 4. CERTIFICATION DRAWER FORM */}
              {drawerType === 'certification' && draftCertification && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="label text-[0.65rem] text-muted">Certification Title</label>
                    <input
                      type="text"
                      value={draftCertification.title}
                      onChange={(e) => setDraftCertification({ ...draftCertification, title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-ink focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div className="grid gap-3 grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="label text-[0.65rem] text-muted">Issuer</label>
                      <input
                        type="text"
                        value={draftCertification.issuer}
                        onChange={(e) => setDraftCertification({ ...draftCertification, issuer: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-ink focus:outline-none focus:border-indigo-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="label text-[0.65rem] text-muted">Date</label>
                      <input
                        type="text"
                        value={draftCertification.date}
                        onChange={(e) => setDraftCertification({ ...draftCertification, date: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-ink focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="label text-[0.65rem] text-muted">Description</label>
                    <textarea
                      rows={3}
                      value={draftCertification.description}
                      onChange={(e) => setDraftCertification({ ...draftCertification, description: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-ink focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  {/* Certificate Image Manager */}
                  <div className="flex flex-col gap-2.5 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="label text-[0.65rem] text-indigo-400 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5" /> Certificate Image
                      </label>
                      <label className={`btn btn-ghost text-[0.65rem] py-1 px-2.5 gap-1 font-mono ${uploadingImage ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}>
                        <Upload className="w-3 h-3 text-indigo-400" />
                        {uploadingImage ? 'Uploading...' : 'Upload File'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingImage}
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            setUploadingImage(true)
                            try {
                              const url = await uploadPortfolioImage(file, 'certifications')
                              setDraftCertification((prev) => (prev ? { ...prev, image: url } : prev))
                            } catch (err: any) {
                              alert(`فشل رفع الصورة إلى Firebase Storage: ${err?.message || 'خطأ غير معروف'}`)
                            } finally {
                              setUploadingImage(false)
                              e.target.value = ''
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Image URL Direct Input */}
                    <div className="flex flex-col gap-1">
                      <input
                        type="text"
                        placeholder="Or enter image URL (e.g. /hassan-/images/cert.webp or https://...)"
                        value={draftCertification.image || ''}
                        onChange={(e) => setDraftCertification({ ...draftCertification, image: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-ink focus:outline-none focus:border-indigo-400"
                      />
                    </div>

                    {/* Image Preview Box */}
                    {draftCertification.image ? (
                      <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-indigo-500/30 bg-black/60 group mt-1">
                        <img src={draftCertification.image} alt={draftCertification.imageAlt || 'Certificate preview'} className="w-full h-full object-cover" />
                        <button
                          onClick={() => setDraftCertification({ ...draftCertification, image: '' })}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600/90 text-white hover:bg-red-700 transition-colors"
                          title="Remove Image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-white/10 bg-black/30 flex flex-col items-center justify-center gap-1 text-faint">
                        <ImageIcon className="w-6 h-6 opacity-30" />
                        <span className="text-[0.65rem]">No image attached yet</span>
                      </div>
                    )}

                    {/* Image Alt Text */}
                    <div className="flex flex-col gap-1 mt-1">
                      <label className="label text-[0.65rem] text-muted">Image Description / Alt Text</label>
                      <input
                        type="text"
                        placeholder="e.g. UI/UX Certificate from Google"
                        value={draftCertification.imageAlt || ''}
                        onChange={(e) => setDraftCertification({ ...draftCertification, imageAlt: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-ink focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-white/10 bg-[#050711] flex items-center justify-end gap-2">
              <button onClick={() => setDrawerOpen(false)} className="btn btn-ghost text-xs py-2 px-3 font-mono">
                Cancel
              </button>

              <button onClick={saveDrawerItem} className="btn btn-primary text-xs py-2 px-4 gap-1.5 font-mono uppercase shadow-md shadow-sky-500/20">
                <Check className="w-3.5 h-3.5" /> Save Item
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
