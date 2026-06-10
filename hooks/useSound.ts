import {useRef} from 'react'
import {useSoundStore} from "@/store/soundStore";

export function useSound(src: string, volume = 1) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const on = useSoundStore(state => state.on)
  if (typeof window !== 'undefined' && !audioRef.current) {
    audioRef.current = new Audio(src)
    audioRef.current.volume = volume
  }

  const play = () => {
    if (!audioRef.current) return
    if (!on) return;
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {
    })
  }

  const stop = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
  }

  return {play, stop}
}
