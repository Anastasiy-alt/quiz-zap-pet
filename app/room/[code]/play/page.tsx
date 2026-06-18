'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useRoomPlay } from '@/hooks/useRoomPlay'
import QuizAppMulti from "@/components/quiz/multi";
import Leaderboard from "@/components/quiz/multi/leaderboard";
import MultiLoading from "@/components/quiz/multi/loading";

export default function PlayPage() {
  const { code } = useParams<{ code: string }>()
  const {
    room,
    players,
    quiz,
    playerId,
    allSubmitted,
    answeredIds,
  } = useRoomPlay(code)

  const [frozenScores, setFrozenScores] = useState<Record<string, number>>({})

  useEffect(() => {
    if (players.length === 0) return
    const snapshot: Record<string, number> = {}
    players.forEach(p => { snapshot[p.id] = p.score })
    setFrozenScores(snapshot)
  }, [room?.currentQuestion])

  if (!room || !quiz) {
    return <MultiLoading text="Загружаем вопрос..." />
  }

  const displayPlayers = allSubmitted
    ? players
    : players.map(p => ({ ...p, score: frozenScores[p.id] ?? p.score }))

  return (
    <>
      <QuizAppMulti data={quiz} code={code} />
      {room.state !== 'finished' && (
        <Leaderboard
          players={displayPlayers}
          totalQuestions={quiz.questions.length}
          playerId={playerId}
          answeredIds={answeredIds}
        />
      )}
    </>
  )
}
