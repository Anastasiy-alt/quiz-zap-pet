'use client'

import Button from "@/components/ui/button";

const PLAYER_NAMES = [
  'Грустный Гусь',
  'Тревожный Бобёр',
  'Сонный Енот',
  'Злой Хомяк',
  'Лысый Пингвин',
  'Вежливый Крокодил',
  'Потрясающий Енот',
  'Гордый Таракан',
  'Задумчивый Осьминог',
  'Весёлый Червяк',
  'Великолепный Морж',
  'Хитрый Кабан',
  'Идеальный Фламинго',
  'Молчаливый Бегемот',
  'Счастливый Слон',
  'Застенчивый Мамонт',
  'Важный Дельфин',
  'Добрый Верблюд',
  'Серьёзный Кот',
  'Спокойный Петух',
]



export default function RandomName({action}: {  action: (name: string) => void  }) {
  const randomName = () => {
    const n = PLAYER_NAMES[Math.floor(Math.random() * PLAYER_NAMES.length)]
    action(n)
  }

  return(
    <Button text={'Воля случая'} action={randomName} type={'tx'} />
  )
}
