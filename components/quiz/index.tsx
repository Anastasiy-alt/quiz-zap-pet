'use client'
import {Quiz, QUIZ_RESULT} from "@/const/quizData";
import stl from './quiz.module.sass'
import Progress from "@/components/ui/progress";
import Life from "@/components/ui/life";
import Timer from "@/components/ui/timer";
import RadioCheck from "@/components/ui/radioCheck";
import Button from "@/components/ui/button";
import {useEffect, useRef, useState} from "react";
import Points from "@/components/ui/points";
import Wand from '@/assets/icons/wand.svg'
import Image from "next/image";
import {useSound} from "@/hooks/useSound";
import {questionsCountText} from "@/const/questionsCountText";
import Thunder from '@/assets/icons/thunder.svg'
import Heart from '@/assets/icons/heart-fill.svg'
import Clock from '@/assets/icons/clock.svg'

export default function QuizApp({data}: { data: Quiz }) {
  const points = [
    {
      level: 'hard',
      correct: 15,
      fast: 5,
      error: 5,
      time: 15,
      lives: 3,
      fastTime: 7
    },
    {
      level: 'easy',
      correct: 10,
      fast: 5,
      error: 0,
      time: 30,
      lives: 5,
      fastTime: 15
    }
  ]
  const countQue = data.questions.length

  const popSound = useSound('/sounds/pop.mp3')
  const correctSound = useSound('/sounds/correct.mp3')
  const overSound = useSound('/sounds/over.mp3')

  const timerStopCalledRef = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [mode, setMode] = useState(points[1])
  const [currentQue, setCurrentQue] = useState(0)
  const [lives, setLives] = useState(mode.lives)
  const [translateBtn, setTranslateBtn] = useState(false)
  const [disable, setDisable] = useState(false)
  const [checked, setChecked] = useState<string[]>([])
  const [timer, setTimer] = useState<number>(mode.time)
  const [timerStop, setTimerStop] = useState<number>(0)
  const [stop, setStop] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [changeForm, setChangeForm] = useState<boolean>(false)
  const [start, setStart] = useState(true)

  const scoreMaxPoints = countQue * (mode.fast + mode.correct)

  const [scoreTimePoints, setScoreTimePoints] = useState(0)
  const [scoreCorrectPoints, setScoreCorrectPoints] = useState(0)
  const [scoreTotalTime, setScoreTotalTime] = useState(0)
  const [scoreResult, setScoreResult] = useState<{
    icon: string, title: string, score: number
  }>()

  const isFinished = currentQue === countQue || lives <= 0

  useEffect(() => {
    setLives(mode.lives)
    setTimer(mode.time)
  }, [mode])

  useEffect(() => {
    if (isFinished) overSound.play()
  }, [isFinished])

  useEffect(() => {
    if (currentQue === countQue) {
      const percent = (score * 100) / scoreMaxPoints
      setScoreResult(QUIZ_RESULT.find(i => i.score >= percent))
    }
  }, [currentQue])

  useEffect(() => {
    if (lives <= 0) {
      const percent = (score * 100) / scoreMaxPoints
      setScoreResult(QUIZ_RESULT.find(i => i.score >= percent))
    }
  }, [lives, score])

  const correctAnswer = (id: string) =>
    (arraysEqual(data.questions[currentQue].correct, checked) && checked.includes(id)) ||
    (data.questions[currentQue].correct.includes(id) && translateBtn)

  const errorAnswer = (id: string) =>
    !arraysEqual(data.questions[currentQue].correct, checked) && checked.includes(id)

  const handleSubmitAnswer = () => {
    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const selected = formData.getAll(data.questions[currentQue].id) as string[]
    setChecked(selected)

    const isCorrect = arraysEqual(data.questions[currentQue].correct, selected)

    if (!isCorrect) {
      setLives(l => l - 1)
      popSound.play()
    }

    if (isCorrect) {
      correctSound.play()
      setScoreCorrectPoints(s => s + mode.correct)
      if (timerStop <= mode.fastTime) {
        setScore(s => s + mode.fast + mode.correct)
        setScoreTimePoints(s => s + mode.fast)
      } else {
        setScore(s => s + mode.correct)
      }
    } else {
      setScore(s => s - mode.error)
      setScoreCorrectPoints(s => s - mode.error)
    }
  }

  function handleAnswer() {
    setStop(true)
    setTranslateBtn(true)
    setDisable(true)
    handleSubmitAnswer()
  }

  function nextQue() {
    timerStopCalledRef.current = false
    setCurrentQue(c => c + 1)
    setTranslateBtn(false)
    setDisable(false)
    setChecked([])
    setTimer(mode.time)
    setStop(false)
    setChangeForm(false)
  }

  function handleTimeout() {
    if (disable) return
    if (formRef.current) formRef.current.reset()
    handleAnswer()
    setChangeForm(true)
  }

  function handleStopTimer(i: number) {
    if (timerStopCalledRef.current) return
    timerStopCalledRef.current = true
    setTimerStop(i)
    setScoreTotalTime(t => t + i)
  }

  const arraysEqual = (a: string[], b: string[]) =>
    [...a].sort().join(',') === [...b].sort().join(',')

  const handleStart = () => {
    setStart(false)
    setCurrentQue(0)
    setLives(mode.lives)
    setTranslateBtn(false)
    setDisable(false)
    setChecked([])
    setTimer(mode.time)
    setTimerStop(0)
    setStop(false)
    setScore(0)
    setChangeForm(false)
    setScoreTimePoints(0)
    setScoreCorrectPoints(0)
    setScoreTotalTime(0)
    setScoreResult(undefined)
  }

  const handleRestart = () => {
    setStart(true)
    setMode(points[1])
  }

  function handleSetMode(lv: string) {
    const pointsLevel = points.find((i) => i.level === lv) || points[0]
    setMode(pointsLevel)
  }

  return (
    <section className={stl.app}>

      {!start && (
        <div className={stl.app__top}>
          <Progress all={countQue} current={currentQue + 1}/>
          <Timer keyId={currentQue}
                 stop={stop || isFinished}
                 onStop={handleStopTimer}
                 onTimeout={handleTimeout}
                 time={timer}/>
          <Life count={lives} all={mode.lives}/></div>
      )}

      {start ? (
        <div className={stl.start}>
          <div className={stl.start__top}>
            <div className={stl.start__iconBlock}>
              <p className={stl.start__icon}>{data.emoji}</p>
            </div>
            <div className={stl.start__titleBlock}>
              <h2 className={stl.start__title}>{data.title}</h2>
              <p className={stl.start__subtitle}>{data.questions.length} {questionsCountText(data.questions.length)}</p>
            </div>
          </div>
          <div className={stl.start__main}>
            <p className={stl.start__description}>{data.description}</p>
            <div className={stl.start__rulesBlock}>
              <div className={stl.start__rule}>
                <Image className={stl.start__ruleImg} src={Clock} alt={'Таймер.'}/>
                <p className={stl.start__ruleTitle}>Таймер</p>
                <p className={stl.start__ruleSubtitle}>На каждый вопрос — ограниченное время. Начнём "тикать" на
                  последних
                  5s.
                </p>
              </div>
              <div className={stl.start__rule}>
                <Image className={stl.start__ruleImg} src={Heart} alt={'Сердечко.'}/>
                <p className={stl.start__ruleTitle}>Жизни</p>
                <p className={stl.start__ruleSubtitle}>За ошибку или таймаут теряется жизнь. Принимаются только 100%
                  правильные ответы!
                </p>
              </div>
              <div className={stl.start__rule}>
                <Image className={stl.start__ruleImg} src={Thunder} alt={'Молния.'}/>
                <p className={stl.start__ruleTitle}>Бонус</p>
                <p className={stl.start__ruleSubtitle}>+5 очков если ответил в первые 15s или 7s (в зависимости от
                  режима).
                </p>
              </div>
            </div>
          </div>
          <form className={stl.start__main}
                onInput={(evt) => handleSetMode((evt.target as HTMLInputElement).value)}>
            <p className={stl.start__title}>Режим игры</p>
            <div className={stl.start__mode}>
              <RadioCheck type={"radio"}
                          id={'mode-easy'}
                          value={'easy'}
                          name={'mode-type'}
                          checked={true}
                          text={'Обычный'}

                          description={'5 жизней, 30s на ответ, 10 баллов за ответ'}/>
              <RadioCheck type={"radio"}
                          id={'mode-hard'}
                          value={'hard'}
                          name={'mode-type'}
                          text={'Хардкор'}
                          description={'3 жизни, 15s на ответ, 15 баллов за ответ и -5 баллов за ошибку'}/>
            </div>
          </form>
        </div>
      ) : (
        <>
          {
            isFinished ? (
              <div className={stl.finish}>
                {lives <= 0 && (
                  <div className={stl.finish__lifes}>
                    💔 Квиз прерван — жизни закончились
                  </div>
                )}
                <div className={stl.finish__main}>
                  <p className={stl.finish__icon}>{scoreResult?.icon}</p>
                  <p className={stl.finish__title}>{scoreResult?.title}</p>
                </div>

                <div className={stl.finish__stats}>
                  <p className={stl.finish__statsText}>Время прохождения</p>
                  <p className={stl.finish__statsText}>
                <span>
                  {Math.floor(scoreTotalTime / 60)}:{scoreTotalTime % 60 >= 10 ? '' : '0'}{scoreTotalTime % 60}s
                </span>
                  </p>
                </div>
                <div className={stl.finish__stats}>
                  <p className={stl.finish__statsText}>Правильных ответов</p>
                  <p className={stl.finish__statsText}>
                    <span>{scoreCorrectPoints / mode.correct}</span> из {countQue}
                  </p>
                </div>
                <div className={stl.finish__score}>
                  <p className={stl.finish__scoreTitle}>Итоговый счёт</p>
                  <div className={stl.finish__scoreValue}>
                    <span>{score} </span> из {scoreMaxPoints}
                  </div>
                  <div className={stl.finish__count}>
                    <p className={stl.finish__countItem}><b>{scoreCorrectPoints}</b> за ответы</p>
                    <p className={stl.finish__countItem}><b>+{scoreTimePoints}</b> бонус за скорость</p>
                  </div>
                </div>
                <div className={stl.finish__stats}>
                  <p className={stl.finish__statsText}>Среднее время ответа на вопрос</p>
                  <p className={stl.finish__statsText}>
                    <span>{(scoreTotalTime / (currentQue + 1)).toFixed(1)}s</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className={stl.app__main}>
                <div className={stl.app__mainLeft}>
                  <h2 className={stl.app__title}>{data.questions[currentQue].question}</h2>
                  {data.questions[currentQue].image && (
                    <Image className={stl.app__image}
                           quality={100}
                           placeholder="blur"
                           width={100}
                           unoptimized
                           height={100}
                           src={data.questions[currentQue].image.url}
                           alt={data.questions[currentQue].image.description}/>
                  )}
                  {stop && (
                    <div className={stl.app__explanation}>
                      <Image className={stl.app__explanationImg} src={Wand} alt={'Объяснение ответа.'}/>
                      <p>{data.questions[currentQue].explanation}</p>
                    </div>
                  )}
                </div>
                <form ref={formRef}
                      onInput={() => setChangeForm(true)}
                      className={stl.app__mainRight}>
                  {data.questions[currentQue].options.map((i) => (
                    <RadioCheck key={data.questions[currentQue].id + i.id}
                                type={data.questions[currentQue].type}
                                id={data.questions[currentQue].id + i.id}
                                value={i.id}
                                correct={correctAnswer(i.id)}
                                error={errorAnswer(i.id)}
                                disabled={disable}
                                name={data.questions[currentQue].id}
                                text={i.text}/>
                  ))}
                </form>
              </div>
            )
          }
        </>
      )}


      <div className={stl.app__bottom}>
        {start ? (
          <>
            <Button text={'Правила'} link={'/rules'} type={'sc'}/>
            <Button text={'Погнали'} action={handleStart}/>
          </>
        ) : (
          <>{
            isFinished ? (
              <div className={stl.app__bottomFinish}>
                <Button link={'/'} text={'На главную'}/>
                <Button action={handleRestart} text={'Пройти заново'} type={'sc'}/>
              </div>
            ) : (
              <>
                <Points total={score}/>
                <div className={stl.app__bottomOut}>
                  <div className={`${stl.app__bottomIn} ${translateBtn ? stl.app__bottomIn_slide : ''}`}>
                    <Button action={changeForm ? nextQue : undefined}
                            disabled={!changeForm}
                            text={!(data.questions.length === currentQue + 1) ? 'Дальше' : 'Финиш'}
                            type={"tx"}
                            iconRight={true}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%"
                           fill="currentColor">
                        <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/>
                      </svg>
                    </Button>
                    <Button action={changeForm ? handleAnswer : undefined}
                            disabled={!changeForm}
                            text={'Ответить'}/>
                  </div>
                </div>
              </>
            )
          }
          </>
        )}

      </div>
    </section>
  )
}
