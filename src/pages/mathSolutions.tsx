import { simplifyExpression } from "@taskbase/mathsteps";
import { useEffect } from "react";
import { api } from "~/utils/api";

type MathSolutionsProps = {
  gramaticalExpression: string;
}



export const MathSolutions = ({ gramaticalExpression }: MathSolutionsProps) => {
  const extractMathExpr = api.math.solveEquation.useMutation();
  const steps = simplifyExpression("1/(5x) + 1/3 = 4/3");
  useEffect(() => {
    extractMathExpr.mutateAsync({ mathEquation: gramaticalExpression })
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        console.log("Error with solving", error)
      })
  }, [gramaticalExpression])
  console.log(steps)

  return (
    <div className="flex flex-col">
    </div>
  )
}
