'use client'

import {useEffect, useMemo, useState} from 'react'
import {onValue, ref, update} from 'firebase/database'
import {db} from '@/lib/firebase'

export interface Room {
  quizId: string
  hostId: string
  state: 'waiting' | 'playing' | 'finished'
  currentQuestion: number
  timerStartedAt: number | null
  createdAt: number
  players: Record<string, Player>
  answers?: Record<string, Record<string, Answer>>
}

export interface Player {
  name: string
  emoji: string
  score: number
  joinedAt: number
}

export interface Answer {
  selected: string[]
  isCorrect: boolean
}

export function useRoom(code: string) {
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const playerId = typeof window !== 'undefined'
    ? sessionStorage.getItem('playerId')
    : null

  const isHost = room?.hostId === playerId

  const players = useMemo(
    () => room ? Object.entries(room.players ?? {}).map(([id, p]) => ({id, ...p})) : [],
    [room]
  )

  useEffect(() => {
    if (!code) return

    const roomRef = ref(db, `rooms/${code}`)

    const unsubscribe = onValue(roomRef, snapshot => {
      if (!snapshot.exists()) {
        setError('Комната не найдена')
        setLoading(false)
        return
      }
      setRoom(snapshot.val())
      setLoading(false)
    }, err => {
      setError('Ошибка подключения')
      setLoading(false)
      console.error(err)
    })

    return () => unsubscribe()
  }, [code])

  useEffect(() => {
    if (!room || !playerId) return
    const playerIds = Object.keys(room.players ?? {})
    if (playerIds.includes(room.hostId)) return
    if (playerIds.length === 0) return

    const sorted = players.slice().sort((a, b) => a.joinedAt - b.joinedAt)
    if (sorted[0]?.id !== playerId) return

    update(ref(db, `rooms/${code}`), { hostId: playerId })
  }, [room?.hostId, players, playerId, code])

  const startGame = async () => {
    if (!isHost) return
    await update(ref(db, `rooms/${code}`), {
      state: 'playing',
      currentQuestion: 0,
      timerStartedAt: Date.now(),
    })
  }

  const nextQuestion = async () => {
    if (!isHost || !room) return
    await update(ref(db, `rooms/${code}`), {
      currentQuestion: room.currentQuestion + 1,
      timerStartedAt: Date.now(),
    })
  }

  const finishGame = async () => {
    if (!isHost) return
    await update(ref(db, `rooms/${code}`), {
      state: 'finished',
    })
  }

  return {
    room,
    players,
    loading,
    error,
    isHost,
    playerId,
    startGame,
    nextQuestion,
    finishGame,
  }
}
