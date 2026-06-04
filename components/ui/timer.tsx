'use client'
import stl from './ui.module.sass'
import {useEffect, useState} from "react";

interface Props {
  time?: number
}
export default function Timer({time = 60}: Props) {
  const [timeLeft, setTimeLeft] = useState(time);
  const [rotate, setRotate] = useState(360);
  const rotateStep = 360 / time


  useEffect(() => {
    setTimeLeft(time);
    setRotate(rotateStep * timeLeft)
    if (time <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRotate(0)
          return 0;
        }
        setRotate(rotateStep * (prev - 1))
        return prev - 1;
      });

    }, 1000);

    return () => clearInterval(interval);
  }, [time]);
  return(
    <div className={stl.timer}>
      <div className={stl.timer__icon} style={{'--rotate': -rotate + 'deg'} as React.CSSProperties}></div>
      {timeLeft}s
    </div>
  )
}
