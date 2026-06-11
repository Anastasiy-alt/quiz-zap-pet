import StepsRules from "@/components/rules/steps";
import ModeRules from "@/components/rules/mode";
import ResultRules from "@/components/rules/result";
import PointsRules from "@/components/rules/points";

export default function RulesPage() {
  return(
    <>
      <StepsRules />
      <ModeRules />
      <PointsRules />
      <ResultRules />
    </>
  )
}
