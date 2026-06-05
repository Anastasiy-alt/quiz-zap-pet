'use client'
import Thunder from '@/assets/icons/thunder.svg'
import Image from 'next/image'
import s from '../main.module.sass'

const PARTICLES = [
  { emoji: '🚀', orbit: 1, delay: '0s'    },
  { emoji: '🦖',  orbit: 1, delay: '-4s'   },
  { emoji: '🐋', orbit: 2, delay: '0s'    },
  { emoji: '🎲', orbit: 2, delay: '-2s'    },
  { emoji: '🌙', orbit: 2, delay: '-5.5s' },
  { emoji: '🐞', orbit: 3, delay: '0s'    },
  { emoji: '👻', orbit: 3, delay: '-3.5s' },
]

export default function AtomAnimation() {
  return (
    <div className={s.atom} aria-hidden="true">
      <div className={s.atom__nucleus}>
        <Image fill={true} src={Thunder} alt={'Лого.'} style={{objectFit: "contain"}} unoptimized/>
      </div>

      <div className={s.atom__orbit} />
      <div className={s.atom__orbit} />
      <div className={s.atom__orbit} />

      {PARTICLES.map(p => (
        <div
          key={p.emoji}
          className={`${s.atom__particle} ${s[`atom__orb${p.orbit}`]}`}
          style={{ animationDelay: p.delay }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  )
}
