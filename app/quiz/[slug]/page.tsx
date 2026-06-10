import {QUIZZES} from "@/const/quizData";
import QuizApp from "@/components/quiz";
import stl from '../../globals.module.sass'
import Tag from "@/components/ui/tag";
import BackBtn from "@/components/ui/backBtn";

export default async function QuizPage({params}: { params: Promise<{ slug: string }> }) {
  const {slug} = await params;
  const quizData = QUIZZES.find(i => i.id === slug);

  return (
    <>
      {
        quizData && (
          <section className={stl.section}>
            <div className={stl.section__header}>
              <BackBtn/>
              <Tag type={quizData.level}/>
              <h1 className={stl.section__title}>Квиз "{quizData.title}"</h1>
            </div>
            <QuizApp data={quizData}/>
          </section>
        )
      }
    </>
  );
}
