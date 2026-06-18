import stl from './multi.module.sass'
import { Room } from '@/hooks/useRoom'

type PlayerRow = { id: string; name: string; emoji: string; score: number }

interface Props {
  players: PlayerRow[]
  totalQuestions: number
  playerId: string | null
  answers?: Room['answers']
  finish?: boolean
  answeredIds?: Set<string>
}

const getMedal = (index: number) => {
  if (index === 0) return '🥇'
  if (index === 1) return '🥈'
  if (index === 2) return '🥉'
  return `#${index + 1}`
}

const getCorrectCount = (pid: string, answers: Room['answers']) => {
  if (!answers) return 0
  return Object.values(answers).filter(
    (questionAnswers: any) => questionAnswers[pid]?.isCorrect
  ).length
}

export default function Leaderboard({ players, totalQuestions, playerId, answers, finish, answeredIds }: Props) {
  const sorted = [...players].sort((a, b) => b.score - a.score)

  return (
    <div className={stl.leaderboard}>
      <p className={stl.leaderboard__title}>Таблица результатов</p>
      <div className={stl.leaderboard__list}>
        {sorted.map((player, i) => (
          <div
            key={player.id}
            className={`${stl.leaderboard__row} ${player.id === playerId ? stl.leaderboard__row_me : ''} ${finish && i === 0 ? stl.leaderboard__row_first : ''}`}
          >
            <span className={stl.leaderboard__medal}>
              {finish ? getMedal(i) : `#${i + 1}`}
            </span>
            <span className={stl.leaderboard__ava}>{player.emoji}</span>
            <span className={stl.leaderboard__name}>{player.name}</span>
            <div className={stl.leaderboard__stats}>
              {finish && answers !== undefined && (
                <span className={stl.leaderboard__correct}>
                  {getCorrectCount(player.id, answers)}/{totalQuestions} ✓
                </span>
              )}
              {!finish && answeredIds?.has(player.id) && (
                <span className={stl.leaderboard__check}>✓</span>
              )}
              <span className={stl.leaderboard__score}>{player.score} очков</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
