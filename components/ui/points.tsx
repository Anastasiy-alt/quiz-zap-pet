'use client'
import Light from '@/assets/icons/thunder.svg'
import Image from "next/image";
import stl from './ui.module.sass'
import { useState, useEffect, useRef } from "react";

interface Props {
  total: number
}

export default function Points({ total }: Props) {
  const prevTotal = useRef(total)
  const [diff, setDiff] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const earned = total - prevTotal.current
    prevTotal.current = total

    if (earned === 0) return

    setDiff(earned)
    setVisible(true)

    const t = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(t)
  }, [total])

  return (
    <div className={stl.points}>
      <Image className={stl.points__img} src={Light} alt={'Молния.'} />
      <p className={stl.points__total}>{total}</p>
      {visible && (
        <p className={stl.points__add}>{diff > 0 ? '+' : ''}{diff}</p>
      )}
    </div>
  )
}
