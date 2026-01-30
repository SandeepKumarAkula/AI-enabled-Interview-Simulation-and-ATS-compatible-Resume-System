import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ToastProvider } from "@/components/toast"
import { LoadingProvider } from "@/components/global-loading-provider"
import { ConfirmProvider } from "@/components/confirm"
import AuthSessionProvider from "@/components/auth-session-provider"
import AuthGate from "@/components/auth-gate"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI²SARS - AI-enabled Interview Simulation & ATS Resume System",
  description: "Build your perfect resume with professional templates and real-time preview",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='75' font-size='80' font-weight='bold' text-anchor='middle' fill='%232ecc71'>A</text></svg>",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ToastProvider>
          <ConfirmProvider>
            <LoadingProvider>
              <AuthSessionProvider>
                <AuthGate>
                  <Header />
                  {children}
                  <Footer />
                  {process.env.NODE_ENV === 'production' ? <Analytics /> : null}
                </AuthGate>
              </AuthSessionProvider>
            </LoadingProvider>
          </ConfirmProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
