'use client'
import SoundOn from '@/assets/icons/volume_up.svg'
import SoundOff from '@/assets/icons/volume_off.svg'
import stl from './ui.module.sass'
import Image from "next/image";
import {useSoundStore} from "@/store/soundStore";
import {CSSTransition, SwitchTransition} from "react-transition-group";
import {useRef} from "react";

export default function Sound() {
  const {on, toggle} = useSoundStore()
  const onRef = useRef<HTMLSpanElement>(null)
  const offRef = useRef<HTMLSpanElement>(null)
  const nodeRef = on ? onRef : offRef

  return (
    <button className={stl.sound} onClick={toggle}>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={on ? 'sound-onn' : 'sound off'}
          timeout={350}
          nodeRef={nodeRef}
          classNames={{
            enter: stl.iconEnter,
            enterActive: stl.iconEnterActive,
            exit: stl.iconExit,
            exitActive: stl.iconExitActive,
          }}
        >
          <span ref={nodeRef}>
            {
              on ? (
                <Image className={`${stl.sound__icon} ${on ? stl.sound__icon_show : ''}`}
                       unoptimized
                       src={SoundOn}
                       alt={'Звук включен.'}/>
              ) : (
                <Image className={`${stl.sound__icon} ${on ? stl.sound__icon_show : ''}`}
                       unoptimized
                       src={SoundOff}
                       alt={'Звук выключен.'}/>
              )
            }
            </span>
        </CSSTransition>
      </SwitchTransition>
    </button>
  )
}
