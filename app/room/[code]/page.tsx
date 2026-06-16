'use client'

import {useParams, useRouter} from 'next/navigation'
import {useRoom} from '@/hooks/useRoom'
import {QUIZZES} from '@/const/quizData'
import stl from '../room.module.sass'
import Button from '@/components/ui/button'
import React, {useEffect} from "react";

export default function RoomPage() {
  const {code} = useParams<{ code: string }>()
  const router = useRouter()
  const {room, players, loading, error, isHost, startGame} = useRoom(code)

  useEffect(() => {
    if (room?.state === 'playing') router.replace(`/room/${code}/play`)
    if (room?.state === 'finished') router.replace(`/room/${code}/results`)
  }, [room?.state, code, router])

  if (loading) return <div className={stl.loading}>Подключаемся...</div>
  if (error) return <div className={stl.error}>{error}</div>
  if (!room) return null
  if (room.state !== 'waiting') return null

  const quiz = QUIZZES.find(q => q.id === room.quizId)


  const copyShareLink = (evt: React.MouseEvent<HTMLParagraphElement>) => {
    const target = evt.target as HTMLParagraphElement;
    if (target.textContent) {
      navigator.clipboard.writeText(window.location.origin + '/room/join?code=' + target.textContent);
    }
    const chips = document.querySelector('.' + stl.room__chips)
    if (chips) {
      chips.classList?.add(stl.room__chips_show)
      setTimeout(() => {
        chips.classList?.remove(stl.room__chips_show)
      }, 3100)
    }

  };


  if (!quiz) return <div className={stl.error}>Квиз не найден</div>
  return (
    <div className={stl.room}>
      <div className={stl.room__top}>
        <p className={stl.room__chips}>Ссылка скопирована в буфер обмена</p>
        <p className={stl.room__title}>Квиз "{quiz.title}"</p>
        <p className={stl.room__sub}>Код комнаты</p>
        <p className={stl.room__code} onClick={copyShareLink}>{code}</p>
        <p className={stl.room__sub}>Кликни на код, чтобы скопировать ссылку и поделиться с друзьями</p>
      </div>
      <hr className={stl.room__hr}/>
      <div className={stl.room__players}>
        <p className={stl.room__playersTitle}>
          Игроки <span>{players.length}</span>
        </p>
        <ul className={stl.room__playersList}>
          {players.map(player => (
            <li key={player.id} className={stl.player}>
                <span className={stl.player__avatar}>
                  {player.emoji}
                </span>
              <span className={stl.player__name}>{player.name}</span>
              {player.id === room.hostId && (
                <span className={stl.player__badge}>хост</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <hr className={stl.room__hr}/>
      <div className={stl.room__footer}>
        {isHost ? (
          <>
            <p className={stl.room__sub}>
              {players.length < 2
                ? 'Жди пока присоединятся другие игроки'
                : 'Все готовы — можно начинать!'}
            </p>
            <Button
              text="Начать игру"
              action={startGame}
              disabled={players.length < 2}
            />
          </>
        ) : (
          <p className={stl.room__sub}>
            Ждём пока хост начнёт игру...
          </p>
        )}
      </div>
    </div>
  )
}
