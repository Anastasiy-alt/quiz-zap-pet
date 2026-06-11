import stl from './rule.module.sass'
import Image from "next/image";
import Trophy from "@/assets/icons/trophy.svg";
import {QUIZ_RESULT} from "@/const/quizData";

export default function ResultRules() {
  return (
    <article className={stl.rule}>
      <div className={stl.rule__top}>
        <Image src={Trophy} alt={'Иконка кубка.'}/>
        <h2 className={stl.rule__title}>Оценка результата</h2>
      </div>
      <div className={stl.results}>
        {
          QUIZ_RESULT.map((i, j) => (
            <div className={stl.result} key={i.score}>
              <p className={stl.result__icon}>{i.icon}</p>
              <p
                className={stl.result__range}>{QUIZ_RESULT[j - 1] && j !== QUIZ_RESULT.length - 1 ? QUIZ_RESULT[j - 1].score + '% -' : (j !== QUIZ_RESULT.length - 1 ? '0% -' : '')} {i.score}%</p>
              <p className={stl.result__title}>{i.title}</p>
            </div>
          ))
        }
      </div>
    </article>
  )
}
