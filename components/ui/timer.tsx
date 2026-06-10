'use client'
import stl from './ui.module.sass'
import {useEffect, useRef, useState} from "react";

interface Props {
  time?: number
  keyId?: number | string
  stop?: boolean
  onTimeout?: () => void
  onStop?: (i: number) => void
}

export default function Timer({time = 60, keyId, stop, onTimeout, onStop}: Props) {
  const [timeLeft, setTimeLeft] = useState(time);
  const [rotate, setRotate] = useState(360);
  const rotateStep = 360 / time

  const onTimeoutRef = useRef(onTimeout)
  const onStopRef = useRef(onStop)
  const calledRef = useRef(false)

  useEffect(() => {
    onTimeoutRef.current = onTimeout
  }, [onTimeout])
  useEffect(() => {
    onStopRef.current = onStop
  }, [onStop])

  useEffect(() => {
    calledRef.current = false
    setTimeLeft(time)
    setRotate(360)
  }, [keyId, time])

  useEffect(() => {
    calledRef.current = false

    if (time <= 0) return

    if (stop) {
      setTimeLeft(prev => {
        setTimeout(() => onStopRef.current?.(time - prev), 0)
        return prev
      })
      return
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setRotate(0)
          if (!calledRef.current) {
            calledRef.current = true
            setTimeout(() => onTimeoutRef.current?.(), 0)
          }
          return 0
        }
        setRotate(rotateStep * (prev - 1))
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [time, keyId, stop])

  return (
    <div className={stl.timer}>
      <div className={stl.timer__icon} style={{'--rotate': -rotate + 'deg'} as React.CSSProperties}></div>
      {timeLeft}s
    </div>
  )
}
