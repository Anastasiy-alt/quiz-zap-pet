import stl from './ui.module.sass'
import Link from "next/link";
import {ReactNode} from "react";

interface Props {
  type?: 'pr' | 'sc' | 'tx'
  text: string
  link?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
  children: ReactNode
}

export default function Button({type = 'pr', text, link, target = '_self', children}: Props) {
  return (
    <>
      {
        link ? (
          <Link href={link} target={target}
                className={`${stl.btn} ${stl.btn}_${type}`}>
            <span>
              {children}
              {text}
            </span>
          </Link>
        ) : (
          <button className={`${stl.btn} ${stl.btn}_${type}`}>
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
