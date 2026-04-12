import type { Metadata } from "next"

import HomePageClient from "@/components/home-page-client"
import { getPublicPortfolioContent } from "@/lib/server/portfolio"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublicPortfolioContent()

  return {
    title: content.meta.title,
    description: content.meta.description,
    keywords: content.meta.keywords,
    authors: [{ name: content.identity.fullName }],
    metadataBase: new URL(content.meta.siteUrl),
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      images: [content.meta.ogImageUrl],
      url: content.meta.siteUrl,
    },
    twitter: {
      card: "summary_large_image",
    },
  }
}

export default async function HomePage() {
  const content = await getPublicPortfolioContent()
  return <HomePageClient content={content} />
}
