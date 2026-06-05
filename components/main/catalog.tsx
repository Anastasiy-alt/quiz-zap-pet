import stl from './main.module.sass'
import QuizCard from "@/components/quiz/card";
import {QUIZZES} from "@/const/quizData";

export default function Catalog() {
  return (
    <section className={stl.catalog}>
      <h2 className={stl.catalog__title}>Квизы</h2>
      <div className={stl.catalog__grid}>
        {
          QUIZZES.map((i) => (
            <QuizCard title={i.title}
                      subtitle={i.description}
                      link={'quiz/' + i.id}
                      questionsCount={i.questions.length}
                      emoji={i.emoji}
                      key={i.id}
                      level={i.level} />
          ))
        }

      </div>
    </section>
  )
}
