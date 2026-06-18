'use client'

import {useEffect, useRef, useState} from 'react'
import {onValue, ref, update} from 'firebase/database'
import {db} from '@/lib/firebase'
import {QUIZZES} from '@/const/quizData'
import {useRoom} from '@/hooks/useRoom'

export function useRoomPlay(code: string) {
  const {room, players, isHost, playerId, nextQuestion, finishGame} = useRoom(code)
  const [submittedForQ, setSubmittedForQ] = useState<number | null>(null)
  const [allSubmitted, setAllSubmitted] = useState(false)
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set())
  const [mySelected, setMySelected] = useState<string[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  const submitted = room !== null && submittedForQ === room.currentQuestion

  const quiz = QUIZZES.find(q => q.id === room?.quizId)
  const currentQuestion = quiz?.questions[room?.currentQuestion ?? 0]
  const isLastQuestion = room
    ? room.currentQuestion >= (quiz?.questions.length ?? 0) - 1
    : false


  useEffect(() => {
    setAllSubmitted(false)
    setAnsweredIds(new Set())
    setMySelected([])
    formRef.current?.reset()
  }, [room?.currentQuestion])


  useEffect(() => {
    if (!code || !currentQuestion || !room) return

    const answersRef = ref(db, `rooms/${code}/answers/${currentQuestion.id}`)

    const unsubscribe = onValue(answersRef, snapshot => {
      const answers = snapshot.val() ?? {}
      const ids = Object.keys(answers)
      setAnsweredIds(new Set(ids))
      setAllSubmitted(ids.length >= players.length)
    })

    return () => unsubscribe()
  }, [code, currentQuestion?.id, players.length])

  const arraysEqual = (a: string[], b: string[]) =>
    [...a].sort().join(',') === [...b].sort().join(',')

  const submitAnswer = async (fastTime = 0, fastBonus = 0) => {
    if (!currentQuestion || !playerId || submitted || !room) return
    if (!formRef.current) return
    const formData = new FormData(formRef.current)
    const selected = formData.getAll(currentQuestion.id) as string[]

    const isCorrect = arraysEqual(currentQuestion.correct, selected)

    await update(
      ref(db, `rooms/${code}/answers/${currentQuestion.id}/${playerId}`),
      {selected, isCorrect}
    )

    if (isCorrect) {
      const elapsed = room.timerStartedAt ? (Date.now() - room.timerStartedAt) / 1000 : Infinity
      const bonus = elapsed <= fastTime ? fastBonus : 0
      const currentScore = room.players[playerId]?.score ?? 0
      await update(ref(db, `rooms/${code}/players/${playerId}`), {
        score: currentScore + 10 + bonus,
      })
    }

    setMySelected(selected)
    setSubmittedForQ(room.currentQuestion)
  }

  const handleNext = async () => {
    if (isLastQuestion) {
      await finishGame()
    } else {
      await nextQuestion()
    }
  }

  return {
    room,
    players,
    quiz,
    currentQuestion,
    isHost,
    isLastQuestion,
    submitted,
    allSubmitted,
    answeredIds,
    mySelected,
    formRef,
    playerId,
    submitAnswer,
    handleNext,
  }
}
