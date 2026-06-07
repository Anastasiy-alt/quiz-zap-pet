import stl from './ui.module.sass'
import Link from "next/link";
import {MouseEventHandler, ReactNode} from "react";

interface Props {
  type?: 'pr' | 'sc' | 'tx'
  text: string
  link?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
  iconRight?: boolean
  children?: ReactNode
  disabled?: boolean
  action?: MouseEventHandler<HTMLButtonElement>,
}

export default function Button({type = 'pr', text, disabled, link, target = '_self', iconRight = false, action, children}: Props) {
  return (
    <>
      {
        link ? (
          <Link href={link} target={target}
                className={`${stl.btn} ${stl.btn}_${type} ${iconRight ? stl.btn_reverse : ''} ${disabled ? stl.btn_dis : ''}`}>
            <span>
              {children}
              {text}
            </span>
          </Link>
        ) : (
          <button className={`${stl.btn} ${stl.btn}_${type} ${iconRight ? stl.btn_reverse : ''} ${disabled ? stl.btn_dis : ''}`} onClick={action}>
            <span>
              {children}
              {text}
            </span>
          </button>
        )
      }
    </>
  )
}
