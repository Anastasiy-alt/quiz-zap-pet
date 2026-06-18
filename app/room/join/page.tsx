'use client'

import {Suspense, useState} from 'react'
import {useSearchParams} from 'next/navigation'
import {useJoinRoom} from '@/hooks/useJoinRoom'
import Button from '@/components/ui/button'
import stl from '../room.module.sass'
import Input from "@/components/ui/input";
import EmojiPicker from "@/components/ui/emojiPicker";
import RandomName from "@/components/ui/randomName";

export default function JoinPage() {
  const searchParams = useSearchParams()
  const [code, setCode] = useState(searchParams.get('code') ?? '')
  const [name, setName] = useState('')
  const {joinRoom, loading, error} = useJoinRoom()
  const [emoji, setEmoji] = useState('')

  const handleSubmit = () => {
    if (!code.trim() || !name.trim()) return
    joinRoom({code, playerName: name, emoji})
  }

  const canSubmit = code.trim().length === 6 && name.trim().length > 0

  return (
    <Suspense>
      <div className={stl.room}>
        <div className={stl.room__top}>
          <span className={stl.room__code}>🚪</span>
          <h1 className={stl.room__title}>Войти в комнату</h1>
          <p className={stl.room__sub}>Введи код от друга и своё имя</p>
        </div>
        <hr className={stl.room__hr}/>
        <form action={() => event?.preventDefault()} className={stl.room__players}>
          <Input
            customClass={stl.room__codeInput}
            id="code"
            type="text"
            placeholder="XXXXXX"
            label='Код комнаты'
            value={code}
            maxLength={6}
            onChange={e => setCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}/>
          <div className={stl.room__emoji}>
            <EmojiPicker value={emoji} onChange={setEmoji}/>
            <Input
              id="name"
              type="text"
              placeholder="Котопёс"
              label='Твоё имя в игре'
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            <div className={stl.room__emojiRand}>
              <RandomName action={(e) => setName(e)}/>
            </div>
          </div>
        </form>
        <hr className={stl.room__hr}/>
        {error && <p className={stl.error}>{error}</p>}
        <div className={stl.room__footer}>
          <Button
            text={loading ? 'Подключаемся...' : 'Войти'}
            action={handleSubmit}
            disabled={!canSubmit || loading}
          />
        </div>
      </div>
    </Suspense>
  )
}


