import stl from './main.module.sass'
import Button from "@/components/ui/button";
import {QUIZZES} from "@/const/quizData";

export default function BannerCTA() {
  const random = Math.floor(Math.random() * QUIZZES.length)
  return (
    <article className={stl.cta}>
      <div className={stl.cta__iconBlock}>
        <p className={stl.cta__icon}>🔮</p>
      </div>

      <div className={stl.cta__block}>
        <h2 className={stl.cta__title}>
          Не знаешь с чего начать?</h2>
        <p className={stl.cta__subtitle}>Нажми — и мы подберём квиз случайным образом</p>
      </div>

      <Button link={'/quiz/' + QUIZZES[random].id} text={'попробовать удачу'} type={'sc'}/>
    </article>
  )
}
