'use client'
import { Quiz, QUIZ_RESULT } from '@/const/quizData'
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
import { useRouter } from 'next/navigation'
import { ref, update, remove } from 'firebase/database'
import { db } from '@/lib/firebase'
import Leaderboard from './leaderboard'
import MultiLoading from './loading'

export default function QuizAppMulti({ data, code }: { data: Quiz, code: string }) {
 const points =     {
    level: 'multi',
    correct: 10,
    fast: 5,
    error: 0,
    time: 60,
    lives: null,
    fastTime: 15
  }

  const {
    room,
    players,
    quiz,
    currentQuestion,
    isHost,
    isLastQuestion,
    submitted,
    allSubmitted,
    mySelected,
    formRef,
    playerId,
    submitAnswer,
    handleNext,
  } = useRoomPlay(code)

  const router = useRouter()
  const correctSound = useSound('/sounds/correct.mp3')
  const popSound = useSound('/sounds/pop.mp3')
  const [hasSelected, setHasSelected] = useState(false)
  const [timedOutForQ, setTimedOutForQ] = useState<number | null>(null)

  const timedOut = timedOutForQ === room?.currentQuestion
  const isAnswered = submitted || timedOut
  const isFinished = room?.state === 'finished'

  useEffect(() => {
    setHasSelected(false)
  }, [room?.currentQuestion])

  useEffect(() => {
    if (room?.state === 'waiting') router.replace(`/room/${code}`)
  }, [room?.state, code, router])

  useEffect(() => {
    if (!allSubmitted || !submitted || !currentQuestion || mySelected.length === 0) return
    const isCorrect = [...mySelected].sort().join(',') === [...currentQuestion.correct].sort().join(',')
    if (isCorrect) correctSound.play()
    else popSound.play()
  }, [allSubmitted])

  const maxScore = quiz ? quiz.questions.length * (points.correct + points.fast) : 0
  const me = players.find(p => p.id === playerId)
  const myPercent = me && maxScore ? Math.round((me.score / maxScore) * 100) : 0
  const result = QUIZ_RESULT.find(i => i.score >= myPercent)

  const myCorrectCount = room?.answers
    ? Object.values(room.answers).filter((q: any) => q[playerId!]?.isCorrect).length
    : 0
  const myCorrectPoints = myCorrectCount * points.correct
  const mySpeedPoints = (me?.score ?? 0) - myCorrectPoints

  const handlePlayAgain = async () => {
    const updates: Record<string, any> = {}
    players.forEach(p => {
      updates[`rooms/${code}/players/${p.id}/score`] = 0
    })
    updates[`rooms/${code}/state`] = 'waiting'
    updates[`rooms/${code}/currentQuestion`] = 0
    updates[`rooms/${code}/timerStartedAt`] = null
    updates[`rooms/${code}/answers`] = null
    await update(ref(db), updates)
  }

  const correctAnswer = (id: string) =>
    isAnswered && !!currentQuestion?.correct.includes(id)

  const errorAnswer = (id: string) =>
    isAnswered && mySelected.includes(id) && !currentQuestion?.correct.includes(id)

  const handleTimeout = () => {
    setTimedOutForQ(room?.currentQuestion ?? null)
    if (formRef.current) formRef.current.reset()
    submitAnswer()
  }

  return (
    <section className={stl.app}>
      {!isFinished && currentQuestion && (
        <div className={stl.app__top}>
          <Progress all={data.questions.length} current={(room!.currentQuestion ?? 0) + 1} />
          <Timer
            keyId={room!.currentQuestion}
            stop={isAnswered}
            time={60}
            onTimeout={handleTimeout}
          />
        </div>
      )}

      {isFinished && quiz ? (
        <>
          {result && (
            <div className={stl.finish}>
              <div className={stl.finish__main}>
                <p className={stl.finish__icon}>{result.icon}</p>
                <p className={stl.finish__title}>{result.title}</p>
              </div>
              <div className={stl.finish__score}>
                <p className={stl.finish__scoreTitle}>Итоговый счёт</p>
                <div className={stl.finish__scoreValue}>
                  <span>{me?.score ?? 0} </span> из {maxScore}
                </div>
                <div className={stl.finish__count}>
                  <p className={stl.finish__countItem}><b>{myCorrectPoints}</b> за ответы</p>
                  <p className={stl.finish__countItem}><b>+{mySpeedPoints}</b> бонус за скорость</p>
                </div>
              </div>
            </div>
          )}
          <Leaderboard
            players={players}
            totalQuestions={quiz.questions.length}
            playerId={playerId}
            answers={room.answers}
            finish
          />
        </>
      ) : currentQuestion ? (
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
            {(isAnswered && allSubmitted) && (
              <div className={stl.app__explanation}>
                <Image className={stl.app__explanationImg} src={Wand} alt="Объяснение ответа." />
                <p>{currentQuestion.explanation}</p>
              </div>
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
                correct={correctAnswer(option.id) && allSubmitted}
                error={errorAnswer(option.id) && allSubmitted}
                disabled={isAnswered}
              />
            ))}
          </form>
        </div>
      ) : (
        <MultiLoading text="Загружаем вопрос..." />
      )}

      <div className={stl.app__bottom}>
        {isFinished ? (
          <div className={stl.app__bottomFinish}>
            <Button
              text="На главную"
              action={async () => {
                if (isHost) await remove(ref(db, `rooms/${code}`))
                router.replace('/')
              }}
            />
            {isHost && (
              <Button
                text="Сыграть ещё раз"
                type="sc"
                action={handlePlayAgain}
              />
            )}
          </div>
        ) : (
          <>
            {isAnswered && (
              <p className={ms.waitStatus}>
                {allSubmitted ? '✅ Все ответили' : '⏳ Ждём остальных...'}
              </p>
            )}
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
                  action={() => submitAnswer(points.fastTime, points.fast)}
                  disabled={!hasSelected || submitted}
                  text="Ответить"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
