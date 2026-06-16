'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useRoom } from '@/hooks/useRoom'
import { QUIZZES } from '@/const/quizData'
import { ref, update, remove } from 'firebase/database'
import { db } from '@/lib/firebase'
import Button from '@/components/ui/button'
import s from './results.module.sass'

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
    if (pct === 100) return { emoji: '🧠', text: 'Идеально!' }
    if (pct >= 81)  return { emoji: '🏆', text: 'Отлично!' }
    if (pct >= 61)  return { emoji: '🎯', text: 'Хороший результат' }
    if (pct >= 41)  return { emoji: '🤔', text: 'Неплохо' }
    if (pct >= 21)  return { emoji: '😬', text: 'Почти' }
    return { emoji: '💀', text: 'Квиз победил' }
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
    <div className={s.page}>

      {/* мой результат */}
      {me && (
        <div className={s.myResult}>
          <span className={s.myEmoji}>{result.emoji}</span>
          <div className={s.myInfo}>
            <p className={s.myTitle}>{result.text}</p>
            <p className={s.mySub}>
              Место #{myRank} · {getCorrectCount(playerId!)} из {quiz.questions.length} верно · {myPercent}%
            </p>
          </div>
          <div className={s.myScore}>
            <span className={s.myScoreNum}>{me.score}</span>
            <span className={s.myScoreMax}>/ {maxScore}</span>
          </div>
        </div>
      )}

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
  )
}
