import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ref, set, get } from 'firebase/database'
import { db } from '@/lib/firebase'
import { generateRoomCode } from '@/lib/generateRoomCode'

interface CreateRoomParams {
  quizId: string
  hostName: string
  emoji: string
}

export function useCreateRoom() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createRoom = async ({ quizId, hostName, emoji }: CreateRoomParams) => {
    setLoading(true)
    setError(null)

    try {
      const hostId = crypto.randomUUID()
      let code = ''
      let attempts = 0

      // ищем свободный код
      while (attempts < 5) {
        const candidate = generateRoomCode()
        const snapshot = await get(ref(db, `rooms/${candidate}`))
        if (!snapshot.exists()) {
          code = candidate
          break
        }
        attempts++
      }

      if (!code) throw new Error('Не удалось сгенерировать код')

      // создаём комнату
      await set(ref(db, `rooms/${code}`), {
        quizId,
        hostId,
        state: 'waiting',
        currentQuestion: 0,
        timerStartedAt: null,
        createdAt: Date.now(),
        players: {
          [hostId]: {
            name: hostName.trim(),
            emoji,
            score: 0,
            joinedAt: Date.now(),
          }
        }
      })

      sessionStorage.setItem('playerId', hostId)
      sessionStorage.setItem('playerName', hostName.trim())

      router.push(`/room/${code}`)
    } catch (err) {
      setError('Не удалось создать комнату. Попробуй ещё раз.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return { createRoom, loading, error }
}
