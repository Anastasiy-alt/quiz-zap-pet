import { InputHTMLAttributes } from 'react'
import stl from './ui.module.sass'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  customClass?: string
}

export default function Input({ label, error, id, customClass, ...props }: Props) {
  return (
    <div className={`${stl.field} ${customClass}`}>
      {label && (
        <label className={stl.field__label} htmlFor={id}>
          {label}
        </label>
      )}
      <input id={id} className={stl.field__input} {...props} />
      {error && <p className={stl.field__error}>{error}</p>}
    </div>
  )
}
