import { z } from "zod"

export const navigationItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
})

export const statItemSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
})

export const socialLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  iconClass: z.string().min(1),
})

export const identitySchema = z.object({
  fullName: z.string().min(1),
  shortName: z.string().min(1),
  initials: z.string().min(1),
  roleTagline: z.string().min(1),
  currentRole: z.string().min(1),
  location: z.string().min(1),
  primaryEmail: z.string().min(1),
  profileImageUrl: z.string().min(1),
  resumeUrl: z.string().min(1),
})

export const heroSchema = z.object({
  badge: z.string().min(1),
  backgroundWord: z.string().min(1),
  eyebrow: z.string().min(1),
  headline: z.string().min(1),
  intro: z.string().min(1),
  typingPrefix: z.string().min(1),
  roles: z.array(z.string().min(1)).min(1),
  primaryCtaLabel: z.string().min(1),
  secondaryCtaLabel: z.string().min(1),
  capabilitySectionTitle: z.string().min(1),
  capabilityRows: z.array(z.string().min(1)).min(1),
  featuredProfileLabel: z.string().min(1),
  availabilityText: z.string().min(1),
  currentFocusLabel: z.string().min(1),
  currentFocusText: z.string().min(1),
  primaryStackLabel: z.string().min(1),
  primaryStack: z.array(z.string().min(1)).min(1),
  buildingLabel: z.string().min(1),
  buildingText: z.string().min(1),
  stats: z.array(statItemSchema).min(1),
})

export const aboutSchema = z.object({
  sectionLabel: z.string().min(1),
  title: z.string().min(1),
  primaryParagraph: z.string().min(1),
  secondaryParagraph: z.string().min(1),
  storySectionTitle: z.string().min(1),
  storyPoints: z.array(z.string().min(1)).min(1),
  stats: z.array(statItemSchema).min(1),
  ctaLabel: z.string().min(1),
})

export const educationItemSchema = z.object({
  title: z.string().min(1),
  meta: z.string().min(1),
  points: z.array(z.string().min(1)).min(1),
  iconName: z.string().min(1),
})

export const educationSchema = z.object({
  sectionLabel: z.string().min(1),
  title: z.string().min(1),
  taglineBadge: z.string().min(1),
  items: z.array(educationItemSchema).min(1),
})

export const skillCardSchema = z.object({
  accent: z.string().min(1),
  category: z.string().min(1),
  iconName: z.string().min(1),
  name: z.string().min(1),
  order: z.string().min(1),
})

export const skillsSchema = z.object({
  sectionLabel: z.string().min(1),
  title: z.string().min(1),
  categories: z.array(z.string().min(1)).min(1),
  cards: z.array(skillCardSchema).min(1),
  rails: z.array(z.string().min(1)).min(1),
})

export const projectFilterSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
})

export const projectSchema = z.object({
  category: z.string().min(1),
  description: z.string().min(1),
  details: z.string().min(1),
  github: z.string().optional(),
  highlights: z.array(z.string().min(1)).min(1),
  image: z.string().min(1),
  live: z.string().optional(),
  period: z.string().optional(),
  stack: z.array(z.string().min(1)).min(1),
  status: z.string().optional(),
  summary: z.string().min(1),
  title: z.string().min(1),
})

export const projectsSchema = z.object({
  sectionLabel: z.string().min(1),
  title: z.string().min(1),
  filters: z.array(projectFilterSchema).min(1),
  items: z.array(projectSchema).min(1),
})

export const achievementSchema = z.object({
  iconName: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  year: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
})

export const achievementsSchema = z.object({
  sectionLabel: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  items: z.array(achievementSchema).min(1),
  stats: z.array(statItemSchema).min(1),
})

export const hobbySchema = z.object({
  iconName: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  eyebrow: z.string().min(1),
})

export const hobbiesSchema = z.object({
  sectionLabel: z.string().min(1),
  title: z.string().min(1),
  highlight: z.string().min(1),
  description: z.string().min(1),
  items: z.array(hobbySchema).min(1),
})

export const contactInfoItemSchema = z.object({
  iconName: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
})

export const contactSchema = z.object({
  sectionLabel: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  formBadge: z.string().min(1),
  formTitle: z.string().min(1),
  infoTitle: z.string().min(1),
  socialTitle: z.string().min(1),
  socialDescription: z.string().min(1),
  submitLabel: z.string().min(1),
  submittingLabel: z.string().min(1),
  formRecipientEmail: z.string().min(1),
  infoItems: z.array(contactInfoItemSchema).min(1),
})

export const footerSchema = z.object({
  description: z.string().min(1),
  copyrightLabel: z.string().min(1),
})

export const assistantSchema = z.object({
  welcomeMessage: z.string().min(1),
  tone: z.string().min(1),
  systemPreamble: z.string().min(1),
  suggestedQuestions: z.array(z.string().min(1)).min(1),
  knowledgeNotes: z.array(z.string().min(1)),
  resumeText: z.string().default(""),
})

export const metaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(1),
  siteUrl: z.string().min(1),
  ogImageUrl: z.string().min(1),
})

export const portfolioContentSchema = z.object({
  identity: identitySchema,
  navigation: z.object({
    items: z.array(navigationItemSchema).min(1),
  }),
  socialLinks: z.array(socialLinkSchema).min(1),
  hero: heroSchema,
  about: aboutSchema,
  education: educationSchema,
  skills: skillsSchema,
  projects: projectsSchema,
  achievements: achievementsSchema,
  hobbies: hobbiesSchema,
  contact: contactSchema,
  footer: footerSchema,
  assistant: assistantSchema,
  meta: metaSchema,
})

export type NavigationItem = z.infer<typeof navigationItemSchema>
export type StatItem = z.infer<typeof statItemSchema>
export type SocialLink = z.infer<typeof socialLinkSchema>
export type Identity = z.infer<typeof identitySchema>
export type HeroContent = z.infer<typeof heroSchema>
export type AboutContent = z.infer<typeof aboutSchema>
export type EducationItem = z.infer<typeof educationItemSchema>
export type EducationContent = z.infer<typeof educationSchema>
export type SkillCard = z.infer<typeof skillCardSchema>
export type SkillsContent = z.infer<typeof skillsSchema>
export type ProjectFilter = z.infer<typeof projectFilterSchema>
export type ProjectItem = z.infer<typeof projectSchema>
export type ProjectsContent = z.infer<typeof projectsSchema>
export type AchievementItem = z.infer<typeof achievementSchema>
export type AchievementsContent = z.infer<typeof achievementsSchema>
export type HobbyItem = z.infer<typeof hobbySchema>
export type HobbiesContent = z.infer<typeof hobbiesSchema>
export type ContactInfoItem = z.infer<typeof contactInfoItemSchema>
export type ContactContent = z.infer<typeof contactSchema>
export type FooterContent = z.infer<typeof footerSchema>
export type AssistantContent = z.infer<typeof assistantSchema>
export type MetaContent = z.infer<typeof metaSchema>
export type PortfolioContent = z.infer<typeof portfolioContentSchema>
