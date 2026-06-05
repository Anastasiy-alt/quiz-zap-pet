import stl from '../main.module.sass'
import AtomAnimation from "@/components/main/hero/animation";

export default function Hero() {
  return (
    <section className={stl.hero}>
        <h1 className={stl.hero__title}>
        <span className={stl.hero__titleOut}>
          <span className={stl.hero__titleIn}>
            Ты знаешь больше чем думаешь.
          </span>
        </span>
          <span className={stl.hero__titleOut}>
          <span className={stl.hero__titleIn}>
            Или меньше.
          </span>
        </span>
          <span className={stl.hero__titleOut}>
          <span className={stl.hero__titleIn}>
            Проверим?
          </span>
        </span>
        </h1>
        <p className={stl.hero__subtitle}>Таймер идёт, жизни конечны,<br/>правильные ответы где-то рядом</p>
      <div className={stl.hero__atom}>
        <AtomAnimation />
      </div>

    </section>
  )
}
