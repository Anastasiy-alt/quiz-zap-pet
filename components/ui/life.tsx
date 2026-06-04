import stl from './ui.module.sass'
import HeartFill from '@/assets/icons/heart-fill.svg'
import HeartStroke from '@/assets/icons/heart-stroke.svg'
import Image from 'next/image'

interface Props {
  count: number
  all?: number
}

export default function Life({count, all = 3}: Props) {
  return (
    <div className={stl.life}>
      {[...Array(all)].map((_, i) => (
        <div key={i} className={stl.life__item}>
          <Image alt={'Жизнь потеряна.'} fill={true} src={HeartStroke} unoptimized
                 className={`${stl.life__icon} ${stl.life__icon_fill}`}
          />
          <Image alt={'Жизнь.'} fill={true} src={HeartFill} unoptimized
                 className={`${stl.life__icon} ${count < all && i > (count - 1) ? stl.life__icon_lose : ''}`}
          />
        </div>
      ))}
    </div>
  )
}
