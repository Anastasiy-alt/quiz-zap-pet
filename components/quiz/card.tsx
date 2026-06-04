import stl from './quiz.module.sass'
import Tag from "@/components/ui/tag";
import Button from "@/components/ui/button";

interface Props {
  title: string
  questionsCount: number
  subtitle: string
  link: string
  emoji: string
  level: 'ease' | 'medium' | 'hard'
}

export default function QuizCard({title, questionsCount, subtitle, link, emoji, level}: Props) {
  const questionsCountText = (count: number) => {
    switch (true) {
      case count === 11:
        return 'вопросов'
      case ((count % 10) === 1):
        return 'вопрос'
      case ((count % 10) > 1 && (count % 10) < 5 && count > 20) || (count > 1 && count < 5):
        return 'вопроса'
      default:
        return 'вопросов'
    }
  }

  return (
    <article className={stl.card}>
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
        <Button text={'Старт'} link={link} type={'pr'}/>
      </div>
    </article>
  )
}
