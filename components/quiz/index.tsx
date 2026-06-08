'use client'
import {Quiz, QUIZ_RESULT} from "@/const/quizData";
import stl from './quiz.module.sass'
import Progress from "@/components/ui/progress";
import Life from "@/components/ui/life";
import Timer from "@/components/ui/timer";
import RadioCheck from "@/components/ui/radioCheck";
import Button from "@/components/ui/button";
import {useRef, useState} from "react";
import Points from "@/components/ui/points";
import Wand from '@/assets/icons/wand.svg'
import Image from "next/image";

export default function QuizApp({data}: { data: Quiz }) {
  const TIMER = 30
  const LIFES = 3
  const points = {
    correct: 10,
    fast: 5
  }
  const countQue = data.questions.length
  const scoreMaxPoints = countQue * (points.fast + points.correct) // максимальное количество баллов

  const formRef = useRef<HTMLFormElement>(null)
  const [currentQue, setCurrentQue] = useState(0)
  const [lives, setLives] = useState(LIFES)
  const [translateBtn, setTranslateBtn] = useState(false)
  const [disable, setDisable] = useState(false)
  const [checked, setChecked] = useState<string[]>([])
  const [timer, setTimer] = useState<number>(TIMER)
  const [timerStop, setTimerStop] = useState<number>(0)
  const [stop, setStop] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0) // счет
  const [changeForm, setChangeForm] = useState<boolean>(false)

  const [scoreTimePoints, setScoreTimePoints] = useState(0) // очки за скорость
  const [scoreCorrectPoints, setScoreCorrectPoints] = useState(0) // очки за правильные ответы
  const [scoreTotalTime, setScoreTotalTime] = useState(0) // время прохождения квиза
  const [scoreResult, setScoreResult] = useState<{
    icon: string, title: string, score: number
  }>()


  const correctAnswer = (id: string) =>
    (arraysEqual(data.questions[currentQue].correct, checked) && checked.includes(id)) || (data.questions[currentQue].correct.includes(id) && translateBtn)

  const errorAnswer = (id: string) => !arraysEqual(data.questions[currentQue].correct, checked) && checked.includes(id)


  function handleAnswer() {
    setTranslateBtn(true)
    setDisable(true)
    handleSubmitAnswer()
    setStop(true)
  }

  function nextQue() {
    setCurrentQue(c => c + 1)
    setTranslateBtn(false)
    setDisable(false)
    setChecked([])
    setTimer(TIMER)
    setStop(false)
    setChangeForm(false)
    setTimeout(
      () => {
        if (currentQue === (countQue - 1)) {
          const percent = (score * 100) / scoreMaxPoints
          setScoreResult(QUIZ_RESULT.find(i => i.score >= percent))
        }
      }, 0)

  }

  const handleSubmitAnswer = () => {
    if (!formRef.current) return
    const formData = new FormData(formRef.current)
    const selected = formData.getAll(data.questions[currentQue].id) as string[]
    setChecked(selected)
    if (!arraysEqual(data.questions[currentQue].correct, selected)) {
      setLives(lives - 1)
    }

    if (arraysEqual(data.questions[currentQue].correct, selected)) {
      setScoreCorrectPoints(scoreCorrectPoints + points.correct)
      if (timerStop <= 10) {
        setScore(score + points.fast + points.correct)
        setScoreTimePoints(scoreTimePoints + points.fast)
      } else {
        setScore(score + points.correct)
      }
    }
  }

  function handleTimeout() {
    if (disable) return
    setLives(lives - 1)
    handleAnswer()
    setChangeForm(true)
  }

  function handleStopTimer(i: number) {
    setTimerStop(i)
    setScoreTotalTime(scoreTotalTime + i)
    console.log('STOP', i, scoreTotalTime)
  }

  const arraysEqual = (a: string[], b: string[]) =>
    [...a].sort().join(',') === [...b].sort().join(',')

  const restart = () => {
    setCurrentQue(0)
    setLives(LIFES)
    setTranslateBtn(false)
    setDisable(false)
    setChecked([])
    setTimer(TIMER)
    setTimerStop(0)
    setStop(false)
    setScore(0)
    setChangeForm(false)
    setScoreTimePoints(0)
    setScoreCorrectPoints(0)
    setScoreTotalTime(0)
  }

  return (
    <section className={stl.app}>
      <div className={stl.app__top}>
        <Progress all={countQue} current={currentQue + 1}/>

        <Timer keyId={currentQue}
               stop={stop || currentQue === countQue}
               onStop={handleStopTimer}
               onTimeout={handleTimeout}
               time={timer}/>

        <Life count={lives}/>
      </div>

      {
        currentQue === countQue ? (
          <div className={stl.finish}>
            <div className={stl.finish__main}>
              <p className={stl.finish__icon}>{scoreResult?.icon}</p>
              <p className={stl.finish__title}>{scoreResult?.title}</p>
            </div>

            <div className={stl.finish__stats}>
              <p className={stl.finish__statsText}>Время прохождения</p>
              <p className={stl.finish__statsText}><span>{Math.floor(scoreTotalTime / 60)}:{scoreTotalTime % 60}s</span>
              </p>
            </div>
            <div className={stl.finish__stats}>
              <p className={stl.finish__statsText}>Правильных ответов</p>
              <p className={stl.finish__statsText}><span>{scoreCorrectPoints / points.correct}</span> из {countQue}</p>
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
              <p className={stl.finish__statsText}><span>
                {(scoreTotalTime / countQue).toFixed(1)}s
              </span></p>
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
              )
              }
              {stop && (
                <div className={stl.app__explanation}>
                  <Image className={stl.app__explanationImg} src={Wand} alt={'Объяснение ответа.'}/>
                  <p>{data.questions[currentQue].explanation}</p>
                </div>
              )}
            </div>
            <form ref={formRef}
                  onChange={() => setChangeForm(true)}
                  className={stl.app__mainRight}>
              {
                data.questions[currentQue].options.map((i) => (
                  <RadioCheck key={data.questions[currentQue].id + i.id}
                              type={data.questions[currentQue].type}
                              id={data.questions[currentQue].id + i.id}
                              value={i.id}
                              correct={correctAnswer(i.id)}
                              error={errorAnswer(i.id)}
                              disabled={disable}
                              name={data.questions[currentQue].id}
                              text={i.text}/>
                ))
              }
            </form>
          </div>
        )
      }

      <div className={stl.app__bottom}>
        {
          currentQue === countQue ? (
            <div className={stl.app__bottomFinish}>
              <Button link={'/'}
                      text={'На главную'}/>
              <Button action={restart}
                      text={'Пройти заново'} type={'sc'}/>
            </div>
          ) : (
            <>
              <Points total={score}/>
              <div className={stl.app__bottomOut}>
                <div className={`${stl.app__bottomIn} ${translateBtn ? stl.app__bottomIn_slide : ''}`}>
                  <Button action={changeForm ? nextQue : undefined}
                          disabled={!changeForm}
                          text={'Дальше'}
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


      </div>
    </section>
  )
}
