'use client'
import stl from './rule.module.sass'
import Image from "next/image";
import Thunder from "@/assets/icons/thunderStroke.svg";
import Tabs from "@/components/ui/tabs";
import {useState} from "react";

export default function PointsRules() {
  const [mode, setMode] = useState('normal')

  return (
    <article className={stl.rule}>
      <div className={stl.rule__top}>
        <Image src={Thunder} alt={'Иконка молнии.'}/>
        <h2 className={stl.rule__title}>Как начисляются очки</h2>
      </div>
      <div className={stl.points}>
        <Tabs
          value={mode}
          onChange={setMode}
          tabs={[
            {label: '"Обычный"', value: 'normal'},
            {label: '"Хардкор"', value: 'hard'},
          ]}
        />
        {
          mode === 'hard' ? (
            <ul className={stl.points__list}>
              <li className={`${stl.point} ${stl.point_correct}`}>
                Правильный ответ
                <span>+15 очков</span>
              </li>
              <li className={`${stl.point} ${stl.point_fast}`}>
                Бонус за скорость
                <span>+5 очков</span>
              </li>
              <li className={`${stl.point} ${stl.point_error}`}>
                Ошибка
                <span>−5 очков</span>
              </li>
              <li className={`${stl.point} ${stl.point_time}`}>
                Таймаут
                <span>0 очков, −1 жизнь</span>
              </li>
            </ul>
          ) : (
            <ul className={stl.points__list}>
              <li className={`${stl.point} ${stl.point_correct}`}>
                Правильный ответ
                <span>+10 очков</span>
              </li>
              <li className={`${stl.point} ${stl.point_fast}`}>
                Бонус за скорость
                <span>+5 очков</span>
              </li>
              <li className={`${stl.point} ${stl.point_time}`}>
                Таймаут
                <span>0 очков, −1 жизнь</span>
              </li>
            </ul>
          )
        }
        <div className={stl.points__info}>
          При мульти-выборе нужно выбрать строго все правильные варианты — частичный ответ считается ошибкой
        </div>
      </div>

    </article>
  )
}
