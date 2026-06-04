import stl from './ui.module.sass'

interface Props {
  all: number
  current: number
}

export default function Progress({all, current}: Props) {
  return (
    <div className={stl.progress}>
      <div className={stl.progress__meter} style={{'--w': (current * 100) / all + '%'} as React.CSSProperties}></div>
      <div className={stl.progress__count}>
        {current} / {all}
      </div>
    </div>
  )
}
