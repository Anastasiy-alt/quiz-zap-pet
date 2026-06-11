export const questionsCountText = (count: number) => {
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
