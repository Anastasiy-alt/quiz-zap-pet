'use client'

import {useEffect, useRef, useState} from 'react'
import {onValue, ref, update} from 'firebase/database'
import {db} from '@/lib/firebase'
import {QUIZZES} from '@/const/quizData'
import {useRoom} from '@/hooks/useRoom'

export function useRoomPlay(code: string) {
  const {room, players, isHost, playerId, nextQuestion, finishGame} = useRoom(code)
  const [submitted, setSubmitted] = useState(false)
  const [allSubmitted, setAllSubmitted] = useState(false)
  const [mySelected, setMySelected] = useState<string[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  const quiz = QUIZZES.find(q => q.id === room?.quizId)
  const currentQuestion = quiz?.questions[room?.currentQuestion ?? 0]
  const isLastQuestion = room
    ? room.currentQuestion >= (quiz?.questions.length ?? 0) - 1
    : false


  useEffect(() => {
    setSubmitted(false)
    setAllSubmitted(false)
    setMySelected([])
    formRef.current?.reset()
  }, [room?.currentQuestion])


  useEffect(() => {
    if (!code || !currentQuestion || !room) return

    const answersRef = ref(db, `rooms/${code}/answers/${currentQuestion.id}`)

    const unsubscribe = onValue(answersRef, snapshot => {
      const answers = snapshot.val() ?? {}
      const answeredCount = Object.keys(answers).length
      setAllSubmitted(answeredCount >= players.length)
    })

    return () => unsubscribe()
  }, [code, currentQuestion?.id, players.length])

  const arraysEqual = (a: string[], b: string[]) =>
    [...a].sort().join(',') === [...b].sort().join(',')

  const submitAnswer = async () => {
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
      const currentScore = room.players[playerId]?.score ?? 0
      await update(ref(db, `rooms/${code}/players/${playerId}`), {
        score: currentScore + 10,
      })
    }

    setMySelected(selected)
    setSubmitted(true)
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
    mySelected,
    formRef,
    submitAnswer,
    handleNext,
  }
}
