import '@/styles/base.sass'
import stl from './globals.module.sass'
import {Commissioner} from 'next/font/google'
import HeaderApp from "@/components/header/header";
import FooterApp from "@/components/footer/footer";
import {Metadata} from "next";

const commissioner = Commissioner({
  subsets: ['latin', 'cyrillic'],
})

export const metadata: Metadata = {
  title: "QuizZapPet",
  description: "Quiz pet-project",
};


export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={commissioner.className}>
    <body className={stl.layout}>
    <HeaderApp/>
    <main className={stl.layout__main}>
      {children}
    </main>
    <FooterApp/>
    </body>
    </html>
  )
}
