'use client'
import {Quiz} from "@/const/quizData";
import stl from './quiz.module.sass'
import Progress from "@/components/ui/progress";
import Life from "@/components/ui/life";
import Timer from "@/components/ui/timer";
import RadioCheck from "@/components/ui/radioCheck";
import Button from "@/components/ui/button";
import {useRef, useState} from "react";

export default function QuizApp({data}: { data: Quiz }) {
  const [currentQue, setCurrentQue] = useState(0)
  const [lives, setLives] = useState(3)
  const [translateBtn, setTranslateBtn] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [disable, setDisable] = useState(false)
  const [checked, setChecked] = useState<string[]>([])

  function handleAnswer() {
    setTranslateBtn(true)
    setDisable(true)
    handleSubmitAnswer()
  }

  function nextQue() {
    setCurrentQue(currentQue + 1)
    setTranslateBtn(false)
    setDisable(false)
    setChecked([])
  }

  const handleSubmitAnswer = () => {
    if (!formRef.current) return
    const formData = new FormData(formRef.current)
    const selected = formData.getAll(data.questions[currentQue].id) as string[]
    setChecked(selected)
  }
  const arraysEqual = (a: string[], b: string[]) =>
    [...a].sort().join(',') === [...b].sort().join(',')

  return (
    <section className={stl.app}>
      <div className={stl.app__top}>
        <Progress all={data.questions.length} current={currentQue + 1}/>
        <Timer/>
        <Life count={lives}/>
      </div>
      <div className={stl.app__main}>
        <div className={stl.app__mainLeft}>
          <h2 className={stl.app__title}>{data.questions[currentQue].question}</h2>
          {data.questions[currentQue].correct}
        </div>
        <form ref={formRef} className={stl.app__mainRight}>
          {
            data.questions[currentQue].options.map((i) => (
              <RadioCheck key={data.questions[currentQue].id + i.id}
                          type={data.questions[currentQue].type}
                          id={data.questions[currentQue].id + i.id}
                          value={i.id}
                          correct={arraysEqual(data.questions[currentQue].correct, checked) && checked.includes(i.id)}
                          error={!arraysEqual(data.questions[currentQue].correct, checked) && checked.includes(i.id)}
                          disabled={disable}
                          name={data.questions[currentQue].id}
                          text={i.text}/>
            ))
          }
        </form>
      </div>
      <div className={stl.app__bottom}>
        <div className={stl.app__bottomOut}>
          <div className={`${stl.app__bottomIn} ${translateBtn ? stl.app__bottomIn_slide : ''}`}>
            <Button action={nextQue} text={'Дальше'} type={"tx"} iconRight={true}>
              <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%"
                   fill="currentColor">
                <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/>
              </svg>
            </Button>
            <Button action={handleAnswer} text={'Ответить'}/>

          </div>
        </div>
      </div>
    </section>
  )
}
