'use client'
import { Quiz } from '@/const/quizData'
import stl from '../quiz.module.sass'
import ms from './multi.module.sass'
import Progress from '@/components/ui/progress'
import Timer from '@/components/ui/timer'
import RadioCheck from '@/components/ui/radioCheck'
import Button from '@/components/ui/button'
import { useEffect, useState } from 'react'
import Wand from '@/assets/icons/wand.svg'
import Image from 'next/image'
import { useSound } from '@/hooks/useSound'
import { useRoomPlay } from '@/hooks/useRoomPlay'

export default function QuizAppMulti({ data, code }: { data: Quiz, code: string }) {
  const {
    room,
    currentQuestion,
    isHost,
    isLastQuestion,
    submitted,
    allSubmitted,
    mySelected,
    formRef,
    submitAnswer,
    handleNext,
  } = useRoomPlay(code)

  const correctSound = useSound('/sounds/correct.mp3')
  const [hasSelected, setHasSelected] = useState(false)
  const [timedOut, setTimedOut] = useState(false)

  const isAnswered = submitted || timedOut

  useEffect(() => {
    setHasSelected(false)
    setTimedOut(false)
  }, [room?.currentQuestion])

  useEffect(() => {
    if (!submitted || !currentQuestion || mySelected.length === 0) return
    const isCorrect = [...mySelected].sort().join(',') === [...currentQuestion.correct].sort().join(',')
    if (isCorrect) correctSound.play()
  }, [submitted])

  if (!room || !currentQuestion) {
    return <div className={stl.app}>Загружаем вопрос...</div>
  }

  const correctAnswer = (id: string) =>
    isAnswered && currentQuestion.correct.includes(id)

  const errorAnswer = (id: string) =>
    isAnswered && mySelected.includes(id) && !currentQuestion.correct.includes(id)

  const handleTimeout = () => {
    setTimedOut(true)
    submitAnswer()
  }

  return (
    <section className={stl.app}>
      <div className={stl.app__top}>
        <Progress all={data.questions.length} current={(room.currentQuestion ?? 0) + 1} />
        <Timer
          keyId={room.currentQuestion}
          stop={isAnswered}
          time={60}
          onTimeout={handleTimeout}
        />
      </div>

      <div className={stl.app__main}>
        <div className={stl.app__mainLeft}>
          <h2 className={stl.app__title}>{currentQuestion.question}</h2>
          {currentQuestion.image && (
            <Image
              className={stl.app__image}
              quality={100}
              placeholder="blur"
              width={100}
              unoptimized
              height={100}
              src={currentQuestion.image.url}
              alt={currentQuestion.image.description}
            />
          )}
          {isAnswered && (
            <div className={stl.app__explanation}>
              <Image className={stl.app__explanationImg} src={Wand} alt="Объяснение ответа." />
              <p>{currentQuestion.explanation}</p>
            </div>
          )}
          {isAnswered && (
            <p className={ms.waitStatus}>
              {allSubmitted ? '✅ Все ответили' : '⏳ Ждём остальных...'}
            </p>
          )}
        </div>

        <form ref={formRef} onInput={() => setHasSelected(true)} className={stl.app__mainRight}>
          {currentQuestion.options.map(option => (
            <RadioCheck
              key={currentQuestion.id + option.id}
              type={currentQuestion.type}
              id={currentQuestion.id + option.id}
              value={option.id}
              name={currentQuestion.id}
              text={option.text}
              correct={correctAnswer(option.id)}
              error={errorAnswer(option.id)}
              disabled={isAnswered}
            />
          ))}
        </form>
      </div>

      <div className={stl.app__bottom}>
        <div className={stl.app__bottomOut}>
          <div className={`${stl.app__bottomIn} ${isAnswered ? stl.app__bottomIn_slide : ''}`}>
            {isHost ? (
              <Button
                action={handleNext}
                disabled={!allSubmitted}
                text={isLastQuestion ? 'Финиш' : 'Дальше'}
                type="tx"
                iconRight
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%"
                     fill="currentColor">
                  <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
                </svg>
              </Button>
            ) : (
              <p className={ms.waitHint}>Ждём хоста...</p>
            )}
            <Button
              action={submitAnswer}
              disabled={!hasSelected || submitted}
              text="Ответить"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
