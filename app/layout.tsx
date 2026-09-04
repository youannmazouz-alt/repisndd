import { Analytics } from '@vercel/analytics/next'
import type React from 'react'
import type { Metadata, Viewport } from 'next'
import { Source_Code_Pro, Source_Sans_3 } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { SolanaProvider } from '@/components/solana-provider'

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
})

const sourceCode = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code',
})

export const metadata: Metadata = {
  title: 'INFER - Markets for Costly Beliefs',
  description:
    'An experimental Solana forecasting protocol for costly probabilistic beliefs and measurable judgment.',
  generator: 'v0.app',
  openGraph: {
    title: 'INFER - Markets for Costly Beliefs',
    description:
      'An experimental Solana forecasting protocol for costly probabilistic beliefs and measurable judgment.',
    type: 'website',
  },
  icons: {
    icon: [{ url: '/images/infer-mark.jpeg?v=2', type: 'image/jpeg' }],
    shortcut: '/images/infer-mark.jpeg?v=2',
    apple: '/images/infer-mark.jpeg?v=2',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f5f4ee',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${sourceCode.variable} bg-background`}>
      <body className="flex min-h-screen flex-col antialiased">
        <SolanaProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </SolanaProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
