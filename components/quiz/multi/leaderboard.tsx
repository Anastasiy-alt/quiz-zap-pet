import stl from './multi.module.sass'
import Image from 'next/image'
import Crown from '@/assets/icons/crown.svg'

type PlayerRow = { id: string; name: string; emoji: string; score: number }

interface Props {
  players: PlayerRow[]
  playerId: string | null
  finish?: boolean
  answeredIds?: Set<string>
}

const getRank = (score: number, sorted: { score: number }[]) =>
  sorted.filter(p => p.score > score).length + 1

const getDenseRank = (score: number, sorted: { score: number }[]) =>
  new Set(sorted.filter(p => p.score > score).map(p => p.score)).size + 1

const getMedal = (rank: number) => {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}

export default function Leaderboard({players, playerId, finish, answeredIds}: Props) {
  const sorted = [...players].sort((a, b) => b.score - a.score)

  return (
    <div className={`${stl.leaderboard} ${finish ? stl.leaderboard_finish : ''}`}>
      <p className={stl.leaderboard__title}>Таблица результатов</p>
      <table className={stl.leaderboard__table}>
        <tbody>
          {sorted.map((player) => {
            const rank = getRank(player.score, sorted)
            const denseRank = getDenseRank(player.score, sorted)
            return (
              <tr key={player.id} className={`${stl.leaderboard__row} ${player.id === playerId ? stl.leaderboard__row_me : ''}`}>
                <td className={stl.leaderboard__medal}>
                  {finish ? getMedal(denseRank) : `#${rank}`}
                </td>
                <td>
                  <div className={stl.leaderboard__player}>
                    <div className={stl.leaderboard__avaWrap}>
                      {finish && denseRank === 1 && <Image className={stl.leaderboard__crown} src={Crown} alt="" width={30} height={30} />}
                      <span className={stl.leaderboard__ava}>{player.emoji}</span>
                    </div>
                    <span className={stl.leaderboard__name}>{player.name}</span>
                  </div>
                </td>
                <td>
                  <div className={stl.leaderboard__scoreCell}>
                    {!finish && answeredIds?.has(player.id) && (
                      <svg className={stl.leaderboard__check} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg>
                    )}
                    <span className={stl.leaderboard__score}>{player.score} очков</span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
