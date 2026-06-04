import stl from './ui.module.sass'

interface Props {
  type: 'ease' | 'medium' | 'hard'
}

export default function Tag({type}: Props) {
  return(
    <p className={`${stl.tag} ${stl.tag}_${type}`}>
      {type}
    </p>
  )
}
