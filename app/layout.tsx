import AppWrapper from "@/components/AppWrapper"
import type React from "react"
import Script from "next/script"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Manrope, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata = {
  title: "Portfolio",
  description: "Personal portfolio",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/profile.jpg" />
        <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" as="style" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-PNJBFZDLVM" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PNJBFZDLVM');
          `}
        </Script>
      </head>
      <body className={`${spaceGrotesk.variable} ${manrope.variable} font-poppins`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AppWrapper>
            {children}
          </AppWrapper>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
