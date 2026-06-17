'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useRoom } from '@/hooks/useRoom'
import { QUIZZES, QUIZ_RESULT } from '@/const/quizData'
import { ref, update, remove } from 'firebase/database'
import { db } from '@/lib/firebase'
import Button from '@/components/ui/button'
import s from './results.module.sass'
import stl from "@/components/quiz/quiz.module.sass";

export default function ResultsPage() {
  const { code } = useParams<{ code: string }>()
  const router = useRouter()
  const { room, players, isHost, error } = useRoom(code)

  const quiz = QUIZZES.find(q => q.id === room?.quizId)
  const playerId = typeof window !== 'undefined'
    ? sessionStorage.getItem('playerId')
    : null

  // когда хост сбрасывает комнату — возвращаем всех в лобби
  useEffect(() => {
    if (room?.state === 'waiting') router.replace(`/room/${code}`)
  }, [room?.state, code, router])

  // когда хост удалил комнату — не-хосты уходят на главную
  useEffect(() => {
    if (error) router.replace('/')
  }, [error, router])

  if (!room || !quiz) {
    return <div className={s.loading}>Считаем результаты...</div>
  }

  const maxScore = quiz.questions.length * 10

  // сортируем игроков по счёту
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const me = sortedPlayers.find(p => p.id === playerId)
  const myRank = sortedPlayers.findIndex(p => p.id === playerId) + 1
  const myPercent = me ? Math.round((me.score / maxScore) * 100) : 0

  // считаем правильные ответы для каждого игрока
  const getCorrectCount = (pid: string) => {
    const answers = room.answers ?? {}
    return Object.values(answers).filter(
      (questionAnswers: any) => questionAnswers[pid]?.isCorrect
    ).length
  }

  const getMedal = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  const getResult = (pct: number) => {
    return QUIZ_RESULT.find(i => i.score >= pct)
  }

  const result = getResult(myPercent)

  const handlePlayAgain = async () => {
    // сбрасываем очки всех игроков
    const updates: Record<string, any> = {}
    players.forEach(p => {
      updates[`rooms/${code}/players/${p.id}/score`] = 0
    })
    updates[`rooms/${code}/state`] = 'waiting'
    updates[`rooms/${code}/currentQuestion`] = 0
    updates[`rooms/${code}/timerStartedAt`] = null
    updates[`rooms/${code}/answers`] = null

    await update(ref(db), updates)
    router.replace(`/room/${code}`)
  }

  return (
    <>
      {result && (
        <div className={stl.finish}>
          <div className={stl.finish__main}>
            <p className={stl.finish__icon}>{result.icon}</p>
            <p className={stl.finish__title}>{result.title}</p>
          </div>


          <div className={stl.finish__stats}>
            <p className={stl.finish__statsText}>Правильных ответов</p>
            <p className={stl.finish__statsText}>
              <span>{getCorrectCount(playerId!)}</span> из {quiz.questions.length}
            </p>
          </div>

          <div className={stl.finish__score}>
            <p className={stl.finish__scoreTitle}>Итоговый счёт</p>
            <div className={stl.finish__scoreValue}>
              <span>{me?.score ?? 0} </span> из {maxScore}
            </div>
          </div>
        </div>
      )}

    <div className={s.page}>
      {/* таблица лидеров */}
      <div className={s.leaderboard}>
        <p className={s.leaderboardTitle}>Таблица результатов</p>
        <div className={s.leaderboardList}>
          {sortedPlayers.map((player, i) => (
            <div
              key={player.id}
              className={`${s.row} ${player.id === playerId ? s.rowMe : ''} ${i === 0 ? s.rowFirst : ''}`}
            >
              <span className={s.medal}>{getMedal(i)}</span>
              <span className={s.rowName}>{player.name}</span>
              <div className={s.rowStats}>
                <span className={s.rowCorrect}>
                  {getCorrectCount(player.id)}/{quiz.questions.length} ✓
                </span>
                <span className={s.rowScore}>{player.score} очков</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* кнопки */}
      <div className={s.footer}>
        <Button
          text="На главную"
          action={async () => {
            if (isHost) await remove(ref(db, `rooms/${code}`))
            router.replace('/')
          }}
        />
        {isHost && (
          <Button
            text="Сыграть ещё раз"
            type="sc"
            action={handlePlayAgain}
          />
        )}
      </div>

    </div>
    </>
  )
}
