import Button from "@/components/ui/button";
import Tag from "@/components/ui/tag";
import RadioCheck from "@/components/ui/radioCheck";
import QuizCard from "@/components/quiz/card";
import Life from "@/components/ui/life";
import Timer from "@/components/ui/timer";
import Progress from "@/components/ui/progress";
import Points from "@/components/ui/points";

export default function GuiPage() {
  return (
    <>
      <Points total={290} />
      <Button text={'primary'}/>
      <Button text={'primary'} disabled={true}/>
      <Button text={'primary'} link={'/'}/>
      <Button text={'secondary'} type={'sc'}/>
      <Button text={'secondary'} type={'sc'} disabled={true}/>
      <Button text={'text'} type={'tx'}/>
      <Tag type={'easy'} />
      <Tag type={'medium'} />
      <Tag type={'hard'} />
      <Progress all={15} current={10} />
      <Timer time={60} />
      <Life count={3} />
      <Life count={1} />
      <Life count={4} all={5} />
      <QuizCard title={'title'} subtitle={'subtitle'} link={'/'} questionsCount={21} emoji={'👻'} level={'medium'} />
      <RadioCheck text={'radio'} type={'radio'} id={'radio-one'} name={'rd-one'}/>
      <RadioCheck text={'radio'} type={'radio'} id={'radio-two'} name={'rd-one'}/>
      <RadioCheck text={'radio'} type={'radio'} id={'radio-three'} name={'rd-one'}/>
      <RadioCheck text={'radio error'} type={'radio'} id={'radio-four'} name={'rd-one'} error={true}/>
      <RadioCheck text={'radio disabled'} type={'radio'} id={'radio-five'} name={'rd-one'} disabled={true}/>
      <RadioCheck text={'radio correct'} type={'radio'} id={'radio-six'} name={'rd-six'} correct={true}/>
      <RadioCheck text={'radio two'} type={'radio'} id={'radio-twoo'} name={'rd-two'}/>
      <RadioCheck text={'checkbox'} type={'checkbox'} id={'checkbox-one'} name={'ch-one'}/>
      <RadioCheck text={'checkbox'} type={'checkbox'} id={'checkbox-two'} name={'ch-one'}
                  description={'корабли лавировали, лавировали, лавировали, да не вылавировали'}/>
      <RadioCheck text={'checkbox error'} type={'checkbox'} id={'checkbox-three'} error={true} name={'ch-one'}
                  description={'корабли лавировали, лавировали, лавировали, да не вылавировали'}/>
      <RadioCheck text={'checkbox disabled'} type={'checkbox'} id={'checkbox-four'} disabled={true} name={'ch-one'}
                  description={'корабли лавировали, лавировали, лавировали, да не вылавировали'}/>
      <RadioCheck text={'checkbox correct'} type={'checkbox'} id={'checkbox-five'} correct={true} name={'ch-one'}
                  description={'корабли лавировали, лавировали, лавировали, да не вылавировали'}/>
    </>
  )
}
