import stl from './multi.module.sass'

interface Props {
  text?: string
}

export default function MultiLoading({ text = 'Загружаем...' }: Props) {
  return <p className={stl.loading}>{text}</p>
}
