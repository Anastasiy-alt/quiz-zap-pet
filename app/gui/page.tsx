'use client'
import { useState } from 'react'
import { ReactNode } from 'react'
import Button from '@/components/ui/button'
import Tag from '@/components/ui/tag'
import RadioCheck from '@/components/ui/radioCheck'
import QuizCard from '@/components/quiz/card'
import Life from '@/components/ui/life'
import Timer from '@/components/ui/timer'
import Progress from '@/components/ui/progress'
import Points from '@/components/ui/points'
import BackBtn from '@/components/ui/backBtn'
import Sound from '@/components/ui/sound'
import Tabs from '@/components/ui/tabs'
import stl from './gui.module.sass'

const TABS = [
  { label: 'Обычный', value: 'easy' },
  { label: 'Хардкор', value: 'hard' },
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={stl.section}>
      <p className={stl.section__label}>{title}</p>
      <div className={stl.section__body}>{children}</div>
    </section>
  )
}

function Row({ children }: { children: ReactNode }) {
  return <div className={stl.row}>{children}</div>
}

export default function GuiPage() {
  const [tab, setTab] = useState('easy')

  return (
    <div className={stl.gui}>
      <h1 className={stl.gui__title}>UI Kit</h1>

      <Section title="Кнопки">
        <Row>
          <Button text="Primary" />
          <Button text="Primary" disabled />
          <Button text="Secondary" type="sc" />
          <Button text="Secondary" type="sc" disabled />
          <Button text="Text" type="tx" />
          <Button text="Link" link="/" type="sc" />
        </Row>
      </Section>

      <Section title="Теги">
        <Row>
          <Tag type="easy" />
          <Tag type="medium" />
          <Tag type="hard" />
        </Row>
      </Section>

      <Section title="Переключатель">
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
      </Section>

      <Section title="Прогресс">
        <div className={stl.col}>
          <Progress all={15} current={3} />
          <Progress all={15} current={10} />
          <Progress all={15} current={15} />
        </div>
      </Section>

      <Section title="Таймер">
        <Timer time={30} />
      </Section>

      <Section title="Жизни">
        <Row>
          <Life count={3} all={3} />
          <Life count={2} all={3} />
          <Life count={1} all={3} />
          <Life count={0} all={3} />
        </Row>
      </Section>

      <Section title="Очки">
        <Points total={290} />
      </Section>

      <Section title="Звук / Назад">
        <Row>
          <Sound />
          <BackBtn />
        </Row>
      </Section>

      <Section title="Radio / Checkbox">
        <div className={stl.rcGrid}>
          <RadioCheck text="Обычный" type="radio" id="r1" name="demo-r" />
          <RadioCheck text="Выбран" type="radio" id="r2" name="demo-r" checked />
          <RadioCheck text="Ошибка" type="radio" id="r3" name="demo-re" error />
          <RadioCheck text="Верно" type="radio" id="r4" name="demo-rc" correct />
          <RadioCheck text="Отключён" type="radio" id="r5" name="demo-rd" disabled />
          <RadioCheck text="Обычный" type="checkbox" id="c1" name="demo-c"
                      description="Описание варианта ответа" />
          <RadioCheck text="Ошибка" type="checkbox" id="c2" name="demo-ce" error
                      description="Описание варианта ответа" />
          <RadioCheck text="Верно" type="checkbox" id="c3" name="demo-cc" correct
                      description="Описание варианта ответа" />
          <RadioCheck text="Отключён" type="checkbox" id="c4" name="demo-cd" disabled
                      description="Описание варианта ответа" />
        </div>
      </Section>

      <Section title="Карточка квиза">
        <div className={stl.cards}>
          <QuizCard title="Динозавры" emoji="🦕" level="easy"
                    subtitle="Проверь свои знания о древних ящерах, правивших Землёй миллионы лет назад!"
                    link="/" questionsCount={7} />
          <QuizCard title="Привидения" emoji="👻" level="medium"
                    subtitle="Знаешь ли ты всё о духах, призраках и паранормальных явлениях?"
                    link="/" questionsCount={15} />
          <QuizCard title="Смешарики" emoji="🍿" level="hard"
                    subtitle="Только для тех, кто смотрел каждую серию. Никакой пощады!"
                    link="/" questionsCount={16} />
        </div>
      </Section>
    </div>
  )
}
