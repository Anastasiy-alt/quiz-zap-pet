import stl from './quiz.module.sass'
import Tag from "@/components/ui/tag";
import Button from "@/components/ui/button";
import Link from "next/link";
import {questionsCountText} from "@/const/questionsCountText";

interface Props {
  title: string
  questionsCount: number
  subtitle: string
  link: string
  emoji: string
  level: 'easy' | 'medium' | 'hard'
}

export default function QuizCard({title, questionsCount, subtitle, link, emoji, level}: Props) {

  return (
    <Link href={link} className={stl.card}>
      <div className={stl.card__top}>
        <div className={stl.card__icon}>{emoji}</div>
        <Tag type={level}/>
      </div>
      <div className={stl.card__main}>
        <h3 className={stl.card__title}>{title}</h3>
        <p className={stl.card__subtitle}>{subtitle}</p>
      </div>
      <div className={stl.card__bottom}>
        <div className={stl.card__count}>
          <p className={stl.card__countValue}>{questionsCount}</p>
          <p className={stl.card__countText}>{questionsCountText(questionsCount)}</p>
        </div>
        <Button text={'Старт'} type={'pr'}/>
      </div>
    </Link>
  )
}
