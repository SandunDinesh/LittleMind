import type { Metadata, Viewport } from 'next'
import { DM_Sans, Inter } from 'next/font/google'

import './globals.css'

const _dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const _inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'LittleMind - Understanding Your Child Through Their Art',
  description:
    'AI-powered analysis of children\'s drawings to detect emotional states and potential stress indicators. A compassionate screening tool for parents.',
}

export const viewport: Viewport = {
  themeColor: '#3a9bd5',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_dmSans.variable} ${_inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
