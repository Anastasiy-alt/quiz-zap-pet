import stl from './header.module.sass'
import Thunder from '@/assets/icons/thunder.svg'
import Image from 'next/image'
import Link from "next/link";
import Sound from "@/components/ui/sound";
import Button from "@/components/ui/button";

export default function HeaderApp() {
  return (
    <header className={stl.header}>
      <Link href="/" className={stl.header__logo}>
        <Image className={stl.header__svg} src={Thunder} alt={'Лого.'} style={{objectFit: "contain"}} unoptimized/>
        QuizZap
      </Link>
        <Button text={'Войти в комнату'} type={'tx'} link={'/room/join'} />
      <Sound />
    </header>
  )
}
