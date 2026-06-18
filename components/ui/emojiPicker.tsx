'use client'
import {useEffect, useRef, useState} from 'react'
import stl from './ui.module.sass'

const EMOJIS = [
  '😀', '😁', '🤩', '🫢', '🤔', '😒', '🥶', '😎', '😱', '😈', '💀', '🪐', '🔥',
  '💩', '🤡', '👻', '👽', '👾', '🤖', '😺', '❤️', '🧡', '💛', '💚', '📻', '🎬',
  '💙', '💜', '🤍', '💥', '🖖', '👌', '✌️', '🤟', '💅', '👀', '👤', '💣', '🐵',
  '🐶', '🐺', '🦊', '🦝', '🦁', '🐯', '🐴', '🦓', '🦄', '🐮', '🐷', '🐏', '🐫',
  '🦒', '🐘', '🦣', '🦛', '🐭', '🐹', '🐰', '🦔', '🦇', '🐻', '🐻‍❄️', '🐨', '🐼',
  '🦥', '🦦', '🦨', '🦘', '🦡', '🐔', '🐥', '🐦', '🐧', '🦆', '🦤', '🦩', '🦚',
  '🦜', '🐸', '🐊', '🐢', '🦎', '🐲', '🦖', '🐳', '🐬', '🦭', '🐟', '🦈', '🐙',
  '🐌', '🦋', '🐛', '🐜', '🐝', '🪲', '🐞', '🦗', '🕷️', '🪰', '🌸', '🌻', '🌼',
  '🪼', '🌷', '🍄', '🍉', '🍍', '🍒', '🍓', '🥑', '🥕', '🧀', '🍿', '📍', '🗿',
  '🦀', '🍦', '🫖', '✨', '🎈', '🎀', '⚽', '🏀', '🏐', '🧩', '🎲', '🖌️', '📎',
  '🕹️', '🎮', '🎰', '🪄', '🔮', '🎯', '🪀', '🎭', '🧭', '🔫', '💄', '🎵', '🎸', '💤',
  '🏍️', '🚗', '✈️', '🚲', '⛵', '🌚', '🌞', '🌝', '⛄', '❄️', '🌈', '⚡', '✏️', '👺'
]

interface Props {
  value: string
  onChange: (emoji: string) => void
}

export default function EmojiPicker({value, onChange}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [randomEmoji, setRandomEmoji] = useState('')

  useEffect(() => {
    const x = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    setRandomEmoji(x)
    onChange(x)
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className={stl.emojiPicker} ref={ref}>
      <button
        type="button"
        className={stl.emojiPicker__trigger}
        onClick={() => setOpen(o => !o)}>
        {value.length !== 0 ? value : randomEmoji}
      </button>
      {open && (
        <div className={stl.emojiPicker__gridOut}>
          <div className={stl.emojiPicker__grid}>
            {EMOJIS.map(emoji => (
              <button
                key={emoji}
                type="button"
                className={`${stl.emojiPicker__item} ${emoji === value ? stl.emojiPicker__item_active : ''}`}
                onClick={() => {
                  onChange(emoji)
                  setOpen(false)
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
