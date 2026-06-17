'use client'

import {useEffect} from 'react'
import {useParams, useRouter} from 'next/navigation'
import {useRoomPlay} from '@/hooks/useRoomPlay'
import s from './play.module.sass'
import QuizAppMulti from "@/components/quiz/multi";
import {useRoom} from "@/hooks/useRoom";

export default function PlayPage() {
  const {code} = useParams<{ code: string }>()
  const {playerId} = useRoom(code)
  const router = useRouter()
  const {
    room,
    players,
    quiz,
    currentQuestion,
  } = useRoomPlay(code)

  useEffect(() => {
    if (room?.state === 'finished') {
      router.replace(`/room/${code}/results`)
    }
  }, [room?.state, code, router])

  if (!room || !quiz || !currentQuestion) {
    return <div className={s.loading}>Загружаем вопрос...</div>
  }

  return (
    <>
      <QuizAppMulti data={quiz} code={code}/>
      <table className={s.scoreboard}>
        <tbody>
        {[...players]
          .sort((a, b) => b.score - a.score)
          .map((player, i) => (
            <tr key={player.id}
                className={`${s.scoreboard__row} ${playerId === player.id ? s.scoreboard__row_current : ''}`}>
              <th className={s.scoreboard__rowPos}>#{i + 1}</th>
              <th className={s.scoreboard__rowAva}>{player.emoji}</th>
              <th className={s.scoreboard__rowName}>{player.name}</th>
              <th className={s.scoreboard__rowVal}>{player.score}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
