import '@/styles/base.sass'
import {Commissioner} from 'next/font/google'

const commissioner = Commissioner({
  subsets: ['latin', 'cyrillic'],
})
export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={commissioner.className}>
    <body>
    {children}
    </body>
    </html>
  )
}
