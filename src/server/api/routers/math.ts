import { z } from "zod";
import OpenAI from "openai";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY

})
// Mocked DB
interface MathProblem {
  id: number;
  base64: string;
}
const mathProblems: MathProblem[] = [
];

export const mathRouter = createTRPCRouter({
  solveEquation: publicProcedure
    .input(z.object({ base64Image: z.string() }))
    .mutation(async ({ input }) => {
      const response = openai.chat.completions.create({
        model: "gpt-4o-turbo",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Show how to solve this mathematical equation step by step in an educational manner"
              },
              {
                type: "image_url",
                image_url: {
                  "url": `data:image/jpeg;base64,${input.base64Image}`
                }
              },
            ]
          }
        ],
        max_tokens: 100,
      })
      const problem: MathProblem = {
        id: mathProblems.length + 1,
        base64: input.base64Image,
      };
      mathProblems.push(problem);
      return response

    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      return mathProblems.at(input.id) ?? null;
    }),
});
