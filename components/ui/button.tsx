import stl from './ui.module.sass'

interface Props {
  type?: 'pr' | 'sc' | 'tx'
  text: string
  link?: string
}

export default function Button({type = 'pr', text, link}: Props) {
  return (
    <>
      {
        link ? (
          <a href={link}
             className={`${stl.btn} ${stl.btn}_${type}`}>
            <span>
              {text}
            </span>
          </a>
        ) : (
          <button
            className={`${stl.btn} ${stl.btn}_${type}`}>
            <span>
              {text}
            </span>
          </button>
        )
      }
    </>
  )
}
