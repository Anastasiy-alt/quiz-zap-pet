import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ref, get, update, onDisconnect } from 'firebase/database'
import { db } from '@/lib/firebase'

interface JoinRoomParams {
  code: string
  playerName: string
  emoji: string
}

export function useJoinRoom() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const joinRoom = async ({ code, playerName, emoji }: JoinRoomParams) => {
    setLoading(true)
    setError(null)

    try {
      const normalizedCode = code.toUpperCase().trim()
      const roomRef = ref(db, `rooms/${normalizedCode}`)
      const snapshot = await get(roomRef)

      if (!snapshot.exists()) {
        setError('Комната с таким кодом не найдена')
        return
      }

      const room = snapshot.val()

      if (room.state !== 'waiting') {
        setError('Игра уже началась — войти нельзя')
        return
      }

      const players = Object.values(room.players ?? {}) as { name: string; emoji: string }[]

      if (players.some(p => p.name === playerName.trim())) {
        setError('Игрок с таким именем уже в комнате')
        return
      }

      if (players.some(p => p.emoji === emoji)) {
        setError('Этот аватар уже занят — выбери другой')
        return
      }

      const playerId = crypto.randomUUID()

      const playerRef = ref(db, `rooms/${normalizedCode}/players/${playerId}`)

      await update(playerRef, {
        name: playerName.trim(),
        score: 0,
        emoji,
        joinedAt: Date.now(),
      })

      onDisconnect(playerRef).remove()

      sessionStorage.setItem('playerId', playerId)
      sessionStorage.setItem('playerName', playerName.trim())

      router.push(`/room/${normalizedCode}`)
    } catch (err) {
      setError('Что-то пошло не так. Попробуй ещё раз.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return { joinRoom, loading, error }
}
