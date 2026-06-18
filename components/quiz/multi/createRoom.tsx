'use client'

import {useState} from 'react'
import {useParams} from 'next/navigation'
import {useCreateRoom} from '@/hooks/useCreateRoom'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import EmojiPicker from '@/components/ui/emojiPicker'
import stl from './multi.module.sass'
import RandomName from "@/components/ui/randomName";

export default function CreateRoom() {
  const {slug: quizId} = useParams<{ slug: string }>()
  const {createRoom, loading, error} = useCreateRoom()
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('')

  const handleSubmit = () => {
    if (!name.trim()) return
    createRoom({quizId, hostName: name.trim(), emoji})
  }

  return (
    <div className={stl.room}>
      <div className={stl.room__header}>
        <span className={stl.room__emoji}>🎮</span>
        <h1 className={stl.room__title}>Создать комнату</h1>
        <p className={stl.room__sub}>
          Друзья войдут по коду — играете одновременно
        </p>
      </div>
      <form action={() => event?.preventDefault()} className={stl.room__form}>
        <EmojiPicker value={emoji} onChange={setEmoji}/>
        <Input
          id="name"
          label="Твоё имя в игре"
          placeholder="Жёлтый полосатик"
          value={name}
          error={error ?? undefined}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        <div className={stl.room__formRand}>
          <RandomName action={(e) => setName(e)}/>
        </div>
      </form>
      <Button
        text={loading ? 'Создаём...' : 'Создать комнату'}
        action={handleSubmit}
        disabled={!name.trim() || loading}
      />
    </div>
  )
}
