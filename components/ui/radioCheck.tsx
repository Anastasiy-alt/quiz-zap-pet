import stl from './ui.module.sass'
import {ChangeEventHandler} from "react";

interface Props {
  text?: string
  error?: boolean
  correct?: boolean
  description?: string
  checked?: boolean
  disabled?: boolean
  type: 'radio' | 'checkbox'
  id: string
  name: string
  value?: string
  action?: ChangeEventHandler<HTMLLabelElement>,
}
export default function RadioCheck({text, checked = false, correct = false, disabled, description, error = false, type, id, name, value, action}: Props) {
  return(
    <label className={`${stl.rc} ${stl.rc}_${type} ${error ? stl.rc_error : ''} ${correct ? stl.rc_correct : ''}`} id={id} onChange={action}>
      <input className={stl.rc__input}
             type={type}
             name={name}
             value={value}
             disabled={disabled}
             defaultChecked={checked || error || correct}/>
      <span className={stl.rc__inputCustom}></span>
      <span className={stl.rc__block}>
        {
          text && (
            <span className={stl.rc__text}>{text}</span>
          )
        }
        {
          description && (
            <span className={stl.rc__description}>{description}</span>
          )
        }
      </span>
    </label>
  )
}
