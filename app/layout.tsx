import AppWrapper from "@/components/AppWrapper"
import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Poppins, Inter } from "next/font/google"
import "./globals.css"

// Load Poppins with all the weights we need
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

// Keep Inter as a fallback
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata = {
  title: "Abhinav Sahu | AI Enthusiast",
  description: "AI & Data Science Enthusiast, C++ & Python Developer. Explore my projects, skills, and experience.",
  keywords: "Abhinav Sahu, AI, Data Science, C++, Python, Developer, Portfolio",
  authors: [{ name: "Abhinav Sahu" }],
  openGraph: {
    title: "Abhinav Sahu | AI Enthusiast",
    description: "AI & Data Science Enthusiast, C++ & Python Developer",
    images: ["/profile.jpg"],
    url: "https://abhinav-sahu-portfolio.vercel.app/",
  },
  twitter: {
    card: "summary_large_image",
  },
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
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-PNJBFZDLVM"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PNJBFZDLVM');
            `,
          }}
        />
      </head>
      <body className={`${poppins.variable} ${inter.variable} font-poppins`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AppWrapper> {/* 👈 Wrap your app in it */}
            {children}
          </AppWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
