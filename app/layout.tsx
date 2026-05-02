import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Outsource Hub',
  description: 'We run AI for local businesses. You do not learn it.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className} style={{ backgroundColor: '#0A0A0F', color: '#F5F5F7', minHeight: '100vh', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
