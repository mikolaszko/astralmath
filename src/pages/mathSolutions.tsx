import { useEffect, useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/utils/api";


type MathSolutionsProps = {
  gramaticalExpression: string;
}

export const MathSolutions = ({ gramaticalExpression }: MathSolutionsProps) => {
  const extractMathExpr = api.math.solveEquation.useMutation();
  const [steps, setSteps] = useState("")
  useEffect(() => {
    extractMathExpr.mutateAsync({ mathEquation: gramaticalExpression })
  }, [gramaticalExpression])

  return (
    <div className="flex flex-col">
      {extractMathExpr.isPending && (
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-zinc-600" />
          <Skeleton className="h-4 w-[200px] bg-zinc-600" />
          <Skeleton className="h-4 w-[150px] bg-zinc-600" />
          <Skeleton className="h-4 w-[100px] bg-zinc-600" />
          <Skeleton className="h-4 w-[50px] bg-zinc-600" />
        </div>
      )}
    </div >
  )
}
