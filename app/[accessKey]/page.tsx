import type { Metadata } from "next"
import { notFound } from "next/navigation"

import AdminControlCenter from "@/components/admin/admin-control-center"
import { getAdminConfig } from "@/lib/server/env"

export const dynamic = "force-dynamic"

type AdminPageProps = {
  params: Promise<{
    accessKey: string
  }>
}

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
}

export default async function AdminAccessPage({ params }: AdminPageProps) {
  const { accessKey } = await params
  const adminConfig = getAdminConfig()

  if (!adminConfig.routeSecret || accessKey !== adminConfig.routeSecret) {
    notFound()
  }

  return <AdminControlCenter accessKey={accessKey} />
}
