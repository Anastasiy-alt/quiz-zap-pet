import stl from './rule.module.sass'
import Rule from '@/assets/icons/rules.svg'
import Trophy from '@/assets/icons/trophyYellow.svg'
import Catalog from '@/assets/icons/catalog.svg'
import Pen from '@/assets/icons/pen.svg'
import Wand from '@/assets/icons/wand.svg'
import Image from "next/image";

export default function StepsRules() {
  return (
    <article className={stl.rule}>
      <div className={stl.rule__top}>
        <Image src={Rule} alt={'Иконка правил.'}/>
        <h2 className={stl.rule__title}>Как проходит квиз</h2>
      </div>
      <ol className={stl.steps}>
        <li className={stl.step}>
          <div className={stl.step__img}>
            <Image src={Catalog} alt={'Иконка каталога.'}/>
          </div>
          <div className={stl.step__block}>
            <h3 className={stl.step__title}>Выбери квиз и режим</h3>
            <p className={stl.step__subtitle}>
              Выбери тему из каталога и реши — Обычный или Хардкор. Режим влияет на таймер, жизни и штрафы.
            </p>
          </div>
        </li>
        <li className={stl.step}>
          <div className={stl.step__img}>
            <Image src={Pen} alt={'Иконка карандаша.'}/>
          </div>
          <div className={stl.step__block}>
            <h3 className={stl.step__title}>Отвечай на вопросы</h3>
            <p className={stl.step__subtitle}>
              Выбери один или несколько вариантов и нажми «Ответить». Таймер идёт — не тяни.
            </p>
          </div>
        </li>
        <li className={stl.step}>
          <div className={stl.step__img}>
            <Image src={Wand} alt={'Иконка волшебной палочки.'}/>
          </div>
          <div className={stl.step__block}>
            <h3 className={stl.step__title}>Узнай правильный ответ</h3>
            <p className={stl.step__subtitle}>После ответа появится объяснение. Ошибся — жизнь спишется, но факт
              запомнится.</p>
          </div>
        </li>
        <li className={stl.step}>
          <div className={stl.step__img}>
            <Image src={Trophy} alt={'Иконка кубка.'}/>
          </div>
          <div className={stl.step__block}>
            <h3 className={stl.step__title}>Финиш</h3>
            <p className={stl.step__subtitle}>После последнего вопроса — итоговый счёт, статистика и оценка
              результата.</p>
          </div>
        </li>
      </ol>
    </article>
  )
}
