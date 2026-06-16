'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useRoomPlay } from '@/hooks/useRoomPlay'
import s from './play.module.sass'
import QuizAppMulti from "@/components/quiz/multi";

export default function PlayPage() {
  const { code } = useParams<{ code: string }>()
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
    <section className={s.page}>
       <QuizAppMulti data={quiz} code={code} />

      <div className={s.scoreboard}>
        {[...players]
          .sort((a, b) => b.score - a.score)
          .map((player, i) => (
            <div key={player.id} className={s.scoreRow}>
              <span className={s.scorePos}>#{i + 1}</span>
              <span className={s.scoreName}>{player.name}</span>
              <span className={s.scoreVal}>{player.score}</span>
            </div>
          ))}
      </div>

    </section>
  )
}
